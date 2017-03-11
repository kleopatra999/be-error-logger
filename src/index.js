function sanitizeKey(key) {
  return String(key)
  .substring(0, 32)
  .toUpperCase()
  .replace(/[^A-Z0-9_]*/g, '');
}

function sanitizeValue(value) {
  return String(value)
  .substring(0, 512)
  .replace(/\'/g, "\\'")
  .replace(/(\n|\r)/g, '\\n');
}

function format(object) {
  return Object.keys(object)
  .map(key => `${sanitizeKey(key)}='${sanitizeValue(object[key])}'`)
  .join(' ');
}

function getTimestamp() {
  const d = new Date();
  const pad = num => `0${num}`.slice(-2);
  return [
    d.getFullYear(), '-', pad(d.getMonth() + 1), '-', pad(d.getDate()), ' ',
    pad(d.getHours()), ':', pad(d.getMinutes()), ':', pad(d.getSeconds()),
  ].join('');
}

function log(stream, level, channel, appName, message, pid, optional = {}) {
  const timestamp = getTimestamp();
  const body = format(Object.assign({
    channel,
    level,
    APP_NAME: appName,
    message,
    pid,
  }, optional));
  stream.write(`[${timestamp}] ${body}\n`);
}

exports.create = function(appName, pid, outstream, errstream) {
  return {
    get(namespace) {
      const logger = {};
      ['error', 'info', 'notice', 'warn'].forEach((level) => {
        const stream = level === 'error' ? errstream : outstream;
        logger[level] = (channel, message, optional) =>
          log(stream, level.toUpperCase(), channel, appName, `${namespace}:${message}`, pid, optional);
      });
      return logger;
    },
  };
};
