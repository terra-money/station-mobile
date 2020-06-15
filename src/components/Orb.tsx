import React from 'react'
import { Text } from 'react-native'
import { percent, gt, min } from '@terra-money/use-native-station'
import Icon from './Icon'

interface Props {
  ratio?: string
  size: number
  className?: string
  completed?: string
}

const Orb = ({ ratio = '0', size, completed, className }: Props) => {
  return (
    <>
      <Text>height: {percent(min([ratio, 1]))}</Text>
      {gt(ratio, 0) && <Text>Tilde</Text>}

      {completed && (
        <>
          <Icon name="check_circle" />
          <Text>{completed}</Text>
        </>
      )}
    </>
  )
}

export default Orb
