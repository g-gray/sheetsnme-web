import * as t from '../types'

import React from 'react'
import {connect} from 'react-redux'

import * as e from '../env'

import * as m from '../views/misc'

import * as a from './actions'

type NotificationsStateProps = {
  notifications: t.NotificationList,
}

type NotificationsProps = NotificationsStateProps

class _Notifications extends m.ViewComponent<NotificationsProps> {
  timeoutId: NodeJS.Timeout | undefined

  componentWillUnmount() {
    if (this.timeoutId) clearTimeout(this.timeoutId)
  }

  render() {
    const {props: {notifications}} = this

    const notification = notifications[0]
    if (!notification) return null

    if (notification.timeout) {
      this.timeoutId = setTimeout(() => {
        e.dispatch(a.removeNotification(notification.time))
      }, notification.timeout)
    }

    return (
      <Snackbar>
        <div>
          {notification.messages
            ? notification.messages.map((message, index) => {
              const {text} = message
              return <p key={index}>{text}</p>
            })
            : notification.text}
        </div>
      </Snackbar>
    )
  }
}

export const Notifications = connect<NotificationsStateProps, {}, {}, t.AppState>(state => ({
  notifications: state.dom.notifications,
}))(_Notifications)


class Snackbar extends m.ViewComponent {
  render() {
    const {props: {children}} = this

    return (
      <div className='row-start-center padding-h-1 padding-v-0x75 snackbar'>
        {children}
      </div>
    )
  }
}
