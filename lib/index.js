const StatsD = require('hot-shots');
const Joi = require('joi');
const proxyFn = require('./utils/proxyFn');

const { number, string, array} = Joi;
const logger = console;

const optionsSchema = Joi.object().keys({
  datadogStatsdPort: number(),
  datadogStatsdHost: string(),
  telegrafStatsdPort: number(),
  telegrafStatsdHost: string(),
  globalTags: array().items(string()),
  prefix: string(),
  suffix: string(),
  sampleRate: number(),
}).or('datadogStatsdHost', 'telegrafStatsdHost')
  .options({
    stripUnknown: true,
  })
  .required();

const methods = [
  'increment',
  'decrement',
  'histogram',
  'guage',
  'unique',
  'set',
  'timing',
];

const datadogOnlyMethods = [
  'check',
  'event',
];


class TsMetric {
  constructor(opts) {
    const options = Joi.attempt(opts, optionsSchema);
    this.datadogStatsdPort = options.datadogStatsdPort || 8125;
    this.datadogStatsdHost = options.datadogStatsdHost;
    this.telegrafStatsdPort = options.telegrafStatsdPort || 8125;
    this.telegrafStatsdHost = options.telegrafStatsdHost;
    this.globalTags = options.globalTags || [];

    if (this.datadogStatsdHost) {
      this.datadogClient = new StatsD({
        host: this.datadogStatsdHost,
        port: this.datadogStatsdPort,
        globalTags: this.globalTags,
        errorHandler: logger.error,
      });
      proxyFn(methods, this, [this.datadogClient]);
      proxyFn(datadogOnlyMethods, this, [this.datadogClient]);
      this.CHECKS = this.datadogClient.CHECKS;
    }

    if (this.telegrafStatsdHost) {
      this.telegrafClient = new StatsD({
        host: this.telegrafStatsdHost,
        port: this.telegrafStatsdPort,
        telegraf: true,
        globalTags: this.globalTags,
        errorHandler: logger.error,
      });
      proxyFn(methods, this, [this.telegrafClient]);
    }
  }
}

module.exports = TsMetric;
