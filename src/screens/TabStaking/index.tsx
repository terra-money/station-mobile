import React, { ReactElement, useEffect, useState } from 'react'
import { View } from 'react-native'

import {
  useStaking,
  useAuth,
  User,
  ValidatorUI,
  StakingPersonal,
  useConfig,
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
}: {
  currentFilter: StakingFilterEnum
  setCurrentFilter: (value: StakingFilterEnum) => void
  validatorList?: Dictionary<string>
  user?: User
  personal?: StakingPersonal
  contents?: ValidatorUI[]
}): ReactElement => {
  return (
    <>
      {contents ? (
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
  const stakingProps = useStaking(user)
  const { chain } = useConfig()
  const [refreshingKey, setRefreshingKey] = useState(0)
  const refreshPage = async (): Promise<void> => {
    setRefreshingKey((ori) => ori + 1)
    stakingProps.execute()
  }
  const bodyProps = stakingProps.ui ? { scrollable: true } : {}

  useEffect(() => {
    refreshPage()
  }, [chain.current])

  const [
    currentFilter,
    setCurrentFilter,
  ] = useState<StakingFilterEnum>(StakingFilterEnum.uptime)

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

  const [reverseContents, setReverseContents] = useState(false)

  const sortContents = (a: ValidatorUI, b: ValidatorUI): number => {
    const [_a, _b] =
      currentFilter === StakingFilterEnum.uptime
        ? [a.uptime.percent, b.uptime.percent]
        : currentFilter === StakingFilterEnum.commission
        ? [a.commission.percent, b.commission.percent]
        : currentFilter === StakingFilterEnum.votingPower
        ? [a.votingPower.percent, b.votingPower.percent]
        : ['', '']

    const r1 =
      (reverseContents ? 1 : -1) * (parseFloat(_b) - parseFloat(_a))
    if (r1 !== 0) return r1

    const r2 =
      (reverseContents ? 1 : -1) *
      (parseFloat(b.votingPower.percent) -
        parseFloat(a.votingPower.percent))
    if (r2 !== 0) return r2

    return b.moniker < a.moniker
      ? (reverseContents ? 1 : -1) * 1
      : b.moniker > a.moniker
      ? (reverseContents ? 1 : -1) * -1
      : 0
  }

  useEffect(() => {
    setReverseContents(true)
  }, [currentFilter])

  return (
    <Body theme={'sky'} {...bodyProps} onRefresh={refreshPage}>
      <Render
        currentFilter={currentFilter}
        setCurrentFilter={setCurrentFilter}
        validatorList={validatorList}
        user={user}
        key={refreshingKey}
        personal={stakingProps.personal}
        contents={stakingProps.ui?.contents.sort(sortContents)}
      />
    </Body>
  )
}

Staking.navigationOptions = navigationHeaderOptions({
  title: 'Staking',
})

export default Staking
