import { Injectable } from '@angular/core';
import {
  IItService,
  IItServiceCaFile,
  IItServiceConnectionData,
  IItServiceConnectionOption,
  IItServiceDetail,
  IItServiceDetailSelectedAppData,
  IItServiceField,
  IItServiceQoSData,
  IItServiceQoSOption,
  ISupportAppsWithVersion,
  IT_SERVICE_CA_TYPE,
  TSupportAppsItService
} from '@neo-edge-web/models';

@Injectable({
  providedIn: 'root'
})
export class ItServiceDetailService {
  private itServiceConnection: IItServiceConnectionOption[] = [
    {
      key: 'mqtt-8883',
      value: 8883,
      label: 'MQTT (8883)'
    },
    {
      key: 'mqtt-1883',
      value: 1883,
      label: 'MQTT (1883)'
    },
    {
      key: 'mqtt-str',
      value: 'MQTT', // use on Azure
      label: 'MQTT (8883)'
    },
    {
      key: 'amqp-5671',
      value: 'AMQP',
      label: 'AMQP (5671)'
    },
    {
      key: 'mqtt-443',
      value: 'MQTT_WS',
      label: 'MQTT over WS (443)'
    },
    {
      key: 'amqp-443',
      value: 'AMQP_WS',
      label: 'AMQP over WS (443)'
    },
    {
      key: 'http-443',
      value: 443,
      label: 'HTTP (443)'
    },
    {
      key: 'custom',
      value: 0,
      label: 'Custom'
    }
  ];

  getConnection = (type?: TSupportAppsItService): IItServiceConnectionOption[] => {
    if (!type) {
      return this.itServiceConnection;
    }

    switch (type) {
      case 'AWS':
        return this.itServiceConnection
          .filter((conn) => conn.key === 'mqtt-8883')
          .map((conn) => ({ ...conn, default: true }));
      case 'MQTT':
        return this.itServiceConnection
          .filter((conn) => ['mqtt-1883', 'custom'].includes(conn.key))
          .map((conn) => (conn.key === 'mqtt-1883' ? { ...conn, default: true } : conn));
      case 'AZURE':
        return this.itServiceConnection
          .filter((conn) => ['mqtt-str', 'amqp-5671', 'mqtt-443', 'amqp-443'].includes(conn.key))
          .map((conn) => (conn.key === 'mqtt-str' ? { ...conn, default: true } : conn));
      case 'HTTP':
        return this.itServiceConnection
          .filter((conn) => ['http-443', 'custom'].includes(conn.key))
          .map((conn) => (conn.key === 'http-443' ? { ...conn, default: true } : conn));
      default:
        return [];
    }
  };

  private itServiceQos: IItServiceQoSOption[] = [
    {
      value: 0,
      tip: 'QoS 0: At most once.'
    },
    {
      value: 1,
      tip: 'QoS 1: At least once.'
    },
    {
      value: 2,
      tip: 'QoS 2: Exactly once.'
    }
  ];

  getQoS = (type?: TSupportAppsItService): IItServiceQoSOption[] => {
    if (!type) {
      return this.itServiceQos;
    }

    switch (type) {
      case 'AWS':
        return this.itServiceQos
          .filter((qoS) => [0, 1].includes(qoS.value))
          .map((qoS) => (qoS.value === 1 ? { ...qoS, default: true } : qoS));
      case 'MQTT':
        return this.itServiceQos.map((qoS) => (qoS.value === 2 ? { ...qoS, default: true } : qoS));
      default:
        return [];
    }
  };

  getQoSTooltipText = (qosArray: IItServiceQoSOption[]): string => {
    return qosArray.map((item) => item.tip).join('\n');
  };

  getSelectedAppSetting = (appData: ISupportAppsWithVersion): IItServiceDetailSelectedAppData => {
    const key = appData.key as TSupportAppsItService;

    // 1. Get Connection Options & default connection
    const connectionData: IItServiceConnectionData = {
      options: this.getConnection(key),
      default: null
    };
    connectionData.default = connectionData.options.find((conn) => conn.default);

    // 2. Get QoS Options & tip
    const qoSData: IItServiceQoSData = {
      options: this.getQoS(key),
      default: null,
      tip: ''
    };
    qoSData.default = qoSData.options.find((qoS) => qoS.default);
    qoSData.tip = this.getQoSTooltipText(qoSData.options);

    return {
      key,
      app: appData,
      connectionData,
      qoSData
    };
  };

  apiToFieldData(api: IItService | IItServiceDetail): IItServiceField {
    const instance = api.setting?.Instances?.['0'] || null;
    const parameters = instance?.Process?.Parameters || null;
    const credentials = parameters?.Credentials || null;
    let host: string;
    let connection: number | null = null;
    let fileData: IItServiceCaFile | null = null;

    if (parameters?.Host) {
      const { host: extractedHost, connection: extractedConnection } = this.extractHostAndConnection(parameters.Host);
      host = extractedHost;
      connection = extractedConnection;
    }

    // Azure
    if (parameters?.Protocol) {
      connection = parameters.Protocol;
    }

    if (credentials?.CaCert) {
      fileData = {
        name: credentials?.CaCert.Name,
        content: credentials?.CaCert.Content
      };
    }

    return {
      name: api.name,
      host: host,
      connection: connection,
      keepAlive: parameters?.KeepAlive,
      qoS: parameters?.QoS,
      caCertFileName: parameters?.Credentials?.CaCert?.Name,
      caCertFileContent: parameters?.Credentials?.CaCert?.Content,
      useTls: parameters?.Host.startsWith('tls://'),
      useCert: !credentials?.SkipCertVerify,
      useCaType: credentials?.CaCert?.Name ? IT_SERVICE_CA_TYPE.Private : IT_SERVICE_CA_TYPE.Public,
      file: fileData
    };
  }

  private extractHostAndConnection(hostString: string): { host: string; connection: number | null } {
    let host: string;
    let connection: number | null = null;

    if (hostString.startsWith('tls://') || hostString.startsWith('tcp://')) {
      const protocol = hostString.startsWith('tls://') ? 'tls://' : 'tcp://';
      const hostParts = hostString.replace(protocol, '').split(':');
      host = hostParts[0];
      connection = hostParts.length > 1 ? parseInt(hostParts[1], 10) : null;
    } else if (hostString.startsWith('tcp:')) {
      const hostParts = hostString.replace('tcp:', '').split('//:');
      host = hostParts[0];
      connection = hostParts.length > 1 ? parseInt(hostParts[1], 10) : null;
    } else {
      host = hostString;
    }

    return { host, connection };
  }
}
