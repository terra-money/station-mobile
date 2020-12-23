import React, { useContext, useEffect, useState } from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { gt, Options, StakingUI, ValidatorUI } from '@terra-money/use-native-station'
import Card from '../../components/Card'
import Icon from 'react-native-vector-icons/MaterialIcons'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import EStyleSheet from 'react-native-extended-stylesheet'
import Picker from '../../components/Picker'
import { transformFileSync } from '@babel/core'

// H. REQ i18n
const validatorTitle = "Validators";

const VALIDATOR_LIST = 'https://terra.money/station/validators.json';

const validatorFilter: Options = [
  {value: "Delegation Return", children: "Delegation Return" },
  {value: "Commission", children: "Commission"},
  {value: "Voting Power", children: "Voting Power"},
  {value: "Uptime", children: "Uptime"},
]

const ValidatorList = ({ sorter, contents }: StakingUI) => {
  const { navigate } = useNavigation()

  const [currentFilter, setCurrentFilter] = useState(validatorFilter[0].value)
  const [reverseContents, setReverseContents] = useState(false)
  const [contactableValidators, setContactableValidators] = useState(undefined)

  // console.log('newValidators', newValidators)

  /**
   * email이 있는 validator 얻어오기
   */
  const getContactableValidators = async () => {
    try {
      const response = await fetch(VALIDATOR_LIST)
      setContactableValidators(await response.json())
    }
    catch(e) {
      console.error(e);
    }
  }

  useEffect(() => {
    getContactableValidators() // 이거 밖으로 빼서 Props로 받아오도록 함. 2번 렌더링 됨..
  }, [])

  /**
   * Content 정렬,
   * - 2차정렬 방법 정의
   * 
   * 1차 정렬 이후 Staking return값으로 2차 정렬. 이후 Moniker로 3차 정렬
   */
  const sortContents = (a: ValidatorUI, b: ValidatorUI) => {
    const [_a, _b] = currentFilter === "Delegation Return"
      ? [a.delegationReturn.percent, b.delegationReturn.percent]
      : currentFilter === "Commission"
      ? [a.commission.percent, b.commission.percent]
      : currentFilter === "Voting Power"
      ? [a.votingPower.percent, b.votingPower.percent]
      : currentFilter === "Uptime"
      ? [a.uptime.percent, b.uptime.percent]
      : ["", ""]

    const r1 = (reverseContents ? 1 : -1) * 
      (parseFloat(_b) - parseFloat(_a))
    if(r1 !== 0)
      return r1

    const r2 = (reverseContents ? 1 : -1) * 
      (parseFloat(b.delegationReturn.percent) - parseFloat(a.delegationReturn.percent))
    if(r2 !== 0)
      return r2

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
    <>
    <Card style={{padding: 0, paddingVertical: 0}}>
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 20,
      }}>
        <Text style={[styles.textColor, styles.textValidators]}>{validatorTitle}</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Picker
            value={currentFilter}
            options={validatorFilter}
            onChange={setCurrentFilter}
            style={[styles.textColor, styles.textFilter]}
            showBox={false}
          >
            <Text>{currentFilter}</Text>
          </Picker>
          <TouchableOpacity onPress={() => { 
            contents.reverse()
            contents.sort(sortContents)
            setReverseContents(!reverseContents)
          }} >
            <Icon style={{marginLeft:9}} name="swap-vert" size={18} color={'rgb(32, 67, 181)'} />
          </TouchableOpacity>
        </View>
      </View>
      {contents.map((content, index) => (
        <TouchableOpacity
          onPress={() =>
            navigate('Validator', { address: content.operatorAddress.address })
          }
          key={index}
        >
          {
            <View style={{backgroundColor: 'rgb(237, 241, 247)', height:1, width: '100%'}} />
          }
          <View style={{ 
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
            marginVertical: 12, marginHorizontal: 20,
            }}>
            <View style={{flexDirection: 'row', alignItems:'center',}}>
              <View style={{width: 18, justifyContent: 'center', alignItems: 'center'}}>
              {
                (index) === 0
                ? <Text style={[styles.rank, styles.rank1st]}>{(index + 1)}</Text>
                : (index) === 1
                ? <Text style={[styles.rank, styles.rank2nd]}>{(index + 1)}</Text>
                : (index) === 2
                ? <Text style={[styles.rank, styles.rank3rd]}>{(index + 1)}</Text>
                : <Text style={[styles.rank]}>{(index + 1)}</Text>
              }
              </View>
              {
                <Image source={content.profile 
                    ? {uri: content.profile}
                    : require('../../../assets/terra.png')
                  } style={styles.profileImage} />
              }
              <Text style={[styles.textColor, styles.textMoniker]}>{content.moniker}</Text>
              {
                !!contactableValidators &&
                !!contactableValidators[content?.operatorAddress?.address] &&
                <EntypoIcon style={{marginLeft:6}} name="check" size={14} color={'rgb(118, 169, 244)'} />
              }
            </View>
            <Text style={[styles.textColor, styles.textPercent]}>
              {
                currentFilter === "Delegation Return"
                ? content.delegationReturn.percent
                : currentFilter === "Commission"
                ? content.commission.percent
                : currentFilter === "Voting Power"
                ? content.votingPower.percent
                : currentFilter === "Uptime"
                ? content.uptime.percent
                : ""
              }
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </Card>
    <View style={{height: 36}} />
    </>
  )
}

export default ValidatorList

const styles = EStyleSheet.create({
  textColor: {
    color:"$primaryColor",
  },
  textValidators: {
    fontSize:16, 
    lineHeight:24,
  },
  textFilter: {
    fontSize:10, 
    lineHeight:15, 
    letterSpacing:-0.1,
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
    width:24, 
    height: 24,
    marginHorizontal: 12,
  }
})