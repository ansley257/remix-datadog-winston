import { cssBundleHref } from '@remix-run/css-bundle';

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';

import { datadogRum } from '@datadog/browser-rum';
import { useEffect } from 'react';

export const links = () => [
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
];

// write a loader to load the env vars from the .env file
export const loader = async () => {
  return {
    ENV: {
      DD_RUM_APPLICATION_ID: process.env.DD_RUM_APPLICATION_ID,
      DD_CLIENT_TOKEN: process.env.DD_CLIENT_TOKEN,
      SERVICE: process.env.SERVICE,
      NODE_ENV: process.env.NODE_ENV,
      VERSION: process.env.VERSION,
    },
  };
};

export default function App() {
  const data = useLoaderData();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      datadogRum.init({
        applicationId: window.ENV.DD_RUM_APPLICATION_ID,
        clientToken: window.ENV.DD_CLIENT_TOKEN,
        site: 'datadoghq.com',
        service: window.ENV.SERVICE,
        env: window.ENV.NODE_ENV,
        // Specify a version number to identify the deployed version of your application in Datadog
        version: window.ENV.VERSION,
        sessionSampleRate: 100,
        sessionReplaySampleRate: 20,
        trackUserInteractions: true,
        trackResources: true,
        trackLongTasks: true,
        trackFrustrations: true,
        defaultPrivacyLevel: 'mask-user-input',
        silentMultipleInit: true,
        allowedTracingUrls: [
          (url) => url.startsWith('<http://localhost:3000>'),
          (url) => url.startsWith('<http://192.168.0.169:3000>'),
        ],
      });

      datadogRum.startSessionReplayRecording();
    }
  }, []);
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
        {}
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
