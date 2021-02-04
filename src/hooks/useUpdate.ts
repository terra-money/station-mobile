import { useEffect, useState } from 'react'
import { AppState, AppStateStatus, Platform } from 'react-native'

import CodePush from 'react-native-code-push'

export enum SyncStatus {
  UP_TO_DATE,
  DOWNLOADING_PACKAGE,
  INSTALLING_UPDATE,
  UPDATE_INSTALLED,
}

interface Update {
  checkUpdate: (version: string) => Promise<boolean>
  syncUpdate: () => void
  isUpToDate: boolean
  receivedBytes: number
  totalBytes: number
  syncProgress: number
}

export const useUpdate = (): Update => {
  const [isUpToDate, setIsUpToDate] = useState(false)
  const [receivedBytes, setReceivedBytes] = useState(0)
  const [totalBytes, setTotalBytes] = useState(0)
  const [syncProgress, setSyncProgress] = useState(0)

  useEffect(() => {
    totalBytes > 0 && setSyncProgress(receivedBytes / totalBytes)
  }, [receivedBytes])

  const checkUpdate = async (version: any): Promise<boolean> => {
    let updateAvailable: boolean

    try {
      const currentVersion = (
        await CodePush.getUpdateMetadata()
      )?.label.slice(1)
      const serverVersion = (Platform.OS === 'ios'
        ? version.ios
        : version.android
      ).slice(1)
      console.log('currentVersion', currentVersion)
      console.log('serverVersion', serverVersion)

      if (
        currentVersion === undefined ||
        (serverVersion &&
          parseInt(serverVersion) > parseInt(currentVersion))
      ) {
        const update = CodePush.checkForUpdate()
        if (update) {
          updateAvailable = true
        } else {
          updateAvailable = false
        }
      } else {
        updateAvailable = false
      }
    } catch (e) {
      updateAvailable = false
    }
    return updateAvailable
  }

  const syncUpdate = async () => {
    CodePush.sync(
      {
        updateDialog: undefined,
        installMode: CodePush.InstallMode.IMMEDIATE,
      },
      (status) => {
        switch (status) {
          case CodePush.SyncStatus.UP_TO_DATE:
            console.log('CodePush.SyncStatus.UP_TO_DATE')
            setIsUpToDate(true)
            break
          case CodePush.SyncStatus.UPDATE_INSTALLED:
            console.log('CodePush.SyncStatus.UPDATE_INSTALLED')
            CodePush.allowRestart()
            break
        }
      },
      ({ receivedBytes, totalBytes }) => {
        setReceivedBytes(receivedBytes)
        setTotalBytes(totalBytes)
      }
    )
  }

  return {
    checkUpdate,
    syncUpdate,
    isUpToDate,
    receivedBytes,
    totalBytes,
    syncProgress,
  }
}
