import React, { useRef, useEffect } from 'react'
import { ReactNode } from 'react'
import { TextInput, Text } from 'react-native'
import { Field as FieldProps } from '@terra-money/use-native-station'
import Picker from './Picker'
import MaxButton from './MaxButton'
import InvalidFeedback from './InvalidFeedback'

interface Props {
  field: FieldProps
  focus?: boolean
  onFocus?: () => void
  render?: (field: FieldProps) => ReactNode
}

const Field = ({ field, focus, onFocus, render }: Props) => {
  const { label, element, attrs, setValue, error } = field
  const { button, unit, options } = field

  /* focus by external */
  const inputRef = useRef<TextInput>(null)

  useEffect(() => {
    focus && inputRef.current!.focus()
  }, [focus])

  /* render */
  const header = label && (
    <>
      <Text>{label}</Text>
      {button && <MaxButton {...button} />}
    </>
  )

  const input = (
    <TextInput
      {...attrs}
      onChangeText={setValue}
      onFocus={onFocus}
      ref={inputRef}
    />
  )

  const elements = {
    input: () =>
      !['checkbox', 'radio'].includes(attrs.type!) ? (
        <>
          {header}
          {!unit ? (
            input
          ) : (
            <>
              {input}
              <Text>{unit}</Text>
            </>
          )}

          {error ? <InvalidFeedback tooltip>{error}</InvalidFeedback> : null}
        </>
      ) : (
        <>
          <TextInput {...attrs} onChangeText={setValue} />
          <Text>{label}</Text>
        </>
      ),
    select: () => (
      <>
        {header}
        <Picker {...attrs} onChange={setValue} options={options} />
      </>
    ),
    textarea: () => (
      <>
        {header}
        <TextInput
          {...attrs}
          onChangeText={setValue}
          numberOfLines={4}
          multiline
        />
        {error && <InvalidFeedback tooltip>{error}</InvalidFeedback>}
      </>
    ),
  }

  return <>{render?.(field) ?? elements[element]()}</>
}

export default Field
