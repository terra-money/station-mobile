import React, { ReactElement } from 'react'
import {
  useConfirmSeed,
  SignUpNext,
} from '@terra-money/use-native-station'
import Form, { State } from '../../components/Form'
import ButtonGroup from '../../components/ButtonGroup'

const ConfirmSeed = (props: SignUpNext): ReactElement => {
  const { form, hint } = useConfirmSeed(props)

  const renderButtonGroup = ({
    index,
    setIndex,
  }: State): ReactElement => {
    const buttons = hint.map(({ label: children, onClick }) => ({
      children,
      onClick: (): void => {
        onClick(index)
        setIndex(index + 1)
      },
    }))

    return <ButtonGroup buttons={buttons} />
  }

  return <Form form={form} render={renderButtonGroup} />
}

export default ConfirmSeed
