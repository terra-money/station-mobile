import React, { ReactElement } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native'
import {
  CardStyleInterpolators,
  StackNavigationOptions,
} from '@react-navigation/stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  NavigationProp,
  useNavigation,
} from '@react-navigation/native'

import { COLOR } from 'consts'

import { useMenu, User, useTxs, TxsUI } from 'lib'

import ErrorComponent from 'components/ErrorComponent'
import HistoryItem from 'components/history/HistoryItem'
import WithAuth from 'components/layout/WithAuth'
import { Text, Icon, Loading } from 'components'

import { RootStackParams } from 'types'

const RenderList = ({ ui }: { ui: TxsUI }): ReactElement => {
  const { History: title } = useMenu()
  const { goBack } = useNavigation<NavigationProp<RootStackParams>>()

  const insets = useSafeAreaInsets()

  return (
    <View
      style={{
        height: '100%',
        backgroundColor: 'white',
        paddingBottom: insets.bottom,
      }}
    >
      <View style={styles.container}>
        <View style={styles.historyTitleBox}>
          <View
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Text style={styles.historyTitle} fontType={'bold'}>
              {title}
            </Text>
          </View>

          <TouchableOpacity onPress={goBack}>
            <Icon
              name={'close'}
              color={COLOR.primary._02}
              size={28}
            />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        style={{ flex: 1, backgroundColor: 'white' }}
        onEndReached={(): void => {
          ui.more?.()
        }}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        data={ui.list}
        keyExtractor={(item, index): string => `${index}`}
        renderItem={({ item, index }): ReactElement => (
          <View
            key={`history-${index}`}
            style={styles.historyItemBox}
          >
            <HistoryItem item={item} />
          </View>
        )}
        ListFooterComponent={
          <>
            {ui.more && (
              <View style={{ height: 40 }}>
                <Loading />
              </View>
            )}
          </>
        }
        ListEmptyComponent={
          ui.card && (
            <View
              style={{
                paddingVertical: 20,
                alignItems: 'flex-start',
                flexDirection: 'row',
                flexShrink: 1,
              }}
            >
              <Icon name="info" color={COLOR.primary._02} size={40} />
              <View style={{ paddingLeft: 10, flex: 1 }}>
                <Text style={{ fontSize: 16 }} fontType={'bold'}>
                  {ui.card.title}
                </Text>
                <Text style={{ fontSize: 13, lineHeight: 20 }}>
                  {ui.card.content}
                </Text>
              </View>
            </View>
          )
        }
      />
    </View>
  )
}

const History = ({ user }: { user: User }): ReactElement => {
  const { error, ui } = useTxs(user)

  return error ? (
    <ErrorComponent />
  ) : ui ? (
    <RenderList {...{ ui }} />
  ) : (
    <View />
  )
}

const WalletHistory = (): ReactElement => {
  const insets = useSafeAreaInsets()

  return (
    <View style={{ marginTop: insets.top }}>
      <WithAuth>
        {(user): ReactElement => <History user={user} />}
      </WithAuth>
    </View>
  )
}

const navigationOptions: StackNavigationOptions = {
  headerShown: false,
  cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
}

WalletHistory.navigationOptions = navigationOptions

export default WalletHistory

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowRadius: 35,
    shadowOpacity: 1,
    backgroundColor: 'white',
    borderColor: '#eeeeee',
    borderWidth: 1,
  },
  historyTitleBox: {
    paddingHorizontal: 20,
    borderBottomColor: '#edf1f7',
    borderBottomWidth: 1,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyTitle: {
    fontSize: 15,
  },
  historyItemBox: {
    paddingVertical: 15,
  },
})
