export const tracer = require('dd-trace').init({
  service: process.env.SERVICE,
  env: process.env.NODE_ENV,
  version: process.env.VERSION,
  hostname: 'localhost',
  logInjection: true,
  analytics: true,
  runtimeMetrics: true,
  tags: {
    pid: process.pid,
    source: 'nodejs',
    framework: 'remix',
  },
  debug: process.env.DEBUG === 'true',
  enabled: process.env.NODE_ENV !== 'test',
  sampleRate: 0.8,
  logLevel: 'debug',
  profiling: true,
  appSec: {
    enabled: true,
  },
});
