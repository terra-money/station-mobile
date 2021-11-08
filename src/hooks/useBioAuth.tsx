import React, { ReactElement, useEffect, useState } from 'react'
import {
  View,
  Image,
  StyleSheet,
  Platform,
  ImageSourcePropType,
} from 'react-native'

import { COLOR } from 'consts'

import Button from 'components/Button'
import Body from 'components/layout/Body'
import { Text } from 'components'

import { useModal } from './useModal'

import { setUseBioAuth } from 'utils/storage'
import {
  getSupportedType,
  BiometricType,
  authenticateBiometric,
} from 'utils/bio'
import images from 'assets/images'

type BioAuthType = {
  bioType: BiometricType
} & AppModal

const BioAuth = ({ close, bioType }: BioAuthType): ReactElement => {
  const getBiometricImage = (): ImageSourcePropType => {
    return bioType === BiometricType.FACE
      ? images.bio_face
      : images.finger_print
  }
  const getBiometricName = (): string => {
    return bioType === BiometricType.FACE
      ? 'Face ID'
      : Platform.OS === 'ios'
      ? 'Touch ID'
      : 'Fingerprint'
  }

  return (
    <Body containerStyle={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.info}>
          <Image
            source={getBiometricImage()}
            style={styles.infoImage}
          />
          <Text style={styles.infoTitle} fontType={'bold'}>
            {`Use ${getBiometricName()}`}
          </Text>
          <Text
            style={{ color: COLOR.primary._02, textAlign: 'center' }}
          >
            {`Use your ${getBiometricName()} for faster, easier access to your acount.`}
          </Text>
        </View>
      </View>
      <View>
        <Button
          theme={'sapphire'}
          title={'Enable'}
          onPress={async (): Promise<void> => {
            const isSuccess = await authenticateBiometric()
            if (isSuccess) {
              setUseBioAuth({ isUse: true })
              close()
            }
          }}
          containerStyle={{ marginBottom: 10 }}
        />
        <Button theme={'gray'} title={'Later'} onPress={close} />
      </View>
    </Body>
  )
}

export const useBioAuth = (): {
  openIsUseBioAuth: () => void
} => {
  const { modal } = useModal()

  const [bioType, setBioType] = useState<BiometricType>(
    BiometricType.NONE
  )

  const initModal = async (): Promise<void> => {
    setBioType(await getSupportedType())
  }

  useEffect(() => {
    initModal()
  }, [])

  const openIsUseBioAuth = (): void => {
    if (bioType === BiometricType.NONE) {
      getSupportedType().then((bioType) => {
        modal.open(BioAuth({ ...modal, bioType }))
      })
    } else {
      modal.open(BioAuth({ ...modal, bioType }))
    }
  }

  return {
    openIsUseBioAuth,
  }
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 50,
    paddingTop: 20,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  info: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  infoImage: {
    width: 60,
    height: 60,
  },
  infoTitle: {
    fontSize: 24,
    fontStyle: 'normal',
    lineHeight: 36,
    letterSpacing: 0,
    textAlign: 'center',
    color: COLOR.primary._02,
    marginVertical: 5,
  },
})
