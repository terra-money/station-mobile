import { useSetRecoilState } from 'recoil'
import AppStore from 'stores/AppStore'

export const useLoading = (): {
  showLoading: () => void
  hideLoading: () => void
} => {
  const setShowLoading = useSetRecoilState(AppStore.showLoading)
  const showLoading = (): void => {
    setShowLoading(true)
  }
  const hideLoading = (): void => {
    setShowLoading(false)
  }
  return {
    showLoading,
    hideLoading,
  }
}
