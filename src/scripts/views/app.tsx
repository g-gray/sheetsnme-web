import * as t from '../types'

import React from 'react'
import {connect} from 'react-redux'

import * as e from '../env'
import * as u from '../utils'

import * as a from '../actions'

import * as m from './misc'
import {Router} from './router'

type AppOwnProps = t.RRRouteComponentProps

type AppStateProps = {
  lang    : t.LANG,
  isMobile: boolean,
}

type AppProps = AppOwnProps & AppStateProps

class _App extends m.ViewComponent<AppProps> {
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

export const App = connect<AppStateProps, {}, AppOwnProps, t.AppState>(state => ({
  isMobile: state.dom.geometry.isMobile,
  lang: state.dom.i18n.lang,
}))(_App)
