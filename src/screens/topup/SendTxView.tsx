import React, { ReactElement, useEffect, useState } from 'react'
import {
  View,
  ViewProps,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  BackHandler,
} from 'react-native'
import { Buffer } from 'buffer'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import _ from 'lodash'

import { COLOR, FONT } from 'consts'

import { useAuth, format, useBank, useIsClassic } from 'lib'
import { Text, Button, Select, Icon, FormInput } from 'components'

import BigNumber from 'bignumber.js'
import SubHeader from 'components/layout/SubHeader'
import { DEBUG_TOPUP } from './TopupUtils'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParams } from 'types'
import StatusBar from 'components/StatusBar'
import { useAlert } from 'hooks/useAlert'
import { useRecoilState } from 'recoil'
import TopupStore from 'stores/TopupStore'
import { useTopup } from 'hooks/useTopup'
import TopupLoadingIndicator from 'components/TopupLoadingIndicator'
import {
  authenticateBiometric,
  isSupportedBiometricAuthentication,
} from 'utils/bio'
import { getBioAuthPassword, getIsUseBioAuth } from 'utils/storage'
import useSignedTx from 'hooks/useSignedTx'
import {
  NavigationProp,
  useNavigation,
} from '@react-navigation/native'
import { getWallets } from 'utils/wallet'
import { whitelist } from 'utils/whitelist'
import {
  AuthInfo,
  Coin,
  Fee,
  Msg,
  Tx,
  TxBody,
} from '@terra-money/terra.js'

type Props = StackScreenProps<RootStackParams, 'SendTxView'>

interface SchemeArgs {
  wallet_address: string
  endpoint_address: string
  return_scheme: string
}

