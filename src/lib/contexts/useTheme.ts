import { useState, useEffect } from 'react'
import { Theme, ThemeConfig, ThemeType } from '../types'

export const themes: Record<ThemeType, Theme> = {
  light: {
    backgroundColor: '#fafbff',
    cardColor: '#fff',
    primaryColor: '#075ae9',
    primaryText: '#f2f2f2',
    textContent: 'dark-content',
  },
  dark: {
    backgroundColor: '#1c1c1c',
    cardColor: '#262627',
    primaryColor: '#439cf4',
    primaryText: '#f2f2f2',
    textContent: 'light-content',
  },
  blossom: {
    backgroundColor: '#ffebf8',
    cardColor: '#fff5ff',
    primaryColor: '#ff2e70',
    primaryText: '#f2f2f2',
    textContent: 'dark-content',
  },
  moon: {
    backgroundColor: '#05040c',
    cardColor: '#090718',
    primaryColor: '#f9d75e',
    primaryText: '#0c0920',
    textContent: 'light-content',
  },
  whale: {
    backgroundColor: '#f0f0f0',
    cardColor: '#fff',
    primaryColor: '#000000',
    primaryText: '#ffffff',
    textContent: 'dark-content',
  },
  madness: {
    backgroundColor: '#141414',
    cardColor: '#4a209d',
    primaryColor: '#25ff14',
    primaryText: '#141414',
    textContent: 'light-content',
  },
}

export default (initial: ThemeType = 'light'): ThemeConfig => {
  const [current, setCurrent] = useState<ThemeType>(initial)

  const set = (options: ThemeType): void => {
    setCurrent(options)
  }

  useEffect(() => {
    set(initial)
  }, [initial])

  return { current, set }
}
