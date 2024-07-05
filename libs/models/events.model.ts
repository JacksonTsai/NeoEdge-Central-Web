export interface IEventDoc {
  name: string;
  group: string;
  severity: string;
  content: string;
}

export interface IEventsDoc {
  [id: string]: IEventDoc;
}

export interface IGetEventDocResp {
  events: IEventsDoc;
}

export interface IEventsState {
  events: IEventsDoc;
  loading: boolean;
  error: any;
}
