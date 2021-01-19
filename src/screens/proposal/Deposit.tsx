import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { DepositUI } from 'use-station/src'

import Orb from 'components/Orb'
import Displays from 'components/Displays'
import Text from 'components/Text'

const Deposit = ({ contents, ...rest }: DepositUI): ReactElement => {
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
