import React, { PureComponent } from 'react'
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  Dimensions,
} from 'react-native'
// import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import ImagePicker from 'react-native-image-crop-picker';
import { Toast, ActionSheet } from 'antd-mobile-rn'
// 方法
import Config from "../Config";
import I18n from '../Language'
import {devlog} from "../FunctionTool";

// import { fcDarkGray } from '../Style/FontStyle'
const { width } = Dimensions.get('window')

const paddingWidth = 18;
const imgWidth = (width - 80) / 3;
// console.log('imgWidth', imgWidth);

// function blueText(text) {
//   return <Text style={{ color: '#046FDB', fontSize: 18 }}>{text}</Text>
// }

// const options = [blueText(I18n.t('localImageAccess.camera')), blueText(I18n.t('localImageAccess.gallery')), blueText(I18n.t('tip.cancel'))]
const options = [I18n.t('localImageAccess.camera'), I18n.t('localImageAccess.gallery'), I18n.t('tip.cancel')]

// 返回的 image 的对象的模板
// {
//   exif:{SubSecTime: null, GPSLatitudeRef: null, WhiteBalance: null, GPSDateStamp: null, GPSLatitude: null}
//   height:1280,
//   mime:"image/jpeg",
//   modificationDate:"1532055617000",
//   path:"file:///storage/emulated/0/Pictures/image-312658b4-a13a-4fea-a20a-7ebe4855009e1565999715733245289.jpg",
//   size:148027,
//   width:960
// }


// 用法
const defaultProps = {
  maxFileNum: 9,
  showImageList: true,
  cropping: false,
  width: 500,
  height: 500,
  rootStyle: {
    marginTop: 9,
    marginRight: 5,
    paddingLeft: paddingWidth
  },
  imagesListShow: false, // 区别选出增加的图片
  imgWidth:imgWidth  //自定义图片样式 
};

const propTypes = {
  onChange: PropTypes.func.isRequired, // 回调函数，返回一个数组，必选参数
  maxFileNum: PropTypes.number, // 最大文件数量，默认值 9
  imageList: PropTypes.array, // 图片列表，如果这个参数存在，将替代组件内的 imageList
  showImageList: PropTypes.bool, // 是否显示图片列表，默认为 true
  cropping: PropTypes.bool, // 是否对图片进行裁剪，默认为 false
  width: PropTypes.number, // 取得的图片的裁剪宽度设定
  height: PropTypes.number, // 取得想图片的裁剪高度设定
  rootStyle: PropTypes.object, // 根组件的样式
  children: PropTypes.any, // 如果传了子组件，则不会出现触发按钮
  imagesListShow:PropTypes.bool,// 是否区别选出增加的图片
  imgWidth:PropTypes.number //图片样式-宽度
};

export default class LocalImageAccess extends PureComponent {
  static defaultProps = defaultProps

  static propTypes = propTypes

  constructor(props) {
    super(props)
    const imageList = props.imageList
    this.state = {
      isUpdate:false,
      images: imageList || [],
    }

  }

  showActionSheet = () => {

    ActionSheet.showActionSheetWithOptions({
      title: I18n.t('localImageAccess.choose'),
      options,
      cancelButtonIndex: 2,
    }, this.onActionPress)

    // this.ActionSheet.show()
  }

  onActionPress = (index) => {
    // 0 是相机
    // 1 是相册
    // 2 是 cancel，目前不用处理
    // console.log('index', index);
    if (index === 0) {
      this.pickSingleWithCamera()
    } else if (index === 1) {
      // console.log('点中这个了吗？？？？？？？？？');
      this.pickMultipleFromGallery()
    } else {

    }
  }

  // 调用手机相机
  pickSingleWithCamera() {
    const { cropping, width, height } = this.props
    ImagePicker.openCamera({
      cropping, width, height,
      includeExif: true,
      mediaType: 'photo'
      // compressImageQuality:0.5,
    })
      .then((image) => {
        // console.log('pickSingleWithCamera image: ', image);
        this.pickMultipleToImageList([image])
      })
      .catch((err) => {
        // console.log('err', err)
        // Toast.info('请选择上传图片', Config.ToestTime, null, false)
      })
  }

