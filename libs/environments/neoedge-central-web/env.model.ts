import { InjectionToken } from '@angular/core';

export interface IEnvVariable {
  eulaVersion: string;
  betaVersion: string;
  version: string;
}

export const ENV_VARIABLE = new InjectionToken<IEnvVariable>('ENV_VARIABLE');
