import { IConfig, Step } from './interfaces';

const DEFAULT_CONFIG: IConfig = {
  iterations: 8,
  url: 'http://localhost:4200/',
  steps: [],
};

function getConfigFromSource(configSource: string): IConfig {
  try {
    const config = require(configSource);
    return Object.assign({}, DEFAULT_CONFIG, config);
  } catch (e) {
    throw new Error(`Unable to run configuration file: ${e}`);
  }
}

function checkFunction(prop: string, data: Function) {
  if (typeof data !== 'function') {
    throw new Error(`config.${prop} is not a function`);
  }
}

function checkStep(i: number, data: Step) {
  checkFunction(`loop[${i}].check`, data.check);
  checkFunction(`loop[${i}].next`, data.next);
}

function checkNumber(prop: string, data: number) {
  if (typeof data !== 'number') {
    throw new Error(`config.${prop} is not a number`);
  }
}

function checkString(prop: string, data: string) {
  if (typeof data !== 'string') {
    throw new Error(`config.${prop} is not a string`);
  }
}

export default class Config implements IConfig {
  public readonly url: string;
  public readonly steps: Step[];
  public readonly iterations: number;

  public static FromSource(configSource: string): Config {
    const raw = getConfigFromSource(configSource);
    checkString('url', raw.url);
    raw.steps.forEach((step, i) => checkStep(i, step));
    checkNumber('iterations', raw.iterations);
    return new Config(raw);
  }

  private constructor(raw: IConfig) {
    this.url = raw.url;
    this.steps = raw.steps;
    this.iterations = raw.iterations;
  }
}
