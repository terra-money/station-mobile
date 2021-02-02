import React, { ReactElement, useEffect, useState } from 'react'
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { StakingUI, ValidatorUI } from 'use-station/src'
import EntypoIcon from 'react-native-vector-icons/Entypo'

import _ from 'lodash'

import Card from 'components/Card'
import { Icon, Text, Selector } from 'components'

import images from 'assets/images'
import { useValidator } from 'hooks/useValidator'
import layout from 'styles/layout'

// H. REQ i18n
const validatorTitle = 'Validators'

enum FilterEnum {
  delegationReturn = 'delegationReturn',
  commission = 'commission',
  votingPower = 'votingPower',
  uptime = 'uptime',
}

const validatorFilter = [
  {
    value: FilterEnum.delegationReturn,
    label: 'Delegation Return',
  },
  { value: FilterEnum.commission, label: 'Commission' },
  { value: FilterEnum.votingPower, label: 'Voting Power' },
  { value: FilterEnum.uptime, label: 'Uptime' },
]

const ValidatorList = ({ contents }: StakingUI): ReactElement => {
  const { navigate } = useNavigation()
  const [currentFilter, setCurrentFilter] = useState(
    FilterEnum.delegationReturn
  )
  const [reverseContents, setReverseContents] = useState(false)

  const [validatorList, setValidatorList] = useState<
    Record<string, string>
  >({})

  const { getValidatorList } = useValidator()
  useEffect(() => {
    getValidatorList().then((list) => {
      setValidatorList(list)
    })
  }, [])

  /**
   * Content 정렬,
   * - 2차정렬 방법 정의
   *
   * 1차 정렬 이후 Staking return값으로 2차 정렬. 이후 Moniker로 3차 정렬
   */
  const sortContents = (a: ValidatorUI, b: ValidatorUI): number => {
    const [_a, _b] =
      currentFilter === FilterEnum.delegationReturn
        ? [a.delegationReturn.percent, b.delegationReturn.percent]
        : currentFilter === FilterEnum.commission
        ? [a.commission.percent, b.commission.percent]
        : currentFilter === FilterEnum.votingPower
        ? [a.votingPower.percent, b.votingPower.percent]
        : currentFilter === FilterEnum.uptime
        ? [a.uptime.percent, b.uptime.percent]
        : ['', '']

    const r1 =
      (reverseContents ? 1 : -1) * (parseFloat(_b) - parseFloat(_a))
    if (r1 !== 0) return r1

    const r2 =
      (reverseContents ? 1 : -1) *
      (parseFloat(b.delegationReturn.percent) -
        parseFloat(a.delegationReturn.percent))
    if (r2 !== 0) return r2

    return b.moniker < a.moniker
      ? (reverseContents ? 1 : -1) * 1
      : b.moniker > a.moniker
      ? (reverseContents ? 1 : -1) * -1
      : 0
  }

  contents.sort(sortContents)

  useEffect(() => {
    setReverseContents(true) // 필터가 바뀌면 정렬을 원래대로 돌려놓음
  }, [currentFilter])

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
              <Text style={styles.textFilter} fontType={'medium'}>
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
          onSelect={setCurrentFilter}
        />
      </View>
      {contents.map((content, index) => (
        <TouchableOpacity
          onPress={(): void =>
            navigate('ValidatorDetail', {
              address: content.operatorAddress.address,
            })
          }
          key={index}
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
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <View
                style={{
                  width: 18,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {index === 0 ? (
                  <Text style={[styles.rank, styles.rank1st]}>
                    {index + 1}
                  </Text>
                ) : index === 1 ? (
                  <Text style={[styles.rank, styles.rank2nd]}>
                    {index + 1}
                  </Text>
                ) : index === 2 ? (
                  <Text style={[styles.rank, styles.rank3rd]}>
                    {index + 1}
                  </Text>
                ) : (
                  <Text style={styles.rank}>{index + 1}</Text>
                )}
              </View>
              <Image
                source={
                  content.profile
                    ? { uri: content.profile }
                    : images.terra
                }
                style={styles.profileImage}
              />
              <Text
                style={[
                  styles.textMoniker,
                  layout.getScreenWideType() === 'narrow' && {
                    maxWidth: '50%',
                  },
                ]}
                fontType={'medium'}
                numberOfLines={1}
              >
                {content.moniker}
              </Text>
              {_.some(
                validatorList[content.operatorAddress.address]
              ) && (
                <EntypoIcon
                  style={{ marginLeft: 6 }}
                  name="check"
                  size={14}
                  color="rgb(118, 169, 244)"
                />
              )}
            </View>
            <Text style={styles.textPercent}>
              {currentFilter === FilterEnum.delegationReturn
                ? content.delegationReturn.percent
                : currentFilter === FilterEnum.commission
                ? content.commission.percent
                : currentFilter === FilterEnum.votingPower
                ? content.votingPower.percent
                : currentFilter === FilterEnum.uptime
                ? content.uptime.percent
                : ''}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </Card>
  )
}
ValidatorList.option = {}

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
    fontWeight: '500',
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
