import * as t from '../../types'

import React from 'react'

import * as u from '../../utils'
import * as v from '../../views'

/**
 * Dialog
 */

type DialogProps = t.DialogProps


export class Dialog extends v.ViewComponent<DialogProps> {
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


export class DialogOverlay extends v.ViewComponent<DialogOverlayProps> {
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


export class DialogScrollable extends v.ViewComponent<DialogScrollableProps> {
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


export class DialogCentered extends v.ViewComponent<DialogCenteredProps> {
  render () {
    const {children, ...props} = this.props

    return (
      <DialogScrollable {...props}>
        <div className='dialog-center'>
          <div className='relative'>
            {children}
          </div>
        </div>
      </DialogScrollable>
    )
  }
}
