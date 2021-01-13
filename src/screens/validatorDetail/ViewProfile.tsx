import React from 'react'
import validators from '../../../validators'
import ExtLink from '../../components/ExtLink'

const PROJECT = 'https://github.com/terra-project/validator-profiles'
const PATH = '/tree/master/validators/'

const ViewProfile = ({ address }: { address: string }) => {
  const link = [PROJECT, PATH, address].join('')
  const invalid = !validators[address]

  return invalid ? null : (
    <ExtLink href={link}>View profile on Terra Validators</ExtLink>
  )
}

export default ViewProfile
