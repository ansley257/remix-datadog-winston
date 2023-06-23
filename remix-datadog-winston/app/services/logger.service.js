export class LoggerService {
  constructor(moduleName, meta = null) {
    this.moduleName = moduleName;
    this.meta = meta;
    this.loggerId = null;

    this.child();
  }

  logUrl = 'http://localhost:3000/api/log';

  log(level, message, meta) {
    // add this.meta and this.moduleName to meta
    meta = {
      ...meta,
      ...this.meta,
      moduleName: this.moduleName,
    };

    fetch(this.logUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        childId: this.loggerId,
        level: level,
        message: message,
        meta: meta,
      }),
    }).catch((error) => console.error(`Logging failed: ${error}`));
  }

  childLogUrl = 'http://localhost:3000/api/logger';

  child() {
    fetch(this.childLogUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        meta: {
          moduleName: this.moduleName,
          ...this.meta,
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        this.loggerId = data.loggerId;
      })
      .catch((error) => console.error(`Logging failed: ${error}`));
  }

  error(message, meta) {
    this.log('error', message, meta);
  }

  warn(message, meta) {
    this.log('warn', message, meta);
  }

  info(message, meta) {
    this.log('info', message, meta);
  }

  http(message, meta) {
    this.log('http', message, meta);
  }

  verbose(message, meta) {
    this.log('verbose', message, meta);
  }

  debug(message, meta) {
    this.log('debug', message, meta);
  }

  silly(message, meta) {
    this.log('silly', message, meta);
  }

  // You could add more methods for other log levels like 'warn', 'error', etc...
}
