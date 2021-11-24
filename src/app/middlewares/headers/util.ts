import {Middleware} from "koa";

export const setHeaders: (headers: { [key: string]: string }) => Middleware = headers => context => {
  const keys = Reflect.ownKeys(headers)
  for (const key of keys) {
    if (typeof key === 'string')
      context.set(key, headers[key])
  }
}
