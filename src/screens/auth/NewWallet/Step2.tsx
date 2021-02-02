import React, { ReactElement, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { useRecoilState } from 'recoil'
import { useNavigation } from '@react-navigation/native'

import Body from 'components/layout/Body'
import { navigationHeaderOptions } from 'components/layout/Header'
import SubHeader from 'components/layout/SubHeader'
import {
  Text,
  Button,
  CopyButton,
  WarningBox,
  NumberStep,
} from 'components'

import color from 'styles/color'
import NewWalletStore from 'stores/NewWalletStore'
import terraWallet from 'nativeModules/terraWallet'

const Screen = (): ReactElement => {
  const [seed, setSeed] = useRecoilState(NewWalletStore.seed)

  const { navigate } = useNavigation()
  const onPressNext = (): void => {
    navigate('NewWalletStep3')
  }

  const stepConfirmed = seed.length > 0

  useEffect(() => {
    terraWallet.getNewWallet().then(({ mnemonic }) => {
      setSeed(mnemonic.split(' '))
    })
  }, [])

  return (
    <>
      <SubHeader theme={'sapphire'} title={'Write down your seed'} />
      <Body theme={'sky'} containerStyle={styles.container}>
        <View>
          <View style={{ alignItems: 'flex-end', marginBottom: 10 }}>
            <CopyButton copyString={seed.join(' ')} />
          </View>
          <View style={styles.seedBox}>
            <Text style={{ fontSize: 14, lineHeight: 21 }}>{seed.join(' ')}</Text>
          </View>
          <WarningBox
            message={
              <Text style={{ color: color.red, lineHeight: 21 }}>
                {`If you lose your seed phrase it's`}
                <Text style={{ color: color.red }} fontType={'bold'}>
                  {' gone forever. '}
                </Text>
                {`Station doesn't store any data.`}
              </Text>
            }
          />
        </View>

        <Button
          title="I have written down my seed"
          theme={'sapphire'}
          containerStyle={{ marginBottom: 10 }}
          disabled={!stepConfirmed}
          onPress={onPressNext}
        />
      </Body>
    </>
  )
}

const HeaderRight = (): ReactElement => (
  <NumberStep stepSize={3} nowStep={2} />
)

Screen.navigationOptions = navigationHeaderOptions({
  theme: 'sapphire',
  headerRight: HeaderRight,
})

export default Screen

const styles = StyleSheet.create({
  container: {
    paddingBottom: 50,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  seedBox: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    flexDirection: 'row',
    backgroundColor: '#EBEFF8',
    borderRadius: 8,
    borderColor: '#CFD8EA',
    borderWidth: 1,
  },
})