  // 可选择多张图片。
  // 選擇多圖 多余9张
  pickMultipleFromGallery() {
    let currentImageSum = this.state.images.length
    const { cropping, width, height, maxFileNum } = this.props

    ImagePicker.openPicker({
      cropping, width, height,
      multiple: maxFileNum > 1,
      waitAnimationEnd: false,
      includeExif: true,
      // mediaType: 'photo',
      maxFiles: maxFileNum - currentImageSum,
    })
    .then((images) => {
      if (Platform.OS !== 'ios') {
        if (currentImageSum + images.length > maxFileNum) {
          Toast.fail(I18n.t('localImageAccess.no_more1') + maxFiles + I18n.t('localImageAccess.no_more2'), Config.ToestTime)
          return
        }
      }
      if (maxFileNum > 1) {
        this.pickMultipleToImageList(images)
      } else {
        this.pickMultipleToImageList([images])
      }
    })
    .catch((err) => {
      // console.log('err', err)
      // Toast.info('请选择上传图片', Config.ToestTime, null, false)
    })
  }

    // 處理imagesList数据
    pickMultipleToImageList(images) {
        //  console.log('pickMultipleToImageList images: ', images)
        const { imageList, onChange,imagesListShow } = this.props

        // const newImagesList1 = [...imageList, ...images]

        // 如果 imageList 是受控的
        // 则返回一个新的增加后的 list
        // if ( Array.isArray(imageList) ) {
        //     onChange(newImagesList1)
        //     return;
        // }

        // imagesListShow默认为false 是否选出新增图片 add by lhy
        if(imagesListShow){
          onChange(images)
        }else{
            const newImagesList2 = [...this.state.images, ...images]

            for (let i = 0; i < newImagesList2.length; i++){
                let img = newImagesList2[i];
                img.isShowDelete = false
            }
    
            this.setState({
                images: newImagesList2
            })
    
            onChange(newImagesList2)
        }
        

    }

    //选择图片，增加删除按钮 add by zzl
    selectImageView = (img) => {
        img.isShowDelete = ! img.isShowDelete;
        this.forceUpdate()
    }

    //删除图片 add by zzl
    deleteImageView = (img) => {
        devlog('+++++++1111++++++++++=',img);
        devlog('++++++++22222++++++++=',this.state.images);
        for (let index = 0; index < this.state.images.length; index++){
            let data = this.state.images[index];
            if (data.filename === img.filename){
                this.state.images.splice(index,1)
                this.forceUpdate()
            }
        }
    }

  render() {
    const { imageList, showImageList, children, rootStyle, imgWidth } = this.props
        // devlog('++++++++1++++++++++=',this.state.images);

      const imgViews = this.state.images.map((img) => (
          <View style={styles.imgContainer} key={img.path}>
              <TouchableOpacity activeOpacity={0.5} style={{width: imgWidth,height:imgWidth}} onPress={() => this.selectImageView(img)}>
                  <Image style={[styles.pickedImg,{width: imgWidth,
              height: imgWidth,}]} source={{uri: img.path}}/>
              </TouchableOpacity>
              {
              img.isShowDelete ?

                  <TouchableOpacity activeOpacity={1} style={{width: imgWidth,height:30,backgroundColor: '#046FDB88',position:'absolute',top:imgWidth - 30}} onPress={() => this.deleteImageView(img)}>
                      <Text style={{flex:1,lineHeight:30, textAlign: 'center', color: '#DD4B39CC',fontSize: 10,}}>删除</Text>
                  </TouchableOpacity>
              :
                  <View></View>
              }

          </View>
      ))

    // console.log('imgViews', imgViews)

    return (
      <View style={[styles.imgAll ,rootStyle]}>
        {showImageList && imgViews}
        {
          children != undefined
          ?
          <TouchableWithoutFeedback onPress={this.showActionSheet}>
            {children}
          </TouchableWithoutFeedback>
          :
          (this.state.images.length < 9 &&
            <TouchableOpacity style={[styles.upImg,{ width: imgWidth,
              height: imgWidth,}]} onPress={this.showActionSheet}>
              <Image
                style={styles.upadd}
                source={require('../../BTImage/local_image_pick.png')}
              />
            </TouchableOpacity>)
        }
      </View>
    )
  }
}


const styles = StyleSheet.create({
  imgAll: {
    flexGrow: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imgContainer: {
    marginRight: paddingWidth,
    marginBottom: 10
  },
  pickedImg: {
    width: imgWidth,
    height: imgWidth,
    resizeMode: 'cover',
  },
  upImg: {
    width: imgWidth,
    height: imgWidth,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dotted',
    justifyContent: 'center',
    alignItems: 'center'
  },
  upadd: {
    width: 55,
    height: 55,
    resizeMode: 'cover'
  },
  // titleFont: {
  //   color: fcDarkGray,
  //   fontSize: 20,
  //   lineHeight: 22,
  //   fontWeight: 'normal'
  // }
})
