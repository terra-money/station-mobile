import React, { ReactElement } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import _ from 'lodash'

import { format, StakingData } from 'lib'

import { Number, Text } from 'components'
import { COLOR } from 'consts'
import images from 'assets/images'
import { Validator } from '@terra-money/terra.js'
import { calcUnbondingsTotal, flattenUnbondings } from '../../qureys/staking'
import FastImagePlaceholder from '../../components/FastImagePlaceholder'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { RootStackParams } from 'types/navigation'

const Rewards = ({
  personal,
  findMoniker,
}: {
  personal: StakingData
  findMoniker: ({ address }: { address: string }) => Validator | undefined
}): ReactElement => {
  const { navigate } =
    useNavigation<NavigationProp<RootStackParams>>()

  const { unbondings } = personal
  const undelegationTotal = calcUnbondingsTotal(unbondings)
  const unbondingList = flattenUnbondings(unbondings)

  return unbondingList?.length ? (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle} fontType={'medium'}>
          {'Undelegated'}
        </Text>
        {
          (undelegationTotal && undelegationTotal !== 'NaN') && (
            <Number
              numberFontStyle={{ fontSize: 20, textAlign: 'left' }}
              decimalFontStyle={{ fontSize: 15 }}
              {
                ...format.display({
                  amount: undelegationTotal,
                  denom: 'uluna'
                })
              }
              unit="Luna"
              fontType={'medium'}
            />
          )
        }
      </View>
      <View style={{ marginBottom: 10 }}>
        {unbondingList?.length && _.map(unbondingList, (item, i) => {
          const moniker = findMoniker({ address: item?.validator_address })
          return (
            <TouchableOpacity
              onPress={(): void =>
                navigate('ValidatorDetail', {
                  address: item?.validator_address,
                })
              }
              key={`undelegated.table.contents-${i}`}
            >
              <View
                style={styles.itemBox}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    maxWidth: '50%',
                  }}
                >
                  <FastImagePlaceholder
                    source={moniker?.picture
                      ? { uri: moniker.picture }
                      : images.terra}
                    style={styles.profileImage}
                    placeholder={images.loading_circle}
                  />
                  <Text>{moniker?.description?.moniker}</Text>
                </View>
                <View style={{ alignItems: 'flex-end', flex: 1 }}>
                  <Number
                    numberFontStyle={{ fontSize: 14 }}
                    decimalFontStyle={{ fontSize: 10.5 }}
                    {
                      ...format.display({
                        amount: item?.initial_balance.toString(),
                        denom: 'uluna'
                      })
                    }
                  />
                  <Text
                    style={{ fontSize: 10.5, marginTop: 5 }}
                    fontType="medium"
                  >
                    Release time
                  </Text>
                  <Text style={{ fontSize: 10.5 }}>
                    {format.date(item?.completion_time)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  ) : (
    <View></View>
  )
}

export default Rewards

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    paddingTop: 20,
    backgroundColor: COLOR.white,
    borderRadius: 20,
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowRadius: 35,
    shadowOpacity: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0,
  },
  itemBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopColor: '#edf1f7',
    borderTopWidth: 1,
  },
  profileImage: {
    borderRadius: 12,
    width: 24,
    height: 24,
    marginRight: 5,
  },
})
