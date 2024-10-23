import React from 'react';
import { type RenderToPipeableStreamOptions, renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import { base_routers } from './routers/base_routers';


export const checkIfPageExists = (url: string): boolean => {
  url = url.split("?")[0]

  for (const router of base_routers) {
    if (router.path === "*") {
      continue
    }

    const regex = new RegExp(`^/?${router.path.replace(/:\w+/g, '(?:[^/]+)?')}/?$`);
    if (regex.test(url)) {
      console.log(router, url);
      return false;
    }
  }
  return true;
};


export function render(url: string, _ssrManifest?: string, options?: RenderToPipeableStreamOptions, is_404=false, isMobile=false, products=[]) {
  const { pipe, abort } = renderToPipeableStream(
    <React.StrictMode>
      <StaticRouter location={url}>
        <App is_404={is_404} is_mobile={isMobile} products={products}/>
      </StaticRouter>
    </React.StrictMode>,
    options,
  );

  const isPage404 = checkIfPageExists(url);

  return { pipe, abort, isPage404 }
}