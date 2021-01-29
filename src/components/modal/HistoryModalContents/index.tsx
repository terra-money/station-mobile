import React, { ReactElement, useEffect, useState } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native'
import _ from 'lodash'

import {
  TxUI,
  TxType,
  useMenu,
  User,
  useTxs,
  ceil,
  div,
  Pagination,
  useTxTypes,
} from 'use-station/src'

import ErrorComponent from 'components/ErrorComponent'
import HistoryItem from 'components/history/HistoryItem'
import WithAuth from 'components/layout/WithAuth'
import { Text, Icon, LoadingIcon, Selector } from 'components'

import color from 'styles/color'
import layout from 'styles/layout'
import { BaseModalButton } from '../BaseModal'

const RenderList = ({
  tsUiList,
  isLastPage,
  params,
  setParams,
  closeModal,
}: {
  tsUiList: TxUI[]
  isLastPage: boolean
  params: {
    type: TxType
    page: number
  }
  setParams: React.Dispatch<
    React.SetStateAction<{
      type: TxType
      page: number
    }>
  >
  closeModal: () => void
}): ReactElement => {
  const tabs = useTxTypes()
  const { History: title } = useMenu()
  const selectedTab = tabs.find((x) => x.key === params.type)

  const onSelectTab = (value: TxType): void => {
    setParams({
      type: value,
      page: 1,
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.historyTitleBox}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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

        <TouchableOpacity onPress={closeModal}>
          <Icon name={'clear'} color={color.sapphire} size={32} />
        </TouchableOpacity>
      </View>
      <FlatList
        onEndReached={(): void => {
          if (isLastPage) {
            return
          }

          setParams((ori) => {
            const newParam = _.clone(ori)
            newParam.page += 1
            return newParam
          })
        }}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        data={tsUiList}
        keyExtractor={(_, index): string => `${index}`}
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
            {isLastPage === false && (
              <View style={{ height: 40 }}>
                <LoadingIcon />
              </View>
            )}
          </>
        }
      />
    </View>
  )
}

const History = ({
  user,
  closeModal,
}: {
  user: User
  closeModal: () => void
}): ReactElement => {
  const [params, setParams] = useState({
    type: '' as TxType,
    page: 1,
  })
  const { error, ui, loading } = useTxs(user, params)
  const [isLastPage, setIsLastPage] = useState(false)
  const [tsUiList, setTsUiList] = useState<TxUI[]>([])
  const checkIsLastPage = ({
    pagination,
  }: {
    pagination: Pagination
  }): void => {
    const total = _.toNumber(
      ceil(div(pagination.totalCnt, pagination.limit))
    )
    setIsLastPage(params.page >= total)
  }

  useEffect(() => {
    if (loading) {
      return
    }
    if (ui) {
      checkIsLastPage({ pagination: ui.pagination })
      setTsUiList((ori) =>
        ui.pagination.page === 1
          ? ui.list || []
          : ori.concat(ui.list || [])
      )
    }
  }, [loading])

  useEffect(() => {
    return (): void => {
      setIsLastPage(true)
      setTsUiList([])
    }
  }, [])

  return error ? (
    <ErrorComponent />
  ) : ui ? (
    <RenderList
      {...{ tsUiList, isLastPage, params, setParams, closeModal }}
    />
  ) : (
    <View />
  )
}

export const HistoryModalButton = (): ReactElement => {
  return (
    <BaseModalButton
      contents={({ closeModal }): ReactElement => (
        <WithAuth>
          {(user): ReactElement => (
            <History user={user} closeModal={closeModal} />
          )}
        </WithAuth>
      )}
    />
  )
}

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
    height: layout.windowHeight,
    borderColor: '#eeeeee',
    borderWidth: 1,
    marginBottom: 20,
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
