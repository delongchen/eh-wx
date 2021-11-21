import Koa from 'koa'
const cors = require('@koa/cors')
import { router } from "./router";

const app = new Koa

app.use(cors())
  .use(router.routes())
  .use(router.allowedMethods())

export {
  app
}
