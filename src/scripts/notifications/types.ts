export type NotificationsState = NotificationList

export type Notification = {
  text: string,
  messages: {text: string}[],
  timeout?: number,
  time: number,
}

export type NotificationList = Notification[]
