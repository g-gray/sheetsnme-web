import * as t from './types'

import React from 'react'
import {connect} from 'react-redux'

import * as e from './env'
import * as u from './utils'

import * as a from './actions'

import {Router} from './router'
import * as v from './views'

type AppStateProps = {
  lang    : t.LANG,
  isMobile: boolean,
}

type AppProps = AppStateProps

class _App extends v.ViewComponent<AppProps> {
  unresize: () => void = () => {}

  resize = () => {
    e.store.dispatch(a.resize(window.innerWidth))
  }

  throttledResize = () => {
    requestAnimationFrame(this.resize)
  }

  render() {
    const {props: {isMobile, lang}} = this

    return (
      <e.Context.Provider value={{isMobile, lang}}>
        {/* Force components render when language was changed */}
        <Router key={lang} />
      </e.Context.Provider>
    )
  }

  componentDidMount() {
    this.unresize = u.addEvent(window, 'resize', this.throttledResize)
  }

  componentWillUnmount() {
    this.unresize()
  }
}

export const App = connect<AppStateProps, {}, {}, t.AppState>(state => ({
  isMobile: state.dom.geometry.isMobile,
  lang: state.dom.i18n.lang,
}))(_App)
