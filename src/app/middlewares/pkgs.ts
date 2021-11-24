import {Middleware} from "koa";
import {getPkg} from "../../core/store";

export const getEhPkg: Middleware = async (context, next) => {
  context.body = getPkg()
  await next()
}
