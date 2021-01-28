import React, { ReactElement, useEffect, useState } from 'react'
import { View, Image, StyleSheet } from 'react-native'

import Button from 'components/Button'
import Body from 'components/layout/Body'
import { Text } from 'components'

import { useApp } from './useApp'

import { setUseBioAuth } from 'utils/storage'
import {
  getSupportedType,
  BiometricType,
  authenticateBiometric,
} from 'utils/bio'
import images from 'assets/images'
import color from 'styles/color'

type BioAuthType = {
  bioType: BiometricType
} & AppModal

const BioAuth = ({ close, bioType }: BioAuthType): ReactElement => {
  return (
    <Body containerStyle={styles.container}>
      <View style={{ flex: 1 }}>
        {bioType === BiometricType.FACE && (
          <View style={styles.info}>
            <Image
              source={images.bio_face}
              style={styles.infoImage}
            />
            <Text style={styles.infoTitle}>Use Face ID</Text>
            <Text style={{ color: color.sapphire }}>
              Use your Face ID for faster, easier access to your
              acount.
            </Text>
          </View>
        )}

        {bioType === BiometricType.FINGERPRINT && (
          <View style={styles.info}>
            <Image
              source={images.finger_print}
              style={styles.infoImage}
            />
            <Text style={styles.infoTitle}>Use Touch ID</Text>
            <Text style={{ color: color.sapphire }}>
              Use your Touch ID for faster, easier access to your
              acount.
            </Text>
          </View>
        )}
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
  const { modal } = useApp()

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
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 36,
    letterSpacing: 0,
    textAlign: 'center',
    color: color.sapphire,
  },
})
