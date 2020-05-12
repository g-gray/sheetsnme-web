export * from './geometry/actions'
import * as ga from './geometry/actions'

export * from './i18n/actions'
import * as i18na from './i18n/actions'

export * from './notifications/actions'
import * as na from './notifications/actions'

export * from './dialogs/actions'
import * as da from './dialogs/actions'

export * from './pending/actions'
import * as pena from './pending/actions'

export * from './user/actions'
import * as ua from './user/actions'

export * from './categories/actions'
import * as ca from './categories/actions'

export * from './accounts/actions'
import * as aa from './accounts/actions'

export * from './payees/actions'
import * as pa from './payees/actions'

export * from './transactions/actions'
import * as ta from './transactions/actions'

export type DomActions =
  ga.GeometryActions |
  i18na.I18nActions |
  na.NotificationActions |
  da.DialogActions

export type NetAction =
  pena.PendingActions |
  ua.UserActions |
  ca.CategoryActions |
  aa.AccountActions |
  pa.PayeeActions |
  ta.TransactionActions
