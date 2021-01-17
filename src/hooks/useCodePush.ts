import { useEffect, useState } from 'react'
import { AppState, AppStateStatus, Platform } from 'react-native'

import CodePush from 'react-native-code-push'

export enum SyncStatus {
  UP_TO_DATE,
  DOWNLOADING_PACKAGE,
  INSTALLING_UPDATE,
  UPDATE_INSTALLED,
}

export const useUpdateSync = (): {
  syncStatus: SyncStatus | undefined
  receivedBytes: number
  totalBytes: number
} => {
  const [syncStatus, setSyncStatus] = useState<
    SyncStatus | undefined
  >(undefined)

  const [receivedBytes, setReceivedBytes] = useState<number>(0)
  const [totalBytes, setTotalBytes] = useState<number>(0)

  useEffect(() => {
    CodePush.sync(
      {
        updateDialog: undefined,
        installMode: CodePush.InstallMode.IMMEDIATE,
      },
      (status) => {
        switch (status) {
          case CodePush.SyncStatus.UP_TO_DATE:
            setSyncStatus(SyncStatus.UP_TO_DATE)
            break
          case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
            setSyncStatus(SyncStatus.DOWNLOADING_PACKAGE)
            break
          case CodePush.SyncStatus.INSTALLING_UPDATE:
            setSyncStatus(SyncStatus.INSTALLING_UPDATE)
            break
          case CodePush.SyncStatus.UPDATE_INSTALLED:
            setSyncStatus(SyncStatus.UPDATE_INSTALLED)
            // CodePush.allowRestart()
            break
        }
      },
      ({ receivedBytes, totalBytes }) => {
        setReceivedBytes(receivedBytes)
        setTotalBytes(totalBytes)
      }
    )
  }, [])

  return {
    syncStatus,
    receivedBytes,
    totalBytes,
  }
}

export const useUpdateCheck = (): {
  updateAvailable: boolean | undefined
} => {
  const [updateAvailable, setUpdateAvailable] = useState<
    boolean | undefined
  >(undefined)

  const checkUpdate = async () => {
    console.log('CodePush::checkUpdate')

    const update = await CodePush.checkForUpdate()
    if (update) {
      setUpdateAvailable(true)
    } else {
      setUpdateAvailable(false)
    }
  }

  useEffect(() => {
    Platform.OS === 'android' && checkUpdate()

    const activeListener = (state: AppStateStatus) => {
      state === 'active' && checkUpdate()
    }

    AppState.addEventListener('change', activeListener)
    return () => {
      AppState.removeEventListener('change', activeListener)
    }
  }, [])

  return {
    updateAvailable,
  }
}

export const restartApp = (): void => {
  CodePush.allowRestart()
}
