import { IItServiceConnectionOption } from '@neo-edge-web/models';

export const itServiceConnection: IItServiceConnectionOption[] = [
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
    key: 'amqp-5671',
    value: 5671,
    label: 'AMQP (5671)'
  },
  {
    key: 'mqtt-443',
    value: 443,
    label: 'MQTT over WS (443)'
  },
  {
    key: 'amqp-443',
    value: 443,
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
