import { useEffect } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { StackNavigationProp } from '@react-navigation/stack'

import AppStore from 'stores/AppStore'
import { RootStackParams } from 'types'

export const useLoading = ({
  navigation,
}: {
  navigation: StackNavigationProp<
    RootStackParams,
    keyof RootStackParams
  >
}): {
  showLoading: ({ txhash, title }: { txhash?: string, title?: string }) => void
  hideLoading: () => Promise<void>
} => {
  const setShowLoading = useSetRecoilState(AppStore.showLoading)
  const [loadingTxHash, setLoadingTxHash] = useRecoilState(
    AppStore.loadingTxHash
  )
  const [, setLoadingTitle] = useRecoilState(
    AppStore.loadingTitle
  )

  const showLoading = ({ txhash, title }: { txhash?: string, title?: string  }): void => {
    setShowLoading(true)
    setLoadingTxHash(txhash || '')
    setLoadingTitle(title || '')
  }
  const hideLoading = async (): Promise<void> => {
    setLoadingTxHash('')
    setLoadingTitle('')
    return await new Promise((resolve) => {
      setTimeout(() => {
        setShowLoading(false)
        resolve()
      }, 300)
    })
  }

  useEffect(() => {
    let unsubscribe: any
    if (loadingTxHash) {
      unsubscribe = navigation.addListener('beforeRemove', (e) =>
        e.preventDefault()
      )
    }

    return (): void => {
      unsubscribe?.()
    }
  }, [loadingTxHash])

  return {
    showLoading,
    hideLoading,
  }
}
