import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import _ from 'lodash'
import { useRecoilState } from 'recoil'
import { useNavigation } from '@react-navigation/native'

import Body from 'components/layout/Body'
import { navigationHeaderOptions } from 'components/layout/Header'
import SubHeader from 'components/layout/SubHeader'
import Button from 'components/Button'
import Text from 'components/Text'
import PasteButton from 'components/PasteButton'
import Input from 'components/Input'

import color from 'styles/color'
import RecoverWalletStore from 'stores/RecoverWalletStore'
import NumberStep from 'components/NumberStep'

const Screen = (): ReactElement => {
  const [seed, setSeed] = useRecoilState(RecoverWalletStore.seed)
  const { navigate } = useNavigation()
  const onPressNext = (): void => {
    navigate('RecoverWalletStep3')
  }

  const stepConfirmed = _.every(seed, _.some)

  const onChangeSeedWord = ({
    index,
    value,
  }: {
    index: number
    value: string
  }): void => {
    const newSeed = _.clone(seed)
    newSeed[index] = value
    setSeed(newSeed)
  }

  const onPressPasteButton = async (
    copiedString: string
  ): Promise<void> => {
    if (_.some(copiedString)) {
      const stringArr = copiedString.trim().split(' ')
      if (stringArr.length > 0) {
        setSeed(stringArr)
      }
    }
  }

  return (
    <>
      <SubHeader theme={'blue'} title={'Enter Your Seed Phase'} />
      <Body theme={'sky'} containerStyle={styles.container}>
        <View>
          <View style={{ alignItems: 'flex-end', marginBottom: 20 }}>
            <PasteButton onPress={onPressPasteButton} />
          </View>
          <View style={styles.seedBox}>
            <View style={{ flex: 1 }}>
              {_.map(
                _.times(12, () => ''),
                (_, index) => {
                  return (
                    <View
                      key={`seedWord-${index}`}
                      style={styles.seedWordBox}
                    >
                      <Text style={styles.seedWordNo}>
                        {index + 1}
                      </Text>
                      <View style={styles.seedWordInputBox}>
                        <Input
                          style={styles.seedWordInput}
                          value={seed[index]}
                          onChangeText={(value): void =>
                            onChangeSeedWord({ index, value })
                          }
                        />
                      </View>
                    </View>
                  )
                }
              )}
            </View>
            <View style={{ flex: 1 }}>
              {_.map(
                _.times(12, () => ''),
                (_, index) => {
                  const seedIndex = index + 12
                  return (
                    <View
                      key={`seedWord-${seedIndex + 1}`}
                      style={styles.seedWordBox}
                    >
                      <Text style={styles.seedWordNo}>
                        {seedIndex + 1}
                      </Text>
                      <View style={styles.seedWordInputBox}>
                        <Input
                          style={styles.seedWordInput}
                          value={seed[seedIndex]}
                          onChangeText={(value): void =>
                            onChangeSeedWord({
                              index: seedIndex,
                              value,
                            })
                          }
                        />
                      </View>
                    </View>
                  )
                }
              )}
            </View>
          </View>
        </View>
        <Button
          title="Finish"
          type={'blue'}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  seedWordNo: {
    width: 25,
    color: color.sapphire,
  },
  seedWordInputBox: {
    flex: 1,
    height: 25,
    paddingRight: 15,
  },
  seedWordInput: {
    flex: 1,
    borderRadius: 3,
    backgroundColor: '#2043b51a',
    color: color.sapphire,
  },
})
