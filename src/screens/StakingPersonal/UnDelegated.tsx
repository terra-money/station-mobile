import React, { ReactElement } from 'react'
import { View, StyleSheet, Image } from 'react-native'
import _ from 'lodash'

import { StakingPersonal, ValidatorUI } from 'use-station/src'

import { Number, Text } from 'components'
import color from 'styles/color'
import images from 'assets/images'

const Rewards = ({
  personal,
  findMoniker,
}: {
  personal: StakingPersonal
  findMoniker: ({ name }: { name: string }) => ValidatorUI | undefined
}): ReactElement => {
  const { undelegated } = personal

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle} fontType={'medium'}>
          {'Undelegated'}
        </Text>
        <Number
          numberFontStyle={{ fontSize: 20, textAlign: 'left' }}
          decimalFontStyle={{ fontSize: 15 }}
          {...undelegated.display}
          fontType={'medium'}
        />
      </View>
      <View style={{ marginBottom: 10 }}>
        {_.map(undelegated.table?.contents, (content, i) => {
          const moniker = findMoniker({ name: content.name })
          return (
            <View
              key={`undelegated.table.contents-${i}`}
              style={styles.itemBox}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingRight: 20,
                }}
              >
                <Image
                  source={
                    moniker?.profile
                      ? { uri: moniker.profile }
                      : images.terra
                  }
                  style={styles.profileImage}
                />
                <Text>{content.name}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Number
                  numberFontStyle={{ fontSize: 14 }}
                  decimalFontStyle={{ fontSize: 10.5 }}
                  {...content.display}
                />
                <Text
                  style={{ fontSize: 10.5, marginTop: 5 }}
                  fontType="medium"
                >
                  Release time
                </Text>
                <Text style={{ fontSize: 10.5 }}>{content.date}</Text>
              </View>
            </View>
          )
        })}
      </View>
    </View>
  )
}

export default Rewards

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    paddingTop: 20,
    backgroundColor: color.white,
    borderRadius: 20,
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowRadius: 35,
    shadowOpacity: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0,
  },
  itemBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopColor: '#edf1f7',
    borderTopWidth: 1,
  },
  profileImage: {
    borderRadius: 12,
    width: 24,
    height: 24,
    marginRight: 5,
  },
})
