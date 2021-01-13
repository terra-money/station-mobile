import React, { ReactElement } from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { format } from '@terra-money/use-native-station'

interface Props {
  buttons: { onClick: () => void; children: any }[]
  truncate?: boolean
}

const ButtonGroup = ({ buttons, truncate }: Props): ReactElement => (
  <>
    {buttons.map(({ onClick: onPress, children }, index) => (
      <TouchableOpacity onPress={onPress} key={index}>
        <Text>
          {truncate && typeof children === 'string'
            ? format.truncate(children, [9, 7])
            : children}
        </Text>
      </TouchableOpacity>
    ))}
  </>
)

export default ButtonGroup
