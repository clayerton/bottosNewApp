import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
    NetInfo,
    Dimensions,
  ImageBackground,
  Platform
} from 'react-native'
import BTFetch from '../../../../Tool/NetWork/BTFetch'
import { Toast } from 'antd-mobile-rn'
import {
  clearMapForKey,
  setLocalStorage,
  getRequestBody,
  getLocalStorage,
  devlog,
  getRequestURL,
  getImageURL
} from '../../../../Tool/FunctionTool'

import BTWaitView from '../../../../Tool/View/BTWaitView.config'
import NavStyle from '../../../../Tool/Style/NavStyle'
import Config from '../../../../Tool/Config'
import I18n from '../../../../Tool/Language'
import UserInfo from '../../../../Tool/UserInfo'
// 组件

import LongButton from '../../../../Tool/View/BTButton/LongButton'
import {Modal} from "antd-mobile-rn/lib/index.native";
import LocalImageAccess from '../../../../Tool/View/LocalImageAccess';
import {requestWithFile} from "../../../../Tool/NetWork/heightOrderFetch";


export default class PhotoCollection extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation
    return {
      headerLeft: (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.goBack()}
          style={NavStyle.leftButton}>
          <Image
            style={NavStyle.navBackImage}
            source={require('../../../../BTImage/navigation_back.png')}
          />
        </TouchableOpacity>
      ),
      headerRight:<TouchableOpacity
          activeOpacity={0.5}
          onPress={() => state.params.commitPage()}
          style={NavStyle.leftButton}>
          <Text style={NavStyle.rightText}>{I18n.t('task.task_delete')} </Text>
      </TouchableOpacity>,
      headerTitle: <Text style={NavStyle.navTitle}>{I18n.t('task.task_details')}</Text>,
      headerTintColor: '#fff',
      headerStyle: NavStyle.navBackground
    }
  }

  constructor(props) {
    super(props)
      //初始化调用定时器
      this.time = props.navigation.state.params.data.collection[0].end_at;
      this.now = props.navigation.state.params.data.time;
      this.countdown = this.time - this.now; //当前时间差
      const date = this.getDateData(this.countdown);

      this.collection_id = props.navigation.state.params.data.collection[0].collection_id;
      this.task_id = props.navigation.state.params.data.collection[0].task_id;
      this.attachment = props.navigation.state.params.data.collection[0].attachment;

      //草稿箱图片
      let imageArr = [];
      this.attachment && this.attachment.map((v,i)=>{
          imageArr.push({
              path: getImageURL(v.attachment_med_value),
              collection_attachment_id:v.collection_attachment_id,
              collection_id:v.collection_id,
              index:i,
              attachment_time:v.attachment_time,
          });
      });

    //   获取 时间&&像素 
    this.px = props.navigation.state.params.data.warning_record.px;
    this.limit_time = props.navigation.state.params.data.warning_record.time

        this.state = {
            images:[...imageArr],
            draft:[...imageArr], //草稿箱
            imageset:[],//新增的未上传的图片
            selectMap:[],
            edit:false, //编辑与删除
            timeLeft:date,
            lower_limit:'',
            upper_limit:'',
            network_status:null, //网络状态
        }
      props.navigation.setParams({
          commitPage: this.commitPage
      })
      this.onChangeUploadImage = this.onChangeUploadImage.bind(this)
      this.onDeletedUploadImage = this.onDeletedUploadImage.bind(this)
  }
  componentDidMount() {
      NetInfo.fetch().done((status)=> {
          this.setState({
              network_status:status,
          })
          devlog('Status:'+status);
      });
      devlog(this.props.navigation.state.params);
      this.interval = setInterval(()=> {
          this.countdown -- ;
          const date = this.getDateData(this.countdown);
          if (date && this.countdown >= 0) {
              this.setState({timeLeft:date});
          } else {
              this.stop();
          }
      }, 1000);
      this.getCollectionLimit();
  }
    //删除与编辑操作
    commitPage=()=>{

        if(this.state.edit){    //edit为true是 执行删除操作
            if(this.state.selectMap.length === 0){
                this.setState({
                    edit:!this.state.edit,
                    selectMap:[],
                });
                return;
            }
            Modal.alert(I18n.t('task.task_delete'), I18n.t('task.task_delete_sure'), [
                { text: I18n.t('tip.cancel'), onPress: () => devlog('cancel') },
                {
                    text: I18n.t('tip.confirm'),
                    onPress: ()=>this.bulletDelete()
                }
            ])

        }else{
            this.setState({
                edit:!this.state.edit,
            })
        }

    }

    //删除弹框
    bulletDelete(){
        //selectNum删除的元素    unSelectNum为未删除元素
        let selectNum =  this.state.images.filter((item,index)=>this.state.selectMap.indexOf(index) > -1);
        let unSelectNum = this.state.images.filter((item,index)=>this.state.selectMap.indexOf(index) === -1);
        devlog(selectNum,unSelectNum,'selectNum_unSelectNum')
        this.setState({
            edit:!this.state.edit,
            selectMap:[],
        });

        let sum = [];
        for(let i = 0;i < selectNum.length;i++){
            if(selectNum[i].hasOwnProperty('collection_attachment_id')){
                // let selectNum = this.state.selectNum.slice()

                sum = [...sum,selectNum[i].collection_attachment_id]
            }
        }
        let body = {
            collection_attachment_id:sum,
            collection_id:this.collection_id,
            task_id:this.task_id,
        };
        devlog({unSelectNum})
        if(sum.length === 0 ){
            // const status = this.state.unSelectNum.slice()
            // devlog(status,status)
            this.setState({
                images: [...unSelectNum],
            },()=>{
                devlog(this.state.images,'images,删除')
            });
            return;
        }
        let requestBody = getRequestBody(body)
        BTWaitView.show(I18n.t('tip.wait_text'))
        BTFetch('/collection/removeCollectionAttachment', requestBody)
            .then(res => {
                BTWaitView.hide()
                devlog(res)
                if (res.code === '0') {
                    devlog(...unSelectNum,)
                    // const unSelectNum1 = this.state.unSelectNum.slice()
                    this.setState({
                        images: [...unSelectNum],
                    })
                } else if (res.code === '99') {
                    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
                } else {
                    Toast.info(res.msg, Config.ToestTime, null, false)
                }
            })
            .catch(res => {
                BTWaitView.hide()
                Toast.offline(I18n.t('tip.offline'), Config.ToestTime, null, false)
            })
    }

  //定时器
    getDateData(diff) {
        if (diff <= 0) {
            return false;
        }
        const timeLeft = {
            days: 0,
            hours: 0,
            min: 0,
            sec: 0,
        };
        if (diff >= (365.25 * 86400)) {
            timeLeft.years = Math.floor(diff / (365.25 * 86400));
            diff -= timeLeft.years * 365.25 * 86400;
        }
        if (diff >= 86400) {
            timeLeft.days = Math.floor(diff / 86400);
            diff -= timeLeft.days * 86400;
        }
        if (diff >= 3600) {
            timeLeft.hours = Math.floor(diff / 3600);
            diff -= timeLeft.hours * 3600;
        }
        if (diff >= 60) {
            timeLeft.min = Math.floor(diff / 60);
            diff -= timeLeft.min * 60;
        }
        timeLeft.sec = diff;
        return timeLeft;
    }

    getCollectionLimit() {
        let body = {
            task_id:this.task_id,
        };
        let requestBody = getRequestBody(body)
        BTFetch('/collection/getCollectionLimit', requestBody)
            .then(res => {
                const { data } = res;
                if (res.code === '0') {
                    this.setState({
                        lower_limit:data.lower_limit,
                        upper_limit:data.upper_limit,
                    })
                } else if (res.code === '99') {
                    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
                } else {
                    Toast.info(res.msg, Config.ToestTime, null, false)
                }
            })
            .catch(res => {
                BTWaitView.hide()
                Toast.offline(I18n.t('tip.offline'), Config.ToestTime, null, false)
            })
    }
    onChangeUploadImage(fileList,newFileList){
        const {images} = this.state;
        devlog({fileList})
        this.setState(prevState => ({
            images: [...prevState.images, ...fileList],
            imageset:newFileList,
            files:[],
            multiple:false,
        }))
    }

    onDeletedUploadImage(){

    }
    //放弃任务
    giveUpTask(){
        Modal.alert(I18n.t('tip.confirm'), I18n.t('task.task_giveup'), [
            { text: I18n.t('tip.cancel'), onPress: () => devlog('cancel') },
            {
                text: I18n.t('tip.confirm'),
                onPress: ()=>this.giveUpTaskSure()
            }
        ])
    }
    //弹出确认放弃任务
    giveUpTaskSure(){
        let formData = new FormData()
        formData.append('token', UserInfo.token)
        formData.append('collection_id', this.collection_id)
        formData.append('task_id', this.task_id)
        formData.append('handle', 0)
        BTWaitView.show(I18n.t('tip.wait_text'))
        requestWithFile('/collection/memberCollectionHandle', formData)
            .then(res => {
                BTWaitView.hide()
                if (res.code === '0') {
                    Toast.hide()
                    Toast.success(res.msg, Config.ToestTime, null, false)
                    this.setState({
                        images: [],
                    });
                    let task={task_id:this.task_id};
                    this.props.navigation.state.params.callback(task);//返回父级刷新状态
                    this.props.navigation.goBack()
                } else if (res.code === '99') {
                    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
                } else {
                    Toast.info(res.msg, Config.ToestTime, null, false)
                }
            })
            .catch(res => {
                BTWaitView.hide()
                Toast.offline(I18n.t('tip.offline'), Config.ToestTime, null, false)
            })

    }
    //保存草稿
    saveDraft(){
        const { images } = this.state
        // 限制保存草稿个数
        if(1 > images.length || images.length > this.state.upper_limit){
            Toast.info(I18n.t('task.task_upper_limit')+`${this.state.upper_limit}`+I18n.t('task.task_down_limit'), Config.ToestTime, null, false);
            return;
        }
        //判断图片像素大于 500万
        let xs =  this.state.images.filter((value,index) =>{
            return value.width * value.height < this.px * 10000
          });
        if(this.task_id ===17 && xs.length>0){
            Toast.info(I18n.t('dataCollection.collection_px1')+`${this.px}`+I18n.t('dataCollection.collection_px2'), Config.ToestTime, null, false);
            return
        }
        // 新增的保存草稿的图片
        let afterdraft =  this.state.images.filter((item,index) =>{
          return  JSON.stringify(this.state.draft).indexOf(JSON.stringify(item)) === -1
        });
        // devlog(afterdraft,this.state.images,this.state.draft,'保存草稿筛选')
        if(afterdraft.length===0){
            Toast.success(I18n.t('invite.Invite_save_success'), Config.ToestTime, null, false);
            return;
        }
        //判断如果this.state.network_status 非WIFI状态下保存草稿，显示提示框；
        if(this.state.network_status !== 'WIFI' && this.state.network_status !== 'wifi'){
            Modal.alert(I18n.t('tip.confirm'), I18n.t('task.task_online'), [
                { text: I18n.t('tip.cancel'), onPress: () => {} },
                {
                    text: I18n.t('tip.confirm'),
                    onPress: ()=>this.saveDraftSure(afterdraft)
                }
            ])
        }else{
            this.saveDraftSure(afterdraft)
        }


    }

    //非WIFI状态下保存操作

    saveDraftSure(afterdraft){
        let formData = new FormData()

        for (let i = 0; i < afterdraft.length; i++) {
            let uri = afterdraft[i].path
            let index = uri.lastIndexOf('/')
            let name = uri.substring(index + 1)
            let file = { uri, type: 'application/octet-stream', name }
            formData.append('picture' + i, file)
            if(Platform.OS === 'ios'){
                let creation_ios = 0; //针对ios相机相册选取时间字段不兼容
                if(afterdraft[i].creationDate){
                    creation_ios = afterdraft[i].creationDate
                }else{
                    creation_ios = Date.parse(new Date())/1000
                }
                formData.append('picture' + i + '_time',creation_ios)
            }else{
                let newDateShow = afterdraft[i].exif &&  afterdraft[i].exif.DateTime && afterdraft[i].exif.DateTime.split(':')[0];
                formData.append('picture' + i + '_time',Date.parse(new Date(newDateShow))/1000)
            }
            
        }


        Toast.loading('Loading...', 0)

        formData.append('token', UserInfo.token)
        formData.append('collection_id', this.collection_id)
        formData.append('task_id', this.task_id)
        formData.append('handle', 1)
       
        requestWithFile('/collection/memberCollectionHandle', formData)
            .then((res) => {
                this.setState({
                    repeat: true
                })
               devlog('collection/memberCollectionHandle res', res);
                if (res.code === '0') {
                    Toast.hide()
                    Toast.success(res.msg, Config.ToestTime, null, false)
                    let imagedraShow = [];
                    res.data && res.data.map((v,i)=>{
                        imagedraShow.push({
                            path: getImageURL(v.attachment_med_value),
                            collection_attachment_id:v.collection_attachment_id,
                            collection_id:v.collection_id,
                            index:i,
                            attachment_time:v.attachment_time,
                        });
                    });
                    devlog(imagedraShow,'imagedraShow');
                    this.setState({
                        images:[...imagedraShow],
                        draft:[...imagedraShow],
                    });
                } else if (res.code === '99') {
                    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter,res.msg);
                } else {
                    let msg = res.msg
                    Toast.hide()
                    Toast.fail(res.msg, Config.ToestTime, null, false)
                }
            })
            .catch((error) => {
                Toast.hide()
                Toast.offline(I18n.t('tip.offline'), Config.ToestTime, null, false)
            })
    }



    //提交任务
    submiTask(){
        const { images } = this.state
         //判断图片像素大于 500万
         let xs =  this.state.images.filter((value,index) =>{
            return value.width * value.height < this.px * 10000
          });
        if(this.task_id ===17 && xs.length>0){
            Toast.info(I18n.t('dataCollection.collection_px1')+`${this.px}`+I18n.t('dataCollection.collection_px2'), Config.ToestTime, null, false);
            return
        }
      
        let arr = [];
        this.task_id === 17 && images.map((value,index)=>{
            if(value.hasOwnProperty('attachment_time')){
                arr.push(value.attachment_time)
            }else{
                if(Platform.OS === 'ios'){
                    let create_null = Date.parse(new Date())/1000
                    value.creationDate ? 
                        arr.push(Number(value.creationDate))
                    :
                    arr.push(Number(create_null))
                }else{
                    let newDateShow =  value.exif && value.exif.DateTime && value.exif.DateTime.split(':')[0];
                    // arr.push('picture' + i + '_time',Date.parse(new Date(newDateShow))/1000)
                    arr.push(Date.parse(new Date(newDateShow))/1000)
                }

                // arr.push(Number(value.creationDate))
            }
        })
        //2015-01-01 00:00:00 时间戳 1420041600
        let i = j = 0;  //i<2015 j>2015
        let isYear = this.task_id ===17 && arr.filter((value,index)=>{
            let atime = (new Date(value * 1000)).getFullYear();
            if( atime >= this.limit_time){
                j ++;
            }else{
                i ++
            }
        })
       

        if(this.state.lower_limit > images.length || images.length > this.state.upper_limit){
            Toast.info(I18n.t('task.task_upper_limit')+`${this.state.upper_limit}`+I18n.t('task.task_down_limit_num')+`${this.state.lower_limit}`+I18n.t('task.task_down_limit_price'),1);
            return;
        }
        //判断上传图片时间年份大于/小于2015年不得少于5张
        devlog({i,j})
            if(this.task_id ===17 && i < 5){
                Toast.info(`${this.limit_time}`+I18n.t('dataCollection.collection_limit_timedown'), Config.ToestTime, null, false);
                return;
            }
            if(this.task_id ===17 && j < 5 ){
                Toast.info(`${this.limit_time}`+I18n.t('dataCollection.collection_limit_timeup'), Config.ToestTime, null, false);
                return
            }
        
         //    新增的上传图片
        let afterdraft =  this.state.images.filter((item,index) =>
            JSON.stringify(this.state.draft).indexOf(JSON.stringify(item)) === -1
        );
        //   判断当前网络是否处于WIFI状态下
        if(this.state.network_status !== 'WIFI' && this.state.network_status !== 'wifi'){
            Modal.alert(I18n.t('tip.confirm'), I18n.t('task.task_online'), [
                { text: I18n.t('tip.cancel'), onPress: () => {} },
                {
                    text: I18n.t('tip.confirm'),
                    onPress: ()=>this.submiTaskSure(afterdraft)
                }
            ])
        }else{
            this.submiTaskSure(afterdraft)
        }



    }
    //非WIFI状态下提交
    submiTaskSure(afterdraft){
     
        let formData = new FormData()

        for (let i = 0; i < afterdraft.length; i++) {
            let uri = afterdraft[i].path
            let index = uri.lastIndexOf('/')
            let name = uri.substring(index + 1)
            let file = { uri, type: 'application/octet-stream', name }
            formData.append('picture' + i, file)
            if(Platform.OS === 'ios'){
                let creation_ios = 0; //针对ios相机相册选取时间字段不兼容
                if(afterdraft[i].creationDate){
                    creation_ios = afterdraft[i].creationDate
                }else{
                    creation_ios = Date.parse(new Date())/1000
                }
                formData.append('picture' + i + '_time',creation_ios)
                // formData.append('picture' + i + '_time',afterdraft[i].creationDate)
            }else{
                let newDateShow = afterdraft[i].exif.DateTime && afterdraft[i].exif.DateTime.split(':')[0];
                formData.append('picture' + i + '_time',Date.parse(new Date(newDateShow))/1000)
            }
        }

        //防止多次发送帖子
        BTWaitView.show(I18n.t('tip.wait_text'))

        formData.append('token', UserInfo.token)
        formData.append('collection_id', this.collection_id)
        formData.append('task_id', this.task_id)
        formData.append('handle', 2)
        devlog('formData', formData);

        requestWithFile('/collection/memberCollectionHandle', formData)
            .then((res) => {
                this.setState({
                    repeat: true
                })
                BTWaitView.hide()
                if (res.code === '0') {
                    Toast.success(res.msg, Config.ToestTime, null, false)
                    let task={task_id:this.task_id};
                    this.props.navigation.state.params.callback(task);//返回父级刷新状态
                    this.props.navigation.goBack();
                } else if (res.code === '99') {
                    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter,res.msg);
                } else {
                    let msg = res.msg
                    Toast.hide()
                    Toast.fail(res.msg, Config.ToestTime, null, false)
                }
            })
            .catch((error) => {
                Toast.hide()
                Toast.offline(I18n.t('tip.offline'), Config.ToestTime, null, false)
            })
    }

    //选中删除操作
    selectDetail(i){
        if(this.state.selectMap.indexOf(i) > -1 ){
            let arr = this.state.selectMap.filter( e => e != i)
            this.setState({
                selectMap:arr,
            })
        }else{
            this.setState({
                selectMap:[...this.state.selectMap,i],
            })
        }
    }
    //清空时间倒计时定时器
    stop(){
        clearInterval(this.interval);
    }
    componentWillUnmount() {
        this.stop();
    }

  render() {
      let selectImg = require('../../../../BTImage/Base/DataCollectionReview/task_collection_select.png');
      let unselectImg = require('../../../../BTImage/Base/DataCollectionReview/task_collection_unselect.png');
    // devlog(this.state.images,'images')
      return (
      <View style={[NavStyle.container,]}>
          <View style={styles.detailHeader}>
              <Text style={[styles.detailHeaderTask,{marginRight:20,marginLeft:10,}]}>{I18n.t('task.task_limit_quantity')}</Text>
              <Text style={[styles.detailHeaderTask,{color:'#000'}]}>{I18n.t('dataCollection.hand_overtime')}
                  {this.state.timeLeft.days < 10 ? '0' + this.state.timeLeft.days:this.state.timeLeft.days}{I18n.t('task.task_day')}
                  {this.state.timeLeft.hours < 10 ? '0' + this.state.timeLeft.hours:this.state.timeLeft.hours}{I18n.t('task.task_hour')}
                  {this.state.timeLeft.min< 10 ? '0' + this.state.timeLeft.min:this.state.timeLeft.min}{I18n.t('task.task_minute')}
                  {this.state.timeLeft.sec< 10 ? '0' + this.state.timeLeft.sec:this.state.timeLeft.sec}{I18n.t('task.task_second')}
              </Text>
          </View>
          <ScrollView style={{flex:1,}}>
              <View style={styles.detailContent}>
                  <LocalImageAccess
                      onChange={this.onChangeUploadImage}
                      maxFileNum={24}
                      imageList={this.state.images}
                      showImageList={false}
                      rootStyle={{margin:0,flexGrow:0}}
                      imagesListShow = {true}
                  >
                      <View style={[styles.localView,styles.localViewImg,{marginBottom:20,}]}>
                          <Image style={styles.localCamera} source={require('../../../../BTImage/Base/DataCollectionReview/base_task_data_collection_camera.png')}/>
                      </View>
                  </LocalImageAccess>
                  {this.state.images &&
                        this.state.images.map((v,i)=>{
                            let pxShow = (v.width) && (v.height) &&  (v.width * v.height < this.px * 10000) 
                          return ( this.state.edit ?
                                  <TouchableOpacity
                                      activeOpacity={0.5}
                                      onPress={()=>this.selectDetail(i)}
                                      key={i}
                                  >
                                      <View style={[styles.localView,{height:(UserInfo.screenW - 28)/4 - 4 + 20,}]}>
                                          <Image style={styles.localView} key={i} source={{uri:v.path}} />
                                          <Image style={styles.detailImg} source={this.state.selectMap.indexOf(i) > -1 ? selectImg : unselectImg} />
                                          { this.task_id ===17 && pxShow ? 
                                                <View style={styles.maskView}>
                                                    <Text style={styles.maskText}>{I18n.t('dataCollection.collection_px1')+`${this.px}`+I18n.t('dataCollection.collection_px2')}</Text>
                                                </View> 
                                                : 
                                                null
                                            }
                                          <Text style={styles.isShowYear}>
                                                {this.task_id ===17 ? (v.attachment_time ? 
                                                    (new Date(v.attachment_time * 1000)).getFullYear()
                                                    :
                                                    Platform.OS === 'ios' ?
                                                        (v.creationDate ? (new Date(v.creationDate * 1000)).getFullYear()
                                                            :
                                                            (new Date()).getFullYear()
                                                        )
                                                        :
                                                        v.exif.DateTime && v.exif.DateTime.split(':')[0]
                                                    ):
                                                    null
                                                }
                                          </Text>
                                      </View>
                                  </TouchableOpacity>
                                 :
                                <View style={[styles.localView,{ height:(UserInfo.screenW - 28)/4 - 4 + 20, }]}>
                                    <Image style={[styles.localView,]} key={i} source={{uri:v.path}} />
                                    { this.task_id ===17 && pxShow ? 
                                        <View style={styles.maskView}>
                                            <Text style={styles.maskText}>{I18n.t('dataCollection.collection_px1')+`${this.px}`+I18n.t('dataCollection.collection_px2')}</Text>
                                        </View> 
                                        : 
                                        null
                                    }
                                    
                                    <View style={{height:16}}>
                                        <Text style={styles.isShowYear}>
                                            {this.task_id ===17 ? (v.attachment_time ? 
                                                (new Date(v.attachment_time * 1000)).getFullYear()
                                                :
                                                Platform.OS === 'ios' ?
                                                (v.creationDate ? (new Date(v.creationDate * 1000)).getFullYear()
                                                    :
                                                    (new Date()).getFullYear()
                                                )
                                                    :
                                                    v.exif.DateTime && v.exif.DateTime.split(':')[0]
                                                ):
                                                null
                                            }
                                        </Text>    
                                    </View>
                                </View>
                             )
                        })
                  }
              </View>
          </ScrollView>
          <View style={styles.collectionDetailBottem}>
              <LongButton
                  onPress={() => {
                        this.giveUpTask()
                  }}
                  style={styles.longButtonStyle}
                  textStyle={{ color:'#046FDB' }}
                  title={I18n.t('dataCollection.collection_gaveup')}
              />
              <LongButton
                  onPress={() => {
                        this.saveDraft()
                  }}
                  style={styles.longButtonStyle}
                  textStyle={{ color:'#046FDB' }}
                  title={I18n.t('dataCollection.collection_draft')}
              />
              <LongButton
                  onPress={() => {
                      this.submiTask()
                  }}
                  style={styles.longButtonStyle}
                  textStyle={{ color:'#046FDB' }}
                  title={I18n.t('dataCollection.collection_submit')}
              />
          </View>

      </View>
    )
  }
}

