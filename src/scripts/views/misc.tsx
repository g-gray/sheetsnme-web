import * as t from '../types'

import React, { MouseEvent } from 'react'

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

type FakeButtonProps = {
  className?: string,
  type?: string,
  disabled?: boolean,
  onClick: (event: t.RKeyboardEvent | t.RMouseEvent) => void,
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


type CircleUserPicProps = {
  url: string,
  size: number,
}

export class CircleUserPic extends ViewComponent<CircleUserPicProps> {
  render() {
    const {props: {url, size, ...props}} = this
    const bgUrl = url || '/images/no-avatar-square.png'

    if (!size) {
      return (
        <span
          className='block bg-circle-trick'
          style={u.bgUrl(bgUrl)}
          {...props}
        />
      )
    }

    return (
      <span
        className='block bg-circle-trick'
        style={{width: `${size}rem`, ...u.bgUrl(bgUrl)}}
        {...props} />
    )
  }
}

/*
Triggers a callback on Escape and on click events originating outside its
"root", which is typically a parent component. Useful for closing a dropdown or
a popup. Usage:

  <Closer root={this} close={this.close}>
    ... content ...
  </Closer>
*/

type CloserProps = {
  root: t.RReactInstance,
  close: (event: Event) => void,
}

export class Closer extends ViewComponent<CloserProps> {
  unKeyDown: () => void = () => {}
  unClick: () => void = () => {}

  maybeClose = (event: Event) => {
    const {props: {close}} = this
    if (close) close(event)
  }

  onKeyDown = (event: Event) => {
    if (
      event instanceof KeyboardEvent &&
      u.eventKeyCode(event) === u.KEY_NAMES_US.ESCAPE
    ) {
      this.maybeClose(event)
    }
  }

  onClick = (event: Event) => {
    const {props: {root}} = this
    const node = u.findDomNode(root)
    if (!u.isAncestorOf(node, event.target)) {
      this.maybeClose(event)
    }
  }

  componentDidMount() {
    this.unKeyDown = u.addEvent(window, 'keydown', this.onKeyDown)
    this.unClick = u.addEvent(window, 'click', this.onClick)
  }

  componentWillUnmount() {
    this.unKeyDown()
    this.unClick()
  }

  render() {
    const {props: {children}} = this
    return children
  }
}
