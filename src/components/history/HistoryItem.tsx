import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import _ from 'lodash'

import Icon from 'components/Icon'
import Text from 'components/Text'
import { MessageUI, TxUI } from 'use-station/src'
import ExtLink from 'components/ExtLink'

const Message = ({
  messages,
  link,
}: {
  messages: MessageUI[]
  link: string
}): ReactElement => {
  const message = messages[0]
  return (
    <View
      style={{
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
      }}
    >
      <View style={{ flexDirection: 'row' }}>
        <Text fontType={'bold'}>{message.tag}</Text>
        {messages.length > 1 && (
          <Text style={styles.moreMsg} fontType={'medium'}>
            +{messages.length - 1} MSG{messages.length > 2 && 'S'}
          </Text>
        )}
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#5493f7', fontSize: 14 }}>
            {message.text}
          </Text>
        </View>

        <View style={{ paddingLeft: 30 }}>
          <ExtLink
            url={link}
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
  )
}

const HistoryItem = ({ item }: { item: TxUI }): ReactElement => {
  return (
    <>
      {_.some(item.messages) && (
        <Message messages={item.messages} link={item.link} />
      )}

      <Text style={styles.historyItemDate}>{item.date}</Text>
    </>
  )
}

export default HistoryItem

const styles = StyleSheet.create({
  historyItemDate: {
    lineHeight: 18,
    letterSpacing: 0,
    color: '#c4c4c4',
    fontSize: 12,
  },
  moreMsg: {
    fontSize: 10,
    marginLeft: 5,
    borderRadius: 7.5,
    backgroundColor: '#f4f5fb',
    textAlignVertical: 'center',
    paddingHorizontal: 5,
  },
})
