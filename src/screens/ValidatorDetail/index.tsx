import React, { ReactElement, useEffect, useState } from 'react'
import { useAuth, User, useValidator } from 'use-station/src'
import { StackScreenProps } from '@react-navigation/stack'

import { navigationHeaderOptions } from 'components/layout/Header'
import Body from 'components/layout/Body'

import { RootStackParams } from '../../types/navigation'

import Top from './Top'
import Actions from './Actions'
import MonikerInfo from './MonikerInfo'
import Informations from './Informations'

type Props = StackScreenProps<RootStackParams, 'ValidatorDetail'>

const Render = ({
  user,
  address,
  setLoadingComplete,
}: {
  user?: User
  address: string
  setLoadingComplete: React.Dispatch<React.SetStateAction<boolean>>
}): ReactElement => {
  const { ui, loading } = useValidator(address, user)
  useEffect(() => {
    if (loading === false) {
      setLoadingComplete(true)
    }
  }, [loading])
  return (
    <>
      {loading ? null : (
        <>
          {ui && (
            <>
              <Top ui={ui} />
              {user && <Actions ui={ui} user={user} />}
              <MonikerInfo ui={ui} user={user} />
              <Informations {...ui} />
            </>
          )}
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
  const [loadingComplete, setLoadingComplete] = useState(false)
  const [refreshingKey, setRefreshingKey] = useState(0)
  const refreshPage = async (): Promise<void> => {
    setRefreshingKey((ori) => ori + 1)
  }

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
    <Body
      theme={'sky'}
      containerStyle={{ paddingHorizontal: 0 }}
      scrollable
      onRefresh={refreshPage}
    >
      <Render
        user={user}
        address={address}
        key={refreshingKey}
        setLoadingComplete={setLoadingComplete}
      />
    </Body>
  )
}

ValidatorDetail.navigationOptions = navigationHeaderOptions({
  theme: 'white',
})

export default ValidatorDetail
