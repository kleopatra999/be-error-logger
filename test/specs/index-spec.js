const loggerFactory = require('../../src');

function makeString(len) {
  return new Array(len + 1).join('a');
}

describe('be-error-logger', function() {
  beforeEach(function() {
    jasmine.clock().mockDate(new Date(2000, 1, 1));
    this.outstream = jasmine.createSpyObj('outstream', ['write']);
    this.errstream = jasmine.createSpyObj('errstream', ['write']);
    this.loggers = loggerFactory.create('app1', 'p1', this.outstream, this.errstream);
  });

  it('should log to outstream on info', function() {
    const logger = this.loggers.get('a1');
    logger.info('ch1', 'm1', { o: 2 });
    expect(this.outstream.write).toHaveBeenCalled();
    expect(this.errstream.write).not.toHaveBeenCalled();
  });

  it('should error to errstream on info', function() {
    const logger = this.loggers.get('a2');
    logger.error('ch2', 'm2', { o: 3 });
    expect(this.errstream.write).toHaveBeenCalled();
    expect(this.outstream.write).not.toHaveBeenCalled();
  });

  it('should log in Be format', function() {
    const logger = this.loggers.get('a3');
    logger.info('ch3', 'm3', { o: 4, b: 3 });
    expect(this.outstream.write.calls.argsFor(0)[0])
    .toEqual("[2000-02-01 00:00:00] CHANNEL='ch3' LEVEL='INFO' APP_NAME='app1' MESSAGE='a3:m3' PID='p1' O='4' B='3'\n");
  });

  describe('keys', function() {
    it('should cut at 32 chars', function() {
      const string33 = makeString(33);
      const logger = this.loggers.get('a4');
      logger.info('ch5', 'm5', { [string33]: 'v' });
      expect(this.outstream.write.calls.argsFor(0)[0].length).toEqual(127);
    });

    it('should be capitalized', function() {
      const logger = this.loggers.get('a5');
      logger.info('ch6', 'm6', { ['key']: 'val' });
      expect(this.outstream.write.calls.argsFor(0)[0]).toMatch(/KEY='val'/);
    });

    it('should not have special characters', function() {
      const logger = this.loggers.get('a6');
      logger.info('ch7', 'm7', { ['k1 ^# ^ _ 3 \' " v']: 'v1' });
      expect(this.outstream.write.calls.argsFor(0)[0]).toMatch(/K1_3V='v1'/);
    });
  });

  describe('values', function() {
    it('should cut at 512 chars', function() {
      const string513 = makeString(513);
      const logger = this.loggers.get('a5');
      logger.info('ch6', 'm6', { k: string513 });
      expect(this.outstream.write.calls.argsFor(0)[0].length).toEqual(607);
    });

    it('should escape single quotes', function() {
      const logger = this.loggers.get('a6');
      logger.info('ch4', "a''b");
      expect(this.outstream.write.calls.argsFor(0)[0]).toMatch(/'a6:a\\'\\'b'/);
    });

    it('should escape line breaks', function() {
      const logger = this.loggers.get('a7');
      logger.info('ch7', 'm7', { k: 'a\n\rb' });
      expect(this.outstream.write.calls.argsFor(0)[0]).toMatch(/K='a\\n\\nb'/);
    });
  });
});
