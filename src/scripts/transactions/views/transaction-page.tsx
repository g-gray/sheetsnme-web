import * as t from '../../types'

import React from 'react'

import * as e from '../../env'

import * as a from '../../actions'

import * as i18n from '../../i18n'
import * as d from '../../dialogs'

import * as v from '../../views'

import * as tf from './transaction-form'
import * as tl from './transaction-list'

type TransactionPageProps = {}


export class TransactionsPage extends v.ViewComponent<TransactionPageProps> {
  openDialog = () => {
    const {context} = this

    const closeDialog = () => {
      e.dispatch(a.removeDialog<d.FormDialogProps>(dialog))
    }

    const dialog = (
      <d.FormDialog
        title={i18n.xln(context, i18n.NEW_TRANSACTION)}
        onClose={closeDialog}
      >
        <tf.TransactionForm onSubmitSuccess={closeDialog} />
      </d.FormDialog>
    )

    e.dispatch(a.addDialog<d.FormDialogProps>(dialog))
  }

  render() {
    const {openDialog} = this

    return (
      <v.ListPageLayout action={<v.Fab onClick={openDialog} />}>
        <tl.TransactionsList />
      </v.ListPageLayout>
    )
  }
}
