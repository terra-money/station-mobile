import React from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { StakingUI } from '@terra-money/use-native-station'
import Card from '../../components/Card'
import Icon from 'react-native-vector-icons/MaterialIcons'
import EStyleSheet from 'react-native-extended-stylesheet'

const ValidatorList = ({ contents }: StakingUI) => {
  const { navigate } = useNavigation()

  return (
    <>
    <Card style={{padding: 0, paddingVertical: 0}}>
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center',
        // backgroundColor: '#ccc',
        margin: 20,
      }}>
        <Text>Validators</Text>
        <View style={{flexDirection: 'row', alignItems: 'center',}}>
          <Text>Delegation Return</Text>
          <Icon name="swap-vert" size={26} />
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
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 12, 
            marginHorizontal: 20,
            }}>
            <View style={{flexDirection: 'row'}}>
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
                // <Image source={require('../../../assets/terra.png')} style={{width:24, height:24}} resizeMode={'cover'}/>
                <Image source={content.profile 
                    ? {uri: content.profile}
                    : require('../../../assets/terra.png')
                  } style={styles.profileImage} />
              }
              <Text>{content.moniker}</Text>
            </View>
            <Text>{content.delegationReturn.percent}</Text>
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
  rank: {
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
    backgroundColor: '#000',
    borderRadius: 12, 
    width:24, 
    height: 24,
    marginHorizontal: 12,
  }
})