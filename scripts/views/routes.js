import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

import * as u from '../utils'
import * as p from './pages'

export class AppRouter extends u.ViewComponent {
  render() {
    return (
      <Router>
        <Switch>
          <Route path='/'           component={p.HomePage} exact />
          <Route path='/categories' component={p.CategoriesPage} />
          <Route path='/accounts'   component={p.AccountsPage} />
          <Route path='/payees'     component={p.PayeesPage} />
          <Route                    component={p.Page404} />
        </Switch>
      </Router>
    )
  }
}
