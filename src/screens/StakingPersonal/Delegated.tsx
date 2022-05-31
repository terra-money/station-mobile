import React, { ReactElement } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import _ from 'lodash'

import { format, StakingData } from 'lib'

import { Number, Text } from 'components'
import { COLOR } from 'consts'
import images from 'assets/images'
import { calcDelegationsTotal } from '../../qureys/staking'
import { Validator } from '@terra-money/terra.js'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { RootStackParams } from 'types/navigation'
import FastImagePlaceholder from '../../components/FastImagePlaceholder'

const Delegated = ({
  personal,
  findMoniker,
}: {
  personal: StakingData
  findMoniker: ({ address }: { address: string }) => Validator | undefined
}): ReactElement => {
  const { navigate } =
    useNavigation<NavigationProp<RootStackParams>>()

  const { delegations } = personal
  const delegationTotal = calcDelegationsTotal(delegations)

  return delegations?.length ? (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle} fontType={'medium'}>
          {'Delegated'}
        </Text>
        <Number
          numberFontStyle={{ fontSize: 20, textAlign: 'left' }}
          decimalFontStyle={{ fontSize: 15 }}
          {
            ...format.display({
              amount: delegationTotal,
              denom: 'uluna'
            })
          }
          unit="Luna"
          fontType={'medium'}
        />
      </View>
      <View
        style={{
          marginBottom: 5,
          paddingTop: 20,
          borderTopColor: '#edf1f7',
          borderTopWidth: 1,
        }}
      >
        {_.map(delegations, (item, i) => {
          const moniker = findMoniker({ address: item?.validator_address })
          return (
            <TouchableOpacity
              onPress={(): void =>
                navigate('ValidatorDetail', {
                  address: item?.validator_address,
                })
              }
              key={`delegated.table.contents-${i}`}
            >
              <View
                style={styles.itemBox}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingRight: 20,
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

                <Number
                  numberFontStyle={{ fontSize: 14 }}
                  decimalFontStyle={{ fontSize: 10.5 }}
                  {
                    ...format.display(item?.balance)
                  }
                />
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

export default Delegated

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
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  profileImage: {
    borderRadius: 12,
    width: 24,
    height: 24,
    marginRight: 5,
  },
})
