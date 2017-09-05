const TsMetric = require('../lib');
const tsMetric = new TsMetric({
  globalTags: [
    'local', // ENV
    'multi', // TENANT
    'file', // SERVICE_NAME
  ],
  telegrafStatsdHost: 'localhost',
});

tsMetric.increment.apply(tsMetric, ['user download']);
setInterval(tsMetric.increment.bind(tsMetric, ['user download']), 2000);
setInterval(() => console.log('sending metrics'), 2000);