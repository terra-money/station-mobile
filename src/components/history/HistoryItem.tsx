import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import _ from 'lodash'

import { Text, Icon, ExtLink } from 'components'
import { MessageUI, TxUI } from 'use-station/src'

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
        <Text
          style={{
            fontSize: 10,
            textTransform: 'uppercase',
            lineHeight: 15,
          }}
          fontType={'bold'}
        >
          {message.tag}
        </Text>
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
        <View style={{ flex: 1, marginVertical: 3 }}>
          <Text
            style={{
              fontSize: 14,
              lineHeight: 19,
              letterSpacing: -0.1,
            }}
          >
            {message.text}
          </Text>
        </View>

        <View style={{ paddingLeft: 20 }}>
          <ExtLink
            url={link}
            title={
              <Icon
                size={20}
                color={'#EAEDF8'}
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

      <Text style={styles.historyItemDate} fontType="medium">{item.date}</Text>
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
    lineHeight: 15,
    marginLeft: 5,
    borderRadius: 7.5,
    backgroundColor: '#f4f5fb',
    textAlignVertical: 'center',
    paddingHorizontal: 5,
  },
})
