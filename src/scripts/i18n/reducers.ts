import * as t from '../types'

// @ts-ignore
import * as fpx from 'fpx'

import * as u from './../utils'

import * as a from './actions'

export const AVAILABLE_LANGS: t.LANG[] = Object.values(t.LANG)

export const QUERY_LANG: t.LANG = fpx.intersection(
  fpx.flatten([u.decodeQuery(window.location.search).lang]),
  AVAILABLE_LANGS,
)[0]

export const STORAGE_LANG: t.LANG = fpx.intersection(
  [u.storageRead(['lang'])],
  AVAILABLE_LANGS,
)[0]

export const DEFAULT_LANG: t.LANG = fpx.intersection(
  window.navigator.languages.map(langPrefix),
  AVAILABLE_LANGS,
)[0] || AVAILABLE_LANGS[0]

function langPrefix(langCode: string): string {
  return langCode.split('-')[0]
}



export const defaultState: t.i18nState = {
  lang: QUERY_LANG || STORAGE_LANG || DEFAULT_LANG,
}

export const i18n = (state = defaultState, action: a.I18nActions) => {
  switch (action.type) {
    case a.NEXT_LANG: {

      const {lang} = state
      const nextLang = selectNextLang(lang)

      u.storageWrite(['lang'], nextLang)

      return {
        ...state,
        lang: nextLang,
      }
    }

    default:
      return state
  }
}



function selectNextLang(currentLang: t.LANG): t.LANG {
  const currentIndex = AVAILABLE_LANGS.indexOf(currentLang)
  const nextIndex: number = (currentIndex + 1) % AVAILABLE_LANGS.length
  return AVAILABLE_LANGS[nextIndex] || DEFAULT_LANG
}
