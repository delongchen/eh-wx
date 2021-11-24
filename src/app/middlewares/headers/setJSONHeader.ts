import {setHeaders} from "./util";

export const setJSONHeader = setHeaders({
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store'
})
