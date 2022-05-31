import React, { ReactElement, useCallback } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import {
  NavigationProp,
  useNavigation,
} from '@react-navigation/native'
import { useIsClassic } from 'lib'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import FastImage from 'react-native-fast-image'
import { readPercent } from '@terra.kitchen/utils'

import _ from 'lodash'

import Card from 'components/Card'
import { Icon, Text, Selector } from 'components'

import images from 'assets/images'
import { Dictionary } from 'ramda'
import Preferences, {
  PreferencesEnum,
} from 'nativeModules/preferences'
import { StakingFilterEnum } from './index'
import { RootStackParams } from 'types'
import FastImagePlaceholder from 'components/FastImagePlaceholder'
import { TerraValidator } from 'types/validator'

const ValidatorList = ({
  contents,
  validatorList,
  currentFilter,
  setCurrentFilter,
}: {
  contents: TerraValidator[]
  validatorList?: Dictionary<string>
  currentFilter: StakingFilterEnum
  setCurrentFilter: (value: StakingFilterEnum) => void
}): ReactElement => {
  const { navigate } =
    useNavigation<NavigationProp<RootStackParams>>()
  const isClassic = useIsClassic()

  const validatorTitle = 'Validators'

  const validatorFilter = isClassic
    ? [
        { value: StakingFilterEnum.commission, label: 'Commission' },
        {
          value: StakingFilterEnum.votingPower,
          label: 'Voting Power',
        },
        { value: StakingFilterEnum.uptime, label: 'Uptime' },
      ]
    : [
        { value: StakingFilterEnum.commission, label: 'Commission' },
        {
          value: StakingFilterEnum.votingPower,
          label: 'Voting Power',
        },
      ]

  const hasValues = useCallback(
    (item: TerraValidator) => {
      const checkList = isClassic ? [
        'time_weighted_uptime',
        'commission',
        'voting_power_rate'
      ] : [
        'commission',
        'voting_power_rate'
      ]

      return checkList.every((c) => (item.hasOwnProperty(c) && item[c] !== undefined))
    },
    [isClassic, contents]
  )

  return (
    <Card
      style={{
        marginHorizontal: 0,
        marginBottom: 30,
        paddingHorizontal: 0,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 20,
          paddingHorizontal: 20,
        }}
      >
        <Text style={styles.textValidators} fontType="bold">
          {validatorTitle}
        </Text>

        <Selector
          display={
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.textFilter} fontType="medium">
                {validatorFilter
                  .find((x) => x.value === currentFilter)
                  ?.label.toUpperCase()}
              </Text>
              <Icon
                name={'swap-vert'}
                size={18}
                color="rgb(32, 67, 181)"
                style={{ marginLeft: 5 }}
              />
            </View>
          }
          selectedValue={currentFilter}
          list={validatorFilter}
          onSelect={(value): void => {
            if (value) {
              Preferences.setString(
                PreferencesEnum.stakingFilter,
                value
              )
              setCurrentFilter(value)
            }
          }}
        />
      </View>
      {!_.isEmpty(contents) &&
        _.map(
        contents,
        (item, index): ReactElement => (
          <TouchableOpacity
            onPress={(): void =>
              navigate('ValidatorDetail', {
                address: item?.operator_address,
              })
            }
            key={`validator${index}`}
          >
            <View
              style={{
                backgroundColor: 'rgb(237, 241, 247)',
                height: 1,
                width: '100%',
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginVertical: 12,
                paddingHorizontal: 20,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  flex: 1,
                }}
              >
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    minWidth: 22,
                  }}
                >
                  {
                    <Text
                      style={[
                        styles.rank,
                        index === 0
                          ? styles.rank1st
                          : index === 1
                          ? styles.rank2nd
                          : index === 2
                          ? styles.rank3rd
                          : {},
                      ]}
                      fontType="medium"
                    >
                      {index + 1}
                    </Text>
                  }
                </View>
                <FastImagePlaceholder
                  source={
                    item?.picture
                      ? {
                          uri: item?.picture,
                          cache: FastImage.cacheControl.web,
                        }
                      : images.terra
                  }
                  style={styles.profileImage}
                  placeholder={images.loading_circle}
                />
                {validatorList &&
                _.some(
                  validatorList[item?.operator_address]
                ) ? (
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginRight: 5,
                    }}
                  >
                    <Text
                      style={styles.textMoniker}
                      fontType={'medium'}
                      numberOfLines={1}
                    >
                      {item?.description?.moniker}
                    </Text>
                    <EntypoIcon
                      style={{
                        flex: 1,
                        marginLeft: 5,
                      }}
                      name="check"
                      size={14}
                      color="rgb(118, 169, 244)"
                    />
                  </View>
                ) : (
                  <Text
                    style={[
                      styles.textMoniker,
                      {
                        flex: 1,
                        marginRight: 5,
                      },
                    ]}
                    fontType={'medium'}
                    numberOfLines={1}
                  >
                    {item?.description?.moniker}
                  </Text>
                )}
                {
                  hasValues(item) && (
                    <Text style={styles.textPercent}>
                      {(currentFilter === StakingFilterEnum.uptime
                        ? readPercent(item?.time_weighted_uptime)
                        : currentFilter === StakingFilterEnum.commission
                        ? readPercent(item?.commission?.commission_rates?.rate)
                        : currentFilter === StakingFilterEnum.votingPower
                        ? readPercent(item?.voting_power_rate)
                        : '') || ''}
                    </Text>
                  )
                }
              </View>
            </View>
          </TouchableOpacity>
        )
      )}
    </Card>
  )
}

export default ValidatorList

const styles = StyleSheet.create({
  textValidators: {
    fontSize: 16,
    lineHeight: 24,
  },
  textFilter: {
    fontSize: 10,
    lineHeight: 18,
    letterSpacing: -0.1,
  },
  textMoniker: {
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0,
  },
  textPercent: {
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0,
  },

  rank: {
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0,
    color: 'rgb(32, 67, 181)',
  },
  rank1st: {
    color: 'rgb(214, 175, 54)',
  },
  rank2nd: {
    color: 'rgb(167, 167, 173)',
  },
  rank3rd: {
    color: 'rgb(167, 112, 68)',
  },

  profileImage: {
    // backgroundColor: '#000',
    borderRadius: 12,
    width: 24,
    height: 24,
    marginHorizontal: 12,
  },
})