const styles=StyleSheet.create({
    detailHeader:{
        flexDirection:'row',
        marginTop:16,
        marginBottom:32,
        marginLeft:16,
        marginRight:16,
        borderBottomWidth:1,
        borderTopWidth:1,
        borderColor:'#D1D5DD',
    },
    detailHeaderTask:{
        fontSize:14,
        color:'#8395A7',
        lineHeight:20,
        alignSelf:'center',
        paddingTop:8,
        paddingBottom:8,
    },
    detailContent:{
        paddingLeft:14,
        paddingRight:14,
        flexDirection:'row',
        flexWrap:'wrap',
    },
    collectionDetailBottem:{
        marginTop:15,
        marginBottom:16,
        paddingLeft:16,
        paddingRight:16,
        justifyContent:'space-between',
        flexDirection:'row',
    },
    longButtonStyle:{
        width:104,
        height:50,
        borderWidth:1,
        borderColor:'#046FDB',
        backgroundColor:'#fff',
    },
    rightText:{
        lineHeight:44,
        height: 44,
        color: '#046FDB',
        fontSize: 16,
        backgroundColor: '#ff00f000',
    },
    localView:{
        width:(UserInfo.screenW - 28)/4 - 4,
        height:(UserInfo.screenW - 28)/4 - 4, 
        marginRight:4,
        borderRadius:4,
        marginBottom:4,
        position:'relative',
    },
    localViewImg:{
        backgroundColor:'#eee',
        justifyContent:'center',
        alignItems:'center',
    },
    localCamera:{
        width:34,
        height:30,
    },
    detailImg:{
        width:27,
        height:27,
        position:'absolute',
        right:5,
        top:5,
    },
    //
    isShowYear:{
        height:16,
        lineHeight:16,
        fontSize:14,
        textAlign:'center',
    },
    //遮罩层
    maskView:{
        width:(UserInfo.screenW - 28)/4 - 4,
        height:(UserInfo.screenW - 28)/4 - 4, 
        borderRadius:4,
        position:'absolute',
        top:0,
        left:0,
        backgroundColor:'rgba(0,0,0,0.5)',
        justifyContent:'center',
        alignItems:'center',
    },
    maskText:{
        fontSize:12,
        color:'#fff',
        textAlign:'center'
    }
});
