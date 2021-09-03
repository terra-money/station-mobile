import React, { ReactElement, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import { StackScreenProps } from '@react-navigation/stack'
import _ from 'lodash'

import { RootStackParams } from 'types/navigation'

import Body from 'components/layout/Body'
import SubHeader from 'components/layout/SubHeader'
import { navigationHeaderOptions } from 'components/layout/Header'
import WithAuth from 'components/layout/WithAuth'
import { Text } from 'components'

import color from 'styles/color'
import layout from 'styles/layout'
import { createRecoverWalletSchemeUrl } from 'utils/qrCode'
import { getEncryptedKey } from 'utils/wallet'
import { User } from 'lib'
import { useAlert } from 'hooks/useAlert'

type Props = StackScreenProps<RootStackParams, 'ExportWallet'>

const Render = ({ user }: { user: User }): ReactElement => {
  const [qrCodeValue, setQrCodeValue] = useState('')
  const [size, setSize] = useState(layout.getWindowWidth() - 200)
  const { alert } = useAlert()

  const makeQrCodeValue = async (): Promise<void> => {
    const name = user.name || ''
    const encrypted_key = await getEncryptedKey(name)
    if (encrypted_key) {
      const value = createRecoverWalletSchemeUrl({
        address: user.address,
        name,
        encrypted_key,
      })
      setQrCodeValue(value)
    } else {
      const desc = `Oops! Something went wrong\n${JSON.stringify({
        WalletName: name,
      })}`
      alert({ desc })
    }
  }

  useEffect(() => {
    makeQrCodeValue()
    if (size < 300) {
      setSize(layout.getWindowWidth() - 50)
    }
  }, [])

  return (
    <>
      <SubHeader theme={'sapphire'} title={'Export with QR code'} />
      <Body theme={'sky'} scrollable>
        <View style={styles.container}>
          {_.some(qrCodeValue) && (
            <QRCode
              value={qrCodeValue}
              color={color.sapphire}
              size={size}
            />
          )}
          <Text style={styles.info} fontType="medium">
            Keep this QR code private
          </Text>
        </View>
      </Body>
    </>
  )
}

const ExportWallet = (props: Props): ReactElement => {
  return (
    <WithAuth>
      {(user): ReactElement => <Render {...{ ...props, user }} />}
    </WithAuth>
  )
}

ExportWallet.navigationOptions = navigationHeaderOptions({
  theme: 'sapphire',
})

export default ExportWallet

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 40,
  },
  info: {
    paddingTop: 20,
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0,
    textAlign: 'center',
    color: color.sapphire,
  },
})
