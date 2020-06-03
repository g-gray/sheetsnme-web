import * as t from '../types'

import React from 'react'
import {connect} from 'react-redux'

import * as u from '../utils'
import * as m from '../views/misc'

/**
 * Dialogs
 */

type DialogsStateProps = {
  dialogs: t.DialogList,
}

type DialogsProps = DialogsStateProps


class _Dialogs extends m.ViewComponent<DialogsProps> {
  componentDidMount() {
    const {props: {dialogs}} = this
    toglleOverflow(dialogs.length)
  }

  componentDidUpdate() {
    const {props: {dialogs}} = this
    toglleOverflow(dialogs.length)
  }

  render() {
    const {props: {dialogs}} = this
    return dialogs.map((dialog, index) => {
      return React.cloneElement(dialog, {
        key: index,
      })
    })
  }
}

export const Dialogs = connect<DialogsStateProps, {}, {}, t.AppState>(state => ({
  dialogs: state.dom.dialogs,
}))(_Dialogs)


function toglleOverflow(dialogsNumber: number) {
  if (dialogsNumber > 0) {
    document.body.style.marginRight = `${u.getGlobalScrollbarWidth()}px`
    document.body.classList.add('overflow-x-scroll')
  }
  else {
    document.body.style.marginRight = ''
    document.body.classList.remove('overflow-x-scroll')
  }
}



/**
 * Dialog
 */

type DialogProps = t.DialogProps


export class Dialog extends m.ViewComponent<DialogProps> {
  unsub: () => void = () => {}

  componentDidMount() {
    const {props: {onEscape}} = this

    this.unsub = u.addEvent(window, 'keydown', (event) => {
      if (
        event instanceof KeyboardEvent &&
        u.eventKeyCode(event) === u.KEY_NAMES_US.ESCAPE &&
        typeof onEscape === 'function'
      ) {
        onEscape(event)
      }
    })
  }

  componentWillUnmount() {
    this.unsub()
  }

  render() {
    const {props: {className: cls, children}} = this

    return (
      <div className={`dialog ${cls || ''}`}>
        {children}
      </div>
    )
  }
}



/**
 * DialogOverlay
 */

type DialogOverlayProps = {
  className?: string,
}


export class DialogOverlay extends m.ViewComponent<DialogOverlayProps> {
  render() {
    const {props: {className: cls, ...props}} = this

    return (
      <div
        className={`dialog-overlay ${cls || ''}`}
        {...props}
      />
    )
  }
}



/**
 * DialogScrollable
 */

type DialogScrollableProps = {
  className?: string,
  onClick?  : (event: t.RMouseEvent) => void,
}


export class DialogScrollable extends m.ViewComponent<DialogScrollableProps> {
  render() {
    const {props: {onClick, className: cls, children}} = this
    // This combination of element nesting and properties appears to satisfy
    // the following requirements:
    //
    //   * the background affects the dead zone (the area between the children
    //     and the scrollbar), without overshadowing other parts
    //   * the inner div catches clicks from exactly the dead zone, nothing else
    //   * scrolling works even when hovering the dead zone
    //
    // When making changes, make sure to test all the edge cases.
    return (
      <div className={`dialog-scrollable ${cls || ''}`}>
        <div
          className='abs-fit'
          onClick={onClick}
        />
        {children}
      </div>
    )
  }
}



/**
 * DialogCentered
 */

type DialogCenteredProps = {
  className?: string,
  onClick?  : (event: t.RMouseEvent) => void,
}


export class DialogCentered extends m.ViewComponent<DialogCenteredProps> {
  render () {
    const {children, ...props} = this.props

    return (
      <DialogScrollable {...props}>
        <div className='dialog-center'>
          <div className='relative'>
            {children}
          </div>,
        </div>
      </DialogScrollable>
    )
  }
}
