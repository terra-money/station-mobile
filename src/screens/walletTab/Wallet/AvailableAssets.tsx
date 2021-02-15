import React, { ReactElement, useEffect } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import _ from 'lodash'
import { StackScreenProps } from '@react-navigation/stack'

import { RootStackParams } from 'types'
import {
  useAssets,
  AssetsUI,
  User,
  AvailableUI,
  VestingUI,
  Card,
} from 'use-station/src'
import { Text, Icon } from 'components'

import AvailableItem from './AvailableItem'
import VestingItem from './VestingItem'
import color from 'styles/color'
import Preferences, {
  PreferencesEnum,
} from 'nativeModules/preferences'

type Props = StackScreenProps<RootStackParams, 'Wallet'>

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

      <Text style={{ lineHeight: 21 }}>{card.content}</Text>
    </View>
  ) : (
    <View />
  )
}

const WalletAddress = ({
  user,
  navigation,
  localHideSmall,
  setlocalHideSmall,
  localHideSmallTokens,
}: {
  user: User
  localHideSmall: boolean
  setlocalHideSmall: (value: boolean) => void
  localHideSmallTokens: boolean
} & Props): ReactElement => {
  const { ui, execute, setHideSmall } = useAssets(user, {
    hideSmall: localHideSmall,
    hideSmallTokens: localHideSmallTokens,
  })

  // If list length is 0 on hiding small-balance-assets, then show small-balance-assets.
  useEffect(() => {
    if (
      localHideSmall &&
      ui?.available?.list &&
      ui.available.list.length < 1
    ) {
      setHideSmall(false)
      setlocalHideSmall(false)
    }
  }, [ui?.available])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      execute()
    })
    return unsubscribe
  }, [])

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
              {available && (
                <TouchableOpacity
                  onPress={async (): Promise<void> => {
                    Preferences.setBool(
                      PreferencesEnum.walletHideSmall,
                      !available.hideSmall.checked
                    )
                    available.hideSmall.toggle()
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text style={styles.hideSmallLabel}>
                    {available.hideSmall.label}
                  </Text>
                  <View style={styles.hideSmallCheckBox}>
                    {available.hideSmall.checked && (
                      <View
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 1,
                          backgroundColor: '#0c3694',
                        }}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              )}
            </View>
          )}
          {available && <AvailableList {...available} />}
          {vesting && <VestingList {...vesting} />}
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
              <TouchableOpacity
                onPress={async (): Promise<void> => {
                  Preferences.setBool(
                    PreferencesEnum.walletHideSmallTokens,
                    !tokens.hideSmall.checked
                  )
                  tokens.hideSmall.toggle()
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Text style={styles.hideSmallLabel}>
                  {tokens.hideSmall.label}
                </Text>
                <View style={styles.hideSmallCheckBox}>
                  {tokens.hideSmall.checked && (
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 1,
                        backgroundColor: '#0c3694',
                      }}
                    />
                  )}
                </View>
              </TouchableOpacity>
            </View>
            <AvailableList {...tokens} />
          </View>
        )}
      </>
    ) : (
      <EmptyWallet card={card} />
    )
  }

  return <>{ui ? render(ui) : null}</>
}

export default WalletAddress

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
  hideSmallLabel: {
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 0,
  },
  hideSmallCheckBox: {
    marginHorizontal: 5,
    width: 16,
    height: 16,
    borderRadius: 2,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#cfd8ea',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
