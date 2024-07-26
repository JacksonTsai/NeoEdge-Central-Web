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
  signal,
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
  @ViewChild(MatMenuTrigger) matMenuTrigger: MatMenuTrigger;
  otDevices = input<IOtDevice<any>[]>();
  processorVer = input('default');
  messageSchema = input<any[]>();
  #neoFlowsConnectionStore = inject(NeoFlowsConnectionStore);
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
      },
      { allowSignalWrites: true }
    );

    // ['click', 'scroll', 'resize'].forEach((event) => {
    //   window.addEventListener(event, (_) => {
    //     console.log();

    //     this.#neoFlowsConnectionStore.connection().forEach((line) => {
    //       if (line) {
    //         line.position();
    //       }
    //     });
    //   });
    // });

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
          name: device.name,
          extended: true,
          nodes: []
        };

        if (device.appClass === SUPPORT_APPS_OT_DEVICE.MODBUS_RTU) {
          nodeGroup.nodes.push(...this.rtuDevice(device));
        } else if (device.appClass === SUPPORT_APPS_OT_DEVICE.MODBUS_TCP) {
          console.log(SUPPORT_APPS_OT_DEVICE.MODBUS_TCP);
        } else {
          console.log(SUPPORT_APPS_OT_DEVICE.TEXOL213MM2R1);
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
                connectionLine: [],
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

  rtuDevice = (device: IOtDevice<any>) => {
    const commands = device.setting.Instances.RTU[0].Devices[0].Commands;
    const tags = Object.values(commands);
    const nodes = tags.map((tag: any) => {
      return {
        id: `${device.name}/${NEOFLOW_DATA_CLASS.TAG}/${tag.Name}`,
        name: tag.Name,
        socket: NEOFLOW_SOCKET.OUTPUT,
        dataClass: NEOFLOW_DATA_CLASS.TAG,
        connectionLine: [],
        properties: tag
      };
    });
    return nodes;
  };

  onSelectedNode = (event) => {
    this.#neoFlowsConnectionStore.updateSelectedNode(event);
  };

  processorMenuPosition = signal({ x: 0, y: 0 });

  onProcessorMenu(event: MouseEvent) {
    event.preventDefault();
    this.processorMenuPosition.set({ x: event.clientX + 8, y: event.clientY - 10 });
    // this.contextMenuPosition.x =
    // this.contextMenuPosition.y = event.clientY - 100 + 'px';

    // this.contextMenu.menuData = { item };
    this.matMenuTrigger.openMenu();
  }

  addProcessorUnit = (processor) => {
    //
  };

  @ViewChild('container', { read: ViewContainerRef, static: true }) container: ViewContainerRef;

  addProcessor(event, processor) {
    // 清空容器 (如果需要)
    // this.container.clear();
    console.log(processor);

    // const x = event.clientX;
    // const y = event.clientY;

    // const x = this.processorMenuPosition().x;
    // const y = this.processorMenuPosition().y;

    // console.log(x, y);

    // 在容器中創建並插入 component
    const componentRef = this.container.createComponent(processor.component);

    // componentRef.instance.clickEmit.subscribe((val) => console.log(processor));

    // const element = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
    // element.style.position = 'relative';
    // element.style.left = `1px`;
    // element.style.top = `1px`;
  }
}
