import React from 'react'
import { View, Text } from 'react-native'
import { useRate, RateItem, RateUI } from '@terra-money/use-native-station'
import ErrorComponent from '../../components/ErrorComponent'
import Loading from '../../components/Loading'
import Card from '../../components/Card'
import Picker from '../../components/Picker'
import Info from '../../components/Info'
import Variation from './Variation'

const RateList = ({ denoms }: { denoms: string[] }) => {
  const { error, loading, title, message, filter, ui } = useRate(denoms)

  const renderFilter = () => {
    const { value, set, options } = filter.denom
    return (
      <Picker
        value={value}
        onChange={set}
        options={options.map((option) => ({
          ...option,
          children: `1 ${option.children}`,
        }))}
      />
    )
  }

  const renderRow = ({ display, variation }: RateItem, index: number) => (
    <View
      style={{ flexDirection: 'row', justifyContent: 'space-between' }}
      key={index}
    >
      <Text>
        {display.value} <Text>{display.unit}</Text>
      </Text>
      <Variation variation={variation} />
    </View>
  )

  const render = ({ message, list }: RateUI) =>
    message ? (
      <Info>{message}</Info>
    ) : (
      <>
        {renderFilter()}
        {list?.map(renderRow)}
      </>
    )

  return (
    <Card title={title}>
      {message ? (
        <Info>{message}</Info>
      ) : error ? (
        <ErrorComponent />
      ) : loading ? (
        <Loading />
      ) : (
        ui && render(ui)
      )}
    </Card>
  )
}

export default RateList
