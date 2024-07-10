import { IEventLog } from '@neo-edge-web/models';

export const getEventSource = (event: IEventLog): string => {
  if (event.eventId >= 1000 && event.eventId < 2000) {
    return event.eventData.userName;
  } else if (event.eventId >= 2000 && event.eventId < 3000) {
    return event.eventData.gatewayName;
  } else if (event.eventId >= 3000 && event.eventId < 4000) {
    return 'Central';
  } else {
    return '-';
  }
};
