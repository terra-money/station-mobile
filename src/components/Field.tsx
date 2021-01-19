import React, {
  useRef,
  useEffect,
  ReactNode,
  ReactElement,
} from 'react'

import { TextInput } from 'react-native'
import { Field as FieldProps } from 'use-station/src'
import Picker from './Picker'
import MaxButton from './MaxButton'
import InvalidFeedback from './InvalidFeedback'
import Text from 'components/Text'

interface Props {
  field: FieldProps
  focus?: boolean
  onFocus?: () => void
  render?: (field: FieldProps) => ReactNode
}

const Field = ({
  field,
  focus,
  onFocus,
  render,
}: Props): ReactElement => {
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
    input: (): ReactElement =>
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

          {error ? (
            <InvalidFeedback tooltip>{error}</InvalidFeedback>
          ) : null}
        </>
      ) : (
        <>
          <TextInput {...attrs} onChangeText={setValue} />
          <Text>{label}</Text>
        </>
      ),
    select: (): ReactElement => (
      <>
        {header}
        <Picker {...attrs} onChange={setValue} options={options} />
      </>
    ),
    textarea: (): ReactElement => (
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
