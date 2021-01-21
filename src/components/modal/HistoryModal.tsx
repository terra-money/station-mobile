import React, { ReactElement, useEffect, useState } from 'react'
import {
  Modal,
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
} from 'use-station/src'

import ErrorComponent from 'components/ErrorComponent'
import Icon from 'components/Icon'
import Text from 'components/Text'
import HistoryItem from 'components/history/HistoryItem'
import Button from 'components/Button'
import WithAuth from 'components/layout/WithAuth'
import LoadingIcon from 'components/LoadingIcon'
import color from 'styles/color'

const RenderList = ({
  tsUiList,
  isLastPage,
  setPage,
  closeModal,
}: {
  tsUiList: TxUI[]
  isLastPage: boolean
  setPage: React.Dispatch<React.SetStateAction<number>>
  closeModal: () => void
}): ReactElement => {
  const { History: title } = useMenu()
  return (
    <View style={styles.container}>
      <View style={styles.historyTitleBox}>
        <Text style={styles.historyTitle} fontType={'bold'}>
          {title}
        </Text>
        <TouchableOpacity onPress={closeModal}>
          <Icon name={'clear'} color={color.sapphire} size={32} />
        </TouchableOpacity>
      </View>
      <FlatList
        onEndReached={(): void => {
          if (isLastPage) {
            return
          }

          setPage((ori) => ori + 1)
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
  const [page, setPage] = useState(1)
  const params = { type: '' as TxType, page }
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
    setIsLastPage(page >= total)
  }

  useEffect(() => {
    if (loading) {
      return
    }
    if (ui) {
      checkIsLastPage({ pagination: ui.pagination })
      setTsUiList((ori) => ori.concat(ui.list || []))
    }
  }, [loading])

  return error ? (
    <ErrorComponent />
  ) : ui ? (
    <RenderList {...{ tsUiList, isLastPage, setPage, closeModal }} />
  ) : (
    <View />
  )
}

export const HistoryModalButton = (): ReactElement => {
  const [showModal, setShowModal] = useState(false)

  const closeModal = (): void => {
    setShowModal(false)
  }

  return (
    <>
      <Button
        theme={'gray'}
        title={'More'}
        onPress={(): void => {
          setShowModal(true)
        }}
      />
      <Modal
        visible={showModal}
        onRequestClose={(): void => setShowModal(false)}
        transparent
      >
        <WithAuth>
          {(user): ReactElement => (
            <History user={user} closeModal={closeModal} />
          )}
        </WithAuth>
      </Modal>
    </>
  )
}

export default History

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    borderRadius: 20,
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
})
