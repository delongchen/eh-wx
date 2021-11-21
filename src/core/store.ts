import {EhItem} from "../types/EhItems";

const state = {
  changed: true
}
const pkgMap = new Map<number, EhItem>()
export const dirtyPkgMap = new Map<string, string>()

export const addPkg = (pkg: EhItem) => {
  pkgMap.set(pkg.id, pkg)
  state.changed = true
}

export const removePkg = (id: number) => {
  pkgMap.delete(id)
  state.changed = true
}

let pkgCache = Buffer.from('')
export const getPkg = () => {
  if (state.changed) {
    pkgCache = Buffer.from(
      JSON.stringify([...pkgMap.values()])
    )
    state.changed = false
  }
  return pkgCache
}
