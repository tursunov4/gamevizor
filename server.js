import fs from 'node:fs/promises'
import express from 'express'
import { Transform } from 'node:stream'
import { createProxyMiddleware } from 'http-proxy-middleware';
import axios from 'axios';
import userAgent from 'user-agent';


// Constants
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5173
const base = process.env.BASE || '/'
const ABORT_DELAY = 10000


// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile('./dist/client/index.html', 'utf-8')
  : ''
const ssrManifest = isProduction
  ? await fs.readFile('./dist/client/.vite/ssr-manifest.json', 'utf-8')
  : undefined

// Create http server
const app = express()

// Add Vite or respective production middlewares
let vite
if (!isProduction) {
  const { createServer } = await import('vite')
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base
  })
  app.use(vite.middlewares)
} else {
  const compression = (await import('compression')).default
  const sirv = (await import('sirv')).default
  app.use(compression())
  app.use(base, sirv('./dist/client', { extensions: [] }))
}

// Serve HTML

app.use(
  '/api',
  createProxyMiddleware({
    target: 'https://server.gamevizor.ru/api',
    changeOrigin: true,
  }),
);

app.use(
  '/media',
  createProxyMiddleware({
    target: 'http://127.0.0.1:8000/media',
    changeOrigin: true,
  }),
);

app.use(
  '/ws',
  createProxyMiddleware({
    target: 'ws://127.0.0.1:8000/ws',
    changeOrigin: true,
    ws: true,
  }),
);

