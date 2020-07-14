import * as t from '../types'

import React from 'react'
import {connect} from 'react-redux'

import * as m from './misc'
import * as nav from './nav'

import * as d from '../dialogs'
import * as n from '../notifications'

/**
 * Dashboard
 */

type DashboardPageLayoutProps = {
  children: t.RReactChildren,
}

export class DashboardPageLayout extends m.ViewComponent<DashboardPageLayoutProps> {
  render() {
    const {
      context: {isMobile},
      props: {children},
    } = this

    if (isMobile) {
      return (
        <MobilePageLayout>
          <div className='col-start-stretch padding-v-0x5'>
            {children}
          </div>
        </MobilePageLayout>
      )
    }

    return (
      <PageLayout className='relative col-start-center padding-r-1x25'>
        <div className='limit-content-width col-start-stretch gaps-v-1 padding-b-2'>
          {children}
        </div>
      </PageLayout>
    )
  }
}



/**
 * ListPage
 */

type ListPageLayoutProps = {
  action  : t.RReactElement,
  children: t.RReactChildren,
}

export class ListPageLayout extends m.ViewComponent<ListPageLayoutProps> {
  render() {
    const {
      context: {isMobile},
      props: {action, children},
    } = this

    if (isMobile) {
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
          <div
            className='col-start-stretch padding-h-0x5'
            style={{marginTop: '-1.75rem'}}
          >
            {action}
          </div>
          {children}
        </div>
      </PageLayout>
    )
  }
}



/**
 * PageLayout
 */

type PageLayoutProps = {
  className?: string,
  style?    : t.RCSSProperties,
}

export class PageLayout extends m.ViewComponent<PageLayoutProps> {
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
            children={children}
          />
        </div>
        <div className='fix-b-l z-index-tooltip width-100p row-start-center margin-0x5'>
          <n.Notifications />
        </div>
        <d.Dialogs />
      </div>
    )
  }
}



/**
 * MobilePageLayout
 */

type MobilePageLayoutOwnProps = {
  className?: string,
  style?    : t.RCSSProperties,
  action?   : t.RReactElement,
  children? : t.RReactChildren,
}

type MobilePageLayoutStateProps = {
  hasDialogs: boolean,
}

type MobilePageLayoutProps = MobilePageLayoutOwnProps & MobilePageLayoutStateProps


class _MobilePageLayout extends m.ViewComponent<MobilePageLayoutProps> {
  render() {
    const {
      props: {className: cls, style, action, children, hasDialogs},
    } = this

    return (
      <div className='relative col-start-stretch stretch-to-viewport-v padding-b-5'>
        <nav.Navbar />
        <div
          className={`flex-1 ${cls || ''}`}
          style={style}
          children={children}
        />
        <div className='fix-b-l z-index-tooltip width-100p col-start-stretch gaps-v-0x5 padding-0x5'>
          <n.Notifications />
          {!action || hasDialogs ? null :
          <div className='row-end-center padding-0x5'>
            {action}
          </div>}
        </div>
        <d.Dialogs />
      </div>
    )
  }
}

export const MobilePageLayout = connect<
  MobilePageLayoutStateProps,
  {},
  MobilePageLayoutOwnProps,
  t.AppState
>(state => ({
  hasDialogs: Boolean(state.dom.dialogs.length),
}))(_MobilePageLayout)
