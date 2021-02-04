import React, { ReactElement } from 'react'
import { View, StyleSheet } from 'react-native'
import _ from 'lodash'

import { StakingPersonal, User } from 'use-station/src'

import { Button, Number, Text } from 'components'
import color from 'styles/color'
import { useWithdraw } from 'hooks/useWithdraw'

const Rewards = ({
  personal,
  user,
}: {
  personal: StakingPersonal
  user: User
}): ReactElement => {
  const { rewards, withdrawAll } = personal

  const { runWithdraw } = useWithdraw({
    user,
    amounts: withdrawAll.amounts,
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
        {_.map(rewards.table?.contents, (content, i) => {
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
