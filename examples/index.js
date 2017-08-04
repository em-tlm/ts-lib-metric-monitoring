const TsMetric = require('../lib');
const tsMetric = new TsMetric({
  globalTags: [
    'local', // ENV
    'multi', // TENANT
    'file',  // SERVICE_NAME
  ],
  telegrafStatsdHost: 'localhost',
});

setInterval(tsMetric.increment.bind(tsMetric, ['user download']), 2000);
