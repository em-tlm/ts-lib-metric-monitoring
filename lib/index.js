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

let telegrafClient;
let datadogClient;

class TsMetric{
  //todo: add test here for input validation
  constructor(opts) {
    Joi.assert(opts, optionsSchema);
    opts = opts || {};
    this.datadogStatsdPort = opts.datadogStatsdPort || '8125';
    this.datadogStatsdHost = opts.datadogStatsdHost || 'localhost';
    this.telegrafStatsdPort = opts.telegrafStatsdPort || '8125';
    this.telegrafStatsdHost = opts.telegrafStatsdHost || 'localhost';
    this.globalTags = opts.globalTags || [];

    if (!datadogClient) {
      datadogClient = new StatsD({
        host: this.datadogStatsdHost,
        port: this.datadogStatsdPort,
        globalTags: this.globalTags,
        errorHandler: logger.error,
      });
    }

    if (!telegrafClient) {
      telegrafClient = new StatsD({
        host: this.telegrafStatsdHost,
        port: this.telegrafStatsdPort,
        telegraf: true,
        globalTags: this.globalTags,
        errorHandler: logger.error,
      });
    }

    this.CHECKS = datadogClient.CHECKS;

    decorate(methods, this, [telegrafClient, datadogClient]);
    decorate(datadogOnlyMethods, this, [datadogClient]);
  }
}

// todo add test
function decorate(methods, target, arrayOfSource){
  methods.forEach((method) => {
    target[method] = (...args) => {
      arrayOfSource.forEach((source) => {
        source[method].apply(source,args);
      })
    }
  })
}



module.exports = TsMetric;