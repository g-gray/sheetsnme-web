import * as t from './types'

import React from 'react'
import {render} from 'react-dom'
import {Provider, connect} from 'react-redux'
import {BrowserRouter as Router, withRouter} from 'react-router-dom'

import * as e from './env'
import * as u from './utils'

import * as a from './actions'

import * as i18n from './i18n'

import * as m from './views/misc'
import {Routes} from './views/routes'

type AppOwnProps = t.RRRouteComponentProps

type AppStateProps = {
  lang    : t.LANG,
  isMobile: boolean,
}

type AppProps = AppOwnProps & AppStateProps

class _App extends m.ViewComponent<AppProps> {
  unlisten: () => void = () => {}
  unresize: () => void = () => {}

  render() {
    const {props: {isMobile, lang}} = this

    return (
      <e.Context.Provider value={{isMobile, lang}}>
        {/* Force components render when language was changed */}
        <Routes key={lang} />
      </e.Context.Provider>
    )
  }

  componentDidMount() {
    const {props: {dispatch, history, location, isMobile, lang}} = this
    const context = {isMobile, lang}

    this.unresize = u.addEvent(window, 'resize', () => {
      e.store.dispatch(a.resize(window.innerWidth))
    })

    this.unlisten = history.listen(nextLocation => {
      if (new RegExp(`^/transactions`, 'g').test(nextLocation.pathname)) {
        dispatch(a.fetchTransactions(nextLocation, i18n.xln(context, i18n.FETCHING_TRANSACTIONS)))
        return
      }

      if (new RegExp(`^/categories`, 'g').test(nextLocation.pathname)) {
        dispatch(a.fetchCategories(i18n.xln(context, i18n.FETCHING_CATEGORIES)))
        return
      }

      if (new RegExp(`^/accounts`, 'g').test(nextLocation.pathname)) {
        dispatch(a.fetchAccounts(i18n.xln(context, i18n.FETCHING_ACCOUNTS)))
        return
      }

      if (new RegExp(`^/payees`, 'g').test(nextLocation.pathname)) {
        dispatch(a.fetchPayees(i18n.xln(context, i18n.FETCHING_PAYEES)))
      }
    })

    dispatch(a.fetchUser(i18n.xln(context, i18n.FETCHING_USER)))
    .then(() => Promise.all([
      dispatch(a.fetchCategories(i18n.xln(context, i18n.FETCHING_CATEGORIES))),
      dispatch(a.fetchAccounts(i18n.xln(context, i18n.FETCHING_ACCOUNTS))),
      dispatch(a.fetchPayees(i18n.xln(context, i18n.FETCHING_PAYEES))),
    ]))
    .then(() => dispatch(a.fetchTransactions(
      location,
      i18n.xln(context, i18n.FETCHING_TRANSACTIONS)
    )))
  }

  componentWillUnmount() {
    this.unlisten()
    this.unresize()
  }
}

const App = withRouter(connect<AppStateProps, {}, AppOwnProps, t.AppState>(state => ({
  isMobile: state.dom.geometry.isMobile,
  lang: state.dom.i18n.lang,
}))(_App))

const elem = (
  <Provider store={e.store}>
    <Router>
      <App />
    </Router>
  </Provider>
)

const rootNode = document.getElementById('root')
render(elem, rootNode)
