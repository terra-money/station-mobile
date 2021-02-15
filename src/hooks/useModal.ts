import { useNavigation } from '@react-navigation/native'
import { useEffect } from 'react'
import { useApp } from './useApp'

export const useModal = (): { modal: AppModal } => {
  const { modal } = useApp()

  const { addListener } = useNavigation()
  useEffect(() => {
    addListener('blur', (): void => {
      modal.close()
    })
  }, [])

  return { modal }
}
