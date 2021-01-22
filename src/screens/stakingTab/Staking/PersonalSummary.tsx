import React, { ReactElement } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'

import { StakingPersonal } from 'use-station/src'

import { Button, Icon, Number, Text } from 'components'
import color from 'styles/color'
import {
  NavigationProp,
  useNavigation,
} from '@react-navigation/native'
import { RootStackParams } from 'types'

const NotStaked = (): ReactElement => {
  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle} fontType={'bold'}>
          Staking rewards
        </Text>
      </View>
      <Text>
        {
          "You haven't staked any assets yet. Stake your Luna and stack up rewards."
        }
      </Text>
    </>
  )
}

const PersonalSummary = ({
  personal,
}: {
  personal: StakingPersonal
}): ReactElement => {
  const {
    delegated,
    undelegated,
    rewards,
    myDelegations,
    myRewards,
    withdrawAll,
  } = personal
  const { navigate } = useNavigation<
    NavigationProp<RootStackParams>
  >()

  return (
    <View style={styles.container}>
      {myDelegations || myRewards ? (
        <>
          <View style={styles.header}>
            <Text style={styles.headerTitle} fontType={'bold'}>
              Summary
            </Text>
            <TouchableOpacity
              onPress={(): void => {
                navigate('StakingPersonal')
              }}
            >
              <Icon
                name={'arrow-forward'}
                color={color.sapphire}
                size={24}
              />
            </TouchableOpacity>
          </View>
          <View style={{ marginBottom: 10 }}>
            {rewards && (
              <View style={styles.itemBox}>
                <Text>{rewards.title}</Text>
                <Number
                  numberFontStyle={{ fontSize: 14 }}
                  {...rewards.display}
                  estimated
                />
              </View>
            )}
            {delegated && (
              <View style={styles.itemBox}>
                <Text>{delegated.title}</Text>
                <Number
                  numberFontStyle={{ fontSize: 14 }}
                  {...delegated.display}
                />
              </View>
            )}
            {undelegated && undelegated.table && (
              <View style={styles.itemBox}>
                <Text>{undelegated.title}</Text>
                <Number
                  numberFontStyle={{ fontSize: 14 }}
                  {...undelegated.display}
                />
              </View>
            )}
          </View>

          <Button title={withdrawAll.attrs.children} theme={'gray'} />
        </>
      ) : (
        <NotStaked />
      )}
    </View>
  )
}

export default PersonalSummary

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: color.white,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
    marginBottom: 20,
  },
  itemBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
})
