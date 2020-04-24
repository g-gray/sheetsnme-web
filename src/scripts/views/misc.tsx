import * as t from '../types'

import React from 'react'
import {connect} from 'react-redux'

// @ts-ignore
import * as f from 'fpx'

import * as u from '../utils'
import * as e from '../env'

/**
 * React-specific
 */

export class ViewComponent<P = any, S = any> extends React.Component<P, S> {
  static contextType: React.Context<t.AppContext> = e.Context
  // static contextType<t.AppContext> = Context

  constructor(props: P, context?: t.AppContext) {
    super(props, context)
    // this.render = renderWithArg
  }
}

// function renderWithArg() {
//   // Minor convenience: pass self as argument.
//   return this.constructor.prototype.render.call(this, this)
// }



/**
 * Dialog
 */

export const GlobalDialog = connect(state => ({
  dialogs: state.dom.dialogs,
}))(({dialogs}) => {
  return f.map(dialogs, ({dialog: Dialog, dialogProps}, index) => (
    <Dialog
      key={`dialog-${index}`}
      dialogsNumber={f.size(dialogs)}
      {...dialogProps} />
  ))
})

export class Dialog extends ViewComponent {
  componentDidMount() {
    const {props: {onEscape}} = this
    this.unsub = u.addEvent(window, 'keydown', event => {
      if (u.eventKeyCode(event) === u.KEY_NAMES_US.ESCAPE && f.isFunction(onEscape)) {
        onEscape(event)
      }
    })
    onDialogOpen(this.props.dialogsNumber)
  }

  componentWillUnmount() {
    if (this.unsub) this.unsub()
    onDialogClose(this.props.dialogsNumber)
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

export class DialogOverlay extends ViewComponent {
  render() {
    const {props: {className: cls, ...props}} = this
    return <div className={`dialog-overlay ${cls || ''}`} {...props} />
  }
}

export class DialogScrollable extends ViewComponent {
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
        <div className='abs-fit' onClick={onClick} />
        {children}
      </div>
    )
  }
}

export class DialogCentered extends ViewComponent {
  render () {
    const {children, ...props} = this.props
    return (
      <DialogScrollable {...props}>
        <div className='dialog-center'>
          {React.cloneElement(<div className='relative'>{children}</div>, {onClick: u.stopPropagation})}
        </div>
      </DialogScrollable>
    )
  }
}

function onDialogOpen(dialogsNumber) {
  if (dialogsNumber > 0) {
    document.body.style.marginRight = `${u.getGlobalScrollbarWidth()}px`
    document.body.classList.add('overflow-x-scroll')
  }
}

function onDialogClose(dialogsNumber) {
  if (!dialogsNumber) {
    document.body.style.marginRight = null
    document.body.classList.remove('overflow-x-scroll')
  }
}

/*
Usable for layouts unsupported by the native button element, such as a flex
container. Doesn't work for submit buttons. Supports focus and keyboard
activation. Should be the last resort; try <Button /> first.
*/
export class FakeButton extends ViewComponent {
  constructor() {
    super(...arguments)
    this.onKeyPress = simulateEnterOnKeyPress.bind(undefined, this)
  }

  render() {
    const {
      onKeyPress,
      props: {type = 'span', onClick, disabled, ...props},
    } = this
    return React.createElement(type, {
      role: 'button',
      tabIndex: disabled ? undefined : '0',
      onKeyPress: onClick ? onKeyPress : undefined,
      onClick,
      disabled,
      ...props,
    })
  }
}

function simulateEnterOnKeyPress(view, event) {
  const {props: {onClick}} = view
  if (u.eventKeyCode(event) === u.KEY_NAMES_US.ENTER && onClick) onClick(event)
}

export class CircleUserPic extends ViewComponent {
  render() {
    const {props: {url, size, ...props}} = this
    const bgUrl = url || '/images/no-avatar-square.png'

    if (!size) {
      return (
        <span
          className='block bg-circle-trick'
          style={u.bgUrl(bgUrl)}
          {...props} />
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
export class Closer extends ViewComponent {
  constructor() {
    super(...arguments)

    const maybeClose = event => {
      const {props: {close}} = this
      if (close) close(event)
    }

    this.onKeyDown = event => {
      if (u.eventKeyCode(event) === u.KEY_NAMES_US.ESCAPE) maybeClose(event)
    }

    this.onClick = event => {
      const {props: {root}} = this
      const node = u.findDomNode(root)
      if (node && !u.isAncestorOf(node, event.target)) maybeClose(event)
    }
  }

  componentDidMount() {
    this.unKeyDown = u.addEvent(window, 'keydown', this.onKeyDown)
    this.unClick = u.addEvent(window, 'click', this.onClick)
  }

  componentWillUnmount() {
    if (this.unKeyDown) this.unKeyDown()
    if (this.unClick) this.unClick()
  }

  render() {
    const {props: {children}} = this
    return children
  }
}
