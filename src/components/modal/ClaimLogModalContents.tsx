import React, { ReactElement, useEffect, useState } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native'
import _ from 'lodash'

import {
  ceil,
  div,
  Pagination,
  useClaims,
  ClaimContent,
} from 'use-station/src'

import ErrorComponent from 'components/ErrorComponent'
import { Text, Icon, LoadingIcon, Number, ExtLink } from 'components'

import color from 'styles/color'
import layout from 'styles/layout'
import { BaseModalButton } from './BaseModal'
import { getDateYMD } from 'utils/date'

const RenderList = ({
  title,
  contentList,
  isLastPage,
  setPage,
  closeModal,
}: {
  title: string
  contentList: ClaimContent[]
  isLastPage: boolean
  setPage: React.Dispatch<React.SetStateAction<number>>
  closeModal: () => void
}): ReactElement => {
  return (
    <View style={styles.container}>
      <View style={styles.TitleBox}>
        <Text style={styles.Title} fontType={'bold'}>
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
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
        }}
        data={contentList}
        keyExtractor={(_, index): string => `${index}`}
        renderItem={({ item, index }): ReactElement => (
          <View key={`contents-${index}`} style={styles.content}>
            <Text style={styles.contentType} fontType={'medium'}>
              {item.type}
            </Text>
            <View style={styles.contentRight}>
              <View>
                {_.map(item.displays, (display, j) => {
                  return (
                    <Number
                      key={`displays-${j}`}
                      {...display}
                      numberFontStyle={styles.contentNumber}
                    />
                  )
                })}
              </View>

              <Text style={styles.contentDate}>
                {getDateYMD(item.date)}
              </Text>

              <View style={styles.contentLink}>
                <ExtLink
                  url={item.link}
                  title={
                    <Icon
                      size={24}
                      color={'#d8d8d8'}
                      name={'open-in-new'}
                    />
                  }
                  textStyle={{
                    fontSize: 10,
                  }}
                />
              </View>
            </View>
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

const Claims = ({
  address,
  closeModal,
}: {
  address: string
  closeModal: () => void
}): ReactElement => {
  const [page, setPage] = useState(1)
  const { title, ui, loading, error } = useClaims(address, {
    page,
  })

  const [isLastPage, setIsLastPage] = useState(false)
  const [contentList, setContentList] = useState<ClaimContent[]>([])

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
      setContentList((ori) => ori.concat(ui.table?.contents || []))
    }
  }, [loading])

  useEffect(() => {
    return (): void => {
      setIsLastPage(true)
      setContentList([])
    }
  }, [])

  return error ? (
    <ErrorComponent />
  ) : ui ? (
    <RenderList
      {...{ title, contentList, isLastPage, setPage, closeModal }}
    />
  ) : (
    <View />
  )
}

export const ClaimLogModalButton = ({
  address,
}: {
  address: string
}): ReactElement => {
  return (
    <BaseModalButton
      contents={({ closeModal }): ReactElement => (
        <Claims address={address} closeModal={closeModal} />
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
  TitleBox: {
    paddingHorizontal: 20,
    borderBottomColor: '#edf1f7',
    borderBottomWidth: 1,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  Title: {
    fontSize: 15,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  contentRight: {
    flexDirection: 'row',
  },
  contentType: {
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0,
  },
  contentNumber: {
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: -0.5,
    textAlign: 'right',
  },
  contentDate: {
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: -0.5,
    color: '#b7b7b7',
    paddingLeft: 16,
  },
  contentLink: {
    paddingLeft: 10,
  },
})