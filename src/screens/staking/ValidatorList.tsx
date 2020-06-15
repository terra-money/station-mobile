import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { StakingUI } from '@terra-money/use-native-station'
import Card from '../../components/Card'

const ValidatorList = ({ contents }: StakingUI) => {
  const { navigate } = useNavigation()

  return (
    <Card>
      {contents.map((content, index) => (
        <TouchableOpacity
          onPress={() =>
            navigate('Validator', { address: content.operatorAddress.address })
          }
          key={index}
        >
          <View>
            <Text>{content.moniker}</Text>
            <Text>{content.delegationReturn.percent}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </Card>
  )
}

export default ValidatorList
