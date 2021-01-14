import React, { ReactElement, useEffect } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import _ from 'lodash'
import { useRecoilState } from 'recoil'
import { useNavigation } from '@react-navigation/native'

import Body from 'components/layout/Body'
import { navigationHeaderOptions } from 'components/layout/Header'
import SubHeader from 'components/layout/SubHeader'
import Button from 'components/Button'
import CopyButton from 'components/CopyButton'
import WarningBox from 'components/WarningBox'

import color from 'styles/color'
import { modules } from 'utils'
import NewWalletStore from 'stores/NewWalletStore'

const Screen = (): ReactElement => {
  const [seed, setSeed] = useRecoilState(NewWalletStore.seed)

  const { navigate } = useNavigation()
  const onPressNext = (): void => {
    navigate('NewWalletStep3')
  }

  const stepConfirmed = seed.length > 0

  useEffect(() => {
    modules.generateSeed().then((mnemonic) => {
      setSeed(mnemonic.split(' '))
    })
  }, [])

  return (
    <>
      <SubHeader theme={'blue'} title={'Write Down Your Seed'} />
      <Body type={'sky'} containerStyle={styles.container}>
        <View>
          <View style={{ alignItems: 'flex-end', marginBottom: 20 }}>
            <CopyButton copyString={seed.join(' ')} />
          </View>
          <View style={styles.seedBox}>
            <View style={{ flex: 1 }}>
              {_.map(seed.slice(0, 12), (item, index) => {
                return (
                  <View key={index} style={styles.seedWordBox}>
                    <Text style={styles.seedWordNo}>{index + 1}</Text>
                    <Text style={styles.seedWord}>{item}</Text>
                  </View>
                )
              })}
            </View>
            <View style={{ flex: 1 }}>
              {_.map(seed.slice(12, 25), (item, index) => {
                return (
                  <View key={index} style={styles.seedWordBox}>
                    <Text style={styles.seedWordNo}>
                      {index + 11}
                    </Text>
                    <Text style={styles.seedWord}>{item}</Text>
                  </View>
                )
              })}
            </View>
          </View>
          <WarningBox
            message={
              <Text style={{ color: color.red, lineHeight: 21 }}>
                {`If you lose your seed phrase it's`}
                <Text style={{ fontWeight: '700' }}>
                  {' gone forever. '}
                </Text>
                {`Station doesn't store any data.`}
              </Text>
            }
          />
        </View>

        <Button
          title="I Have Written Down My Seed."
          type={'blue'}
          containerStyle={{ marginBottom: 10 }}
          disabled={!stepConfirmed}
          onPress={onPressNext}
        />
      </Body>
    </>
  )
}

const HeaderRight = (): ReactElement => {
  return (
    <View>
      <Text>2</Text>
    </View>
  )
}

Screen.navigationOptions = navigationHeaderOptions({
  theme: 'blue',
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
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    backgroundColor: color.white,
    borderRadius: 10,
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowRadius: 25,
    shadowOpacity: 1,
  },
  seedWordBox: {
    flexDirection: 'row',
    paddingBottom: 5,
  },
  seedWordNo: {
    width: 25,
    color: color.sapphire,
  },
  seedWord: {
    color: color.sapphire,
  },
})
