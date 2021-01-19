import React, { ReactElement, useState } from 'react'
import { DisplaySelector as Props } from 'use-station/src'
import Card from 'components/Card'
import Number from 'components/Number'
import Picker from 'components/Picker'

const DisplaySelector = (props: Props): ReactElement => {
  const { title, select, displays } = props
  const { defaultValue, options } = select
  const [current, setCurrent] = useState<string>(defaultValue)

  const picker = (
    <Picker
      value={current}
      options={options}
      onChange={setCurrent}
      style={{ color: 'white' }}
    />
  )

  return (
    <Card title={title} action={picker} dark>
      <Number {...displays[current]} integer dark />
    </Card>
  )
}

export default DisplaySelector
