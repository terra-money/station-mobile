import React, { ReactElement, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import _ from 'lodash'
import { Msg } from '@terra-money/terra.js'

import { COLOR } from 'consts'

import { Icon, Text } from 'components'

const getDl = (
  object: Record<string, any>
): { dt: string; dd: string }[] =>
  Object.entries(object).map(([k, v]) => {
    const dd = v.toJSON
      ? v.toJSON()
      : typeof v === 'object'
      ? JSON.stringify(v, null, 2)
      : v

    return {
      dt: k,
      dd,
    }
  })

const MessageContents = ({ msg }: { msg: Msg }): ReactElement => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <View style={styles.openBox}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <View
          style={{
            borderRadius: 5,
            backgroundColor: COLOR.primary._02,
            paddingHorizontal: 5,
          }}
        >
          <Text style={styles.executeContract} fontType="bold">
            ExecuteContact
          </Text>
        </View>
        <TouchableOpacity
          style={styles.openBtn}
          onPress={(): void => {
            setIsOpen(!isOpen)
          }}
        >
          <Text
            style={{ color: COLOR.primary._03, fontSize: 10 }}
            fontType="bold"
          >
            {isOpen ? 'Collapse' : 'Expand'}
          </Text>
          <Icon
            name={isOpen ? 'expand-less' : 'expand-more'}
            size={14}
            color={COLOR.primary._03}
          />
        </TouchableOpacity>
      </View>
      {isOpen && (
        <View style={{ paddingTop: 15 }}>
          {_.map(getDl(msg), ({ dt, dd }, index) => {
            return (
              <View
                key={`msg-${index}`}
                style={{
                  borderTopWidth: index > 0 ? 1 : 0,
                  borderTopColor: '#ebeff8',
                  paddingTop: index > 0 ? 10 : 0,
                  paddingBottom: 5,
                }}
              >
                <Text style={styles.infoTitle} fontType="bold">
                  {dt}
                </Text>
                <Text>{dd}</Text>
              </View>
            )
          })}
        </View>
      )}
    </View>
  )
}

const MessageBox = ({ msgs }: { msgs: Msg[] }): ReactElement => {
  return (
    <View>
      {_.map(msgs, (msg, i) => {
        return <MessageContents msg={msg} key={`msgs-${i}`} />
      })}
    </View>
  )
}

export default MessageBox

const styles = StyleSheet.create({
  openBox: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 10,
    shadowOpacity: 1,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ebeff8',
  },
  executeContract: {
    fontSize: 12,
    fontStyle: 'normal',
    lineHeight: 21,
    letterSpacing: 0,
    color: '#ffffff',
  },
  openBtn: {
    borderRadius: 3,
    borderWidth: 1,
    borderColor: COLOR.primary._03,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginRight: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0,
  },
})
