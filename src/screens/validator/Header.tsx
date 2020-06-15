import React from 'react'
import { Text } from 'react-native'
import { ValidatorUI } from '@terra-money/use-native-station'
import Badge from '../../components/Badge'
import Number from '../../components/Number'
import ExtLink from '../../components/ExtLink'
import ViewProfile from './ViewProfile'

const Header = (v: ValidatorUI) => {
  const { profile, moniker, status, link, details, operatorAddress } = v
  const { votingPower, selfDelegation, commission, uptime } = v

  const title = (
    <>
      <Text>{profile}</Text>
      <Text>{moniker}</Text>
      <Badge>{status}</Badge>
      <ExtLink href={link}>{link}</ExtLink>
      <Text>{details}</Text>
      <ViewProfile address={operatorAddress.address} />
    </>
  )

  return (
    <>
      {title}
      <Text>{votingPower.title}</Text>
      <Text>{votingPower.percent}</Text>
      <Number {...votingPower.display} fontSize={14} integer />
      <Text>{selfDelegation.title}</Text>
      <Text>{selfDelegation.percent}</Text>
      <Number {...selfDelegation.display} fontSize={14} integer />
      <Text>{commission.title}</Text>
      <Text>{commission.percent}</Text>
      <Text>
        {uptime.title} ({uptime.desc})
      </Text>
      <Text>{uptime.percent}</Text>
    </>
  )
}

export default Header

/* helpers */
const getBadgeColor = (status: string) => {
  const suffix: { [status: string]: string } = {
    active: 'success',
    inactive: 'warning',
    jailed: 'danger',
  }

  return suffix[status]
}
