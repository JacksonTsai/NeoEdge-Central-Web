import {
  IDevices,
  IInstances,
  IInstancesRtu,
  IInstancesTcp,
  IOtTagsForUI,
  IRtuProfileForUI,
  ITcpProfileForUI
} from '@neo-edge-web/models';
import { isSwapByte, isSwapWord, swapType } from '@neo-edge-web/utils';
import { rtuOptions, tagOptions } from '../configs';

export const tcpProfile = (otDevice) => {
  const tcpInstance: IInstancesTcp = otDevice.setting.Instances;
  const tcpDevice: IDevices = otDevice.setting.Instances.TCP[0].Devices[0];
  return {
    slaveId: tcpDevice.SlaveID,
    deviceName: tcpDevice.Name,
    description: otDevice.description,
    ip: tcpInstance.TCP[0].Properties.IP,
    port: tcpInstance.TCP[0].Properties.Port,
    initialDelay: tcpInstance.TCP[0].Properties.InitialDelay,
    pollingRetries: tcpInstance.TCP[0].Properties.PollingRetries,
    responseTimeout: tcpInstance.TCP[0].Properties.ResponseTimeout,
    delayBetweenPolls: tcpInstance.TCP[0].Properties.DelayBetweenPolls,
    swapByte: isSwapByte(tcpDevice?.Commands[0].Swap) ?? false,
    swapWord: isSwapWord(tcpDevice?.Commands[0].Swap) ?? false,
    iconPath: otDevice.iconPath
  };
};

export const rtuProfile = (otDevice) => {
  const rtuInstance: IInstancesRtu = otDevice.setting.Instances;
  const rtuDevice: IDevices = otDevice.setting.Instances.RTU[0].Devices[0];

  return {
    slaveId: rtuDevice.SlaveID,
    mode: rtuOptions.rtuModeOpts[0].value,
    baudRate: rtuInstance.RTU[0].Properties.BaudRate,
    dataBits: rtuInstance.RTU[0].Properties.DataBit,
    parity: rtuInstance.RTU[0].Properties.Parity,
    stopBit: rtuInstance.RTU[0].Properties.StopBit,
    deviceName: rtuDevice.Name,
    description: otDevice.description,
    initialDelay: rtuInstance.RTU[0].Properties.InitialDelay,
    pollingRetries: rtuInstance.RTU[0].Properties.PollingRetries,
    responseTimeout: rtuInstance.RTU[0].Properties.ResponseTimeout,
    delayBetweenPolls: rtuInstance.RTU[0].Properties.DelayBetweenPolls,
    swapByte: rtuDevice?.Commands && rtuDevice.Commands[0] ? isSwapByte(rtuDevice.Commands[0].Swap) : false,
    swapWord: rtuDevice?.Commands && rtuDevice.Commands[0] ? isSwapWord(rtuDevice?.Commands[0]?.Swap) : false,
    iconPath: otDevice.iconPath
  };
};

export const otTags = (otDevice, deviceType: 'tcp' | 'rtu') => {
  let device: IDevices;
  if ('tcp' === deviceType) {
    device = otDevice.setting.Instances.TCP[0].Devices[0];
  } else {
    device = otDevice.setting.Instances.RTU[0].Devices[0];
  }
  const deviceCommands = device?.Commands;

  return [
    ...Object.values(deviceCommands).map((d: any) => ({
      tagName: d.Name,
      enable: d.Enable,
      trigger: tagOptions.tagTrigger.find((v) => v.value === d.Trigger),
      dataType: tagOptions.tagTypeOpts.find((v) => v.value === d.DataType),
      function: tagOptions.tagFunctionOpts.find((v) => v.value === d.Function),
      quantity: d.Quantity,
      startAddress: d.StartingAddress,
      interval: d.Interval
    }))
  ];
};

