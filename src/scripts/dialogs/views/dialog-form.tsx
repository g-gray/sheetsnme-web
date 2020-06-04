import * as t from '../../types'

import React from 'react'
import {connect} from 'react-redux'

import * as i18n from '../../i18n'

import * as d from './dialog'

import * as v from '../../views'
import * as s from '../../views/svg'
import * as m from '../../views/misc'

export type FormDialogProps = {
  title   : string,
  onClose : (event?: KeyboardEvent | v.FakeButtonEvent) => void,
  children: t.RReactChildren,
}

class _FormDialog extends m.ViewComponent<FormDialogProps> {
  render() {
    const {
      context: {isMobile},
      props: {title, children, onClose},
    } = this

    if (isMobile) {
      return (
        <d.Dialog onEscape={onClose}>
          <d.DialogScrollable className='bg-surface'>
            <div className='relative col-start-stretch'>
              <div className='row-between-center gaps-h-1 padding-l-1x25 navbar-height'>
                <h2 className='font-large weight-medium'>
                  {title}
                </h2>
                <v.FakeButton
                  className='row-center-center padding-1x25'
                  onClick={onClose}
                >
                  <s.X className='font-large' />
                </v.FakeButton>
              </div>
              <hr className='hr' />
              {children}
            </div>
          </d.DialogScrollable>
        </d.Dialog>
      )
    }

    return (
      <d.Dialog onEscape={onClose}>
        <d.DialogOverlay className='bg-overlay' />
        <d.DialogCentered onClick={close}>
          <div
            className='col-start-stretch rounded bg-surface shadow-dept-3'
            style={{minWidth: '31rem'}}>
            <div className='row-between-center gaps-h-1 padding-h-1x25 navbar-height'>
              <h2 className='font-large weight-medium'>
                {title}
              </h2>
              <v.FakeButton
                className='row-center-center'
                onClick={close}
              >
                <s.X className='font-large' />
              </v.FakeButton>
            </div>
            <hr className='hr' />
            {children}
          </div>
        </d.DialogCentered>
      </d.Dialog>
    )
  }
}

export const FormDialog = connect()(_FormDialog)

export type ConfirmDialogProps = {
  question    : string,
  cancelText? : string,
  confirmText?: string,
  onClose     : (event: KeyboardEvent | v.FakeButtonEvent) => void,
  onConfirm   : (event: v.FakeButtonEvent) => void,
}

class _ConfirmDialog extends m.ViewComponent<ConfirmDialogProps> {
  render() {
    const {
      context,
      props: {question, cancelText, confirmText, onConfirm, onClose},
    } = this

    return (
      <d.Dialog onEscape={onClose}>
        <d.DialogOverlay className='bg-overlay' />
        <d.DialogCentered onClick={onClose}>
          <div
            className='col-start-stretch gaps-v-1 padding-v-1 rounded bg-surface shadow-dept-3'
            style={{minWidth: '11rem'}}
          >
            <p className='padding-h-1x25 font-midlarge weight-medium'>
              {question}
            </p>
            <div className='row-center-center gaps-h-1'>
              <v.FakeButton
                className='btn-secondary'
                onClick={onClose}
              >
                {cancelText || i18n.xln(context, i18n.CANCEL)}
              </v.FakeButton>
              <v.FakeButton
                className='btn-primary'
                onClick={onConfirm}
              >
                {confirmText || i18n.xln(context, i18n.OK)}
              </v.FakeButton>
            </div>
          </div>
        </d.DialogCentered>
      </d.Dialog>
    )
  }
}

export const ConfirmDialog = connect()(_ConfirmDialog)
