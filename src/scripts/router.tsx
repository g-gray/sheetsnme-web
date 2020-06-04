import * as t from './types'

import React from 'react'
import {connect} from 'react-redux'
import {Switch, Route, Redirect, withRouter} from 'react-router-dom'

import * as e from './env'

import * as a from './actions'
import * as i18n from './i18n'

import {CategoriesPage} from './categories'
import {AccountsPage} from './accounts'
import {PayeesPage} from './payees'
import {TransactionsPage} from './transactions'

import * as p from './views/pages'
import * as m from './views/misc'

type RoutesProps = t.RRRouteComponentProps

class _Routes extends m.ViewComponent<RoutesProps> {
  unlisten: () => void = () => {}

  componentDidMount() {
    const {
      context,
      props: {history, location},
    } = this

    this.unlisten = history.listen(nextLocation => {
      if (new RegExp(`^/transactions`, 'g').test(nextLocation.pathname)) {
        e.dispatch(a.fetchTransactions(nextLocation, i18n.xln(context, i18n.FETCHING_TRANSACTIONS)))
        return
      }

      if (new RegExp(`^/categories`, 'g').test(nextLocation.pathname)) {
        e.dispatch(a.fetchCategories(i18n.xln(context, i18n.FETCHING_CATEGORIES)))
        return
      }

      if (new RegExp(`^/accounts`, 'g').test(nextLocation.pathname)) {
        e.dispatch(a.fetchAccounts(i18n.xln(context, i18n.FETCHING_ACCOUNTS)))
        return
      }

      if (new RegExp(`^/payees`, 'g').test(nextLocation.pathname)) {
        e.dispatch(a.fetchPayees(i18n.xln(context, i18n.FETCHING_PAYEES)))
      }
    })

    e.dispatch(a.fetchUser(i18n.xln(context, i18n.FETCHING_USER)))
      .then(() => Promise.all([
        e.dispatch(a.fetchCategories(i18n.xln(context, i18n.FETCHING_CATEGORIES))),
        e.dispatch(a.fetchAccounts(i18n.xln(context, i18n.FETCHING_ACCOUNTS))),
        e.dispatch(a.fetchPayees(i18n.xln(context, i18n.FETCHING_PAYEES))),
      ]))
      .then(() => e.dispatch(a.fetchTransactions(
        location,
        i18n.xln(context, i18n.FETCHING_TRANSACTIONS)
      )))
  }

  componentWillUnmount() {
    this.unlisten()
  }

  render() {
    return (
      <Switch>
        <Redirect from='/' to='/transactions' exact />
        <Route path='/transactions'           component={TransactionsPage} exact />
        <Route path='/categories'             component={CategoriesPage} />
        <Route path='/accounts'               component={AccountsPage} />
        <Route path='/payees'                 component={PayeesPage} />
        <Route                                component={p.Page404} />
      </Switch>
    )
  }
}

export const Router = withRouter(connect()(_Routes))
