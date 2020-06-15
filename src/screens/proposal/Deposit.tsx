import React from 'react'
import { View, Text } from 'react-native'
import { DepositUI } from '@terra-money/use-native-station'
import Orb from '../../components/Orb'
import Displays from '../../components/Displays'

const Deposit = ({ title, contents, ...rest }: DepositUI) => {
  const { ratio, completed, percent, total } = rest

  return (
    <>
      <Orb ratio={ratio} completed={completed} size={120} />
      <Text>{percent}</Text>
      <Text>{total}</Text>

      {contents.slice(1).map(({ title, content, displays }) => (
        <View key={title}>
          <Text>{title}</Text>
          {content ? (
            <Text>{content}</Text>
          ) : (
            displays && <Displays list={displays} integer />
          )}
        </View>
      ))}
    </>
  )
}

export default Deposit
