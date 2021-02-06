import React, { ReactElement, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import _ from 'lodash'
import { StackScreenProps } from '@react-navigation/stack'

import { RootStackParams } from 'types'
import { TxsUI, TxType, useMenu, User, useTxs } from 'use-station/src'

import HistoryItem from 'components/history/HistoryItem'
import { Text, ErrorComponent, Button } from 'components'
import { useNavigation } from '@react-navigation/native'

type Props = StackScreenProps<RootStackParams, 'Wallet'>

const RenderList = ({ ui }: { ui: TxsUI }): ReactElement => {
  const { History: title } = useMenu()
  const { list } = ui
  const { navigate } = useNavigation()

  return list ? (
    <View style={styles.container}>
      <View style={styles.historyTitleBox}>
        <Text style={styles.historyTitle} fontType={'bold'}>
          {title}
        </Text>
      </View>

      {_.map(list?.slice(0, 3), (item, index) => (
        <View key={`history-${index}`} style={styles.historyItemBox}>
          <HistoryItem item={item} />
        </View>
      ))}

      <Button
        title={'More'}
        onPress={(): void => {
          navigate('WalletHistory')
        }}
        theme="gray"
        size="sm"
      />
    </View>
  ) : (
    <View />
  )
}

const History = ({
  user,
  navigation,
}: { user: User } & Props): ReactElement => {
  const params = { type: '' as TxType, page: 1 }
  const { error, ui, execute } = useTxs(user, params)

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      execute()
    })
    return unsubscribe
  }, [])

  return error ? (
    <ErrorComponent />
  ) : ui ? (
    <RenderList ui={ui} />
  ) : (
    <View />
  )
}

export default History

const styles = StyleSheet.create({
  container: {
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
    marginBottom: 20,
  },
  historyTitleBox: {
    borderBottomColor: '#edf1f7',
    borderBottomWidth: 1,
    paddingBottom: 20,
    marginBottom: 15,
  },
  historyTitle: {
    fontSize: 15,
  },
  historyItemBox: {
    paddingBottom: 30,
  },
})
