import { useSetRecoilState } from 'recoil'
import AppStore from 'stores/AppStore'

export const useLoading = (): {
  showLoading: ({ txhash }: { txhash?: string }) => void
  hideLoading: () => void
} => {
  const setShowLoading = useSetRecoilState(AppStore.showLoading)
  const setLoadingTxHash = useSetRecoilState(AppStore.loadingTxHash)
  const showLoading = ({ txhash }: { txhash?: string }): void => {
    setShowLoading(true)
    setLoadingTxHash(txhash || '')
  }
  const hideLoading = (): void => {
    setShowLoading(false)
    setLoadingTxHash('')
  }
  return {
    showLoading,
    hideLoading,
  }
}
