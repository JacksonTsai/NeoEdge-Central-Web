export interface IWebSocketAction {
  action: string;
  data: webSocketData;
}

export interface webSocketData {
  room: string;
  timestamp: number;
  messages: webSocketMessage[];
}

export interface webSocketMessage {
  [key: string]: string;
  type: string;
  data: any;
}
