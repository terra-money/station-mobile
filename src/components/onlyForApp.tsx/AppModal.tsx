import React, { ReactElement } from 'react'
import { Modal, View } from 'react-native'
import { useRecoilState, useRecoilValue } from 'recoil'
import ModalStore from 'stores/ModalStore'

const AppModal = (): ReactElement => {
  const [isVisible, setIsVisible] = useRecoilState(
    ModalStore.isVisible
  )
  const children = useRecoilValue(ModalStore.children)

  return (
    <Modal
      visible={isVisible}
      onRequestClose={(): void => {
        setIsVisible(false)
      }}
      transparent
    >
      <View style={{ flex: 1 }}>{children}</View>
    </Modal>
  )
}

export default AppModal