export const texolTags = (otDevice, generateTagType: 'texol-general' | 'texol-dedicated') => {
  const rtuDevice: IDevices = otDevice.setting.Instances.RTU[0].Devices[0];
  const rtuDeviceProfile = rtuDevice.Profile;
  if ('texol-general' === generateTagType) {
    return {
      ...rtuDeviceProfile.Domains.reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {})
    };
  } else {
    let rtuDeviceProfileNameSplit = rtuDeviceProfile.Name.split('.');
    if (rtuDeviceProfileNameSplit.length !== 6) {
      rtuDeviceProfileNameSplit = [
        ...rtuDeviceProfileNameSplit.slice(0, 2),
        rtuDeviceProfileNameSplit[1],
        ...rtuDeviceProfileNameSplit.slice(2)
      ];
    }
    return {
      component: rtuDeviceProfileNameSplit[0],
      level2: rtuDeviceProfileNameSplit[1],
      level3: rtuDeviceProfileNameSplit[2],
      axial: rtuDeviceProfileNameSplit[4]
    };
  }
};

export const setRTUInstance = (
  otProfile: IRtuProfileForUI,
  otTags: IOtTagsForUI[] | { generateTagType: string; tags: any }
): IInstances<any> => {
  const rtuInstancesDevices = {
    Name: otProfile.basic.deviceName,
    SlaveID: otProfile.basic.slaveId
  };
  if (Array.isArray(otTags)) {
    const tags = otTags
      .map((d) => ({
        Function: d.function.value,
        StartingAddress: d.startAddress,
        Quantity: d.quantity,
        Trigger: d.trigger.value,
        Interval: d.interval,
        Enable: d.enable,
        Name: d.tagName,
        DataType: d.tagType.value,
        Swap: swapType(otProfile.advanced.swapByte, otProfile.advanced.swapWord)
      }))
      .reduce((acc, value, index) => {
        acc[index] = value;
        return acc;
      }, {});
    rtuInstancesDevices['Commands'] = tags;
  } else {
    if ('texol-general' === otTags.generateTagType) {
      rtuInstancesDevices['Profile'] = {
        Name: 'General.profile',
        Domains: [...Object.keys(otTags.tags).filter((key) => otTags.tags[key])]
      };
    } else {
      let profile = '';
      if (otTags.tags.level2 === otTags.tags.level3) {
        profile = `${otTags.tags.component}.${otTags.tags.level2}.Axial.${otTags.tags.axial}.profile`;
      } else {
        profile = `${otTags.tags.component}.${otTags.tags.level2}.${otTags.tags.level3}.Axial.${otTags.tags.axial}.profile`;
      }
      rtuInstancesDevices['Profile'] = { Name: profile };
    }
  }

  return {
    Instances: {
      RTU: {
        '0': {
          Properties: {
            BaudRate: otProfile.connectionSetting.baudRate,
            DataBit: otProfile.connectionSetting.dataBits,
            Parity: otProfile.connectionSetting.parity.value,
            StopBit: otProfile.connectionSetting.stopBit.toString(),
            InitialDelay: otProfile.advanced.initialDelay,
            DelayBetweenPolls: otProfile.advanced.delayBetweenPolls,
            ResponseTimeout: otProfile.advanced.responseTimeout,
            PollingRetries: otProfile.advanced.pollingRetries
          },
          Devices: {
            0: { ...rtuInstancesDevices }
          }
        }
      }
    }
  };
};

export const setTCPInstance = (otProfile: ITcpProfileForUI, otTags: IOtTagsForUI[]): IInstances<any> => {
  const tags = otTags
    .map((d) => {
      return {
        Function: d.function.value,
        StartingAddress: d.startAddress,
        Quantity: d.quantity,
        Trigger: d.trigger.value,
        Interval: d.interval,
        Enable: d.enable,
        Name: d.tagName,
        DataType: d.tagType.value,
        Swap: swapType(otProfile.advanced.swapByte, otProfile.advanced.swapWord)
      };
    })
    .reduce((acc, value, index) => {
      acc[index] = value;
      return acc;
    }, {});

  return {
    Instances: {
      TCP: {
        '0': {
          Properties: {
            IP: otProfile.basic.ipAddress,
            Port: otProfile.basic.port,
            InitialDelay: otProfile.advanced.initialDelay,
            DelayBetweenPolls: otProfile.advanced.delayBetweenPolls,
            ResponseTimeout: otProfile.advanced.responseTimeout,
            PollingRetries: otProfile.advanced.pollingRetries
          },
          Devices: {
            0: {
              Name: otProfile.basic.deviceName,
              SlaveID: otProfile.basic.slaveId,
              Commands: { ...tags }
            }
          }
        }
      }
    }
  };
};
