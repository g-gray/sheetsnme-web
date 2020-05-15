import * as t from '../types'

import React from 'react'

import * as u from '../utils'
import * as e from '../env'

/**
 * React-specific
 */

export class ViewComponent<P = any, S = any> extends React.Component<P, S> {
  static contextType: React.Context<t.AppContext> = e.Context
  declare context: React.ContextType<typeof e.Context>

  constructor(props: Readonly<P>, context?: t.AppContext) {
    super(props, context)
    // this.render = renderWithArg
  }
}

// function renderWithArg() {
//   // Minor convenience: pass self as argument.
//   return this.constructor.prototype.render.call(this, this)
// }



/*
Usable for layouts unsupported by the native button element, such as a flex
container. Doesn't work for submit buttons. Supports focus and keyboard
activation. Should be the last resort; try <Button /> first.
*/

export type FakeButtonEvent = t.RKeyboardEvent | t.RMouseEvent

export type FakeButtonClickHandler = (event: FakeButtonEvent) => void

type FakeButtonProps = {
  className?: string,
  style?: t.RCSSProperties,
  type?: string,
  disabled?: boolean,
  onClick: FakeButtonClickHandler,
}

export class FakeButton extends ViewComponent<FakeButtonProps> {
  keyPress = (event: t.RKeyboardEvent) => {
    const {props: {onClick}} = this
    if (u.eventKeyCode(event) === u.KEY_NAMES_US.ENTER) {
      onClick(event)
    }
  }

  click = (event: t.RMouseEvent) => {
    const {props: {onClick}} = this
    onClick(event)
  }

  render() {
    const {
      props: {className, type = 'span', onClick, disabled, ...props},
      keyPress, click,
    } = this
    return React.createElement(type, {
      className,
      role: 'button',
      tabIndex: disabled ? undefined : '0',
      disabled,
      onKeyPress: keyPress,
      onClick: click,
      ...props,
    })
  }
}
