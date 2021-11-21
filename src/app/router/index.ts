import Router from 'koa-router'
import {getEhPkg} from "../middlewares/pkgs";

const router = new Router

router.get('/pkg', getEhPkg)

export {
  router
}
