import { Linking } from 'react-native'

const useLinking = (): {
  openURL: (url: string) => void
} => {
  const openURL = (url: string): void => {
    Linking.openURL(url)
  }
  return {
    openURL,
  }
}

export default useLinking
