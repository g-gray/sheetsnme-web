import * as t from '../../types'

import React from 'react'
import {connect} from 'react-redux'

import * as u from '../../utils'

import * as v from '../../views'

/**
 * Dialogs
 */

type DialogsStateProps = {
  dialogs: t.DialogList,
}

type DialogsProps = DialogsStateProps


class _Dialogs extends v.ViewComponent<DialogsProps> {
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
