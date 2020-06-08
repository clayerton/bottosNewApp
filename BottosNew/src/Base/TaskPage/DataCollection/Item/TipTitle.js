import React from 'react'
import { View, Image, Text, StyleSheet } from 'react-native'
import I18n from '../../../../Tool/Language'
import {isZHLanguage} from '../../../../Tool/FunctionTool'
const isZHLan = isZHLanguage()
const TipTitle = props => {
    let tipTop_zh = require('../../../../BTImage/Base/DataCollectionReview/base_task_ic_data_collection.png')
    let tipTop_en = require('../../../../BTImage/Base/DataCollectionReview/base_task_ic_data_collection_en.png')
    return (
    <View style={styles.Bg}>
      <Image
        style={{ width: isZHLan ? 50 : 111, height: 16,marginLeft:4, }}
        source={isZHLan ? tipTop_zh : tipTop_en}
      />
      <Text style={{ color: '#353B48', fontSize: 16, lineHeight:22 }}>{I18n.t('dataCollection.friendly_reminder')}</Text>
      <Text style={[styles.fontStyleContent, { marginTop: 5 }]}>
          {I18n.t('dataCollection.collection_explain1')}
      </Text>
      <Text style={styles.fontStyleContent}>{I18n.t('dataCollection.collection_explain2')}</Text>
      <Text style={styles.fontStyleContent}>{I18n.t('dataCollection.collection_explain3')}</Text>
      <Text style={styles.fontStyleContent}>
          {I18n.t('dataCollection.collection_explain4')}
      </Text>
      <Text style={styles.fontStyleContent}>
          {I18n.t('dataCollection.collection_explain5')}
      </Text>
    </View>
  )
}

export default TipTitle
const styles = StyleSheet.create({
  Bg: {
    backgroundColor: '#FFFFFF',
    margin: 8,
    paddingTop: 16,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 3,
      borderWidth:1,
      borderColor: '#DFEFFE',
  },
  fontStyleContent: {
    color: '#596379',
    fontSize: 12,
      lineHeight:18
  }
})
