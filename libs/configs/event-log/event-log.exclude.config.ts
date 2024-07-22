export interface IEventLogExcludeConfig {
  dashboard: number[];
  gateway: number[];
}

export const eventLogExcludeConfig: IEventLogExcludeConfig = {
  dashboard: [],
  gateway: [1401]
};
