# Behance Error Logger [![Build Status](https://img.shields.io/travis/behance/be-error-logger.svg)](http://travis-ci.org/behance/be-error-logger) [![NPM version](https://img.shields.io/npm/v/be-error-logger.svg)](https://www.npmjs.com/package/be-error-logger)

This Browser / Node.js library is a helper for logging errors in the Be format.

## Format

`[2000-02-01 00:00:00] CHANNEL='my_channel' LEVEL='INFO' APP_NAME='App' MESSAGE='Hello' PID='3421' OPTIONAL_KEY1='v1' OPTIONAL_KEY2='v2'\n`


## Usage

Designed as contents of: `<APP_ROOT>/lib/core/loggers.js`:

```js
const loggerFactory = require('be-error-logger');
module.exports = loggerFactory.create('My Application', process.pid, process.stdout, process.stderr);
```

Then, in many other places within the application:

```js
const loggers = require('./core/loggers');

const logger = loggers.get('semantic_name_of_file');

// ...

logger.info('stats_channel', 'some description', { time_in_ms: 34 });
```


## Logger

`loggers.get()` returns a Logger with the following interface:

  - 'error' - prints to errstream
  - 'info' - prints to outstream
  - 'notice' - prints to outstream
  - 'warn' - prints to outstream

Each of these, in turn, has the following interface:

  - `channel` - `String` - rendered as `CHANNEL='name_of_chan'
  - `message` - `String` - rendered as `MESSAGE='context:message'`
  - `optional` - `Object` - rendered as `KEY1='value1' KEY2='value2'` etc.


## License

[Apache-2.0](/LICENSE)
