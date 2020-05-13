export type UserState = null | UserRes

export type UserRes = {
  id           : string,
  pictureUrl   : string,
  email        : string,
  firstName    : string,
  lastName     : string,
  spreadsheets : SpreadsheetRes[],
  createdAt    : Date,
  updatedAt    : Date,
}

export type SpreadsheetRes = {
  id: string,
}
