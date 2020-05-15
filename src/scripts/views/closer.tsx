import * as t from '../types'

import React from 'react'

import * as u from '../utils'

import * as m from './misc'

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

export class Closer extends m.ViewComponent<CloserProps> {
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
