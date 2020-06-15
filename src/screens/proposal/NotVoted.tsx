import React from 'react'
import { View, Text } from 'react-native'
import { NotVoted as Props } from '@terra-money/use-native-station'
import validators from '../../../validators'
import Icon from '../../components/Icon'

const NotVoted = ({ title, list, button }: Props) => (
  <>
    <Icon name="how_to_vote" />
    <Text>{title}:</Text>

    {list.map(({ operatorAddress, moniker }) => {
      const email = validators[operatorAddress]
      return (
        <View key={operatorAddress}>
          <Text>{moniker}</Text>

          {email && (
            <Text>
              {'mailto:' + email}
              {button}
            </Text>
          )}
        </View>
      )
    })}
  </>
)

export default NotVoted
