import React from 'react'
import {
  View,
  Image,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity
} from 'react-native'
import I18n from '../../../../Tool/Language'
import LongButton from '../../../../Tool/View/BTButton/LongButton'
import UserInfo from '../../../../Tool/UserInfo'
import { getRequestBody, devlog } from '../../../../Tool/FunctionTool'
const MissionCard = props => {
  const { task_id, gift_value, task_name, link_intro,currency_name } = props


  // 创建按钮上的文字
  const createStatusStr = status => {
    let str = ''
    status === -1 && (str = I18n.t('dataCollection.hand_start'))
    status === 0 && (str = I18n.t('dataCollection.hand_already_end'))
    status === 1 && (str = I18n.t('dataCollection.hand_already_check'))
    status === 2 && (str = I18n.t('dataCollection.hand_already_submit'))
    status === 3 && (str = I18n.t('dataCollection.hand_already_audit'))
    status === 4 && (str = I18n.t('dataCollection.hand_already_notpass'))
    status === 5 && (str = I18n.t('dataCollection.hand_already_pass'))
    return str
  }

  // 背景图
  const ImageBgUrl = taskId => {
    let imageUrl = null
    // 手写体
    taskId === 10 &&
      (imageUrl = require('../../../../BTImage/Base/DataCollectionReview/base_task_data_collection_group2.png'))
    // 数据采集任务
    taskId === 4 &&
      (imageUrl = require('../../../../BTImage/Base/DataCollectionReview/base_task_data_collection_group1.png'))
    taskId === 12 &&
    (imageUrl = require('../../../../BTImage/Base/DataCollectionReview/base_task_data_collection_group3.png'))

    taskId === 17 &&
    (imageUrl = require('../../../../BTImage/Base/DataCollectionReview/base_task_data_collection_group3.png'))
    //社区共建
    taskId === 20 &&
    (imageUrl = require('../../../../BTImage/Base/DataCollectionReview/base_task_data_collection_group4.png'))

      return imageUrl
  }

  const onPressLinkIntro = linkIntro => {
    const { onPressLinkIntro } = props
    onPressLinkIntro && onPressLinkIntro(linkIntro)
  }

  // 点击开始任务
  const _onPress = (taskId) => {
    const { onPress } = props
    onPress && onPress(taskId)
  }
    let achievers = 0;
    let doing = 0;
    let tasklimits = 0;
    if(props.hasOwnProperty('status')) {
        achievers = props.status.achievers;
        doing = props.status.doing;
        tasklimits = props.status.tasklimits;
    }
  return (
    <View style={styles.Bg}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between',paddingLeft:24,paddingRight:24, }}>
        <Text style={{ color: '#353B48', fontSize: 16, fontWeight:'bold' }}>{task_name}</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
          <Text style={{ color: '#596379 ',fontSize:12, }}>{I18n.t('dataCollection.hand_surplus')}</Text>
          <Text style={{ color: '#046FDB',fontSize:12, }}>
            {achievers + doing}/{tasklimits}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          onPressLinkIntro(link_intro)
        }}>
        <ImageBackground
          style={{
            width: (UserInfo.screenW - 64),
            height: (UserInfo.screenW - 64) * 119 / 311,

            marginTop: 8,
            marginBottom: 12,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
              alignSelf:'center'
          }}
          source={ImageBgUrl(task_id)}>
          <Text style={{ color: '#fff', fontSize: 20, fontWeight:'bold' }}>{I18n.t('dataCollection.hand_explain1')}</Text>
          <Text style={[styles.task_image_text,{ marginTop: 16 }]}>{I18n.t('dataCollection.hand_explain2')}</Text>
          <Text style={styles.task_image_text}>{I18n.t('dataCollection.hand_explain3')}</Text>
          <Text style={styles.task_image_text}>················</Text>
        </ImageBackground>
      </TouchableOpacity>

      <View style={styles.dataContentTouch}>
        <View style={styles.dataContentTouchView}>
            <Text style={styles.dataContentReward}>{I18n.t('dataCollection.hand_award')}:</Text>
            <Text style={[styles.dataRewardText]}>{parseInt(gift_value)}</Text>
            <Text style={[styles.dataRewardText]}>{currency_name}</Text>
        </View>
        <LongButton
          onPress={() => {
            _onPress(task_id)
          }}
          style={{ width: 99, height: 32, lineHeight:32, }}
          textStyle={{height:32,lineHeight:32,fontSize:13,}}
          title={props.status && createStatusStr(props.status.status)}
        />
      </View>
    </View>
  )
}

export default MissionCard
const styles = StyleSheet.create({
  Bg: {
    backgroundColor: '#FFFFFF',
    margin: 8,
    paddingTop: 16,
    paddingBottom: 8,
    borderRadius: 3,
      borderWidth:1,
      borderColor: '#DFEFFE',
  },
  dataContentTouch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#EFF0F3',
    borderTopWidth: 1,
    paddingTop: 10,
      paddingRight:24,
      paddingLeft:24,
  },
  dataContentReward: {
    lineHeight: 24,
    fontSize: 16,
    color: '#596379',
      paddingRight:16,
      fontWeight:'bold',
  },
  dataRewardText: {
      color: '#F15B40',
      lineHeight: 24,
      fontSize: 16,
      paddingRight:3,
      fontWeight:'bold',
  },
    dataContentTouchView:{
      flexDirection:'row',
    },
    task_image_text:{
      color: '#fff',
       lineHeight:17,
       fontSize:12,
    },
})
