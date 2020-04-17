import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'

import * as r from './reducers'


export const store = createStore(combineReducers(r), applyMiddleware(thunk))
