export type i18nState = {
  lang: LANG,
}

export enum LANG {
  en = 'en',
  ru = 'ru',
}

export type Translation = string | ((...args: any[]) => string)

export type TranslationsByLang = {
  [key in LANG]: Translation
}
