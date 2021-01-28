import React, { ReactElement, ReactNode, useState } from 'react'
import { Modal, SafeAreaView } from 'react-native'

const AppModal = ({ modal }: { modal: AppModal }): ReactElement => {
  return (
    <Modal
      visible={modal.isOpen}
      onRequestClose={modal.onRequestClose}
      transparent
    >
      <SafeAreaView style={{ flex: 1 }}>{modal.content}</SafeAreaView>
    </Modal>
  )
}

export const useModalState = (): AppModal => {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState<ReactNode>(null)
  const [config, setConfig] = useState<AppModalConfig>()

  const open = (
    content: ReactNode,
    config?: AppModalConfig
  ): void => {
    setContent(content)
    setIsOpen(true)
    setConfig(config)
  }

  const close = (): void => {
    setIsOpen(false)
    setContent(null)
  }

  const onRequestClose = (): void => {
    config?.onRequestClose ? config.onRequestClose() : close()
  }

  return { isOpen, open, close, content, onRequestClose }
}

export default AppModal
