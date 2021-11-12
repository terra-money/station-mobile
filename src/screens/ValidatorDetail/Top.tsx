import React, { ReactElement, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import _ from 'lodash'

import { Text, Icon } from 'components'
import Badge from 'components/Badge'
import { ValidatorUI } from 'lib'
import images from 'assets/images'
import { COLOR } from 'consts'
import useTerraAssets from 'lib/hooks/useTerraAssets'
import FastImagePlaceholder from 'components/FastImagePlaceholder'

const Top = ({ ui }: { ui: ValidatorUI }): ReactElement => {
  const { profile, moniker, status, operatorAddress } = ui
  const [validatorList, setValidatorList] = useState<
    Dictionary<string>
  >({})

  const { data } = useTerraAssets<Dictionary<string>>(
    'validators.json'
  )
  useEffect(() => {
    data && setValidatorList(data)
  }, [data])

  const isValidator = _.some(validatorList[operatorAddress.address])

  return (
    <View style={styles.container}>
      <View>
        <FastImagePlaceholder
          source={profile ? { uri: profile } : images.terra}
          style={styles.profileImage}
          placeholder={images.loading_circle}
        />
      </View>
      <Text style={styles.moniker} fontType={'bold'}>
        {moniker}
      </Text>
      <View style={{ flexDirection: 'row' }}>
        {isValidator && (
          <View style={styles.validatorIconBox}>
            <Icon name={'check'} color={'white'} />
          </View>
        )}
        <Badge
          text={status.toUpperCase()}
          containerStyle={{
            backgroundColor:
              status === 'active' ? '#1daa8e' : '#fd9a02',
          }}
        />
      </View>
    </View>
  )
}

export default Top

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    borderBottomColor: '#edf1f7',
    borderBottomWidth: 1,
    backgroundColor: COLOR.white,
  },
  profileImage: {
    borderRadius: 12,
    width: 60,
    height: 60,
    marginHorizontal: 12,
    marginBottom: 10,
  },
  moniker: {
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0,
    marginBottom: 5,
  },
  validatorIconBox: {
    marginRight: 6,
    backgroundColor: '#5493f7',
    borderRadius: 30,
    width: 17,
    height: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
