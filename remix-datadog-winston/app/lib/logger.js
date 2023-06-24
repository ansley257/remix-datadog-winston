import { tracer } from './datadogTracer';
import {
  createLogger,
  format as _format,
  transports as _transports,
} from 'winston';
import os from 'os';
import DataDogTransport from './datadogTransport';

export const Logger = createLogger({
  level: 'debug',
  format: _format.combine(
    _format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    _format.errors({ stack: true }),
    _format.json()
  ),
  defaultMeta: {
    env: process.env.NODE_ENV,
    service: process.env.SERVICE,
    version: process.env.VERSION,
    pid: process.pid,
    source: 'nodejs',
    framework: 'remix',
    hostname: os.hostname(),
  },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new _transports.File({ filename: './log/frontend.log' }),
    new DataDogTransport({
      level: 'debug',
      apiKey: process.env.DD_API_KEY,
      service: process.env.SERVICE,
      ddsource: 'nodejs',
      hostname: os.hostname(),
    }),
  ],
});
