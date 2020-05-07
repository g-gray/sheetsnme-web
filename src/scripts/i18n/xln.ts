import * as t from '../types'

import * as r from './reducers'

export function xln(
  context: t.AppContext,
  translations: t.TranslationsByLang,
  ...args: any[]
): string {
  let translation: t.Translation = ''

  if (translations[context.lang]) {
    translation = translations[context.lang]
  }
  else if (translations[r.DEFAULT_LANG]) {
    translation = translations[r.DEFAULT_LANG]
  }
  else {
    let lang: t.LANG
    for (lang in translations) {
      if (translations[lang]) {
        translation = translations[lang]
        break
      }
    }
  }

  return typeof translation === 'function'
    ? translation(...args)
    : (translation || '')
}
