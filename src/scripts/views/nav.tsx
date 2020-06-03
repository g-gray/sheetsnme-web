import * as t from '../types'

import React from 'react'
import {connect} from 'react-redux'
import {NavLink, Link} from 'react-router-dom'

import * as e from '../env'
import * as u from '../utils'

import * as a from '../actions'

import * as d from '../dialogs'
import * as i18n from '../i18n'

import * as m from './misc'
import * as s from './svg'
import * as c from './closer'
import * as fb from './fake-button'

/**
 * Navbar
 */

class _Navbar extends m.ViewComponent {
  open = () => {
    const close = () => {
      e.dispatch(a.removeDialog<MobileMenuProps>(dialog))
    }

    const dialog = (
      <MobileMenu onClose={close} />
    )

    e.dispatch(a.addDialog<MobileMenuProps>(dialog))
  }

  nextLang = () => {
    e.dispatch(a.nextLang())
  }

  render() {
    const {
      context, context: {isMobile},
      open, nextLang,
    } = this

    if (isMobile) {
      return (
        <header className='row-between-stretch bg-primary navbar-height shadow-dept-1'>
          <div className='row-start-center gaps-h-0x75 padding-h-1'>
            <fb.FakeButton
              className='row-center-center padding-0x5 circle decorate-dark-menu-item'
              onClick={open}
            >
              <s.Menu style={{fontSize: '1.5rem'}} />
            </fb.FakeButton>
          </div>
          <div className='row-start-stretch relative z-index-1'>
            <fb.FakeButton
              className='relative row-start-center gaps-h-0x75 padding-h-1 decorate-dark-menu-item'
              onClick={nextLang}
            >
              {i18n.xln(context, i18n.LANG)}
            </fb.FakeButton>
            <UserMenu />
          </div>
        </header>
      )
    }

    return (
      <header className='row-between-stretch bg-primary navbar-height shadow-dept-1'>
        <Link
          to='/'
          className='row-center-center gaps-h-0x75 padding-h-1 decorate-dark-menu-item'
        >
          <Logo />
        </Link>
        <div className='row-start-stretch relative z-index-1'>
          <fb.FakeButton
            onClick={nextLang}
            className='relative row-start-center gaps-h-0x75 padding-h-1 decorate-dark-menu-item'
          >
            {i18n.xln(context, i18n.LANG)}
          </fb.FakeButton>
          <UserMenu />
        </div>
      </header>
    )
  }
}

export const Navbar = connect()(_Navbar)



/**
 * UserMenu
 */

type UserMenuStateProps = {
  user: t.UserState,
}

type UserMenuProps = UserMenuStateProps

type UserMenuState = {
  expanded: boolean,
}

class _UserMenu extends m.ViewComponent<UserMenuProps, UserMenuState> {
  state: Readonly<UserMenuState> = {expanded: false}

  close = () => {
    this.setState({expanded: false})
  }

  toggle = () => {
    this.setState({expanded: !this.state.expanded})
  }

  render() {
    const {
      context,
      props: {user},
      state: {expanded},
      close, toggle,
    } = this

    if (user == null) {
      return null
    }

    const {firstName, lastName, pictureUrl, email} = user

    return (
      <div className='relative row-start-stretch'>
        <fb.FakeButton
          onClick={toggle}
          className='relative row-start-center gaps-h-0x75 padding-h-1 decorate-dark-menu-item z-index-2'
          aria-expanded={expanded}>
          <CircleUserPic
            url={pictureUrl}
            size={2}
          />
        </fb.FakeButton>
        {!expanded ? null :
        <c.Closer
          root={this}
          close={close}
        >
          <div
            className='dropdown-position z-index-tooltip'
            onClick={close}
          >
            <div
              className='dropdown dropdown-padding col-start-stretch'
              style={{minWidth: '11rem'}}
            >
              <div className='row-start-center gaps-h-0x75 padding-v-0x5 padding-h-1'>
                <CircleUserPic
                  url={pictureUrl}
                  size={4}
                />
                <div className='col-start-stretch gaps-v-0x5'>
                  <div className='col-start-stretch'>
                    <span className='weight-medium wspace-nowrap'>
                      {`${firstName || ''} ${lastName || ''}`}
                    </span>
                    {!email ? null :
                    <span className='font-midsmall'>
                      {email}
                    </span>}
                  </div>
                  <div className='row-start-center'>
                    <a href='/auth/logout' className='btn-secondary'>
                      {i18n.xln(context, i18n.LOGOUT)}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </c.Closer>}
      </div>
    )
  }
}

