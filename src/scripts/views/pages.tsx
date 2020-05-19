import * as t from '../types'

import React, {Fragment} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

import * as a from '../actions'

import * as d from '../dialogs'
import * as g from '../geometry'

import * as i18n from '../i18n'

import * as m from './misc'
import * as s from './svg'
import * as l from './layouts'
import * as fb from './fake-button'


type FormDialogProps<P> = {
  title: string,
  form: React.ComponentType<P>,
  formProps: P,
  onClose?: (event: t.RKeyboardEvent | t.RMouseEvent) => void,
}

class _FormDialog<P> extends m.ViewComponent<FormDialogProps<P>> {
  close = (event: t.RKeyboardEvent | t.RMouseEvent) => {
    const {dispatch, onClose} = this.props
    dispatch(a.removeDialog())

    if (onClose) {
      onClose(event)
    }
  }

  render() {
    const {
      context,
      props: {title, form: Form, formProps},
      close,
    } = this

    if (g.isMobile(context)) {
      return (
        <d.Dialog onEscape={close}>
          <d.DialogScrollable className='bg-surface'>
            <div className='relative col-start-stretch'>
              <div className='row-between-center gaps-h-1 padding-l-1x25 navbar-height'>
                <h2 className='font-large weight-medium'>
                  {title}
                </h2>
                <fb.FakeButton
                  className='row-center-center padding-1x25'
                  onClick={close}
                >
                  <s.X className='font-large' />
                </fb.FakeButton>
              </div>
              <hr className='hr' />
              {!Form ? null :
              <Form {...formProps} onSubmitSuccess={close} />}
            </div>
          </d.DialogScrollable>
        </d.Dialog>
      )
    }

    return (
      <d.Dialog onEscape={close}>
        <d.DialogOverlay className='bg-overlay' />
        <d.DialogCentered onClick={close}>
          <div
            className='col-start-stretch rounded bg-surface shadow-dept-3'
            style={{minWidth: '31rem'}}>
            <div className='row-between-center gaps-h-1 padding-h-1x25 navbar-height'>
              <h2 className='font-large weight-medium'>
                {title}
              </h2>
              <fb.FakeButton className='row-center-center' onClick={close}>
                <s.X className='font-large' />
              </fb.FakeButton>
            </div>
            <hr className='hr' />
            {!Form ? null :
            <Form {...formProps} onSubmitSuccess={close} />}
          </div>
        </d.DialogCentered>
      </d.Dialog>
    )
  }
}

export const FormDialog = connect()(_FormDialog)

type ConfirmDialog = {
  question: string,
  cancelText?: string,
  confirmText?: string,
  onClose: (event: fb.FakeButtonEvent) => void,
  onConfirm: (event: fb.FakeButtonEvent) => void,
}

class _ConfirmDialog extends m.ViewComponent<ConfirmDialog> {
  close = (event: fb.FakeButtonEvent) => {
    const {props: {dispatch, onClose}} = this
    dispatch(a.removeDialog())
    onClose(event)
  }

  confirm = (event: fb.FakeButtonEvent) => {
    const {props: {dispatch, onConfirm}} = this
    dispatch(a.removeDialog())
    onConfirm(event)
  }

  render() {
    const {
      context,
      props: {question, cancelText, confirmText},
      confirm, close,
    } = this

    return (
      <d.Dialog onEscape={close}>
        <d.DialogOverlay className='bg-overlay' />
        <d.DialogCentered onClick={close}>
          <div
            className='col-start-stretch gaps-v-1 padding-v-1 rounded bg-surface shadow-dept-3'
            style={{minWidth: '11rem'}}>
            <p className='padding-h-1x25 font-midlarge weight-medium'>
              {question}
            </p>
            <div className='row-center-center gaps-h-1'>
              <fb.FakeButton className='btn-secondary' onClick={close}>
                {cancelText || i18n.xln(context, i18n.CANCEL)}
              </fb.FakeButton>
              <fb.FakeButton className='btn-primary' onClick={confirm}>
                {confirmText || i18n.xln(context, i18n.OK)}
              </fb.FakeButton>
            </div>
          </div>
        </d.DialogCentered>
      </d.Dialog>
    )
  }
}

export const ConfirmDialog = connect()(_ConfirmDialog)



/**
 * Misc
 */

// TODO Unused. Candidate to delete
// class _ActionsMenu extends m.ViewComponent {
//   constructor() {
//     super(...arguments)

//     this.state = {expanded: false}

//     this.close = () => {
//       this.setState({expanded: false})
//     }

//     this.toggle = () => {
//       this.setState({expanded: !this.state.expanded})
//     }
//   }

//   render() {
//     const {
//       props: {children},
//       state: {expanded},
//       toggle, close,
//     } = this

//     return !children ? null : (
//       <div className='relative row-start-stretch'>
//         <f.FakeButton
//           onClick={toggle}
//           className='relative row-start-center decorate-drawer-link z-index-2'
//           aria-expanded={expanded}>
//           <s.MoreVertical className='font-large' />
//         </f.FakeButton>
//         {!expanded ? null :
//         <m.Closer root={this} close={close}>
//           <div
//             className='dropdown-position z-index-1'
//             onClick={close}>
//             <div className='dropdown dropdown-padding col-start-stretch' style={{minWidth: '11rem'}}>
//               {children}
//             </div>
//           </div>
//         </m.Closer>}
//       </div>
//     )
//   }
// }

export class Page404 extends m.ViewComponent {
  render() {
    const {context} = this

    const content = (
      <Fragment>
        <div className='col-start-center gaps-v-0x5'>
          <h2 style={{lineHeight: '1', fontSize: '3em'}}>404</h2>
          <p>Page Not Found</p>
        </div>
        <p className='row-center-center'>
          <Link to='/' className='btn-primary'>Dashboard</Link>
        </p>
      </Fragment>
    )

    if (g.isMobile(context)) {
      return (
        <l.MobilePageLayout>
          <div className='col-start-stretch gaps-v-1 padding-v-3'>
            {content}
          </div>
        </l.MobilePageLayout>
      )
    }

    return (
      <l.PageLayout className='relative col-start-center padding-r-1x25'>
        <div className='limit-content-width col-start-center gaps-v-1 padding-v-3'>
          {content}
        </div>
      </l.PageLayout>
    )
  }
}
