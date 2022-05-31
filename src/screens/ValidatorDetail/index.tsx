import React, { ReactElement, useEffect, useMemo, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'

import { navigationHeaderOptions } from 'components/layout/Header'
import Body from 'components/layout/Body'
import { useAuth, User } from 'lib'

import { RootStackParams } from '../../types/navigation'

import Top from './Top'
import Actions from './Actions'
import MonikerInfo from './MonikerInfo'
import Informations from './Informations'
import { Loading } from 'components'
import { useValidator } from '../../qureys/staking'
import { useTerraValidator, useVotingPowerRate } from '../../qureys/Terra/TerraAPI'
import { TerraValidator } from 'types/validator'

type Props = StackScreenProps<RootStackParams, 'ValidatorDetail'>

const Render = ({
  user,
  data,
}: {
  user?: User
  data?: TerraValidator
}): ReactElement => {
  return (
    <>
      {(data && user) && (
        <>
          <Top data={data} />
          <Actions data={data} user={user} />
          <MonikerInfo data={data} user={user} />
          <Informations data={data} />
        </>
      )}
    </>
  )
}

const ValidatorDetail = ({
  navigation,
  route,
}: Props): ReactElement => {
  const { user } = useAuth()

  const { address } = route.params
  const { data, refetch, isLoading } = useValidator(address)
  const { data: terraData, ...terraResponse } = useTerraValidator(address)
  const { data: votingPowerRate } = useVotingPowerRate(address)
  const [loadingComplete, setLoadingComplete] = useState(false)
  const [refreshingKey, setRefreshingKey] = useState(0)

  const refreshPage = async (): Promise<void> => {
    setRefreshingKey((ori) => ori + 1)
    refetch()
  }

  const activeData = useMemo(() => {
    if (!(terraData && data)) return null

    return {
      ...terraData,
      ...data,
      voting_power_rate: votingPowerRate,
    }
  }, [data, terraData, votingPowerRate])

  useEffect(() => {
    if (isLoading === false && terraResponse.isLoading === false) {
      setLoadingComplete(true)
    }
  }, [isLoading, terraResponse.isLoading])

  useEffect(() => {
    let unsubscribe
    if (loadingComplete) {
      unsubscribe = navigation.addListener('focus', () => {
        refreshPage()
      })
    }
    return unsubscribe
  }, [loadingComplete])

  return (
    <>
      <Body
        theme={'sky'}
        containerStyle={{ paddingHorizontal: 0 }}
        scrollable={loadingComplete}
        onRefresh={refreshPage}
      >
        {loadingComplete ? (
          <Render user={user} data={activeData} key={refreshingKey} />
        ) : (
          <Loading
            style={{
              height: '100%',
              justifyContent: 'center',
            }}
          />
        )}
      </Body>
    </>
  )
}

ValidatorDetail.navigationOptions = navigationHeaderOptions({
  theme: 'white',
})

export default ValidatorDetail
