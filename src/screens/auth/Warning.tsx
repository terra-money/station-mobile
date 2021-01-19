import React, { ReactElement } from 'react'
import { CheckBoxProps } from 'react-native'
import CheckBox from '@react-native-community/checkbox'
import { Trans, SignUpWarning } from 'use-station/src'

import Icon from 'components/Icon'
import Text from 'components/Text'

interface Props extends SignUpWarning {
  attrs: CheckBoxProps
}

const Warning = ({
  tooltip,
  i18nKey,
  attrs,
}: Props): ReactElement => (
  <>
    <Icon name="error" />
    <Text>{tooltip[0]}</Text>
    <Text>{tooltip[1]}</Text>

    <CheckBox {...attrs} />

    <Text>
      <Trans i18nKey={i18nKey}>
        <Text />
      </Trans>
    </Text>
  </>
)

export default Warning
