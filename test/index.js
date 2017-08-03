const Code = require('code');
const expect = Code.expect;
const TsMetric = require('../lib/index');

describe('lib/index', function() {
  it('can not create the tsMetric without improper input', function(done) {
    expect(() => new TsMetric()).to.throw();
    expect(() => new TsMetric({
      datadogStatsdHost: 'localhost',
    })).to.throw();
    expect(() => new TsMetric({
      telegrafStatsdHost: 'localhost',
    })).to.throw();
    expect(() => new TsMetric({
      datadogStatsdHost: 'localhost',
      telegrafStatsdHost: 'localhost',
      globalTags: [1, 2, 4],
    })).to.throw();
    expect(() => new TsMetric({
      datadogStatsdHost: 'localhost',
      datadogStatsdPort: 'abd',
      telegrafStatsdHost: 'localhost',
    })).to.throw();
    done();
  });

  it('can create the tsMetric instance with proper input', function(done) {
    expect(() => new TsMetric({
      datadogStatsdHost: 'localhost',
      telegrafStatsdHost: 'localhost',
    })).to.not.throw();
    expect(() => new TsMetric({
      datadogStatsdHost: 'localhost',
      datadogStatsdPort: '1234',
      telegrafStatsdHost: 'localhost',
    })).to.not.throw();
    done();
  });

  it('can create the tsMetric instance with proper parameters', function(done) {
    const tsMetric = new TsMetric({
      datadogStatsdHost: 'localhost',
      telegrafStatsdHost: 'localhost',
      telegrafStatsdPort: 1234,
      globalTags: ['1', '2', '3'],
    });
    expect(tsMetric.globalTags).to.have.length(3);
    expect(tsMetric.globalTags[0]).to.equal('1');
    expect(tsMetric.telegrafStatsdPort).to.equal(1234);
    done();
  });
});
