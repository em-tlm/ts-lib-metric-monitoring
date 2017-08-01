const StatsD = require('hot-shots'),
  client = new StatsD({
    telegraf: true,
    errorHandler: console.error,
  });


function next(err,result) {
  console.log(err);
  console.log(result);
}

// Catch socket errors so they don't go unhandled, as explained
// in the Errors section below
client.socket.on('error', function(error) {
  console.error("Error in socket: ", error);
});

// Timing: sends a timing command with the specified milliseconds
//client.timing('response_time', 42);


/*for (let i = 0; i< 50; i++) {
 // Increment: Increments a stat by a value (default is 1)
 client.increment('my_counter');
 }*/

//setInterval(function(){
//  client.increment('service1');
//}, 5000);


setInterval(function(){
  client.increment('service2');
}, 1000);



// setInterval(function(){
//   client.check('service.health', client.CHECKS.OK, { hostname: 'tsscheduling' }, [process.env.NODE_ENV])
// },5000);

/*// Decrement: Decrements a stat by a value (default is -1)
 client.decrement('my_counter');

 // Histogram: send data for histogram stat (DataDog and Telegraf only)
 client.histogram('my_histogram', 42);

 // Gauge: Gauge a stat by a specified amount
 client.gauge('my_gauge', 123.45);

 // Set: Counts unique occurrences of a stat (alias of unique)
 client.set('my_unique', 'foobar');
 client.unique('my_unique', 'foobarbaz');

 // Event: sends the titled event (DataDog only)
 //client.event('my_title', 'description');

 // Check: sends a service check (DataDog only)
 //client.check('service.up', client.CHECKS.OK, { hostname: 'host-1' }, ['foo', 'bar'])

 // Incrementing multiple items
 client.increment(['these', 'are', 'different', 'stats']);

 // Sampling, this will sample 25% of the time the StatsD Daemon will compensate for sampling
 client.increment('my_counter', 1, 0.25);

 // Tags, this will add user-defined tags to the data (DataDog and Telegraf only)
 client.histogram('my_histogram', 42, ['foo', 'bar']);

 // Using the callback.  This is the same format for the callback
 // with all non-close calls
 client.set(['foo', 'bar'], 42, function(error, bytes){
 //this only gets called once after all messages have been sent
 if(error){
 console.error('Oh noes! There was an error:', error);
 } else {
 console.log('Successfully sent', bytes, 'bytes');
 }
 });



 // Sampling, tags and callback are optional and could be used in any combination (DataDog and Telegraf only)
 client.histogram('my_histogram', 42, 0.25); // 25% Sample Rate
 client.histogram('my_histogram', 42, ['tag']); // User-defined tag
 client.histogram('my_histogram', 42, function(){
 console.log('here');
 }); // Callback
 client.histogram('my_histogram', 42, 0.25, ['tag']);
 client.histogram('my_histogram', 42, 0.25, next);
 client.histogram('my_histogram', 42, ['tag'], next);
 client.histogram('my_histogram', 42, 0.25, ['tag'], next);

 // Use a child client to add more context to the client.
 // Clients can be nested.
 var childClient = client.childClient({
 prefix: 'additionalPrefix.',
 suffix: '.additionalSuffix',
 globalTags: ['globalTag1:forAllMetricsFromChildClient']
 });
 childClient.increment('my_counter_with_more_tags');*/

// Close statsd.  This will ensure all stats are sent and stop statsd
// from doing anything more.
// client.close(function(err) {
//   console.log('The close did not work quite right: ', err);
// });