app.use('', async (req, res) => {
  try {

    var url = req.originalUrl.replace(base, '/')
    var refresh_token = null;
    if (req.headers.cookie) {
      const cookies = req.headers.cookie.split(';').map(cookie => cookie.trim()).reduce((acc, cookie) => {
        const [name, value] = cookie.split('=');
        acc[name] = value;
        return acc;
      }, {});
      refresh_token = cookies.refresh_token;
    }

    const ua = userAgent.parse(req.headers['user-agent']);
    let isMobile = false;
    if (ua.full.includes("Mobile")) {
      isMobile = true;
    }

    var app_head = ""
    let accessToken = null

    var json_data = {}

    if (refresh_token) {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/v1/token/refresh/', {
          refresh_token: refresh_token
        });
        accessToken = response.data.access;
      } catch (error) {
        refresh_token = null
      }
    }
    var is_404 = false
    if (url.startsWith('/admin')) {
      if (accessToken) {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/v1/auth/user/', {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });

          const response2 = await axios.get('http://127.0.0.1:8000/api/v1/admin/staffs/' + response.data.id + "/", {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
        } catch (error) {
          console.log("error", error)
          is_404 = true
        }
      } else {
        is_404 = true
      }
    }

    if (url.startsWith("/profile")) {
      if (accessToken) {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/v1/auth/user/', {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
        } catch (error) {
          console.log("error", error)
          is_404 = true
        }
      } else {
        is_404 = true
      }
    }

    if (url.startsWith("/catalog") && !url.startsWith("/catalog_")) {
      try {
        const pageMatch = url.match(/page=(\d+)/);
        var page = 1
        if (pageMatch) {
          var page = pageMatch[1];
        }
        const response = await axios.get('http://127.0.0.1:8000/api/v1/products/?sort_popular=1&type=PRODUCT&page=' + page, {
          headers: {
          }
        });

        json_data["products"] = response.data.results

        app_head = '<meta name="robots" content="noindex, follow" />'
      } catch (error) {
        console.log("error", error)
        is_404 = true
      }
    }

    var title = "GAMEVIZOR – играй без ограничений."

    if (url.startsWith("/product")) {
      try {
        const regex = /^\/product\/(\d+)(?:\?.+)?$/;
        const id1 = url.match(regex)[1];
        const response = await axios.get('http://127.0.0.1:8000/api/v1/products/' + id1 + "/", {
          headers: {
          }
        });

        if (response.data.product_type !== "PRODUCT" && response.data.product_type !== "CURRENCY") {
          is_404 = true
        } else {
          title = "GAMEVIZOR | Купить игру " + response.data.title

          json_data["products"] = [response.data.results]
        }
      } catch (error) {
        console.log("error", error)
        is_404 = true
      }
    }

    if (url.startsWith("/subscription")) {
      try {
        const regex = /^\/subscription\/(\d+)(?:\?.+)?$/;
        const id1 = url.match(regex)[1];
        const response = await axios.get('http://127.0.0.1:8000/api/v1/products/' + id1 + "/", {
          headers: {
          }
        });

        if (response.data.product_type !== "SUBSCRIPTION") {
          is_404 = true
        } else {
          title = "GAMEVIZOR | Купить подписку " + response.data.title
        }
      } catch (error) {
        console.log("error", error)
        is_404 = true
      }
    }

    const titles = {
      "/rules": "GAMEVIZOR | Правила сайта",
      "/confidential": "GAMEVIZOR | Политика конфиденциальности",
      "/offer": "GAMEVIZOR | Публичная оферта",

      "/order/create": "GAMEVIZOR | Создание заказа",

      "/catalog": "GAMEVIZOR | Каталог игр",
      "/subscriptions": "GAMEVIZOR | Каталог подписок",
      "/wallet": "GAMEVIZOR | Пополнение кошелька",

      "/profile": "GAMEVIZOR | Личный кабинет",
      "/profile/orders": "GAMEVIZOR | Мои заказы",
      "/profile/subscriptions": "GAMEVIZOR | Мои подписки",
      "/profile/offers": "GAMEVIZOR | Мои промокоды и бонусы",
      "/profile/chats": "GAMEVIZOR | Мои чаты",
      "/profile/supports": "GAMEVIZOR | Поддержка",

      "/admin": "GAMEVIZOR | Админка",
      "/admin/products": "GAMEVIZOR | Админка - Продукты",
      "/admin/orders": "GAMEVIZOR | Админка - Заказы",
      "/admin/chats": "GAMEVIZOR | Админка - Чаты",
      "/admin/stats": "GAMEVIZOR | Админка - Статистика",
      "/admin/team": "GAMEVIZOR | Админка - Команда",
      "/admin/clients": "GAMEVIZOR | Админка - Клиенты",
      "/admin/feedbacks": "GAMEVIZOR | Админка - Отзывы",
      "/admin/offers": "GAMEVIZOR | Админка - Предложения",
      "/admin/wallet": "GAMEVIZOR | Админка - Правила кошелька",
    }
    for (var i in titles) {
      if (url.startsWith(i)) {
        title = titles[i]
      }
    }


    let template
    let render
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile('./index.html', 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
    } else {
      template = templateHtml
      render = (await import('./dist/server/entry-server.js')).render
    }

    //const routeMatch = base_routers.find((route) => new RegExp(route.path).test(url));
    //console.log(routeMatch)

    let didError = false
    const { pipe, abort, isPage404 } = render(url, ssrManifest, {
      onShellError() {
        res.status(500)
        res.set({ 'Content-Type': 'text/html' })
        res.send('<h1>Something went wrong</h1>')
      },
      onShellReady() {
        res.status(didError ? 500 : is_404 ? 404 : 200);
        res.set({ 'Content-Type': 'text/html' })

        const transformStream = new Transform({
          transform(chunk, encoding, callback) {
            res.write(chunk, encoding)
            callback()
          }
        })

        json_data["is_404"] = is_404
        json_data["is_mobile"] = isMobile

        const data = JSON.stringify(json_data)

        console.log(isMobile)
        template = template.replace("<!--data-html-->", data)
        template = template.replace("<!--meta-head-->", app_head)
        template = template.replace("<!--title-html-->", title)
        const [htmlStart, htmlEnd] = template.split(`<!--app-html-->`)

        res.write(htmlStart)

        transformStream.on('finish', () => {
          res.end(htmlEnd)
        })

        pipe(transformStream)
      },
      onError(error) {
        didError = true
        console.error(error)
      }
    }, is_404, isMobile, json_data["products"])

    setTimeout(() => {
      abort()
    }, ABORT_DELAY)
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
