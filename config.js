const envalid = require('envalid');

const { num, str } = envalid;

/* eslint-disable no-process-env */

const env = envalid.cleanEnv(process.env, {
  SERVICE_NAME: str(),
  GRAYLOG_HOST: str(),
  GRAYLOG_PORT: num(),
  ENV: str(),
  TENANT: str(),
  DATADOG_STATSD_HOST: str(),
  DATADOG_STATSD_PORT: str(),
  TELEGRAF_STATSD_HOST: str(),
  TELEGRAF_STATSD_PORT: str()
});


module.exports = env;