import Button from 'components/Button'
import Body from 'components/layout/Body'
import React, { ReactElement } from 'react'
import { useApp } from './useApp'

const BioAuth = (): ReactElement => {
  return (
    <Body>
      <Button type={'blue'} title={'Enable'} />
      <Button type={'gray'} title={'Later'} />
    </Body>
  )
}

export const useBioAuth = (): {
  openBioAuth: () => void
} => {
  const { modal } = useApp()
  const openBioAuth = (): void => {
    modal.open(BioAuth)
  }

  return {
    openBioAuth,
  }
}