const SendTxView = (props: Props): ReactElement => {
  const { user } = useAuth()
  const { data: bank } = useBank(user!)
  const { alert } = useAlert()
  const { navigate } = useNavigation<
    NavigationProp<RootStackParams>
  >()
  const insets = useSafeAreaInsets()

  const [walletAddress, setWalletAddress] = useState('')
  const [returnScheme, setReturnScheme] = useState('')
  const [endpointAddress, setEndpointAddress] = useState('')

  const isClassic = useIsClassic()

  const [unsignedTx, setUnsignedTx] = useRecoilState(
    TopupStore.unsignedTx
  )

  const [, setConnectAddress] = useRecoilState(
    TopupStore.connectAddress
  )

  const [feeDenom, setFeeDenom] = useState('')
  const [feeAmount, setFeeAmount] = useState('')

  const [loading, setLoading] = useState(false)
  const [enableNext, setEnableNext] = useState(false)
  const [bioAvailable, setBioAvailable] = useState(false)

  const { restoreApp } = useTopup()
  const { confirm } = useSignedTx(endpointAddress, props.navigation)

  useEffect(() => {
    // parse param
    try {
      if (props.route.params.payload !== undefined) {
        const payload: SchemeArgs = JSON.parse(
          Buffer.from(props.route.params.payload, 'base64').toString()
        )
        setWalletAddress(payload.wallet_address)
        setEndpointAddress(payload.endpoint_address)
        setReturnScheme(payload.return_scheme)
      }
    } catch (e: any) {
      alert({
        title: 'Unexpected Error',
        desc: e.toString(),
      })
    }

    // bio check
    const checkBioAuth = async (): Promise<void> => {
      const support = await isSupportedBiometricAuthentication()
      const enable = await getIsUseBioAuth()

      setBioAvailable(support && enable)
    }
    checkBioAuth()
  }, [])

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', (): boolean => {
      returnScheme && restoreApp(returnScheme)
      return true
    })
    return (): void => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        (): boolean => {
          returnScheme && restoreApp(returnScheme)
          return true
        }
      )
    }
  }, [returnScheme])

  useEffect(() => {
    const validateMsg = (tx: Tx): void => {
      // length check - only one message
      if (tx.body.messages.length > 1) {
        throw new Error(`Wrong msg count: ${tx.body.messages.length}`)
      }

      const { topupGranteeAddress, topupMessageType } = whitelist()
      const msg = tx.body.messages[0].toData(isClassic) as any

      // type check - whitelist
      const type = msg['@type']
      if (!!msg) {
        if (!_.includes(topupMessageType, type)) {
          throw new Error(`Wrong msg type: ${type}`)
        }
      } else {
        throw new Error(`Could not find msg`)
      }

      // address check - whitelist
      if (!!msg && !!msg.grantee) {
        if (!_.includes(topupGranteeAddress, msg.grantee)) {
          throw new Error(`Wrong grantee address: ${msg.grantee}`)
        }
      } else {
        throw new Error(`Could not find grantee address`)
      }
    }

    const getUnsignedMessage = async (): Promise<void> => {
      try {
        setLoading(true)
        const tx = (await getUnsignedTx(endpointAddress)).txData

        const isAmino = tx.msgs[0].type !== undefined

        let msgs = undefined
        if (isAmino) {
          msgs = _.map(tx.msgs, (i) => Msg.fromAmino(i, isClassic))
        } else {
          msgs = _.map(tx.msgs, (i) => Msg.fromData(i, isClassic))
        }

        const txBody = new TxBody(msgs, tx.memo, undefined)
        const authInfo = new AuthInfo(
          [],
          new Fee(
            parseInt(tx.fee.gas),
            _.map(tx.fee.amount, (i) =>
              Coin.fromData({ amount: i.amount, denom: i.denom })
            )
          )
        )
        const unsignedTx = new Tx(txBody, authInfo, [])

        if (unsignedTx) {
          const fee = unsignedTx.auth_info.fee.amount

          const amount = fee.get('ukrw')?.amount
          amount && setFeeAmount(amount.toString())

          const denom = fee.get('ukrw')?.denom
          denom && setFeeDenom(denom.toString())
        }
        validateMsg(unsignedTx)
        setUnsignedTx(unsignedTx)
      } catch (e: any) {
        somethingWrong(e.toString())
      } finally {
        setLoading(false)
      }
    }

    const checkUserAddress = async (): Promise<void> => {
      if (!walletAddress || walletAddress !== user?.address) {
        getWallets()
          .then((wallets) => {
            const isHaveWallet = wallets.find(
              (wallet) => walletAddress === wallet.address
            )

            alert({
              title: 'Error',
              desc:
                isHaveWallet && walletAddress
                  ? `Connect with the wallet that has authorized access.`
                  : `The wallet that has authorized access does not exist. Please recover the wallet.\n\nAddress: ${walletAddress}`,
              onPressConfirmText: 'OK',
              onPressConfirm: (): void => {
                if (isHaveWallet && walletAddress) {
                  setConnectAddress(walletAddress)
                  navigate('AutoLogout')
                } else {
                  restoreApp(returnScheme)
                }
              },
            })
          })
          .catch((e) => {
            alert({
              title: 'Unexpected Error',
              desc: e.toString(),
              onPressConfirmText: 'OK',
              onPressConfirm: (): void => {
                restoreApp(returnScheme)
              },
            })
          })
      }
    }

    if (
      walletAddress !== '' &&
      endpointAddress !== '' &&
      returnScheme !== ''
    ) {
      getUnsignedMessage()
      checkUserAddress()
    }
  }, [walletAddress, endpointAddress, returnScheme])

  useEffect(() => {
    const available = bank?.balance?.find((b) => b.denom === feeDenom)
      ?.available

    available &&
      new BigNumber(available).gt(feeAmount) &&
      setEnableNext(true)
  }, [bank, feeDenom, feeAmount])

  const getUnsignedTx = async (url: string): Promise<any> => {
    const response = await fetch(url, { method: 'GET' })

    if (response.status !== 200) {
      throw new Error(JSON.stringify(response))
    }

    return await response.json()
  }

  const somethingWrong = (content: string): void => {
    props.navigation.replace('SendTxCompleteView', {
      success: false,
      title: 'Something wrong',
      content,
      returnScheme,
    })
  }

  const confirmSignedTx = async (): Promise<void> => {
    const gotoPasswordView = (): void => {
      props.navigation.push('SendTxPasswordView', {
        returnScheme,
        endpointAddress,
      })
    }

    if (unsignedTx === undefined) {
      somethingWrong('Tx is undefined')
    } else {
      if (bioAvailable) {
        const bioResult = await authenticateBiometric()
        if (bioResult) {
          const password = await getBioAuthPassword({
            walletName: user?.name || '',
          })
          await confirm(password, returnScheme)
        } else {
          gotoPasswordView()
        }
      } else {
        gotoPasswordView()
      }
    }
  }

  const TitleIcon = (props?: ViewProps): ReactElement => (
    <View style={[{ flexDirection: 'row' }, props?.style]}>
      <View style={{ width: 15, height: 40, overflow: 'hidden' }}>
        <View
          style={{
            width: 40,
            height: 40,
            backgroundColor: 'transparent',
            borderColor: COLOR.primary._02,
            borderWidth: 5,
            borderRadius: 20,
          }}
        />
      </View>
      <View
        style={{
          width: 40,
          height: 40,
          backgroundColor: 'transparent',
          borderColor: COLOR.primary._02,
          borderWidth: 5,
          borderRadius: 20,
        }}
      />
    </View>
  )

  return (
    <View
      style={[
        style.container,
        {
          marginBottom: insets.bottom,
        },
      ]}
    >
      <StatusBar theme="sapphire" />
      <View
        style={{
          height: insets.top,
          backgroundColor: COLOR.primary._02,
        }}
      />
      <View style={style.headerContainer}>
        <TouchableOpacity
          onPress={(): void => {
            restoreApp(returnScheme)
          }}
        >
          <Icon name={'clear'} color={COLOR.white} size={24} />
        </TouchableOpacity>
      </View>
      <SubHeader theme={'sapphire'} title={'Confirm'} />
      <View style={style.contentContainer}>
        <TitleIcon style={style.titleIcon} />
        <Text fontType="book" style={style.titleText}>
          {'Grant CHAI permission to charge your wallet?'}
        </Text>
        <View style={style.feeTextContainer}>
          <Text fontType="medium" style={style.feeText}>
            {'Fees'}
          </Text>
        </View>
        <View style={style.feeContainer}>
          <Select
            disabled={true}
            selectedValue={format.denom(feeDenom)}
            optionList={[
              {
                label: format.denom(feeDenom),
                value: format.denom(feeDenom),
              },
            ]}
            onValueChange={(): void => {
              // Do nothing
            }}
            textStyle={style.denomText}
            containerStyle={style.denomContainer}
          />
          <View style={{ width: 10 }} />
          <View style={style.amountContainer}>
            <FormInput
              style={style.amountText}
              value={
                feeAmount &&
                new BigNumber(feeAmount).dividedBy(1e6).toString()
              }
              editable={false}
              errorMessage={
                enableNext && feeAmount !== ''
                  ? undefined
                  : 'Insufficient funds'
              }
            />
          </View>
        </View>
        {DEBUG_TOPUP && (
          <ScrollView style={style.debugContainer}>
            <Text
              style={style.debugText}
            >{`returnScheme: ${returnScheme}`}</Text>
            <Text
              style={style.debugText}
            >{`endpointAddress: ${endpointAddress}`}</Text>
            <Text
              style={style.debugText}
            >{`unsignedTx: ${JSON.stringify(
              unsignedTx?.toData(isClassic)
            )}`}</Text>
          </ScrollView>
        )}
      </View>
      <View style={style.buttonContainer}>
        <Button
          theme="sapphire"
          title="Next"
          titleStyle={style.buttonText}
          titleFontType="medium"
          onPress={confirmSignedTx}
          disabled={!enableNext}
        />
      </View>
      {loading && <TopupLoadingIndicator />}
    </View>
  )
}

const style = StyleSheet.create({
  container: { flex: 1, flexDirection: 'column' },
  headerContainer: {
    backgroundColor: COLOR.primary._02,
    height: 60,
    paddingLeft: 20,
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 60,
  },

  titleIcon: { marginBottom: 15 },
  titleText: {
    fontSize: 16,
    lineHeight: 24,
    color: COLOR.primary._02,
    marginBottom: 60,
  },

  feeTextContainer: { alignSelf: 'flex-start', marginBottom: 5 },
  feeText: { fontSize: 14, lineHeight: 21 },

  feeContainer: { flexDirection: 'row' },
  denomText: {
    fontSize: 14,
    color: COLOR.primary._02,
    paddingLeft: 15,
  },
  denomContainer: {
    flex: 1,
    backgroundColor: COLOR.disabled,
  },
  amountContainer: {
    flex: 2,
  },
  amountText: {
    color: COLOR.primary._02,
    fontFamily: FONT.gotham.book,
    fontVariant: ['tabular-nums'],
  },

  debugContainer: { alignSelf: 'flex-start' },
  debugText: { marginBottom: 4 },

  buttonContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  buttonText: { fontSize: 16, lineHeight: 24 },
})

export default SendTxView
