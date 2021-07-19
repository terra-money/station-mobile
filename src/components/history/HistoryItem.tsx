import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import _ from 'lodash'

import { Text, Icon, ExtLink } from 'components'
import { format, MessageUI, TxUI } from 'use-station/src'
import Label from 'components/Badge'
import color from 'styles/color'
import { AccAddress } from '@terra-money/terra.js'

const messageAddressParser = (message: string): string => {
  if (message) {
    return _.map(message.split(' '), (word) => {
      if (AccAddress.validate(word)) {
        return format.truncate(word, [6, 6])
      }
      return word
    }).join(' ')
  }
  return ''
}

const Message = ({
  messages,
}: {
  messages: MessageUI[]
}): ReactElement => {
  const message = messages[0]
  const messageText = messageAddressParser(message.text)

  return (
    <View
      style={{
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
      }}
    >
      <View
        style={{
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          width: '100%',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
          {false === message.success && (
            <Label
              containerStyle={{
                marginLeft: 5,
                backgroundColor: color.red,
              }}
              text={'Failed'}
            />
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
              {messageText}
            </Text>
          </View>
          <View style={{ paddingLeft: 20 }}>
            <Icon size={20} color={'#d8d8d8'} name={'open-in-new'} />
          </View>
        </View>
      </View>
    </View>
  )
}

const HistoryItem = ({ item }: { item: TxUI }): ReactElement => {
  return (
    <ExtLink
      url={item.link}
      title={
        <View>
          {_.some(item.messages) && (
            <Message messages={item.messages} />
          )}

          <Text style={styles.historyItemDate} fontType="medium">
            {item.date}
          </Text>
        </View>
      }
      textStyle={{
        fontSize: 10,
      }}
    />
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
