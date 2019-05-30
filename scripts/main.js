import React from 'react'
import {render} from 'react-dom'
import {Provider, connect} from 'react-redux'
import {BrowserRouter as Router, withRouter} from 'react-router-dom'

import * as e from './env'
import * as a from './actions'
import * as u from './utils'
import * as t from './translations'

import {Routes} from './views/routes'

class App extends u.ViewComponent {
  render({props: {isMobile, lang}}) {
    return (
      <u.Context.Provider value={{isMobile, lang}}>
        {/* Force components render when language was changed */}
        <Routes key={lang} />
      </u.Context.Provider>
    )
  }

  componentDidMount() {
    const {props} = this
    const {dispatch, location, lang} = props
    const context = {lang}

    dispatch(a.fetchUser(u.xln(context, t.FETCHING_USER)))
      // eslint-disable-next-line promise/no-native
      .then(() => Promise.all([
        dispatch(a.fetchCategories(u.xln(context, t.FETCHING_CATEGORIES))),
        dispatch(a.fetchAccounts(u.xln(context, t.FETCHING_ACCOUNTS))),
        dispatch(a.fetchPayees(u.xln(context, t.FETCHING_PAYEES))),
      ]))
      .then(() => dispatch(a.fetchTransactions(location, u.xln(context, t.FETCHING_TRANSACTIONS))))
  }
}

const ConnectedApp = withRouter(connect(state => ({
  isMobile: state.dom.geometry.isMobile,
  lang: state.dom.lang,
}))(App))

const elem = (
  <Provider store={e.store}>
    <Router>
      <ConnectedApp />
    </Router>
  </Provider>
)

const rootNode = document.getElementById('root')

render(elem, rootNode, initDom)

function initDom() {
  window.addEventListener('resize', () => {
    e.store.dispatch(a.resize(u.geometry(window.innerWidth)))
  })
}
