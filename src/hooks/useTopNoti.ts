import {
  MessageOptions,
  showMessage,
} from 'react-native-flash-message'

const useTopNoti = (): {
  showNoti: (options: MessageOptions) => void
} => {
  const showNoti = (options: MessageOptions): void => {
    showMessage(options)
  }

  return {
    showNoti,
  }
}

export default useTopNoti
