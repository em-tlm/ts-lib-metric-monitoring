const StatsD = require('hot-shots');
const Joi = require('joi');
const proxyFn = require('./utils/proxyFn');

const logger = console;

const optionsSchema = Joi.object().keys({
  datadogStatsdPort: Joi.number(),
  datadogStatsdHost: Joi.string(),
  telegrafStatsdPort: Joi.number(),
  telegrafStatsdHost: Joi.string(),
  globalTags: Joi.array().items(Joi.string()),
  prefix: Joi.string(),
  suffix: Joi.string(),
  sampleRate: Joi.number(),
}).or('datadogStatsdHost', 'telegrafStatsdHost').required();

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
    Joi.assert(opts, optionsSchema);
    opts = opts || {};
    this.datadogStatsdPort = opts.datadogStatsdPort || '8125';
    this.datadogStatsdHost = opts.datadogStatsdHost;
    this.telegrafStatsdPort = opts.telegrafStatsdPort || '8125';
    this.telegrafStatsdHost = opts.telegrafStatsdHost;
    this.globalTags = opts.globalTags || [];

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
