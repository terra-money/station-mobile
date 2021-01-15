import React, { ReactElement } from 'react'

import _ from 'lodash'
import Icon from './Icon'

import Text from 'components/Text'
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
