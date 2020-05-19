import * as t from '../types'

import React, {Fragment} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

import * as a from '../actions'
import * as u from '../utils'

import * as d from '../dialogs'
import * as g from '../geometry'

import * as i18n from '../i18n'

import * as m from './misc'
import * as s from './svg'
import * as l from './layouts'
import * as fb from './fake-button'

/**
 * Entities
 */

export class EntityPlaceholder extends m.ViewComponent {
  render() {
    const {context} = this

    const isMobile = g.isMobile(context)

    return (
      <div className='row-start-stretch gaps-h-1 padding-h-1'>
        <div className='relative width-2x5 square'>
          <div className='row-center-center abs-center'>
            <div className='width-1x5 square circle decorate-placeholder' />
          </div>
        </div>
        <div className='flex-1 col-start-stretch'>
          <div className='flex-1 row-start-center padding-v-1'>
            <Placeholder style={{width: '8em'}} />
          </div>
        </div>
        {isMobile ? null :
        <div className='row-center-center padding-h-0x25'>
          <div className='row-center-center' style={{minHeight: '2.5rem'}}>
            <s.Trash2 className='font-large fg-transparent' />
          </div>
        </div>}
      </div>
    )
  }
}


type EntityItemProps = {
  icon: t.RReactElement,
  onOpen: (event: fb.FakeButtonEvent) => void,
  onDelete: (event: fb.FakeButtonEvent) => void,
}

export class EntityItem extends m.ViewComponent<EntityItemProps> {
  actionsRef = React.createRef<HTMLDivElement>()

  onClick = (event: fb.FakeButtonEvent): void => {
    const {actionsRef, props: {onOpen}} = this

    const actionsNode = u.findDomNode(actionsRef.current)
    if (u.isAncestorOf(actionsNode, event.target)) {
      return
    }

    onOpen(event)
  }

  render() {
    const {
      context,
      props: {children, icon, onDelete},
      onClick, actionsRef,
    } = this

    const isMobile = g.isMobile(context)

    return (
      <fb.FakeButton
        type='div'
        onClick={onClick}
        className='row-start-stretch gaps-h-1 padding-h-1 text-left theme-drawer-link-busy rounded trigger'>
        <div className='relative width-2x5 square'>
          <div className='row-center-center abs-center'>
            {icon}
          </div>
        </div>
        <div className='flex-1 col-start-stretch'>
          <div className='flex-1 row-between-center padding-v-1'>
            {children}
          </div>
        </div>
        {isMobile ? null :
        <div className='row-center-center padding-h-0x25' ref={actionsRef}>
          <div className='row-center-center' style={{minHeight: '2.5rem'}}>
            <fb.FakeButton
              className='row-center-center show-on-trigger-hover decorate-icon-button'
              onClick={onDelete}>
              <s.Trash2 className='font-large' />
            </fb.FakeButton>
          </div>
        </div>}
      </fb.FakeButton>
    )
  }
}


type PlaceholderProps = {
  className?: string,
  style?: t.RCSSProperties,
}

export class Placeholder extends m.ViewComponent<PlaceholderProps> {
  render() {
    const {props: {style, className: cls}} = this

    return (
      <span className={`inline-block ${cls || ''}`}>
        <span
          className='inline-block valign-middle decorate-placeholder rounded-50p'
          style={{width: '3em', height: '1em', ...style}} />
      </span>
    )
  }
}



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
