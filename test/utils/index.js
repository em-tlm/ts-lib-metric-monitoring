const Code = require('code');
const expect = Code.expect;

describe('lib/util/proxyFn', function() {

  it('can properly proxy the function call', function(done) {
    let tempVar = 0;
    const proxyFn = require('../../lib/utils/proxyFn');
    const methods =['f1'];
    const target = {};
    const sources = [{
      f1() { tempVar++; },
    }, {
      f1() { tempVar++; },
    }];
    proxyFn(methods, target, sources);
    target.f1();
    expect(tempVar).to.equal(2);
    done();
  });

  it('can keep the scope of this while proxying function', function(done){
    let tempVar = '';
    const proxyFn = require('../../lib/utils/proxyFn');
    const methods =['f1'];
    const target = {};
    const sources = [{
      key: 'value',
      f1() { tempVar += this.key; },
    }, {
      key: 'value',
      f1() { tempVar += this.key; },
    }];
    proxyFn(methods, target, sources);
    target.f1();
    expect(tempVar).to.equal('valuevalue');
    done();
  })
});