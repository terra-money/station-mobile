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
import { useNavigation } from '@react-navigation/native'

const CoinMenu = ({
  symbol,
  navigate,
  close,
}: {
  symbol: string
  navigate: (...args: any) => void
} & Modal): ReactElement => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-end',
      }}
    >
      <View style={{ backgroundColor: 'green', padding: 20 }}>
        <TouchableOpacity
          onPress={(): void => {
            navigate('Send', { symbol })
            close()
          }}
          style={{ backgroundColor: 'white', padding: 10 }}
        >
          <Text>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={(): void => {
            navigate('Swap', { symbol })
            close()
          }}
          style={{ backgroundColor: 'white', padding: 10 }}
        >
          <Text>Swap</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={close}
          style={{ backgroundColor: 'white', padding: 10 }}
        >
          <Text>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const AvailableList = ({
  list,
  openCoinMenu,
}: {
  openCoinMenu: ({ symbol }: { symbol: string }) => void
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
  openCoinMenu: ({ symbol }: { symbol: string }) => void
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
  const { navigate } = useNavigation()

  const openCoinMenu = ({ symbol }: { symbol: string }): void => {
    modal.open(() => CoinMenu({ symbol, navigate, ...modal }))
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
})
