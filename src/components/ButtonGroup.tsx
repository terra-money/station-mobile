import React, { ReactElement } from 'react'
import { TouchableOpacity } from 'react-native'
import { format } from 'use-station/src'

import { Text } from 'components'

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
