import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import _ from 'lodash'

import {
  useAssets,
  AssetsUI,
  User,
  AvailableUI,
  VestingUI,
} from 'use-station/src'
import AvailableItem from './AvailableItem'
import { Text, Loading } from 'components'

const AvailableList = ({ list }: AvailableUI): ReactElement => {
  return (
    <View>
      {_.map(list, (item, index) => (
        <AvailableItem key={`AvailableList-${index}`} item={item} />
      ))}
    </View>
  )
}

const VestingList = ({ list }: VestingUI): ReactElement => {
  return (
    <View>
      {_.map(list, (item, index) => (
        <AvailableItem key={`AvailableList-${index}`} item={item} />
      ))}
    </View>
  )
}

const WalletAddress = ({ user }: { user: User }): ReactElement => {
  const { ui, loading } = useAssets(user)

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
        {available && <AvailableList {...available} />}
        {vesting && <VestingList {...vesting} />}
      </View>
      <View style={styles.section}>
        <Text style={styles.assetListTitle} fontType="medium">
          TOKENS
        </Text>

        {tokens && <AvailableList {...tokens} />}
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
