import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import _ from 'lodash'

import { TxsUI, TxType, useMenu, User, useTxs } from 'use-station/src'

import ErrorComponent from 'components/ErrorComponent'
import Text from 'components/Text'
import HistoryItem from 'components/history/HistoryItem'
import { HistoryModalButton } from 'components/modal/HistoryModal'

const RenderList = ({ ui }: { ui: TxsUI }): ReactElement => {
  const { History: title } = useMenu()
  const { list } = ui

  return (
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

      <HistoryModalButton />
    </View>
  )
}

const History = ({ user }: { user: User }): ReactElement => {
  const params = { type: '' as TxType, page: 1 }
  const { error, ui } = useTxs(user, params)

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
