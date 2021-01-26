import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import _ from 'lodash'

import { Text, Number } from 'components'
import { ValidatorUI } from 'use-station/src'
import color from 'styles/color'

const Top = ({ ui }: { ui: ValidatorUI }): ReactElement => {
  const {
    details,
    uptime,
    votingPower,
    selfDelegation,
    commission,
  } = ui

  return (
    <View style={styles.container}>
      <View>
        {_.some(details) && (
          <View style={{ paddingBottom: 15 }}>
            <Text style={styles.details}>{details}</Text>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.infoItem}>
            <Text style={styles.infoItemTitle} fontType={'bold'}>
              {votingPower.title}
            </Text>
            <Text style={styles.infoItemValue} fontType={'bold'}>
              {votingPower.percent}
            </Text>
            <Number
              {...votingPower.display}
              numberFontStyle={{ fontSize: 12 }}
            />
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoItemTitle} fontType={'bold'}>
              {selfDelegation.title}
            </Text>
            <Text style={styles.infoItemValue} fontType={'bold'}>
              {selfDelegation.percent}
            </Text>
            <Number
              {...selfDelegation.display}
              numberFontStyle={{ fontSize: 12 }}
            />
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.infoItem}>
            <Text style={styles.infoItemTitle} fontType={'bold'}>
              {commission.title}
            </Text>
            <Text style={styles.infoItemValue} fontType={'bold'}>
              {commission.percent}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoItemTitle} fontType={'bold'}>
              {uptime.title}
            </Text>
            <Text style={styles.infoItemValue} fontType={'bold'}>
              {uptime.percent}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default Top

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderBottomColor: '#edf1f7',
    borderBottomWidth: 1,
    backgroundColor: color.white,
  },
  section: {
    flexDirection: 'row',
  },
  infoItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  infoItemTitle: {
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0,
  },
  infoItemValue: {
    fontSize: 24,
    letterSpacing: 0,
  },
  details: {
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0,
  },
})
