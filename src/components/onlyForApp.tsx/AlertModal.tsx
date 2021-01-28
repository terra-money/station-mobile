import React, { ReactElement, ReactNode, useState } from 'react'
import { Modal, SafeAreaView } from 'react-native'

const AlertModal = ({
  modal,
}: {
  modal: AlertModal
}): ReactElement => {
  return (
    <Modal visible={modal.isOpen} transparent>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {modal.content}
      </SafeAreaView>
    </Modal>
  )
}

export const useAlertModalState = (): AlertModal => {
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

export default AlertModal
