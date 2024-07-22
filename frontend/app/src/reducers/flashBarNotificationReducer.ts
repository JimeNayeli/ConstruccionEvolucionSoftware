import { FlashbarProps } from "@cloudscape-design/components/flashbar"
import React from "react"

export enum FlashBarNotificationActionType {
  ADD = "add",
  REMOVE = "remove",
  RESET = "reset",
}

interface FlashBarNotification {
  header?: string
  content?: React.ReactNode
  dismissLabel?: string
  id: string
  type?: "success" | "warning" | "error" | "info"
  onDismiss?: Function
}

export interface FlashBarNotificationAction {
  type: FlashBarNotificationActionType
  notification?: FlashBarNotification
}

const flashBarNotificationReducer = (
  notifications: Array<FlashbarProps.MessageDefinition>,
  action: FlashBarNotificationAction
) => {
  switch (action.type) {
    case FlashBarNotificationActionType.ADD: {
      const newNotifications = [...notifications]
      newNotifications.push({
        header: action.notification?.header,
        type: action.notification?.type,
        content: action.notification?.content,
        dismissible: true,
        dismissLabel: action.notification?.dismissLabel,
        onDismiss: () => {
          console.log("dismissed")
          if (action.notification?.onDismiss) {
            action.notification?.onDismiss()
          }
        },
        id: action.notification?.id,
      })
      return newNotifications
    }
    case FlashBarNotificationActionType.REMOVE: {
      return notifications.filter((notification) => {
        return notification.id !== action.notification?.id
      })
    }
    case FlashBarNotificationActionType.RESET: {
      return []
    }
    default: {
      return notifications
    }
  }
}

export default flashBarNotificationReducer
