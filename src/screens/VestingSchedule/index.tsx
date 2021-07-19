import {
  StackNavigationOptions,
  StackScreenProps,
} from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import _ from 'lodash'
import { RootStackParams } from 'types'

import { navigationHeaderOptions } from 'components/layout/Header'
import { AssetIcon, Icon, Number, Text } from 'components'
import Body from 'components/layout/Body'
import color from 'styles/color'

type Props = StackScreenProps<RootStackParams, 'VestingSchedule'>

const ProgressBar = ({
  percent,
}: {
  percent: string
}): ReactElement => {
  return (
    <View style={{ backgroundColor: '#d2d9f0', borderRadius: 20 }}>
      <View
        style={{
          height: 5,
          width: percent,
          backgroundColor: color.sapphire,
          borderRadius: 20,
        }}
      />
    </View>
  )
}

const VestingSchedule = (props: Props): ReactElement => {
  const { schedule, display } = props.route.params.item
  return (
    <Body theme={'sky'} containerStyle={styles.container} scrollable>
      <View style={styles.scheduleCard}>
        <View style={styles.scheduleCardHeader}>
          <View
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <AssetIcon name={display.unit} />
            <Text
              style={{
                color: color.white,
                fontSize: 16,
                lineHeight: 24,
                letterSpacing: 0,
                paddingLeft: 4,
              }}
              fontType={'bold'}
            >
              {display.unit}
            </Text>
          </View>
          <Number numberFontStyle={{ color: color.white }}>
            {display.value}
          </Number>
        </View>
        <View style={styles.scheduleCardBody}>
          {_.map(schedule, (s, i) => {
            return (
              <View key={i} style={styles.scheduleItem}>
                <View style={styles.scheduleItemPercentAmount}>
                  <View style={{ flexDirection: 'row' }}>
                    {s.released ? (
                      <View style={styles.checkIconActive}>
                        <Icon
                          name={'check'}
                          size={14}
                          color={color.white}
                        />
                      </View>
                    ) : (
                      <View style={styles.checkIcon} />
                    )}
                    <Text style={{ paddingLeft: 6 }}>
                      {s.percent}
                    </Text>
                  </View>
                  <Number>{s.display.value}</Number>
                </View>

                <View style={{ marginBottom: 10 }}>
                  <Text fontType={'bold'}>{s.status}</Text>
                  <Text>{s.duration}</Text>
                </View>

                <ProgressBar percent={s.width} />
              </View>
            )
          })}
        </View>
      </View>
    </Body>
  )
}

const HeaderTitle = ({ title }: { title: string }): ReactElement => {
  return (
    <Text style={styles.headerTitle} fontType={'bold'}>
      {title}
    </Text>
  )
}

VestingSchedule.navigationOptions = (
  props: Props
): StackNavigationOptions => {
  const title = props.route.params.title

  return navigationHeaderOptions({
    theme: 'white',
    headerTitle: () => <HeaderTitle title={title} />,
  })
}

export default VestingSchedule

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
  },
  scheduleCard: {
    borderRadius: 20,
    backgroundColor: color.white,
  },
  scheduleCardHeader: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 20,
    backgroundColor: color.sapphire,
  },
  scheduleCardBody: {
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  scheduleItem: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#edf1f7',
  },
  scheduleItemPercentAmount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
  },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 50,
    backgroundColor: '#f9fafd',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#cdd5ee',
  },
  checkIconActive: {
    width: 20,
    height: 20,
    borderRadius: 50,
    backgroundColor: color.sapphire,
    borderColor: '#cdd5ee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    textAlign: 'center',
    paddingRight: 20,
    fontFamily: 'Gotham-Bold',
  },
})
