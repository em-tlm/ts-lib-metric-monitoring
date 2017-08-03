# ts-lib-metric-monitoring

[![Build Status](https://travis-ci.org/tetrascience/ts-lib-metric-monitoring.svg?branch=master)](https://travis-ci.org/tetrascience/ts-lib-metric-monitoring)

This is a node module that will help you send your application metrics to __*both*__
* [Telegraf's statsD input](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/statsd), which then stores the data in influxdb and can be visualized using grafana. 
For more information, refer to the 
[metric visualization stack](https://github.com/tetrascience/ts-devops-local-stack/tree/master/metricvisualization)
* [Datadog agent's statsD server](http://docs.datadoghq.com/guides/dogstatsd/), which will then forward the metric to datadog for our centralized 
alerting/monitoring for important environments. 

You can read more about [StatsD Metric Types](https://github.com/etsy/statsd/blob/master/docs/metric_types.md) and [StatsD Server](https://github.com/etsy/statsd). 

## todo
* use callback
* add close 

## Usage

```
$ npm install tetrascience/ts-lib-metric-monitoring --save
```

Here are some examples how you can use this. 
It implements all the methods included in [hot-shots](https://github.com/brightcove/hot-shots), 
with some simplifications:

#### Simplication
> `close` and `socket` are not suppored yet. 
> `callback` is not supported yet. 

```js
const TsMetric = require('ts-lib-metric-monitoring');
const client = new TsMetric({
  globalTags: [
    process.env.SERVICE_NAME,
    process.env.TENANT,
    process.env.ENV
  ],
  datadogStatsdHost: 'datadog-agent',
  telegrafStatsdHost: 'telegraf', 
});

// Timing: sends a timing command with the specified milliseconds
client.timing('response_time', 42);

// Increment: Increments a stat by a value (default is 1)
client.increment('my_counter');

// Decrement: Decrements a stat by a value (default is -1)
client.decrement('my_counter');

// Histogram: send data for histogram stat (DataDog and Telegraf only)
client.histogram('my_histogram', 42);

// Gauge: Gauge a stat by a specified amount
client.gauge('my_gauge', 123.45);

// Set: Counts unique occurrences of a stat (alias of unique)
client.set('my_unique', 'foobar');
client.unique('my_unique', 'foobarbaz');

// Event: sends the titled event (DataDog only)
client.event('my_title', 'description');

// Check: sends a service check (DataDog only)
client.check('service.up', client.CHECKS.OK, { hostname: 'host-1' }, ['foo', 'bar'])

// Incrementing multiple items
client.increment(['these', 'are', 'different', 'stats']);

// Sampling, this will sample 25% of the time the StatsD Daemon will compensate for sampling
client.increment('my_counter', 1, 0.25);

// Tags, this will add user-defined tags to the data (DataDog and Telegraf only)
client.histogram('my_histogram', 42, ['foo', 'bar']);


// Sampling, tags and callback are optional and could be used in any combination (DataDog and Telegraf only)
client.histogram('my_histogram', 42, 0.25); // 25% Sample Rate
client.histogram('my_histogram', 42, ['tag']); // User-defined tag
client.histogram('my_histogram', 42, 0.25, ['tag']);

```


## API

```js
const TsMetric = require('ts-lib-metric-monitoring');
const tsMetric = new TsMetric();
```

### `new TsMetric(options)`
__Parameters__

* `options`: _(optional)_ an object with the following keys:

  + `datadogStatsdHost`: _(required)_ Hostname or IP of the Datadog StatsD server. 

  + `datadogStatsdPort`: _(optional)_ Port of the Datadog StatsD server with `default: 8125`.
  
  + `telegrafStatsdHost`: _(required)_ Hostname or IP of the Telegraf StatsD server.
  
  + `telegrafStatsdPort`: _(optional)_ Port of the Telegraf StatsD server with `default: 8125`.

  + `prefix`: _(optional)_ What to prefix each stat name with `default: ''`.

  + `suffix`: _(optional)_ What to suffix each stat name with `default: ''`.

  + `globalTags`: _(optional)_ Tags that will be added to every metric `default: []`.

  + `sampleRate`: _(optional)_ Sends only a sample of data to StatsD for all StatsD methods.  Can be overriden at the method level. `default: 1`.

### Other APIs
The APIs are exactly the same as [hot-shots](https://github.com/brightcove/hot-shots).
[Simplications](#Simplication) are described earlier. 

The following will only send metric to Datadog StatsD server
* `tsMetric.check`
* `tsMetric.event`

The following will send metric to both Datadog StatsD and Telegraf StatsD server. 
* `tsMetric.increment`
* `tsMetric.decrement`
* `tsMetric.guage`
* `tsMetric.unique`
* `tsMetric.timing`
* `tsMetric.set`
* `tsMetric.histogram`


