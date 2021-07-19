import { useNavigation } from '@react-navigation/native'
import { ReactNode, useEffect } from 'react'
import { useSetRecoilState } from 'recoil'
import ModalStore from 'stores/ModalStore'

export const useModal = (): { modal: AppModal } => {
  const setIsVisible = useSetRecoilState(ModalStore.isVisible)
  const setModalChildren = useSetRecoilState(ModalStore.children)

  const modal = {
    open: (children: ReactNode): void => {
      setIsVisible(true)
      setModalChildren(children)
    },
    close: (): void => {
      setIsVisible(false)
    },
  }

  const { addListener } = useNavigation()
  useEffect(() => {
    addListener('blur', (): void => {
      modal.close()
    })
  }, [])

  return { modal }
}
