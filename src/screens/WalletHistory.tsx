import React, { ReactElement, useState } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native'
import _ from 'lodash'
import {
  CardStyleInterpolators,
  StackNavigationOptions,
} from '@react-navigation/stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  NavigationProp,
  useNavigation,
} from '@react-navigation/native'

import {
  TxType,
  useMenu,
  User,
  useTxs,
  useTxTypes,
  TxsUI,
} from 'use-station/src'

import ErrorComponent from 'components/ErrorComponent'
import HistoryItem from 'components/history/HistoryItem'
import WithAuth from 'components/layout/WithAuth'
import { Text, Icon, LoadingIcon, Selector } from 'components'

import color from 'styles/color'
import { RootStackParams } from 'types'

const RenderList = ({
  ui,
  type,
  setType,
}: {
  ui: TxsUI
  type: TxType
  setType: React.Dispatch<React.SetStateAction<TxType>>
}): ReactElement => {
  const tabs = useTxTypes()
  const { History: title } = useMenu()
  const selectedTab = tabs.find((x) => x.key === type)
  const { goBack } = useNavigation<NavigationProp<RootStackParams>>()
  const onSelectTab = (value: TxType): void => {
    setType(value)
  }
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
            <Selector
              containerStyle={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
              display={
                <>
                  <Text
                    style={styles.selectedTabLabel}
                    fontType={'medium'}
                  >
                    {selectedTab?.label.toUpperCase()}
                  </Text>
                  <Icon
                    name={'tune'}
                    size={15}
                    color={color.sapphire}
                  />
                </>
              }
              selectedValue={selectedTab?.key || ''}
              list={_.map(tabs, (item) => ({
                label: item.label,
                value: item.key,
              }))}
              onSelect={onSelectTab}
            />
          </View>

          <TouchableOpacity onPress={goBack}>
            <Icon name={'close'} color={color.sapphire} size={28} />
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
                <LoadingIcon />
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
              <Icon name="info" color={color.sapphire} size={40} />
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

const History = ({
  user,
  type,
  setType,
}: {
  user: User
  type: TxType
  setType: React.Dispatch<React.SetStateAction<TxType>>
}): ReactElement => {
  const { error, ui } = useTxs(user, { type })

  return error ? (
    <ErrorComponent />
  ) : ui ? (
    <RenderList {...{ ui, type, setType }} />
  ) : (
    <View />
  )
}

const WalletHistory = (): ReactElement => {
  const insets = useSafeAreaInsets()
  const [type, setType] = useState<TxType>('')

  return (
    <View style={{ marginTop: insets.top }}>
      <WithAuth>
        {(user): ReactElement => (
          <History key={type} user={user} {...{ type, setType }} />
        )}
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
  selectedTabLabel: {
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 0,
    paddingLeft: 10,
    paddingRight: 7,
  },
})
