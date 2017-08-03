const TsMetric = require('../lib');
const tsMetric = new TsMetric({
  globalTags: [
    'local',
    'multi',
    'file'
  ],
  datadogStatsdHost: 'localhost',
  telegrafStatsdHost: 'localhost',
});
tsMetric.check('end to end test A', tsMetric.CHECKS.OK);

setInterval(tsMetric.increment.bind(tsMetric, ['user download']), 2000);