const UserMenu = connect<UserMenuStateProps, {}, {}, t.AppState>(state => ({
  user: state.net.user,
}))(_UserMenu)



/**
 * MobileMenu
 */

export type MobileMenuProps = {
  onClose : (event?: KeyboardEvent | fb.FakeButtonEvent) => void,
}

class _MobileMenu extends m.ViewComponent<MobileMenuProps> {
  render() {
    const {props: {onClose}} = this

    return (
      <d.Dialog onEscape={onClose}>
        <d.DialogScrollable
          className='row-start-stretch bg-overlay fade-in-fast'
          onClick={onClose}
        >
          <div
            className='relative col-start-stretch gaps-v-0x5 bg-surface slide-in-left-fast'
            onClick={onClose}
          >
            <div className='row-start-center padding-h-1 bg-primary navbar-height shadow-dept-1'>
              <Logo />
            </div>
            <Drawer />
          </div>
        </d.DialogScrollable>
      </d.Dialog>
    )
  }
}

const MobileMenu = connect()(_MobileMenu)



/**
 * Logo
 */

class Logo extends m.ViewComponent {
  render() {
    return (
      <s.Logo
        className='fg-surface'
        style={{width: '2rem', height: '2rem'}}
      />
    )
  }
}



/**
 * Drawer
 */

export class Drawer extends m.ViewComponent {
  render() {
    const {context} = this

    return (
      <aside
        className='col-start-stretch gaps-v-1 padding-v-1'
        style={{width: '16rem'}}
      >
        <div className='col-start-stretch padding-h-0x5'>
          <NavLink
            to='/'
            exact
            className='drawer-link decorate-drawer-link'
          >
            <s.BarChart className='font-large theme-drawer-icon' />
            <span>{i18n.xln(context, i18n.TRANSACTIONS)}</span>
          </NavLink>
        </div>
        <hr className='hr' />
        <div className='col-start-stretch padding-h-0x5'>
          <NavLink
            to='/categories'
            exact
            className='drawer-link decorate-drawer-link'
          >
            <s.Tag className='font-large theme-drawer-icon' />
            <span>{i18n.xln(context, i18n.CATEGORIES)}</span>
          </NavLink>
          <NavLink
            to='/accounts'
            exact
            className='drawer-link decorate-drawer-link'
          >
            <s.CreditCard className='font-large theme-drawer-icon' />
            <span>{i18n.xln(context, i18n.ACCOUNTS)}</span>
          </NavLink>
          <NavLink
            to='/payees'
            exact
            className='drawer-link decorate-drawer-link'
          >
            <s.Users className='font-large theme-drawer-icon' />
            <span>{i18n.xln(context, i18n.PAYEES)}</span>
          </NavLink>
        </div>
      </aside>
    )
  }
}



/**
 * CircleUserPic
 */

type CircleUserPicProps = {
  url  : string,
  size?: number,
}


class CircleUserPic extends m.ViewComponent<CircleUserPicProps> {
  render() {
    const {props: {url, size, ...props}} = this
    const bgUrl = url || '/images/no-avatar-square.png'

    if (size == null) {
      return (
        <span
          className='block bg-circle-trick'
          style={u.bgImg(bgUrl)}
          {...props}
        />
      )
    }

    return (
      <span
        className='block bg-circle-trick'
        style={{width: `${size}rem`, ...u.bgImg(bgUrl)}}
        {...props}
      />
    )
  }
}
