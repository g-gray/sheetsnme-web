import * as t from '../types'

// @ts-ignore
import * as fpx from 'fpx'

import * as u from '../utils'

export const AVAILABLE_LANGS: t.LANG[] = Object.values(t.LANG)

export const QUERY_LANG: t.LANG = fpx.intersection(
  [u.decodeQuery(window.location.search).lang],
  AVAILABLE_LANGS,
)[0]

export const DEFAULT_LANG: t.LANG = fpx.intersection(
  window.navigator.languages.map(langPrefix),
  AVAILABLE_LANGS,
)[0] || AVAILABLE_LANGS[0]

function langPrefix(langCode: string): string {
  return langCode.split('-')[0]
}

export function xln(
  context: t.AppContext,
  translations: t.Translations,
  ...args: any[]
): string {
  fpx.validate(context, fpx.isObject)

  if (translations == null) return ''
  fpx.validate(translations, fpx.isDict)

  let translation: t.Translation = ''

  if (translations[context.lang]) {
    translation = translations[context.lang]
  }
  else if (translations[DEFAULT_LANG]) {
    translation = translations[DEFAULT_LANG]
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

export function nextLang(context: t.AppContext): t.LANG {
  fpx.validate(context, fpx.isObject)

  const lang = context.lang || DEFAULT_LANG
  const nextIndex: number = (AVAILABLE_LANGS.indexOf(lang) + 1) % AVAILABLE_LANGS.length
  return AVAILABLE_LANGS[nextIndex] || DEFAULT_LANG
}
