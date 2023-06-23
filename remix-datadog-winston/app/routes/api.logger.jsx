import { Logger } from '../lib/logger.js';
import { v5 as uuid } from 'uuid';

const NAMESPACE = 'bc20b886-1b25-49f5-87c6-3c2109fb7339';

export let childLoggers = [];

export async function action({ request }) {
  const body = await request.json();

  const { meta } = body;

  const childId = uuid(JSON.stringify(meta), NAMESPACE);

  childLoggers.push(Logger.child({ loggerID: childId, ...meta }));

  // return the childId so we can use it to log to the child logger
  return new Response(JSON.stringify({ childId: childId }), { status: 200 });
}
