import React, { ReactElement } from 'react'
import { Text } from 'react-native'
import _ from 'lodash'
import Icon from './Icon'

type Props = { tooltip?: boolean; children: string }
const InvalidFeedback = ({ children }: Props): ReactElement => (
  <>
    {_.some(children) && (
      <>
        <Icon name="error" />
        <Text>{children}</Text>
      </>
    )}
  </>
)

export default InvalidFeedback
