import React, { ReactElement, useEffect, useState } from 'react'
import { View } from 'react-native'

import {
  useStaking,
  useAuth,
  User,
  StakingPersonal,
  useConfig,
  useIsClassic,
} from 'lib'

import { navigationHeaderOptions } from 'components/layout/TabScreenHeader'
import Body from 'components/layout/Body'

import ValidatorList from './ValidatorList'
import PersonalSummary from './PersonalSummary'
import Preferences, {
  PreferencesEnum,
} from 'nativeModules/preferences'
import useTerraAssets from 'lib/hooks/useTerraAssets'
import { Loading } from 'components'
import { TerraValidator } from 'types/validator'

export enum StakingFilterEnum {
  commission = 'commission',
  votingPower = 'votingPower',
  uptime = 'uptime',
}

const Render = ({
  currentFilter,
  setCurrentFilter,
  validatorList,
  user,
  personal,
  contents,
  lodingComplete,
}: {
  lodingComplete: boolean
  currentFilter: StakingFilterEnum
  setCurrentFilter: (value: StakingFilterEnum) => void
  validatorList?: Dictionary<string>
  user?: User
  personal?: StakingPersonal
  contents?: TerraValidator[]
}): ReactElement => {
  return (
    <>
      {lodingComplete ? (
        <View>
          {personal && user && (
            <PersonalSummary personal={personal} user={user} />
          )}
          <ValidatorList
            validatorList={validatorList}
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
            contents={contents}
          />
        </View>
      ) : (
        <Loading
          style={{
            height: '100%',
            justifyContent: 'center',
          }}
        />
      )}
    </>
  )
}

const Staking = (): ReactElement => {
  const { user } = useAuth()
  const {
    ui, personal, TerraValidatorsState, validatorsState, delegationsState, unbondingsState, rewardsState
  } = useStaking()
  const { chain } = useConfig()
  const [refreshingKey, setRefreshingKey] = useState(0)
  const [loadingComplete, setLoadingComplete] = useState(false)

  const refreshPage = async (): Promise<void> => {
    setRefreshingKey((ori) => ori + 1)
    validatorsState?.refetch()
    TerraValidatorsState?.refetch()
    delegationsState?.refetch()
    unbondingsState?.refetch()
    rewardsState?.refetch()
  }
  const bodyProps = ui ? { scrollable: true } : {}
  const isClassic = useIsClassic()

  useEffect(() => {
    refreshPage()
  }, [chain.current])

  useEffect(() => {
    if (validatorsState.isLoading === false && TerraValidatorsState.isLoading === false) {
      setLoadingComplete(true)
    }
  }, [validatorsState.isLoading, TerraValidatorsState.isLoading])

  const [
    currentFilter,
    setCurrentFilter,
  ] = useState<StakingFilterEnum>(isClassic ? StakingFilterEnum.uptime : StakingFilterEnum.votingPower)

  const { data: validatorList } = useTerraAssets<Dictionary<string>>(
    'validators.json'
  )

  useEffect(() => {
    Preferences.getString(PreferencesEnum.stakingFilter).then(
      (v: string): void => {
        v && setCurrentFilter(v as StakingFilterEnum)
      }
    )
  }, [])

  const [reverseContents, setReverseContents] = useState(true)

  const sortContents = (
    a: TerraValidator,
    b: TerraValidator
  ): number => {
    const [_a, _b] =
      currentFilter === StakingFilterEnum.uptime
        ? [a?.time_weighted_uptime, b?.time_weighted_uptime]
        : currentFilter === StakingFilterEnum.commission
        ? [a?.commission?.commission_rates?.rate, b?.commission?.commission_rates?.rate]
        : currentFilter === StakingFilterEnum.votingPower
        ? [a?.voting_power_rate, b?.voting_power_rate]
        : ['', '']

    const r1 =
      (reverseContents ? 1 : -1) * (parseFloat(_b) - parseFloat(_a))
    if (r1 !== 0) return r1

    const r2 =
      (reverseContents ? 1 : -1) *
      (parseFloat(b?.voting_power_rate) -
        parseFloat(a?.voting_power_rate))
    if (r2 !== 0) return r2

    return b?.description?.moniker < a?.description?.moniker
      ? (reverseContents ? 1 : -1) * 1
      : b?.description?.moniker > a?.description?.moniker
      ? (reverseContents ? 1 : -1) * -1
      : 0
  }

  useEffect(() => {
    setReverseContents(true)
  }, [currentFilter])

  return (
    <Body theme={'sky'} {...bodyProps} onRefresh={refreshPage}>
      <Render
        lodingComplete={loadingComplete}
        currentFilter={currentFilter}
        setCurrentFilter={setCurrentFilter}
        validatorList={validatorList}
        user={user}
        key={refreshingKey}
        personal={personal}
        contents={ui?.contents.sort(sortContents)}
      />
    </Body>
  )
}

Staking.navigationOptions = navigationHeaderOptions({
  title: 'Staking',
})

export default Staking
