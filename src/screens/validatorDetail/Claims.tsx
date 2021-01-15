import React, { ReactElement, useState } from 'react'
import { View, Text } from 'react-native'
import {
  ClaimsTable,
  ClaimContent,
  TableUI,
  useClaims,
  format,
} from '@terra-money/use-native-station'

import ErrorComponent from '../../components/ErrorComponent'
import Loading from '../../components/Loading'
import Number from '../../components/Number'
import Table from '../../components/Table'
import ExtLink from '../../components/ExtLink'

const Claims = ({ address }: { address: string }): ReactElement => {
  const [page] = useState(1)
  const { error, title, ui } = useClaims(address, { page })

  const renderHeadings = (
    headings: ClaimsTable['headings']
  ): ReactElement => {
    const { hash, type, displays, date } = headings
    return (
      <View>
        <Text>{hash}</Text>
        <Text>{type}</Text>
        <Text>{displays}</Text>
        <Text>{date}</Text>
      </View>
    )
  }

  const renderRow = (
    { link, hash, ...rest }: ClaimContent,
    index: number
  ): ReactElement => {
    const { type, displays, date } = rest
    return (
      <View key={index}>
        <ExtLink href={link}>
          {format.truncate(hash, [14, 13])}
        </ExtLink>

        <Text>{type}</Text>
        {displays.map((display, index) => (
          <Number {...display} key={index} />
        ))}

        <Text>{date}</Text>
      </View>
    )
  }

  const render = ({ table }: TableUI<ClaimsTable>): ReactElement => {
    return (
      <>
        {table && (
          <Table>
            {renderHeadings(table.headings)}
            {table.contents.map(renderRow)}
          </Table>
        )}
      </>
    )
  }

  return (
    <>
      <Text>{title}</Text>
      {error ? <ErrorComponent /> : ui ? render(ui) : <Loading />}
    </>
  )
}

export default Claims
