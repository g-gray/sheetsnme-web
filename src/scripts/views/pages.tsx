import * as t from '../types'

import React, {Fragment} from 'react'
import {connect} from 'react-redux'
import {NavLink, Link, withRouter} from 'react-router-dom'
import ReactPaginate from 'react-paginate'

// @ts-ignore
import * as fpx from 'fpx'

import * as a from '../actions'
import * as u from '../utils'

import * as m from './misc'
import * as s from './svg'
import * as f from './forms'
import * as nav from './nav'

import * as d from '../dialogs'
import * as n from '../notifications'
import * as g from '../geometry'

import * as i18n from '../i18n'

/**
 * Layouts
 */

class PageLayout extends m.ViewComponent {
  render() {
    const {
      props: {className: cls, style, children},
    } = this

    return (
      <div className='relative col-start-stretch stretch-to-viewport-v'>
        <nav.Navbar />
        <div className='row-start-stretch gaps-h-1'>
          <nav.Drawer />
          <div
            className={`flex-1 ${cls || ''}`}
            style={style}
            children={children} />
        </div>
        <div className='fix-b-l z-index-tooltip width-100p row-start-center margin-0x5'>
          <n.Notifications />
        </div>
        <d.GlobalDialog />
      </div>
    )
  }
}

class _MobilePageLayout extends m.ViewComponent {
  render() {
    const {
      props: {className: cls, style, children, action, dialogs},
    } = this

    return (
      <div className='relative col-start-stretch stretch-to-viewport-v padding-b-5'>
        <nav.Navbar />
        <div
          className={`flex-1 ${cls || ''}`}
          style={style}
          children={children} />
        <div className='fix-b-l z-index-tooltip width-100p col-start-stretch gaps-v-0x5 padding-0x5'>
          <n.Notifications />
          {!action || fpx.size(dialogs) ? null :
          <div className='row-end-center padding-0x5'>
            {action}
          </div>}
        </div>
        <d.GlobalDialog />
      </div>
    )
  }
}

const MobilePageLayout = connect(state => ({
  dialogs: state.dom.dialogs,
}))(_MobilePageLayout)



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
  onOpen: (event: t.RMouseEvent) => void,
  onDelete: (event: t.RMouseEvent) => void,
}

export class EntityItem extends m.ViewComponent<EntityItemProps> {
  actionsRef = React.createRef<HTMLDivElement>()

