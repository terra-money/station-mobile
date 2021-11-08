import React, { ReactElement } from 'react'
import { View, Image } from 'react-native'

import { COLOR } from 'consts'

import { authenticateBiometric } from 'utils/bio'
import Text from './Text'
import Button from './Button'

import images from 'assets/images'
import { getBioAuthPassword } from 'utils/storage'

const BiometricButtonTitle = (): ReactElement => {
  return (
    <View style={{ flexDirection: 'row' }}>
      <Image
        source={images.bio_face}
        style={{ width: 20, height: 20, marginRight: 10 }}
      />
      <Text
        style={{
          color: COLOR.primary._02,
        }}
        fontType="medium"
      >
        {'Biometric Authentication'}
      </Text>
    </View>
  )
}

const BiometricButton = (props: {
  walletName: string
  disabled?: boolean
  onPress: ({
    isSuccess,
    password,
  }: {
    isSuccess: boolean
    password: string
  }) => void
}): ReactElement => {
  const onPress = async (): Promise<void> => {
    const isSuccess = await authenticateBiometric()
    if (isSuccess) {
      const password = await getBioAuthPassword({
        walletName: props.walletName,
      })
      props.onPress({
        isSuccess: true,
        password,
      })
      return
    }
    props.onPress({
      isSuccess: false,
      password: '',
    })
  }

  return (
    <Button
      disabled={props.disabled}
      title={<BiometricButtonTitle />}
      theme={'gray'}
      onPress={onPress}
    />
  )
}

export default BiometricButton
