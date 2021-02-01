import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import _ from 'lodash'

import { format, useDelegators } from 'use-station/src'
import { ExtLink, Icon, Number, Text } from 'components'
import color from 'styles/color'
import { DelegatorsModalButton } from 'components/modal/DelegatorsModalContents'
import layout from 'styles/layout'

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
      {ui.table ? (
        <>
          {_.map(ui.table.contents, (item, index) => {
            return (
              <View
                key={`contents-${index}`}
                style={[
                  styles.content,
                  layout.getScreenWideType() === 'narrow' && {
                    flexDirection: 'column',
                  },
                ]}
              >
                <ExtLink
                  url={item.link}
                  title={
                    <Text
                      style={styles.contentAddress}
                      fontType={'medium'}
                    >
                      {format.truncate(item.address, [5, 5])}
                    </Text>
                  }
                  textStyle={{
                    fontSize: 10,
                  }}
                />
                <View style={styles.contentRight}>
                  <Number
                    value={item.display.value}
                    numberFontStyle={styles.contentNumber}
                  />
                  <Text style={styles.contentWeight}>
                    {item.weight}
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
          <DelegatorsModalButton address={address} />
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
    justifyContent: 'space-between',
  },
  contentAddress: {
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0,
    color: color.dodgerBlue,
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
