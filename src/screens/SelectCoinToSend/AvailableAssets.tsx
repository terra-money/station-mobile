import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import _ from 'lodash'

import {
  useAssets,
  AssetsUI,
  User,
  AvailableUI,
  Card,
} from 'use-station/src'
import { Text, Icon } from 'components'

import AvailableItem from './AvailableItem'
import color from 'styles/color'

const AvailableList = ({
  list,
  toAddress,
}: { toAddress?: string } & AvailableUI): ReactElement => {
  return (
    <View>
      {_.map(list, (item, index) => (
        <AvailableItem
          key={`AvailableList-${index}`}
          item={item}
          toAddress={toAddress}
        />
      ))}
    </View>
  )
}

const EmptyWallet = ({ card }: { card?: Card }): ReactElement => {
  return card ? (
    <View style={styles.emptyWalletCard}>
      <View
        style={{
          flexDirection: 'row',
          marginBottom: 5,
          alignItems: 'center',
        }}
      >
        <Icon
          name={'info-outline'}
          size={20}
          color={color.sapphire}
        />
        <Text style={styles.emptyWalletCardTitle} fontType={'bold'}>
          {card.title}
        </Text>
      </View>

      <Text
        style={{ lineHeight: 21 }}
      >{`This wallet does not hold any coins.`}</Text>
    </View>
  ) : (
    <View />
  )
}

const AvailableAssets = ({
  user,
  toAddress,
}: {
  user: User
  toAddress?: string
}): ReactElement => {
  const { ui } = useAssets(user, {
    hideSmall: false,
    hideSmallTokens: false,
  })

  const render = ({
    available,
    tokens,
    vesting,
    card,
  }: AssetsUI): ReactElement => {
    return tokens || available || vesting ? (
      <>
        <View style={styles.section}>
          {(available || vesting) && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}
            >
              <Text style={styles.assetListTitle} fontType="medium">
                AVAILABLE
              </Text>
            </View>
          )}
          {available && (
            <AvailableList {...available} toAddress={toAddress} />
          )}
        </View>
        {tokens && (
          <View style={styles.section}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}
            >
              <Text style={styles.assetListTitle} fontType="medium">
                TOKENS
              </Text>
            </View>
            <AvailableList {...tokens} toAddress={toAddress} />
          </View>
        )}
      </>
    ) : (
      <EmptyWallet card={card} />
    )
  }

  return <>{ui ? render(ui) : null}</>
}

export default AvailableAssets

const styles = StyleSheet.create({
  section: { marginBottom: 20 },
  assetListTitle: {
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 0,
  },
  emptyWalletCard: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowRadius: 35,
    shadowOpacity: 1,
  },
  emptyWalletCardTitle: {
    marginLeft: 7,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
    color: color.sapphire,
  },
})
