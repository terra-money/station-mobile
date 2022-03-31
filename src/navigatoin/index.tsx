import React, {
  ReactElement,
  useEffect,
  useState,
  useRef,
} from 'react'
import { Linking } from 'react-native'
import {
  NavigationContainer,
  DefaultTheme,
  NavigationContainerRef,
  LinkingOptions,
} from '@react-navigation/native'

import { UTIL } from 'consts'

import { RN_APIS } from '../App/WebViewContainer'

import { useRecoilState, useRecoilValue } from 'recoil'
import AutoLogoutStore from 'stores/AutoLogoutStore'
import AppStore from 'stores/AppStore'
import useLinking from 'hooks/useLinking'

const TerraTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F9FAFF',
  },
}

const Navigator = (): ReactElement => {
  const navigatorRef = useRef<NavigationContainerRef<any>>(null)
  const { openURL } = useLinking()
  const [linkingUrl, setLinkingUrl] = useState('')
  const [isFromAutoLogout, setIsFromAutoLogout] = useRecoilState(
    AutoLogoutStore.isFromAutoLogout
  )
  const webviewInstance = useRecoilValue(AppStore.webviewInstance)
  const webviewLoadEnd = useRecoilValue(AppStore.webviewLoadEnd)

  useEffect(() => {
    if (linkingUrl) {
      const url = UTIL.tryNewURL(linkingUrl || '')

      const action = url?.searchParams.get('action')
      const payload = url?.searchParams.get('payload')

      if (payload) {
        webviewInstance?.current?.postMessage(
          JSON.stringify({
            type: RN_APIS.DEEPLINK,
            data: {
              action,
              payload,
            },
          })
        )
      }
    }
  }, [webviewInstance, linkingUrl])

  useEffect(() => {
    if (isFromAutoLogout) {
      setIsFromAutoLogout(false)
      linkingUrl && openURL(linkingUrl)
    }
  }, [isFromAutoLogout])

  useEffect(() => {
    const onReceiveURL = ({ url }: any): void => {
      setLinkingUrl(url)
    }

    if (webviewLoadEnd) {
      Linking.getInitialURL().then((url) => {
        if (url) {
          setLinkingUrl(url)
        } else {
          return null
        }
      })
    }
    Linking.addEventListener('url', onReceiveURL)

    return (): void => {
      Linking.removeEventListener('url', onReceiveURL)
    }
  }, [webviewLoadEnd])

  const linking: LinkingOptions<any> = { prefixes: ['terrastation://'] }

  return (
    <NavigationContainer
      ref={navigatorRef}
      theme={TerraTheme}
      linking={linking}
    >
      <></>
    </NavigationContainer>
  )
}

export default Navigator
