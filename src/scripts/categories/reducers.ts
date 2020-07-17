import * as t from './types'

import * as u from '../utils'

import * as a from './actions'

export const defaultState: t.CategoriesState = {
  categoryList: [],
  categoriesById: {},
  spendingsByCategoryId: {},
}

export const categories = (
  state = defaultState,
  action: a.CategoryActions
) => {
  switch (action.type) {
    case a.RECEIVE_CATEGORIES: {
      const {categoryList} = action.payload
      return {
        ...state,
        categoryList,
        categoriesById: u.keyById(categoryList),
      }
    }

    case a.RECEIVE_CATEGORIES_SPENDINGS: {
      const {categoriesSpendings} = action.payload
      return {
        ...state,
        spendingsByCategoryId: categoriesSpendings,
      }
    }

    default:
      return state
  }
}
