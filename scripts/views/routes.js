import React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'

import * as u from '../utils'
import * as p from './pages'

export class AppRouter extends u.ViewComponent {
  render() {
    return (
      <Router>
        <Route path='/'           component={p.HomePage}       exact />
        <Route path='/categories' component={p.CategoriesPage} exact />
        <Route path='/accounts'   component={p.AccountsPage}   exact />
        <Route path='/payees'     component={p.PayeesPage}     exact />
      </Router>
    )
  }
}
