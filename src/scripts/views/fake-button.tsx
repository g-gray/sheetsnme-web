import * as t from '../types'

import React from 'react'

import * as u from '../utils'

import * as m from './misc'

/*
Usable for layouts unsupported by the native button element, such as a flex
container. Doesn't work for submit buttons. Supports focus and keyboard
activation. Should be the last resort; try <Button /> first.
*/

export type FakeButtonEvent = t.RKeyboardEvent | t.RMouseEvent

type FakeButtonProps = {
  className?: string,
  style?    : t.RCSSProperties,
  type?     : string,
  disabled? : boolean,
  onClick   : (event: FakeButtonEvent) => void,
}

export class FakeButton extends m.ViewComponent<FakeButtonProps> {
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
