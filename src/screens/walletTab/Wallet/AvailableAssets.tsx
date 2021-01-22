import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import _ from 'lodash'

import {
  useAssets,
  AssetsUI,
  User,
  AvailableUI,
  VestingUI,
  Card,
} from 'use-station/src'
import { Text, Loading, Icon } from 'components'

import AvailableItem from './AvailableItem'
import VestingItem from './VestingItem'
import color from 'styles/color'

const AvailableList = ({ list }: AvailableUI): ReactElement => {
  return (
    <View>
      {_.map(list, (item, index) => (
        <AvailableItem key={`AvailableList-${index}`} item={item} />
      ))}
    </View>
  )
}

const VestingList = ({ list, title }: VestingUI): ReactElement => {
  return (
    <View>
      {_.map(list, (item, index) => (
        <VestingItem
          key={`VestingList-${index}`}
          item={item}
          title={title}
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

      <Text>{card.content}</Text>
    </View>
  ) : (
    <View />
  )
}

const WalletAddress = ({ user }: { user: User }): ReactElement => {
  const { ui, loading } = useAssets(user)

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
            <Text style={styles.assetListTitle} fontType="medium">
              AVAILABLE
            </Text>
          )}
          {available && <AvailableList {...available} />}
          {vesting && <VestingList {...vesting} />}
        </View>
        {tokens && (
          <View style={styles.section}>
            <Text style={styles.assetListTitle} fontType="medium">
              TOKENS
            </Text>

            <AvailableList {...tokens} />
          </View>
        )}
      </>
    ) : (
      <EmptyWallet card={card} />
    )
  }

  return <View>{loading ? <Loading /> : ui ? render(ui) : null}</View>
}

export default WalletAddress

const styles = StyleSheet.create({
  section: { marginBottom: 20 },
  assetListTitle: {
    marginBottom: 10,
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
