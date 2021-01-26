import React, { ReactElement, useState } from 'react'
import { Modal, SafeAreaView } from 'react-native'
import { Button } from 'components'

export const BaseModalButton = ({
  contents,
}: {
  contents: ({
    closeModal,
  }: {
    closeModal: () => void
  }) => ReactElement
}): ReactElement => {
  const [showModal, setShowModal] = useState(false)

  const closeModal = (): void => {
    setShowModal(false)
  }

  return (
    <>
      <Button
        theme={'gray'}
        title={'More'}
        onPress={(): void => {
          setShowModal(true)
        }}
      />
      <Modal
        visible={showModal}
        onRequestClose={(): void => setShowModal(false)}
        transparent
      >
        <SafeAreaView>{contents({ closeModal })}</SafeAreaView>
      </Modal>
    </>
  )
}
