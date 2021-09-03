import React, { ReactElement, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import _ from 'lodash'

import { RootStackParams } from 'types/navigation'
import { User } from 'lib'

import Body from 'components/layout/Body'
import SubHeader from 'components/layout/SubHeader'
import { navigationHeaderOptions } from 'components/layout/Header'
import WithAuth from 'components/layout/WithAuth'
import { Text, CopyButton } from 'components'

import { createRecoverWalletPayload } from 'utils/qrCode'
import { getEncryptedKey } from 'utils/wallet'
import { useAlert } from 'hooks/useAlert'
import color from 'styles/color'

type Props = StackScreenProps<RootStackParams, 'ExportPrivateKey'>

const Render = ({ user }: { user: User }): ReactElement => {
  const [exportKey, setExportKey] = useState('')
  const { alert } = useAlert()

  const getKey = async (): Promise<void> => {
    const name = user.name || ''
    const encrypted_key = await getEncryptedKey(name)
    if (encrypted_key) {
      const value = createRecoverWalletPayload({
        address: user.address,
        name,
        encrypted_key,
      })
      setExportKey(value)
    } else {
      const desc = `Oops! Something went wrong\n${JSON.stringify({
        WalletName: name,
      })}`
      alert({ desc })
    }
  }

  useEffect(() => {
    getKey()
  }, [])

  return (
    <>
      <SubHeader theme={'sapphire'} title={'Export private key'} />
      <Body theme={'sky'} containerStyle={{ paddingTop: 20 }}>
        {_.some(exportKey) && (
          <>
            <View
              style={{ alignItems: 'flex-end', marginBottom: 10 }}
            >
              <CopyButton copyString={exportKey} />
            </View>
            <View style={styles.keyBox}>
              <Text style={{ lineHeight: 21 }}>{exportKey}</Text>
            </View>
          </>
        )}
        <Text style={styles.info} fontType="medium">
          Keep this encrypted key private
        </Text>
      </Body>
    </>
  )
}

const ExportPrivateKey = (props: Props): ReactElement => {
  return (
    <WithAuth>
      {(user): ReactElement => <Render {...{ ...props, user }} />}
    </WithAuth>
  )
}

ExportPrivateKey.navigationOptions = navigationHeaderOptions({
  theme: 'sapphire',
})

export default ExportPrivateKey

const styles = StyleSheet.create({
  keyBox: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    flexDirection: 'row',
    backgroundColor: '#EBEFF8',
    borderRadius: 8,
    borderColor: '#CFD8EA',
    borderWidth: 1,
  },
  info: {
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0,
    textAlign: 'center',
    color: color.sapphire,
  },
})
