import React, { ReactElement, useEffect, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'

import { navigationHeaderOptions } from 'components/layout/Header'
import Body from 'components/layout/Body'
import { useAuth, User, useValidator, ValidatorUI } from 'lib'

import { RootStackParams } from '../../types/navigation'

import Top from './Top'
import Actions from './Actions'
import MonikerInfo from './MonikerInfo'
import Informations from './Informations'
import { Loading } from 'components'

type Props = StackScreenProps<RootStackParams, 'ValidatorDetail'>

const Render = ({
  user,
  ui,
}: {
  user?: User
  ui?: ValidatorUI
}): ReactElement => {
  return (
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
  )
}

const ValidatorDetail = ({
  navigation,
  route,
}: Props): ReactElement => {
  const { user } = useAuth()

  const { address } = route.params
  const { ui, loading } = useValidator(address, user)
  const [loadingComplete, setLoadingComplete] = useState(false)
  const [refreshingKey, setRefreshingKey] = useState(0)
  const refreshPage = async (): Promise<void> => {
    setRefreshingKey((ori) => ori + 1)
  }

  useEffect(() => {
    if (loading === false) {
      setLoadingComplete(true)
    }
  }, [loading])

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
          <Render user={user} ui={ui} key={refreshingKey} />
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
