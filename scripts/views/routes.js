import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'

import * as u from '../utils'
import * as p from './pages'

export class Routes extends u.ViewComponent {
  render() {
    return (
      <Switch>
        <Redirect from='/' to='/transactions' exact />
        <Route path='/transactions'           component={p.TransactionsPage} exact />
        <Route path='/categories'             component={p.CategoriesPage} />
        <Route path='/accounts'               component={p.AccountsPage} />
        <Route path='/payees'                 component={p.PayeesPage} />
        <Route                                component={p.Page404} />
      </Switch>
    )
  }
}
