import { CdkDrag } from '@angular/cdk/drag-drop';
import { CdkContextMenuTrigger, CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { NeoFlowNodeComponent } from '@neo-edge-web/components';
import { processMenuByVersion } from '@neo-edge-web/configs';
import {
  INeoFlowNodeGroup,
  IOtDevice,
  NEOFLOW_DATA_CLASS,
  NEOFLOW_SOCKET,
  SUPPORT_APPS_OT_DEVICE
} from '@neo-edge-web/models';
import { MathCalculatorComponent } from '@neo-edge-web/processor-1.0.0';
import { CreateNeoFlowsStore } from '../../stores/create-neoflows.store';
import { NeoFlowsConnectionStore } from '../../stores/neoflows-connection.store';

@Component({
  selector: 'ne-message-link-datasource-page',
  standalone: true,
  imports: [
    CommonModule,
    NeoFlowNodeComponent,
    CdkContextMenuTrigger,
    CdkMenu,
    CdkMenuItem,
    MatMenuModule,
    MatButtonModule,
    CdkDrag,
    MathCalculatorComponent,
    MatMenuModule
  ],
  templateUrl: './message-link-datasource-page.component.html',
  styleUrl: './message-link-datasource-page.component.scss',
  providers: [NeoFlowsConnectionStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageLinkDataSourcePageComponent {
  @ViewChild('container', { read: ViewContainerRef, static: true }) container: ViewContainerRef;
  @ViewChild(MatMenuTrigger) matMenuTrigger: MatMenuTrigger;
  otDevices = input<IOtDevice<any>[]>();
  processorVer = input('default');
  messageSchema = input<any[]>();
  #neoFlowsConnectionStore = inject(NeoFlowsConnectionStore);
  #createNeoFlowStore = inject(CreateNeoFlowsStore);

  texolTagDoc = this.#createNeoFlowStore.texolTagDoc;
  selectedNode = this.#neoFlowsConnectionStore.selectedNode;

  processorMenuOpt = computed(() => {
    return processMenuByVersion[this.processorVer()]
      ? processMenuByVersion[this.processorVer()]
      : processMenuByVersion['default'];
  });

  constructor() {
    effect(
      () => {
        this.#neoFlowsConnectionStore.updateSourceNodes(this.sources());
        this.#neoFlowsConnectionStore.updateTargetNodes(this.destination());

        this.#createNeoFlowStore.updateDsToMessageConnection(this.#neoFlowsConnectionStore.connection());
      },
      { allowSignalWrites: true }
    );

    Object.keys(window).forEach((key) => {
      if (/^on/.test(key)) {
        window.addEventListener(key.slice(2), (_) => {
          this.#neoFlowsConnectionStore.connection().forEach((line) => {
            if (line) {
              line.position();
            }
          });
        });
      }
    });
  }

  sources = computed(() => {
    if (this.otDevices()) {
      const sources: INeoFlowNodeGroup[] = this.otDevices().map((device: IOtDevice<any>) => {
        const nodeGroup: INeoFlowNodeGroup = {
          id: `group_header/${device.name}/${device.name}`,
          socket: NEOFLOW_SOCKET.OUTPUT,
          name: device.name,
          extended: true,
          nodes: []
        };
        if (device.appClass === SUPPORT_APPS_OT_DEVICE.MODBUS_RTU) {
          nodeGroup.nodes.push(...this.rtuDevice(device));
        } else if (device.appClass === SUPPORT_APPS_OT_DEVICE.MODBUS_TCP) {
          nodeGroup.nodes.push(...this.tcpDevice(device));
        } else {
          nodeGroup.nodes.push(...this.getTagsFromTexol(device));
        }
        return nodeGroup;
      });
      return sources;
    }
    return [];
  });

  destination = computed(() => {
    if (this.messageSchema()) {
      const destination: INeoFlowNodeGroup[] = this.messageSchema().map((message) => {
        return {
          name: message.messageInfoSetting.messageName,
          extended: true,
          nodes: [
            ...message.tags.map((tag) => {
              return {
                id: `${message.messageInfoSetting.messageName}/${NEOFLOW_DATA_CLASS.TAG}/${tag.tagName}`,
                name: tag.tagName,
                socket: NEOFLOW_SOCKET.INPUT,
                dataClass: tag.dataClass,
                properties: tag
              };
            })
          ],
          properties: message
        } as INeoFlowNodeGroup;
      });
      return destination;
    }

    return [];
  });

  tagObj = (device, tag) => ({
    id: `${device.name}/${NEOFLOW_DATA_CLASS.TAG}/${tag.Name}`,
    name: tag.Name,
    socket: NEOFLOW_SOCKET.OUTPUT,
    dataClass: NEOFLOW_DATA_CLASS.TAG,
    properties: tag
  });

  rtuDevice = (device: IOtDevice<any>) => {
    const commands = device.setting.Instances.RTU[0].Devices[0].Commands;
    const tags = Object.values(commands);
    const nodes = tags.map((tag: any) => {
      return { ...this.tagObj(device, tag) };
    });
    return nodes;
  };

  tcpDevice = (device: IOtDevice<any>) => {
    const commands = device.setting.Instances.TCP[0].Devices[0].Commands;
    const tags = Object.values(commands);
    const nodes = tags.map((tag: any) => {
      return { ...this.tagObj(device, tag) };
    });
    return nodes;
  };

  getTagsFromTexol(device: IOtDevice<any>) {
    const deviceCommand = device.setting?.Instances?.RTU[0]?.Devices[0];
    const tags = [];
    if (deviceCommand.Profile.Name === 'General.profile') {
      const domains = deviceCommand.Profile.Domains;
      tags.push(...this.texolTagDoc()['General']['allDomain']);
      domains.forEach((d) => {
        this.texolTagDoc()['General'][d].forEach((v) => tags.push(v));
      });
    } else {
      const profileName = deviceCommand?.Profile?.Name.split('.');
      if (profileName.length === 5) {
        profileName.splice(1, 0, profileName[1]);
      }
      this.texolTagDoc()[profileName[0]][profileName[1]][profileName[2]][profileName[4]].forEach((v) => {
        tags.push(v);
      });
    }

    return tags.map((tag) => ({
      id: `${device.name}/${NEOFLOW_DATA_CLASS.TAG}/${tag.TagName}`,
      name: tag.TagName,
      socket: NEOFLOW_SOCKET.OUTPUT,
      dataClass: NEOFLOW_DATA_CLASS.TAG,
      properties: tag
    }));
  }

  onSelectedNode = (event) => {
    this.#neoFlowsConnectionStore.updateSelectedNode(event);
  };

  addProcessorUnit = (event, processor) => {
    const componentRef = this.container.createComponent(processor.component);
  };
}
