import 'react-native-url-polyfill/auto' // to use URL

export const jsonTryParse = <T>(value: string): T | undefined => {
  try {
    return JSON.parse(value) as T
  } catch {
    return undefined
  }
}

export const getParam = ({
  url,
  key,
}: {
  url: string
  key: string
}): string => {
  try {
    const instance = new URL(url)
    const params = new URLSearchParams(instance.search)
    return params.get(key) || ''
  } catch {
    return ''
  }
}
