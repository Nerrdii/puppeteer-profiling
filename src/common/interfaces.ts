export interface IConfig {
  url: string;
  steps: Step[];
  iterations: number;
  timeout: number;
}

export interface Step {
  check: () => boolean;
  next: () => null | undefined;
}
