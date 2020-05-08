export type CategoriesState = {
  categoryList: CategoryListRes,
  categoriesById: CategoriesById,
}

export type CategoryReq = {
  id?          : string,
  title        : string,
  createdAt?   : string,
  updatedAt?   : string,
}

export type CategoryRes = {
  id          : string,
  title       : string,
  createdAt   : string,
  updatedAt   : string,
}

export type CategoryListRes = CategoryRes[]

export type CategoriesById = {
  [key: string]: CategoryRes,
}
