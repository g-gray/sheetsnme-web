import * as t from '../types'

export type I18nActions = NextLang

export const NEXT_LANG = 'NEXT_LANG'

interface NextLang extends t.ReduxAction {
  type: typeof NEXT_LANG,
}

export function nextLang(): NextLang {
  return {
    type: NEXT_LANG,
  }
}
