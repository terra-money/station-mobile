import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import _ from 'lodash'

import { useClaims } from 'use-station/src'
import { ExtLink, Icon, Number, Text } from 'components'
import color from 'styles/color'

const Delegations = ({
  address,
}: {
  address: string
}): ReactElement => {
  const { title, ui } = useClaims(address, { page: 1 })
  const getContentDateFormat = (date: string): string => {
    const match = date.match(/^(\d){4}\.(\d){2}\.(\d){2}/g)
    return match ? match[0] : ''
  }
  return ui ? (
    <View style={styles.container}>
      <Text style={styles.title} fontType={'bold'}>
        {title}
      </Text>
      {_.map(ui.table?.contents, (content, index) => {
        return (
          <View key={`contents-${index}`} style={styles.content}>
            <Text style={styles.contentType} fontType={'medium'}>
              {content.type}
            </Text>
            <View style={styles.contentRight}>
              <View>
                {_.map(content.displays, (display, j) => {
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
                {getContentDateFormat(content.date)}
              </Text>

              <View style={styles.contentLink}>
                <ExtLink
                  url={content.link}
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
      })}
    </View>
  ) : (
    <View />
  )
}

export default Delegations

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderBottomColor: '#edf1f7',
    borderBottomWidth: 1,
    backgroundColor: color.white,
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
    marginBottom: 30,
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