  onClick = (event: t.RMouseEvent) => {
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
      <m.FakeButton
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
            <m.FakeButton
              className='row-center-center show-on-trigger-hover decorate-icon-button'
              onClick={onDelete}>
              <s.Trash2 className='font-large' />
            </m.FakeButton>
          </div>
        </div>}
      </m.FakeButton>
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



type FormDialogOwnProps = {
  onClose: void | ((event: KeyboardEvent) => void),
  title: string,
  form: React.ComponentType<P>,
  formProps: P,
}

type FormDialogStateProps = {}

type FormDialogProps = FormDialogOwnProps & FormDialogStateProps

class _FormDialog extends m.ViewComponent<FormDialogProps> {
  close = (event) => {
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
                <m.FakeButton className='row-center-center padding-1x25' onClick={close}>
                  <s.X className='font-large' />
                </m.FakeButton>
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
              <m.FakeButton className='row-center-center' onClick={close}>
                <s.X className='font-large' />
              </m.FakeButton>
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

export const FormDialog = connect<FormDialogStateProps, {}, FormDialogOwnProps, t.AppState>()(_FormDialog)

class _ConfirmDialog extends m.ViewComponent {
  constructor({dispatch}) {
    super(...arguments)

    this.close = () => {
      dispatch(a.removeDialog())
      if (this.props.onClose) this.props.onClose()
    }

    this.confirm = () => {
      dispatch(a.removeDialog())
      if (this.props.onConfirm) this.props.onConfirm()
    }
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
              <m.FakeButton className='btn-secondary' onClick={close}>
                {cancelText || i18n.xln(context, i18n.CANCEL)}
              </m.FakeButton>
              <m.FakeButton className='btn-primary' onClick={confirm}>
                {confirmText || i18n.xln(context, i18n.OK)}
              </m.FakeButton>
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

type ListPageProps = {
  action: t.RReactElement,
}

export class ListPage extends m.ViewComponent<ListPageProps> {
  render() {
    const {
      context,
      props: {action, children},
    } = this

    if (g.isMobile(context)) {
      return (
        <MobilePageLayout action={action}>
          <div className='col-start-stretch padding-v-0x5'>
            {children}
          </div>
        </MobilePageLayout>
      )
    }

    return (
      <PageLayout className='relative col-start-center padding-r-1x25'>
        <div className='limit-content-width col-start-stretch gaps-v-1 padding-b-2'>
          <div className='col-start-stretch padding-h-0x5' style={{marginTop: '-1.75rem'}}>
            {action}
          </div>
          {children}
        </div>
      </PageLayout>
    )
  }
}


type PaginatorProps = t.RRRouteComponentProps & {
  pageCount: number,
  onPageChange?: (pageNumber: number) => void,
}

type PaginatorState = {
  forcePage: number,
}

class _Paginator extends m.ViewComponent<PaginatorProps, PaginatorState> {
  state: Readonly<PaginatorState>
  unlisten: () => void = () => {}

  constructor(props: PaginatorProps) {
    super(props)

    const query = u.decodeQuery(this.props.location.search)
    const page = Array.isArray(query.page)
      ? query.page[0]
      : query.page

    this.state =  {
      forcePage: parseInt(page) || 1,
    }
  }

  onPageChange = ({selected}: {selected: number}): void => {
    const {props: {history, location, onPageChange}} = this

    const query = u.decodeQuery(location.search)
    const page = selected + 1
    history.push(`/transactions/${u.encodeQuery({...query, page})}`)

    if (typeof onPageChange === 'function') {
      onPageChange(page)
    }
  }

  hrefBulder = (page: number) => {
    const query = u.decodeQuery(this.props.location.search)
    return `/transactions/${u.encodeQuery({...query, page})}`
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen(nextLocation => {
      const location = this.props.location
      if (location.pathname !== nextLocation.pathname) return

      const nextQuery = u.decodeQuery(nextLocation.search)
      const page = Array.isArray(nextQuery.page)
        ? nextQuery.page[0]
        : nextQuery.page
      this.setState({forcePage: parseInt(page) || 1})
    })
  }

  componentWillUnmount() {
    this.unlisten()
  }

  render() {
    const {
      context,
      props: {pageCount},
      state: {forcePage},
      onPageChange, hrefBulder,
    } = this

    const isMobile = g.isMobile(context)

    return (
      <ReactPaginate
        pageCount={pageCount}
        pageRangeDisplayed={isMobile ? 2 : 3}
        marginPagesDisplayed={isMobile ? 1 : 2}
        previousLabel={<s.ArrowLeft />}
        nextLabel={<s.ArrowRight />}
        breakLabel='...'
        breakClassName={`block ${isMobile ? '' : 'padding-h-0x75'}`}
        breakLinkClassName='btn-secondary row-center-center'
        onPageChange={onPageChange}
        forcePage={forcePage - 1}
        disableInitialCallback={true}
        containerClassName={`${isMobile
          ? 'col-start-stretch gaps-v-1 padding-h-1x25'
          : 'row-center-center gaps-h-0x25'}`}
        pageClassName='block'
        pageLinkClassName='btn-secondary row-center-center'
        previousClassName='block'
        previousLinkClassName='btn-secondary row-center-center'
        nextClassName='block'
        nextLinkClassName='btn-secondary row-center-center'
        hrefBuilder={hrefBulder}
        ariaLabelBuilder={page => `${i18n.xln(context, i18n.PAGE)} ${page}`}
      />
    )
  }
}

export const Paginator = withRouter(_Paginator)


type FabProps = {
  className?: string,
  onClick: (event: m.FakeButtonEvent) => void,
}

export class Fab extends m.ViewComponent<FabProps> {
  render() {
    const {props: {className: cls, ...props}} = this

    return (
      <m.FakeButton
        className={`row-start-stretch width-3x5 ${cls || ''}`}
        {...props}
      >
        <span className='flex-1 relative circle square bg-accent shadow-dept-2'>
          <s.Plus className='abs-center font-giant fg-on-accent' />
        </span>
      </m.FakeButton>
    )
  }
}

// TODO Unused. Candidate to delete
class _ActionsMenu extends m.ViewComponent {
  constructor() {
    super(...arguments)

    this.state = {expanded: false}

    this.close = () => {
      this.setState({expanded: false})
    }

    this.toggle = () => {
      this.setState({expanded: !this.state.expanded})
    }
  }

  render() {
    const {
      props: {children},
      state: {expanded},
      toggle, close,
    } = this

    return !children ? null : (
      <div className='relative row-start-stretch'>
        <m.FakeButton
          onClick={toggle}
          className='relative row-start-center decorate-drawer-link z-index-2'
          aria-expanded={expanded}>
          <s.MoreVertical className='font-large' />
        </m.FakeButton>
        {!expanded ? null :
        <m.Closer root={this} close={close}>
          <div
            className='dropdown-position z-index-1'
            onClick={close}>
            <div className='dropdown dropdown-padding col-start-stretch' style={{minWidth: '11rem'}}>
              {children}
            </div>
          </div>
        </m.Closer>}
      </div>
    )
  }
}

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
        <MobilePageLayout>
          <div className='col-start-stretch gaps-v-1 padding-v-3'>
            {content}
          </div>
        </MobilePageLayout>
      )
    }

    return (
      <PageLayout className='relative col-start-center padding-r-1x25'>
        <div className='limit-content-width col-start-center gaps-v-1 padding-v-3'>
          {content}
        </div>
      </PageLayout>
    )
  }
}
