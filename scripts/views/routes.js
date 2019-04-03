import React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'

import * as u from '../utils'
import * as p from './pages'

export class AppRouter extends u.ViewComponent {
  render() {
    return (
      <Router>
        <Route path='/' component={p.HomePage} exact />
        <Route path='/settings' component={p.SettingsPage} />
      </Router>
    )
  }
}
