const StatsD = require('hot-shots');
const Joi = require('joi');

const logger = console;

const optionsSchema = Joi.object().keys({
  datadogStatsdPort: Joi.number(),
  datadogStatsdHost: Joi.string().required(),
  telegrafStatsdPort: Joi.number(),
  telegrafStatsdHost: Joi.string().required(),
  globalTags: Joi.array().items(Joi.string()),
  prefix: Joi.string(),
  suffix: Joi.string(),
  sampleRate: Joi.number(),
});

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

class TsMetric{
  constructor(opts) {
    Joi.assert(opts, optionsSchema);
    opts = opts || {};
    this.datadogStatsdPort = opts.datadogStatsdPort || '8125';
    this.datadogStatsdHost = opts.datadogStatsdHost || 'localhost';
    this.telegrafStatsdPort = opts.telegrafStatsdPort || '8125';
    this.telegrafStatsdHost = opts.telegrafStatsdHost || 'localhost';
    this.globalTags = opts.globalTags || [];

    this.datadogClient = new StatsD({
      host: this.datadogStatsdHost,
      port: this.datadogStatsdPort,
      globalTags: this.globalTags,
      errorHandler: logger.error,
    });

    this.telegrafClient = new StatsD({
      host: this.telegrafStatsdHost,
      port: this.telegrafStatsdPort,
      telegraf: true,
      globalTags: this.globalTags,
      errorHandler: logger.error,
    });

    this.CHECKS = this.datadogClient.CHECKS;

    methods.forEach((name) => {
      this[name] = (...args) => {
        this.telegrafClient[name].apply(this.telegrafClient, args);
        this.datadogClient[name].apply(this.datadogClient, args);
      }
    });

    datadogOnlyMethods.forEach((name) => {
      this[name] = (...args) => {
        this.datadogClient[name].apply(this.datadogClient, args);
      }
    });
  }
}

module.exports = TsMetric;