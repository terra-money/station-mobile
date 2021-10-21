import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import _ from 'lodash'

import { useAssets, AssetsUI, User, Card, AvailableItem } from 'lib'
import { Text, Icon } from 'components'

import AssetItem from '../../components/wallet/AssetItem'

import { COLOR } from 'consts'

const AvailableList = ({
  list,
  toAddress,
}: {
  toAddress?: string
  list: AvailableItem[]
}): ReactElement => {
  return (
    <View>
      {_.map(list, (item, index) => (
        <AssetItem
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
          color={COLOR.primary._02}
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
  })

  const render = ({
    available,
    ibc,
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
                {available?.title}
              </Text>
            </View>
          )}
          {available && (
            <AvailableList {...available} toAddress={toAddress} />
          )}
        </View>
        {ibc && (
          <View style={styles.section}>
            <View style={{ marginBottom: 10 }}>
              <Text style={styles.assetListTitle} fontType="bold">
                {ibc.title}
              </Text>
            </View>
            <AvailableList {...ibc} toAddress={toAddress} />
          </View>
        )}
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
                {tokens.title}
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
  section: { marginBottom: 10 },
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
    color: COLOR.primary._02,
  },
})
