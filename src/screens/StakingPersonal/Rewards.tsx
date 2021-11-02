import React, { ReactElement, useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import _ from 'lodash'

import { format, StakingPersonal, User } from 'lib'

import { Button, Number, Text } from 'components'
import { COLOR } from 'consts'
import { useWithdraw } from 'hooks/useWithdraw'
import useLCD from 'hooks/useLCD'
import { getTraceDenom } from 'hooks/useDenomTrace'

type RewardContents = { unit: string; value: string }

const Rewards = ({
  personal,
  user,
}: {
  personal: StakingPersonal
  user: User
}): ReactElement => {
  const lcd = useLCD()
  const { rewards, withdrawAll } = personal

  // Parse IBC Token
  const [rewardContents, setRewardsContents] = useState<
    RewardContents[]
  >([])
  useEffect(() => {
    const promises = _.map(rewards.table?.contents, async (item) => {
      return {
        unit: item.unit.includes('ibc/')
          ? format.denom(await getTraceDenom(lcd, item.unit))
          : item.unit,
        value: item.value,
      }
    })

    const ret: RewardContents[] = []
    promises
      .reduce(async (prev, next) => {
        await prev
        ret.push(await next)
      }, Promise.resolve())
      .then(() => {
        setRewardsContents(ret)
      })

    return (): void => {
      setRewardsContents([])
    }
  }, [rewards])

  const { runWithdraw } = useWithdraw({
    user,
    amounts: withdrawAll.amounts,
    validators: withdrawAll.validators,
  })
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle} fontType={'medium'}>
          {rewards.title}
        </Text>
        <Number
          numberFontStyle={{ fontSize: 20, textAlign: 'left' }}
          decimalFontStyle={{ fontSize: 15 }}
          {...rewards.display}
          estimated
          fontType={'medium'}
        />
      </View>
      <View style={{ marginBottom: 8 }}>
        {_.map(rewardContents, (content, i) => {
          return (
            <View
              key={`rewards.table.contents-${i}`}
              style={styles.itemBox}
            >
              <Text style={{ paddingRight: 20 }}>{content.unit}</Text>
              <Number
                numberFontStyle={{ fontSize: 14 }}
                decimalFontStyle={{ fontSize: 10.5 }}
              >
                {content.value}
              </Number>
            </View>
          )
        })}
      </View>
      <View style={{ paddingHorizontal: 20 }}>
        <Button
          title={withdrawAll.attrs.children}
          disabled={withdrawAll.attrs.disabled}
          theme={'gray'}
          onPress={(): void => {
            runWithdraw()
          }}
          size="sm"
        />
      </View>
    </View>
  )
}

export default Rewards

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    paddingVertical: 20,
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
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopColor: '#edf1f7',
    borderTopWidth: 1,
  },
})
