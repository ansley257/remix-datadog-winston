import { tracer } from './datadogTracer';
import Transport from 'winston-transport';
import axios from 'axios';

export default class DataDogTransport extends Transport {
  constructor(opts) {
    super(opts);
    this.name = 'dataDogTransport';
    this.level = opts.level || 'info';
    this.apiKey = opts.apiKey;
    this.ddsource = opts.ddsource || 'nodejs';
    this.service = opts.service || 'my_service';
    this.hostname = opts.hostname || require('os').hostname();
  }

  log(info, callback) {
    const { message, level, source, service, hostname, ...meta } = info;

    // turn meta into a string of key:value pairs for ddtags, itterate over the object
    // and add each key:value pair to the string. Where there are nested objects, the
    // concatenate the keys with a '.' and only add the final value to the string. continue to
    // drill into nested objects recursively until all key:value pairs have been added to the string.
    let ddtags = '';
    const addTags = (obj, prefix) => {
      Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === 'object') {
          addTags(obj[key], `${prefix}${key}.`);
        } else {
          ddtags += `${prefix}${key}:${obj[key]},`;
        }
      });
    };
    addTags(meta, '');

    const payload = {
      ddsource: this.ddsource,
      service: this.service,
      hostname: this.hostname,
      message: { message: message, ...meta },
      ddtags: ddtags,
    };

    axios({
      method: 'post',
      url: `https://http-intake.logs.datadoghq.com/api/v2/logs`,
      headers: {
        'Content-Type': 'application/json',
        'DD-API-KEY': this.apiKey,
      },
      data: payload,
    })
      .then(() => {
        setImmediate(() => {
          this.emit('logged', info);
        });
        callback(null, true);
      })
      .catch((error) => {
        this.emit('error', error);
        callback(error);
      });
  }
}
