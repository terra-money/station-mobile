import React, { useState, ReactElement, useEffect } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { useRecoilValue } from 'recoil'
import {
  CommonActions,
  NavigationProp,
  useNavigation,
} from '@react-navigation/native'
import { fcd, format, useBank } from 'lib'
import { MnemonicKey } from '@terra-money/terra.js'
import _ from 'lodash'

import Body from 'components/layout/Body'
import { navigationHeaderOptions } from 'components/layout/Header'
import SubHeader from 'components/layout/SubHeader'
import Button from 'components/Button'
import NumberStep from 'components/NumberStep'
import Badge from 'components/Badge'
import { Text } from 'components'

import RecoverWalletStore from 'stores/RecoverWalletStore'
import {
  recoverWalletWithMnemonicKey,
  generateAddresses,
} from 'utils/wallet'
import color from 'styles/color'
import { RecoverWalletStackParams } from 'types'

const AddressBox = ({
  bip,
  mk,
  selectedMk,
  setSelectedMk,
}: {
  bip: 118 | 330
  mk: MnemonicKey
  selectedMk?: MnemonicKey
  setSelectedMk: React.Dispatch<
    React.SetStateAction<MnemonicKey | undefined>
  >
}): ReactElement => {
  const bank = useBank({ address: mk.accAddress })
  const [isVested, setIsVested] = useState(false)
  const [isDelegated, setIsDelegated] = useState(false)
  const [isUndelegated, setIsUndelegated] = useState(false)
  const [balanceList, setBalanceList] = useState<string[]>([])
  const selectedStyle =
    selectedMk &&
    (selectedMk === mk
      ? { borderColor: color.sapphire, opacity: 0.9 }
      : { opacity: 0.5 })

  useEffect(() => {
    if (bank.data) {
      const { data } = bank

      setIsVested(_.some(data.vesting))
      setIsDelegated(_.some(data.delegations))
      setIsUndelegated(_.some(data.unbondings))
      if (_.some(data.balance)) {
        setBalanceList(
          data.balance.map(({ available, denom }) =>
            format.coin({ amount: available, denom })
          )
        )
      }
    }
  }, [bank.loading])

  return (
    <TouchableOpacity
      onPress={(): void => {
        setSelectedMk(mk)
      }}
    >
      <View style={[styles.addressBox, selectedStyle]}>
        <View style={styles.addressBadgeBox}>
          <Badge text={`BIP ${bip}`} />
          {isVested && <Badge text={'Vested'} />}
          {isDelegated && <Badge text={'Delegated'} />}
          {isUndelegated && <Badge text={'Undelegated'} />}
        </View>
        <View style={styles.addressBoxAddress}>
          <Text>{mk.accAddress}</Text>
        </View>
        <View>
          {_.map(balanceList, (balance, i) => (
            <Text key={`balanceList-${i}`}>{balance}</Text>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  )
}

const Step4Seed = (): ReactElement => {
  const { dispatch } = useNavigation<
    NavigationProp<RecoverWalletStackParams>
  >()
  const seed = useRecoilValue(RecoverWalletStore.seed)
  const name = useRecoilValue(RecoverWalletStore.name)
  const password = useRecoilValue(RecoverWalletStore.password)

  const [mk118, setMk118] = useState<MnemonicKey>()
  const [mk330, setMk330] = useState<MnemonicKey>()
  const [selectedMk, setSelectedMk] = useState<MnemonicKey>()

  const onPressNext = async (
    selectedMk: MnemonicKey
  ): Promise<void> => {
    const result =
      selectedMk &&
      (await recoverWalletWithMnemonicKey(selectedMk, {
        name,
        password,
      }))

    if (result?.success) {
      dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {
              name: 'WalletRecovered',
              params: { wallet: result.wallet },
            },
          ],
        })
      )
    }
  }

  const stepConfirmed = _.some(selectedMk)

  const checkIf118IsEmpty = async (
    address: string
  ): Promise<boolean> => {
    try {
      const { data } = await fcd.get(`/v1/bank/${address}`)
      return (
        _.isEmpty(data.balance) &&
        _.isEmpty(data.vesting) &&
        _.isEmpty(data.delegations) &&
        _.isEmpty(data.unbondings)
      )
    } catch {
      return false
    }
  }

  useEffect(() => {
    const { mk118, mk330 } = generateAddresses(seed.join(' '))

    checkIf118IsEmpty(mk118.accAddress).then((mk118IsEmpty) => {
      if (mk118IsEmpty) {
        onPressNext(mk330)
      } else {
        setMk118(mk118)
        setMk330(mk330)
      }
    })
  }, [])

  return (
    <>
      <SubHeader
        theme={'sapphire'}
        title={'Select Address to Recover'}
      />
      <Body
        theme={'sky'}
        containerStyle={styles.container}
        scrollable
      >
        <View style={{ flex: 1 }}>
          {mk118 && (
            <View style={{ marginBottom: 20 }}>
              <AddressBox
                mk={mk118}
                bip={118}
                {...{ setSelectedMk, selectedMk }}
              />
            </View>
          )}
          {mk330 ? (
            <AddressBox
              mk={mk330}
              bip={330}
              {...{ setSelectedMk, selectedMk }}
            />
          ) : (
            <Text>Loading...</Text>
          )}
        </View>

        <Button
          title="Recover"
          theme={'sapphire'}
          containerStyle={{ marginTop: 40 }}
          disabled={!stepConfirmed}
          onPress={(): void => {
            selectedMk && onPressNext(selectedMk)
          }}
        />
      </Body>
    </>
  )
}

const HeaderRight = (): ReactElement => (
  <NumberStep stepSize={3} nowStep={3} />
)

Step4Seed.navigationOptions = navigationHeaderOptions({
  theme: 'sapphire',
  headerRight: HeaderRight,
})

export default Step4Seed

const styles = StyleSheet.create({
  container: {
    paddingBottom: 50,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  addressBox: {
    padding: 20,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: '#d2d9f0',
  },
  addressBoxAddress: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e9edf8',
    marginBottom: 20,
  },
  addressBadgeBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
})
