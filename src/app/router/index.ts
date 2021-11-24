import Router from 'koa-router'
import {getEhPkg} from "../middlewares/pkgs";
import {setJSONHeader} from "../middlewares/headers/setJSONHeader";

const router = new Router

router.get('/pkg', getEhPkg, setJSONHeader)

export {
  router
}
