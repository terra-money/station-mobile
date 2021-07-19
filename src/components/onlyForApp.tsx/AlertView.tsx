import React, { ReactElement, ReactNode, useState } from 'react'
import { SafeAreaView, View } from 'react-native'

const AlertView = ({
  alertViewProps,
}: {
  alertViewProps: AlertView
}): ReactElement => {
  return alertViewProps.isOpen ? (
    <SafeAreaView
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        flex: 1,
        backgroundColor: 'rgba(0,0,0,.5)',
      }}
    >
      <View
        style={{
          paddingHorizontal: 40,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {alertViewProps.content}
      </View>
    </SafeAreaView>
  ) : (
    <View />
  )
}

export const useAlertViewState = (): AlertView => {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState<ReactNode>(null)

  const open = (content: ReactNode): void => {
    setContent(content)
    setIsOpen(true)
  }

  const close = (): void => {
    setIsOpen(false)
    setContent(null)
  }

  return { isOpen, open, close, content }
}

export default AlertView
