import React, { useState, ReactElement, useEffect } from 'react'
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import { useRecoilValue } from 'recoil'
import _ from 'lodash'
import numeral from 'numeral'
import { StackActions, useNavigation } from '@react-navigation/native'

import Body from 'components/layout/Body'
import { navigationHeaderOptions } from 'components/layout/Header'
import SubHeader from 'components/layout/SubHeader'

import { FormLabel, NumberStep, Text, Button } from 'components'

import color from 'styles/color'
import NewWalletStore from 'stores/NewWalletStore'
import { createWallet } from 'utils/wallet'

const Screen = (): ReactElement => {
  const { dispatch } = useNavigation()
  const seed = useRecoilValue(NewWalletStore.seed)
  const name = useRecoilValue(NewWalletStore.name)
  const password = useRecoilValue(NewWalletStore.password)
  const [firstSeedWord, setFirstSeedWord] = useState('')
  const [secondSeedWord, setSecondSeedWord] = useState('')
  const [focusInputIndex, setFocusInputIndex] = useState<0 | 1>(0)

  const [quiz, setQuiz] = useState<number[]>([])
  const [hint, setHint] = useState<number[]>([])

  const stepConfirmed =
    firstSeedWord === seed[quiz[0]] &&
    secondSeedWord === seed[quiz[1]]

  const onPressHint = (index: number): void => {
    if (focusInputIndex === 1) {
      setFocusInputIndex(0)
      setSecondSeedWord(seed[index])
    } else {
      setFocusInputIndex(1)
      setFirstSeedWord(seed[index])
    }
  }

  const onPressNext = async (): Promise<void> => {
    const result = await createWallet({
      name,
      password,
      seed: seed.join(' '),
    })

    if (result.success) {
      dispatch(StackActions.popToTop())
      dispatch(
        StackActions.replace('WalletCreated', {
          wallet: result.wallet,
        })
      )
    }
  }

  useEffect(() => {
    const n = 2
    const shuffled = _.shuffle(_.times(seed.length))
    const quiz = shuffled.slice(0, n).sort()
    const hint = _.shuffle(shuffled.slice(0, n * 3))
    setQuiz(quiz)
    setHint(hint)
  }, [])

  return (
    <>
      <SubHeader theme={'sapphire'} title={'Confirm seed phrase'} />
      <Body theme={'sky'} containerStyle={styles.container}>
        <View style={{ flex: 1 }}>
          <View style={styles.sectionGroup}>
            <View style={styles.section}>
              <FormLabel
                text={`${numeral(quiz[0] + 1).format('0o')} word`}
              />

              <TouchableOpacity
                onPress={(): void => setFocusInputIndex(0)}
                style={[
                  {
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#cfd8ea',
                    height: 45,
                    justifyContent: 'center',
                    paddingLeft: 10,
                    backgroundColor: 'white',
                  },
                  focusInputIndex === 0 && {
                    borderColor: color.sapphire,
                  },
                ]}
              >
                {firstSeedWord ? (
                  <Text>{firstSeedWord}</Text>
                ) : (
                  <Text style={{ color: '#dddddd' }}>Select</Text>
                )}
              </TouchableOpacity>
            </View>
            <View style={{ width: 15 }} />
            <View style={styles.section}>
              <FormLabel
                text={`${numeral(quiz[1] + 1).format('0o')} word`}
              />

              <TouchableOpacity
                onPress={(): void => setFocusInputIndex(1)}
                style={[
                  {
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#cfd8ea',
                    height: 45,
                    justifyContent: 'center',
                    paddingLeft: 10,
                    backgroundColor: 'white',
                  },
                  focusInputIndex === 1 && {
                    borderColor: color.sapphire,
                  },
                ]}
              >
                {secondSeedWord ? (
                  <Text>{secondSeedWord}</Text>
                ) : (
                  <Text style={{ color: '#dddddd' }}>Select</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <FlatList
              data={hint}
              numColumns={3}
              contentContainerStyle={{ margin: -5 }}
              keyExtractor={(item, index): string => `hint-${index}`}
              renderItem={({ item }): ReactElement => (
                <TouchableOpacity
                  style={styles.hintItem}
                  onPress={(): void => onPressHint(item)}
                >
                  <Text style={styles.hintText}>{seed[item]}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
        <Button
          title="Confirm and finish"
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
  <NumberStep stepSize={3} nowStep={3} />
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
  sectionGroup: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  section: {
    flex: 1,
  },
  hintItem: {
    flex: 1,
    margin: 5,
    height: 34,
    borderRadius: 5,
    backgroundColor: '#e8ecf7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hintText: {
    color: color.sapphire,
  },
})
