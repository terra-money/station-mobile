import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { MyActionsTable } from 'use-station/src'

import Number from 'components/Number'
import Table from 'components/Table'
import { Text } from 'components'

const DelegationTooltip = ({
  headings,
  contents,
}: MyActionsTable): ReactElement => (
  <Table light small>
    <Text>{headings.action}</Text>
    <Text>{headings.display}</Text>
    <Text>{headings.date}</Text>

    {contents.map(({ action, display, date }, index) => (
      <View key={index}>
        <Text>{action}</Text>
        <Number>{display.value}</Number>
        <Text>{date}</Text>
      </View>
    ))}
  </Table>
)

export default DelegationTooltip
