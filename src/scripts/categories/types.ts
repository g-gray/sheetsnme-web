export type CategoriesState = {
  categoryList         : CategoryListRes,
  categoriesById       : CategoriesById,
  spendingsByCategoryId: SpendingsByCategoryId,
}

export type CategoryReq = {
  id?       : string,
  title     : string,
  createdAt?: string,
  updatedAt?: string,
}

export type CategoryRes = {
  id       : string,
  title    : string,
  createdAt: string,
  updatedAt: string,
}

export type CategoryListRes = CategoryRes[]

export type CategoriesById = {
  [key: string]: CategoryRes,
}



/**
 * Spendigns
 */

export type CategoriesSpendingsRes = SpendingsByCategoryId

export type SpendingsByCategoryId = {
  [key: string]: Spending,
}

export type Spending = {
  categoryId: string,
  spending  : number,
}
