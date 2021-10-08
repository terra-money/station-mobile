import React, { ReactElement, useEffect, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import {
  StackNavigationOptions,
  StackScreenProps,
} from '@react-navigation/stack'
import {
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil'
import {
  NavigationProp,
  StackActions,
  useNavigation,
} from '@react-navigation/native'
import { CreateTxOptions } from '@terra-money/terra.js'
import _ from 'lodash'
import WalletConnect from '@walletconnect/client'
import { IClientMeta } from '@walletconnect/types'

import { User, format } from 'lib'

import { Button, Icon, LoadingIcon, Text } from 'components'
import Body from 'components/layout/Body'
import { navigationHeaderOptions } from 'components/layout/Header'
import SubHeader from 'components/layout/SubHeader'
import WithAuth from 'components/layout/WithAuth'

import { RootStackParams } from 'types/navigation'
import { createTxOptionsToTxParam, txParamParser } from 'utils/util'
import { getBioAuthPassword, getIsUseBioAuth } from 'utils/storage'
import { authenticateBiometric } from 'utils/bio'

import WalletConnectStore from 'stores/WalletConnectStore'

import useWalletConnectConfirm, {
  ErrorCodeEnum,
  UseWalletConnectConfirmReturn,
} from 'hooks/useWalletConnectConfirm'

import color from 'styles/color'

import MessageBox from './MessageBox'
import { useAlert } from 'hooks/useAlert'
import ErrorBox from './ErrorBox'

type Props = StackScreenProps<RootStackParams, 'WalletConnectConfirm'>

const TIMEOUT_DELAY = 1000 * 60

const TxMessages = ({
  tx,
  peerMeta,
  tryConfirm,
  onPressAllow,
  onPressGoBack,
}: {
  tx: CreateTxOptions
  peerMeta: IClientMeta | null
  tryConfirm: boolean
  onPressAllow: () => Promise<void>
  onPressGoBack: () => void
}): ReactElement => {
  const feeList = (tx?.fee && tx.fee.amount.toArray()) || []

  return (
    <>
      {tx?.msgs && (
        <>
          <View>
            <View style={styles.infoBox}>
              <View style={styles.infoBoxSection}>
                <Text style={styles.infoBoxTitle} fontType="bold">
                  Origin
                </Text>
                <Text style={{ flex: 1 }}>{peerMeta?.url}</Text>
              </View>

              {_.some(feeList) && (
                <View
                  style={[
                    styles.infoBoxSection,
                    _.isEmpty(tx.memo) && { marginBottom: 0 },
                  ]}
                >
                  <Text style={styles.infoBoxTitle} fontType="bold">
                    Fee
                  </Text>
                  <View style={{ flex: 1 }}>
                    {_.map(feeList, (coin, i) => {
                      return (
                        <Text key={`coins-${i}`}>{`${format.coin({
                          amount: _.toString(coin.amount),
                          denom: coin.denom,
                        })}`}</Text>
                      )
                    })}
                  </View>
                </View>
              )}

              {_.some(tx.memo) && (
                <View
                  style={[styles.infoBoxSection, { marginBottom: 0 }]}
                >
                  <Text style={styles.infoBoxTitle} fontType="bold">
                    Memo
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text>{tx.memo}</Text>
                  </View>
                </View>
              )}
            </View>

            <MessageBox msgs={tx.msgs} />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Button
                theme={'red'}
                title={'Cancel'}
                onPress={onPressGoBack}
                containerStyle={{
                  marginTop: 20,
                  marginBottom: 40,
                }}
              />
            </View>
            <View style={{ width: 10 }} />
            <View style={{ flex: 1 }}>
              <Button
                theme={'sapphire'}
                title={'Sign'}
                disabled={tryConfirm}
                onPress={onPressAllow}
                containerStyle={{
                  marginTop: 20,
                  marginBottom: 40,
                }}
              />
            </View>
          </View>
        </>
      )}
    </>
  )
}

const ConfirmForm = ({
  user,
  connector,
  isUseBioAuth,
  id,
  tx,
  route,
  walletConnectConfirmReturn,
}: {
  connector: WalletConnect
  isUseBioAuth: boolean
  user: User
  id: number
  tx: CreateTxOptions
  walletConnectConfirmReturn: UseWalletConnectConfirmReturn
} & Props): ReactElement => {
  const autoCloseTimer = React.useRef<NodeJS.Timeout>()
  const setIsListenConfirmRemove = useSetRecoilState(
    WalletConnectStore.isListenConfirmRemove
  )
  const walletName = user.name
  const [tryConfirm, setTryConfirm] = useState(false)
  const { dispatch, goBack, canGoBack, navigate } = useNavigation<
    NavigationProp<RootStackParams>
  >()
  const { confirm } = useAlert()

  const onPressGoBack = (): void => {
    if (canGoBack()) {
      goBack()
    } else {
      dispatch(StackActions.replace('Tabs'))
    }
  }

  const { confirmSign, confirmResult } = walletConnectConfirmReturn

  const onPressAllow = async (): Promise<void> => {
    autoCloseTimer.current && clearTimeout(autoCloseTimer.current)
    setTryConfirm(true)
    setIsListenConfirmRemove(false)

    if (isUseBioAuth) {
      const isSuccess = await authenticateBiometric()
      if (isSuccess) {
        const password = await getBioAuthPassword({
          walletName,
        })
        confirmSign({
          address: user.address,
          walletName,
          tx,
          password,
        })
      } else {
        setIsListenConfirmRemove(true)
        confirm({
          desc: 'Would you like to confirm with your password?',
          onPressConfirm: () => {
            navigate('WalletConnectConfirmPassword', {
              id,
              tx: createTxOptionsToTxParam(tx),
              handshakeTopic: route.params?.handshakeTopic,
            })
          },
        })
      }
    } else {
      setIsListenConfirmRemove(true)
      navigate('WalletConnectConfirmPassword', {
        id,
        tx: createTxOptionsToTxParam(tx),
        handshakeTopic: route.params?.handshakeTopic,
      })
    }
    setTryConfirm(false)
  }

  useEffect(() => {
    if (confirmResult) {
      dispatch(
        StackActions.replace('Complete', { result: confirmResult })
      )
    }
  }, [confirmResult])

  return (
    <TxMessages
      {...{
        tx,
        tryConfirm,
        onPressGoBack,
        onPressAllow,
        peerMeta: connector.peerMeta,
      }}
    />
  )
}

const Render = ({
  user,
  connector,
  id,
  route,
  navigation,
}: {
  connector: WalletConnect
  user: User
  id: number
} & Props): ReactElement => {
  const autoCloseTimer = React.useRef<NodeJS.Timeout>()
  const [initComplete, setInitComplete] = useState(false)
  const [
    isListenConfirmRemove,
    setIsListenConfirmRemove,
  ] = useRecoilState(WalletConnectStore.isListenConfirmRemove)

  const [tx, setTx] = useState<CreateTxOptions>()

  const { dispatch, goBack, canGoBack } = useNavigation<
    NavigationProp<RootStackParams>
  >()
  const [isUseBioAuth, setIsUseBioAuth] = useState(false)

  const onPressGoBack = (): void => {
    if (canGoBack()) {
      goBack()
    } else {
      dispatch(StackActions.replace('Tabs'))
    }
  }

  const walletConnectConfirmReturn = useWalletConnectConfirm({
    connector,
    id,
    navigation,
    user,
  })
  const { rejectWalletConnectRequest } = walletConnectConfirmReturn

  const denySign = (): void => {
    rejectWalletConnectRequest({
      errorCode: ErrorCodeEnum.userDenied,
      message: 'Denied by user',
    })
  }

  const initPage = async (): Promise<void> => {
    setIsUseBioAuth(await getIsUseBioAuth())

    const txOption = txParamParser(route.params?.params)
    setTx(txOption)

    autoCloseTimer.current = setTimeout(() => {
      rejectWalletConnectRequest({
        errorCode: ErrorCodeEnum.timeOut,
        // TIMEOUT_DELAY is 1 minute
        message: `Connection timed out. 1 minute`,
      })
      onPressGoBack()
    }, TIMEOUT_DELAY) // 1 minute

    setInitComplete(true)
  }

  useEffect(() => {
    let unsubscribe: any

    if (isListenConfirmRemove) {
      unsubscribe = navigation.addListener('beforeRemove', denySign)
    }

    return (): void => {
      unsubscribe?.()
    }
  }, [isListenConfirmRemove])

  useEffect(() => {
    initPage()
    setIsListenConfirmRemove(true)
    return (): void => {
      autoCloseTimer.current && clearTimeout(autoCloseTimer.current)
    }
  }, [])

  return (
    <>
      <SubHeader theme={'sapphire'} title={'Confirm'} />
      <Body
        theme={'sky'}
        scrollable
        containerStyle={{
          paddingTop: 20,
          flexGrow: 1,
          justifyContent: 'space-between',
        }}
      >
        {tx ? (
          <ConfirmForm
            {...{
              user,
              connector,
              isUseBioAuth,
              id,
              tx,
              route,
              navigation,
              walletConnectConfirmReturn,
            }}
          />
        ) : initComplete ? (
          <ErrorBox
            {...{
              peerMeta: connector.peerMeta,
              denySign,
              onPressGoBack,
              route,
              navigation,
            }}
          />
        ) : (
          <LoadingIcon size={24} style={{ paddingTop: 40 }} />
        )}
      </Body>
    </>
  )
}

const WalletConnectConfirm = (props: Props): ReactElement => {
  const { dispatch } = useNavigation()
  const _handshakeTopic = props.route.params?.handshakeTopic
  const id = props.route.params?.id
  const walletConnectors = useRecoilValue(
    WalletConnectStore.walletConnectors
  )
  const walletConnectRecoverComplete = useRecoilValue(
    WalletConnectStore.walletConnectRecoverComplete
  )

  const connector = walletConnectors[_handshakeTopic]
  useEffect(() => {
    if (walletConnectRecoverComplete) {
      if (!connector) {
        dispatch(StackActions.replace('WalletConnectDisconnected'))
      }
    }
  }, [walletConnectRecoverComplete])

  return (
    <WithAuth>
      {(user): ReactElement =>
        walletConnectRecoverComplete && connector ? (
          <Render
            {...{
              ...props,
              user,
              id,
              connector,
            }}
          />
        ) : (
          <View style={{ marginTop: 20 }}>
            <LoadingIcon size={24} />
          </View>
        )
      }
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
      <Icon name={'close'} color={color.white} size={28} />
    </TouchableOpacity>
  )
}

WalletConnectConfirm.navigationOptions = (): StackNavigationOptions =>
  navigationHeaderOptions({
    theme: 'sapphire',
    headerLeft: () => <HeaderLeft />,
  })

export default WalletConnectConfirm

const styles = StyleSheet.create({
  infoBox: {
    padding: 20,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: '#ebeff8',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#cfd8ea',
  },
  infoBoxSection: {
    marginBottom: 10,
    flexDirection: 'row',
  },
  infoBoxTitle: {
    minWidth: 70,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0,
    paddingRight: 20,
  },
})
