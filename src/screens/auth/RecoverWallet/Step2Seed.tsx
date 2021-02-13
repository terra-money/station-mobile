import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import _ from 'lodash'
import { useRecoilState } from 'recoil'
import { useNavigation } from '@react-navigation/native'

import Body from 'components/layout/Body'
import { navigationHeaderOptions } from 'components/layout/Header'
import SubHeader from 'components/layout/SubHeader'
import PasteButton from 'components/PasteButton'
import { Input, Button, FormLabel } from 'components'

import RecoverWalletStore from 'stores/RecoverWalletStore'
import NumberStep from 'components/NumberStep'
import { useSignUp } from 'use-station/src'
import { formatSeedStringToArray } from 'utils/wallet'

const Screen = (): ReactElement => {
  const [seed, setSeed] = useRecoilState(RecoverWalletStore.seed)

  const { navigate } = useNavigation()
  const onPressNext = (): void => {
    navigate('Step3Seed')
  }

  const stepConfirmed = _.every(seed, _.some)

  const onChangeSeedWord = ({ value }: { value: string }): void => {
    setSeed(value.split(' '))
  }

  const onPressPasteButton = async (
    copiedString: string
  ): Promise<void> => {
    useSignUp
    if (_.some(copiedString)) {
      const stringArr = formatSeedStringToArray(copiedString)

      if (stringArr.length > 0) {
        setSeed(stringArr)
      }
    }
  }

  return (
    <>
      <SubHeader theme={'sapphire'} title={'Recover wallet'} />
      <Body theme={'sky'} containerStyle={styles.container}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 5,
            }}
          >
            <FormLabel text={'Enter seed phrase'} />
            <View style={{ marginBottom: 5 }}>
              <PasteButton onPress={onPressPasteButton} />
            </View>
          </View>
          <Input
            style={{
              padding: 5,
              textAlignVertical: 'top',
            }}
            containerStyle={{
              height: 100,
            }}
            multiline
            autoCorrect={false}
            value={seed.join(' ')}
            onChangeText={(value): void =>
              onChangeSeedWord({ value })
            }
          />
        </View>
        <Button
          title="Next"
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
  <NumberStep stepSize={3} nowStep={1} />
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
})
