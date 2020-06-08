import React from 'react'
import { Text, View, StyleSheet } from 'react-native'

import I18n from '../../Tool/Language'

import FontStyle from '../../Tool/Style/FontStyle'
import { transTimeToString } from '../../Tool/FunctionTool'

const Portrayal = props => {
  const { btos, hashrate, regdate, rank, exp, follow_me_count } = props
  return (
    <View
      style={{
        paddingLeft: 24,
        paddingRight: 24,
        marginTop: 32,
        marginBottom: 32
      }}>
      {/* <View style={styles.item}>
        <Text style={FontStyle.fontLightGray}>DTO</Text>
        <View style={styles.rightBg}>
          <Text style={[FontStyle.fontBlue, { fontSize: 13 }]}>{btos}</Text>
        </View>
      </View> */}

      <View style={styles.item}>
        <Text style={FontStyle.fontLightGray}>
          {I18n.t('my.portrayal_hashrate')}
        </Text>
        <View style={styles.rightBg}>
          <Text style={[FontStyle.fontBlue, { fontSize: 13 }]}>{hashrate}</Text>
        </View>
      </View>

      <View style={styles.item}>
        <Text style={FontStyle.fontLightGray}>
          {I18n.t('my.portrayal_regdate')}
        </Text>
        <View style={styles.rightBg}>
          <Text style={[FontStyle.fontBlue, { fontSize: 13 }]}>
            {transTimeToString(regdate)}
          </Text>
        </View>
      </View>

      <View style={styles.item}>
        <Text style={FontStyle.fontLightGray}>
          {I18n.t('my.portrayal_rank')}
        </Text>
        <View style={styles.rightBg}>
          <Text style={[FontStyle.fontBlue, { fontSize: 13 }]}>{rank}</Text>
        </View>
      </View>

      <View style={styles.item}>
        <Text style={FontStyle.fontLightGray}>
          {I18n.t('my.portrayal_exp')}
        </Text>
        <View style={styles.rightBg}>
          <Text style={[FontStyle.fontBlue, { fontSize: 13 }]}>{exp}</Text>
        </View>
      </View>

        <View style={styles.item}>
            <Text style={FontStyle.fontLightGray}>
                {I18n.t('my.follow_me_count')}
            </Text>
            <View style={styles.rightBg}>
                <Text style={[FontStyle.fontBlue, { fontSize: 13 }]}>{follow_me_count}</Text>
            </View>
        </View>
    </View>
  )
}

export default Portrayal
const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20
  },
  rightBg: {
    backgroundColor: '#F7F8FA',
    height: 32,
    width: 160,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20
  }
})
