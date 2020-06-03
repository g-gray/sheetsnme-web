import * as t from '../types'

import React, {Fragment} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

import * as d from '../dialogs'

import * as i18n from '../i18n'

import * as m from './misc'
import * as s from './svg'
import * as l from './layouts'
import * as fb from './fake-button'

export type FormDialogProps = {
  title   : string,
  onClose : (event?: KeyboardEvent | fb.FakeButtonEvent) => void,
  children: t.RReactChildren,
}

export type FormProps = {
  onSubmitSuccess: (event?: KeyboardEvent | t.RMouseEvent) => void,
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
                <fb.FakeButton
                  className='row-center-center padding-1x25'
                  onClick={onClose}
                >
                  <s.X className='font-large' />
                </fb.FakeButton>
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
              <fb.FakeButton
                className='row-center-center'
                onClick={close}
              >
                <s.X className='font-large' />
              </fb.FakeButton>
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
  onClose     : (event: KeyboardEvent | fb.FakeButtonEvent) => void,
  onConfirm   : (event: fb.FakeButtonEvent) => void,
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
              <fb.FakeButton
                className='btn-secondary'
                onClick={onClose}
              >
                {cancelText || i18n.xln(context, i18n.CANCEL)}
              </fb.FakeButton>
              <fb.FakeButton
                className='btn-primary'
                onClick={onConfirm}
              >
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
    const {context: {isMobile}} = this

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

    if (isMobile) {
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
