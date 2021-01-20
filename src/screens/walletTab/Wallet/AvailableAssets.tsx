import React, { ReactElement } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import _ from 'lodash'

import {
  useAssets,
  AssetsUI,
  User,
  AvailableUI,
  VestingUI,
} from 'use-station/src'
import Loading from 'components/Loading'
import AvailableItem from './AvailableItem'
import Text from 'components/Text'
import { useApp } from 'hooks'
import {
  NavigationProp,
  useNavigation,
} from '@react-navigation/native'
import { RootStackParams } from 'types/navigation'
import color from 'styles/color'

const CoinMenu = ({
  denom,
  navigate,
  close,
}: {
  denom: string
  navigate<RouteName extends keyof RootStackParams>(
    ...args: undefined extends RootStackParams[RouteName]
      ? [RouteName] | [RouteName, RootStackParams[RouteName]]
      : [RouteName, RootStackParams[RouteName]]
  ): void
} & Modal): ReactElement => {
  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        justifyContent: 'flex-end',
      }}
    >
      <View
        style={{
          borderRadius: 18,
          backgroundColor: color.white,
          marginBottom: 20,
        }}
      >
        <TouchableOpacity
          onPress={(): void => {
            navigate('Send', { screen: 'Send', params: { denom } })
            close()
          }}
          style={{
            padding: 10,
            borderBottomColor: '#edf1f7',
            borderBottomWidth: 1,
          }}
        >
          <Text style={styles.coninMenuItemText} fontType={'medium'}>
            Send
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={(): void => {
            navigate('Swap')
            close()
          }}
          style={{ padding: 10 }}
        >
          <Text style={styles.coninMenuItemText} fontType={'medium'}>
            Swap
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          borderRadius: 18,
          backgroundColor: color.white,
        }}
      >
        <TouchableOpacity onPress={close} style={{ padding: 10 }}>
          <Text style={styles.coninMenuItemText} fontType={'medium'}>
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const AvailableList = ({
  list,
  openCoinMenu,
}: {
  openCoinMenu: ({ denom }: { denom: string }) => void
} & AvailableUI): ReactElement => {
  return (
    <View>
      {_.map(list, (item, index) => (
        <AvailableItem
          key={`AvailableList-${index}`}
          item={item}
          openCoinMenu={openCoinMenu}
        />
      ))}
    </View>
  )
}

const VestingList = ({
  list,
  openCoinMenu,
}: {
  openCoinMenu: ({ denom }: { denom: string }) => void
} & VestingUI): ReactElement => {
  return (
    <View>
      {_.map(list, (item, index) => (
        <AvailableItem
          key={`AvailableList-${index}`}
          item={item}
          openCoinMenu={openCoinMenu}
        />
      ))}
    </View>
  )
}

const WalletAddress = ({ user }: { user: User }): ReactElement => {
  const { ui, loading } = useAssets(user)
  const { modal } = useApp()
  const { navigate } = useNavigation<
    NavigationProp<RootStackParams>
  >()

  const openCoinMenu = ({ denom }: { denom: string }): void => {
    modal.open(() => CoinMenu({ denom, navigate, ...modal }))
  }

  const render = ({
    available,
    tokens,
    vesting,
  }: AssetsUI): ReactElement => (
    <>
      <View style={styles.section}>
        <Text style={styles.assetListTitle} fontType="medium">
          AVAILABLE
        </Text>
        {available && (
          <AvailableList {...available} openCoinMenu={openCoinMenu} />
        )}
        {vesting && (
          <VestingList {...vesting} openCoinMenu={openCoinMenu} />
        )}
      </View>
      <View style={styles.section}>
        <Text style={styles.assetListTitle} fontType="medium">
          TOKENS
        </Text>

        {tokens && (
          <AvailableList {...tokens} openCoinMenu={openCoinMenu} />
        )}
      </View>
    </>
  )

  return <View>{loading ? <Loading /> : ui ? render(ui) : null}</View>
}

export default WalletAddress

const styles = StyleSheet.create({
  section: { marginTop: 20 },
  assetListTitle: {
    marginBottom: 10,
  },
  coninMenuItemText: {
    paddingVertical: 18,
    textAlign: 'center',
  },
})
