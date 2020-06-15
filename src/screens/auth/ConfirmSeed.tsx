import React from 'react'
import { useConfirmSeed, SignUpNext } from '@terra-money/use-native-station'
import Form, { State } from '../../components/Form'
import ButtonGroup from '../../components/ButtonGroup'

const ConfirmSeed = (props: SignUpNext) => {
  const { form, hint } = useConfirmSeed(props)

  const renderButtonGroup = ({ index, setIndex }: State) => {
    const buttons = hint.map(({ label: children, onClick }) => ({
      children,
      onClick: () => {
        onClick(index)
        setIndex(index + 1)
      },
    }))

    return <ButtonGroup buttons={buttons} />
  }

  return <Form form={form} render={renderButtonGroup} />
}

export default ConfirmSeed
