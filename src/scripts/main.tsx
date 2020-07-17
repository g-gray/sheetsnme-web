import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {BrowserRouter as Router} from 'react-router-dom'

import * as e from './env'

import {App} from './app'

const rootElem = (
  <React.StrictMode>
    <Provider store={e.store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>
)

const rootNode = document.getElementById('root')
render(rootElem, rootNode)
