import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import _ from 'lodash'

import { format, useDelegators } from 'use-station/src'
import { ExtLink, Icon, Number, Text } from 'components'
import color from 'styles/color'

const Delegations = ({
  address,
}: {
  address: string
}): ReactElement => {
  const { title, ui } = useDelegators(address, { page: 1 })

  return ui ? (
    <View style={styles.container}>
      <Text style={styles.title} fontType={'bold'}>
        {title}
      </Text>
      {_.map(ui.table?.contents, (content, index) => {
        return (
          <View key={`contents-${index}`} style={styles.content}>
            <Text style={styles.contentAddress} fontType={'medium'}>
              {format.truncate(content.address, [5, 5])}
            </Text>
            <View style={styles.contentRight}>
              <Number
                value={content.display.value}
                numberFontStyle={styles.contentNumber}
              />
              <Text style={styles.contentWeight}>
                {content.weight}
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
  contentAddress: {
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0,
  },
  contentNumber: {
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: -0.5,
  },
  contentWeight: {
    minWidth: 70,
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: -0.5,
    color: '#b7b7b7',
    paddingLeft: 16,
    textAlign: 'right',
  },
  contentLink: {
    paddingLeft: 10,
  },
})
