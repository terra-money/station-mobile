import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import _ from 'lodash'

import { Text, Icon, ExtLink } from 'components'
import { MessageUI, TxUI } from 'lib'
import Label from 'components/Badge'
import { COLOR } from 'consts'

const Message = ({
  messages,
}: {
  messages: MessageUI[]
}): ReactElement => {
  const message = messages[0]

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
          {message.success ? (
            <>
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
                  +{messages.length - 1} MSG
                  {messages.length > 2 && 'S'}
                </Text>
              )}
            </>
          ) : (
            <Label
              containerStyle={{ backgroundColor: COLOR.red }}
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
            {_.map(message.summary, (item, index) => {
              return (
                <Text
                  key={`message.summary-${index}`}
                  style={{
                    fontSize: 14,
                    lineHeight: 19,
                    letterSpacing: -0.1,
                  }}
                >
                  {item}
                </Text>
              )
            })}
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
