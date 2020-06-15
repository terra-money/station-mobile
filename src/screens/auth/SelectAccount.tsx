import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { SignUpNext, Field, AccountUI } from '@terra-money/use-native-station'
import { useSelectAccount } from '@terra-money/use-native-station'
import Badge from '../../components/Badge'

interface Props {
  field: Field<AccountUI>
  checkedSome: boolean
}

const Account = ({ field, checkedSome }: Props) => {
  const { attrs, setValue, label, ui } = field
  const { bip, badges, balances } = ui!

  return (
    <TouchableOpacity {...attrs} onPress={() => setValue?.('')}>
      <Badge>BIP {bip}</Badge>

      {badges.map((badge) => (
        <Badge key={badge}>{badge}</Badge>
      ))}

      <Text>{label}</Text>

      {Array.isArray(balances)
        ? balances.map((balance, index) => <Text key={index}>{balance}</Text>)
        : balances}
    </TouchableOpacity>
  )
}

const SelectAccount = (props: SignUpNext) => {
  const { form } = useSelectAccount(props)

  return !form ? null : (
    <>
      {form.fields.map((field) => (
        <Account
          field={field}
          checkedSome={form.fields.some(({ attrs }) => attrs.checked)}
          key={field.label}
        />
      ))}
    </>
  )
}

export default SelectAccount
