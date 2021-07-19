import React, { ReactElement } from 'react'
import validators from '../../../validators'
import ExtLink from 'components/ExtLink'

const PROJECT = 'https://github.com/terra-project/validator-profiles'
const PATH = '/tree/master/validators/'

const ViewProfile = ({
  address,
}: {
  address: string
}): ReactElement => {
  const link = [PROJECT, PATH, address].join('')
  const invalid = !validators[address]

  return (
    <>
      {invalid === false && (
        <ExtLink
          url={link || ''}
          title={'View profile on Terra Validators'}
        />
      )}
    </>
  )
}

export default ViewProfile
