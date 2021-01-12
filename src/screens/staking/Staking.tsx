import React from 'react'
import {
  useMenu,
  useStaking,
  useAuth,
} from '@terra-money/use-native-station'
import { StatusBar } from 'react-native'
import ValidatorList from './ValidatorList'
import Page from '../../components/Page'

const Staking = () => {
  const { user } = useAuth()
  const { Staking: title } = useMenu()
  const { ui, ...api } = useStaking(user)

  // const newValidators = api.data?.validators
  //   .filter((o) => o.isNewValidator)
  //   .filter((o) => o.myDelegation && gt(o.myDelegation, 0)) // 이거 내용 확인 필요함
  //   .filter((o) => (o.status !== 'jailed' && o.status !== 'inactive')) // jailed, inactive된 경우 제외
  //   .map((o) => {
  //     return o.operatorAddress
  //   })

  // console.log('newValidators', newValidators?.length)
  // console.log('newValidators', newValidators)

  return (
    <Page {...api} title={title}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
      />
      {ui && <ValidatorList {...ui} />}
    </Page>
  )
}

export default Staking
