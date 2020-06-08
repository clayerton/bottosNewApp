import React from 'react'
import { Text, View } from 'react-native'

const VersionLogItem = props => {
  const { description, updateTime, version } = props
  return (
    <View key={version}>
      <View
        style={{
          borderBottomColor: '#EFF0F3',
          borderBottomWidth: 1
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginLeft: 16,
            marginRight: 16,
            marginTop: 16,
            marginBottom: 8
          }}>
          <Text
            style={{
              color: '#596379',
              fontSize: 12
            }}>{`Wali(V ${version})`}</Text>
          <Text
            style={{
              color: '#596379',
              fontSize: 12
            }}>
            {updateTime}
          </Text>
        </View>
      </View>
      <View style={{ marginBottom: 16, marginLeft: 16, marginTop: 8 }}>
        {description &&
          description.map((item, i) => {
            return (
              <Text
                style={{
                  color: '#8395A7',
                  fontSize: 12
                }}
                key={i}>{`${i + 1}.${item}`}</Text>
            )
          })}
      </View>
    </View>
  )
}

export default VersionLogItem
