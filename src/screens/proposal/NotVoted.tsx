import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { NotVoted as Props } from 'use-station/src'

import validators from '../../../validators'
import Icon from 'components/Icon'
import { Text } from 'components'

const NotVoted = ({ title, list, button }: Props): ReactElement => (
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
              {`mailto:${email}`}
              {button}
            </Text>
          )}
        </View>
      )
    })}
  </>
)

export default NotVoted
