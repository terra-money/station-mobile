import React from 'react'
import { Text, View } from 'react-native'
import { MyActionsTable } from '@terra-money/use-native-station'
import Number from '../../components/Number'
import Table from '../../components/Table'

const DelegationTooltip = ({
  headings,
  contents,
}: MyActionsTable) => (
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
