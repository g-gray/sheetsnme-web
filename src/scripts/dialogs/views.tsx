import * as t from '../types'

import React from 'react'
import {connect} from 'react-redux'

import * as u from '../utils'
import * as m from '../views/misc'

type GlobalDialogStateProps = {
  dialogs: t.DialogList,
}

type GlobalDialogProps = GlobalDialogStateProps

class _GlobalDialog extends m.ViewComponent<GlobalDialogProps> {
  render() {
    const {props: {dialogs}} = this
    return dialogs.map((dialog, index) => {
      const {dialog: Dialog, dialogProps} = dialog

      return (
        <Dialog
          key={index}
          dialogsNumber={dialogs.length}
          {...dialogProps}
        />
      )
    })
  }
}

export const GlobalDialog = connect<GlobalDialogStateProps, {}, {}, t.AppState>(state => ({
  dialogs: state.dom.dialogs,
}))(_GlobalDialog)

type DialogProps<P> = t.DialogProps<P>

export class Dialog<P> extends m.ViewComponent<DialogProps<P>> {
  unsub: () => void = () => {}

  componentDidMount() {
    const {props: {dialogsNumber, onEscape}} = this

    this.unsub = u.addEvent(window, 'keydown', (event) => {
      if (
        event instanceof KeyboardEvent &&
        u.eventKeyCode(event) === u.KEY_NAMES_US.ESCAPE &&
        typeof onEscape === 'function'
      ) {
        onEscape(event)
      }
    })

    onDialogOpen(dialogsNumber)
  }

  componentWillUnmount() {
    const {props: {dialogsNumber}} = this

    this.unsub()

    onDialogClose(dialogsNumber - 1)
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

function onDialogOpen(dialogsNumber: number) {
  if (dialogsNumber > 0) {
    document.body.style.marginRight = `${u.getGlobalScrollbarWidth()}px`
    document.body.classList.add('overflow-x-scroll')
  }
}

function onDialogClose(dialogsNumber: number) {
  if (!dialogsNumber) {
    document.body.style.marginRight = ''
    document.body.classList.remove('overflow-x-scroll')
  }
}


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


type DialogScrollableProps = {
  className?: string,
  onClick?: (event: t.RMouseEvent) => void,
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

type DialogCenteredProps = DialogScrollableProps

export class DialogCentered extends m.ViewComponent<DialogCenteredProps> {
  render () {
    const {children, ...props} = this.props

    return (
      <DialogScrollable {...props}>
        <div className='dialog-center'>
          {React.cloneElement(
            <div className='relative'>
              {children}
            </div>,
            {onClick: u.stopPropagation}
          )}
        </div>
      </DialogScrollable>
    )
  }
}
