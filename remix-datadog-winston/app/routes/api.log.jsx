import { tracer } from '../lib/datadogTracer';
import { Logger } from '../lib/logger';
// import { childLoggers } from './api.logger';

export async function action({ request }) {
  const { childId, level, message, meta = null } = await request.json();

  const childLogger = childLoggers.find((logger) => logger.childId === childId);

  if (!childLogger) {
    meta ? Logger.log(level, message, meta) : Logger.info(level, message);
  } else {
    meta
      ? childLogger.log(level, message, meta)
      : childLogger.log(level, message);
  }

  return new Response('ok');
}
