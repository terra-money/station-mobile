import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import _ from 'lodash'

import { useDelegations } from 'use-station/src'
import { ExtLink, Icon, Number, Text } from 'components'
import color from 'styles/color'
import { getDateYMD } from 'utils/date'
import { DelegationsModalButton } from 'components/modal/DelegationsModalContents'

const Delegations = ({
  address,
}: {
  address: string
}): ReactElement => {
  const { title, ui } = useDelegations(address, { page: 1 })

  return ui ? (
    <View style={styles.container}>
      <Text style={styles.title} fontType={'bold'}>
        {title}
      </Text>
      {ui.table ? (
        <>
          {_.map(ui.table?.contents, (item, index) => {
            return (
              <View key={`contents-${index}`} style={styles.content}>
                <Text style={styles.contentType} fontType={'medium'}>
                  {item.type}
                </Text>
                <View style={styles.contentRight}>
                  <Number
                    value={item.display.value}
                    numberFontStyle={[
                      styles.contentNumber,
                      item.display.value.startsWith('-')
                        ? { color: '#e64c57' }
                        : { color: color.dodgerBlue },
                    ]}
                  />
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
            )
          })}
          <DelegationsModalButton address={address} />
        </>
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon
            name={'info-outline'}
            color={color.sapphire}
            size={16}
          />
          <Text>{ui.card?.content}</Text>
        </View>
      )}
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
