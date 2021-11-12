import React, { ReactElement, useEffect, useState } from 'react'
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import WalletConnect from '@walletconnect/client'
import { IClientMeta } from '@walletconnect/types'
import _ from 'lodash'
import {
  NavigationProp,
  StackActions,
  useNavigation,
} from '@react-navigation/native'

import { COLOR } from 'consts'

import { RootStackParams } from 'types/navigation'

import Body from 'components/layout/Body'
import { navigationHeaderOptions } from 'components/layout/Header'
import WithAuth from 'components/layout/WithAuth'
import { Button, Icon, Loading, Text } from 'components'

import { useConfig, User } from 'lib'
import useWalletConnect from 'hooks/useWalletConnect'
import images from 'assets/images'
import useTopNoti from 'hooks/useTopNoti'

type Props = StackScreenProps<RootStackParams, 'WalletConnect'>

const TIMEOUT_DELAY = 1000 * 60

const PeerMetaInfo = ({
  peerMeta,
}: {
  peerMeta: IClientMeta
}): ReactElement => {
  return (
    <View
      style={{
        width: '100%',
        padding: 20,
        borderRadius: 5,
        backgroundColor: '#ebeff8',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#cfd8ea',
      }}
    >
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.infoTitle} fontType="medium">
          Connect to
        </Text>
        <Text style={styles.infoDesc}>{peerMeta?.url}</Text>
      </View>
      {_.some(peerMeta?.description) && (
        <View>
          <Text style={styles.infoTitle} fontType="medium">
            Description
          </Text>
          <Text style={styles.infoDesc}>{peerMeta.description}</Text>
        </View>
      )}
    </View>
  )
}

const Render = ({
  user,
  route,
}: { user: User } & Props): ReactElement => {
  const autoCloseTimer = React.useRef<NodeJS.Timeout>()
  // before connected
  const [
    localWalletConnector,
    setLocalWalletConnector,
  ] = useState<WalletConnect>()

  const [localPeerMeta, setLocalPeerMeta] = useState<IClientMeta>()

  const { chain } = useConfig()
  const { showNoti } = useTopNoti()

  const { newWalletConnect, saveWalletConnector } = useWalletConnect()

  const { goBack, dispatch, canGoBack, addListener } = useNavigation<
    NavigationProp<RootStackParams>
  >()

  const goBackOrHome = (): void => {
    if (canGoBack()) {
      goBack()
    } else {
      dispatch(StackActions.replace('Tabs'))
    }
  }

  const rejectConnect = (): void => {
    localWalletConnector?.rejectSession()
  }

  const connect = async (uri: string): Promise<void> => {
    const connector = newWalletConnect({ uri })

    if (!connector.connected) {
      await connector.createSession()
    }
    setLocalWalletConnector(connector)

    connector.on('session_request', (error, payload) => {
      if (error) {
        throw error
      }
      const { peerMeta } = payload.params[0]

      setLocalPeerMeta(peerMeta)
    })
  }

  const confirmConnect = (): void => {
    if (localWalletConnector) {
      const { peerMeta } = localWalletConnector

      localWalletConnector.approveSession({
        chainId: chain.current.walletconnectID,
        accounts: [user.address],
      })
      saveWalletConnector(localWalletConnector)

      showNoti({
        duration: 5000,
        message: `${peerMeta?.name} is connected`,
        description: 'Return to your browser and continue',
      })
    }
    goBackOrHome()
  }

  useEffect(() => {
    if (localPeerMeta) {
      autoCloseTimer.current = setTimeout(() => {
        goBack()
      }, TIMEOUT_DELAY) // 1 minute

      addListener('blur', (): void => {
        if (!localWalletConnector?.connected) {
          rejectConnect()
        }
      })
    }
  }, [localPeerMeta])

  useEffect(() => {
    // one of payload or uri is must be included
    const payload = route.params?.payload
    const uri = route.params?.uri

    if (payload) {
      connect(decodeURIComponent(payload))
    } else if (uri) {
      connect(uri)
    } else {
      showNoti({ message: 'no payload data', type: 'danger' })
    }

    return (): void => {
      autoCloseTimer.current && clearTimeout(autoCloseTimer.current)
    }
  }, [])

  return (
    <>
      <Body theme={'sky'} containerStyle={{ paddingTop: 20 }}>
        {localPeerMeta ? (
          <View
            style={{
              justifyContent: 'space-between',
              flex: 1,
            }}
          >
            <View style={{ alignItems: 'center' }}>
              <Image
                source={images.walletconnect_blue}
                style={{ width: 60, height: 60, marginBottom: 10 }}
              />
              <View style={{ marginBottom: 30 }}>
                <Text style={styles.title} fontType="medium">
                  {localPeerMeta.name} is requesting to connect to
                  your wallet
                </Text>
              </View>
              <PeerMetaInfo peerMeta={localPeerMeta} />
            </View>

            <View style={{ flexDirection: 'row', marginBottom: 40 }}>
              <View style={{ flex: 1 }}>
                <Button
                  title={'Deny'}
                  theme="red"
                  onPress={(): void => {
                    rejectConnect()
                    goBackOrHome()
                  }}
                />
              </View>
              <View style={{ width: 10 }} />
              <View style={{ flex: 1 }}>
                <Button
                  title={'Allow'}
                  theme="sapphire"
                  onPress={confirmConnect}
                />
              </View>
            </View>
          </View>
        ) : (
          <View>
            <Loading style={{ marginBottom: 30 }} />
            <Text style={styles.title} fontType="medium">
              Ready to Connect
            </Text>
          </View>
        )}
      </Body>
    </>
  )
}

const ConnectToWalletConnect = (props: Props): ReactElement => {
  return (
    <WithAuth>
      {(user): ReactElement => <Render {...{ ...props, user }} />}
    </WithAuth>
  )
}

const HeaderLeft = (): ReactElement => {
  const { goBack, canGoBack, dispatch } = useNavigation()

  const onPressGoBack = (): void => {
    if (canGoBack()) {
      goBack()
    } else {
      dispatch(StackActions.replace('Tabs'))
    }
  }

  return (
    <TouchableOpacity
      onPress={onPressGoBack}
      style={{ paddingLeft: 20 }}
    >
      <Icon name={'close'} color={COLOR.primary._02} size={28} />
    </TouchableOpacity>
  )
}

ConnectToWalletConnect.navigationOptions = navigationHeaderOptions({
  theme: 'sky',
  headerLeft: () => <HeaderLeft />,
})

export default ConnectToWalletConnect

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    lineHeight: 21,
    letterSpacing: 0,
    textAlign: 'center',
    color: COLOR.primary._02,
  },
  infoTitle: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 5,
  },
  infoDesc: {
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0,
  },
})
