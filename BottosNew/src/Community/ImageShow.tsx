import React, { Component } from 'react'
import { CameraRoll, Modal, Dimensions,Platform, AlertIOS } from 'react-native'
import config from "../Tool/Config";
import { devlog, getRequestURL ,getImageURL } from "../Tool/FunctionTool";
import UserInfo from '../Tool/UserInfo'
import { Toast } from 'antd-mobile-rn'
import ImageViewer from 'react-native-image-zoom-viewer/src'
import { IImageInfo } from 'react-native-image-zoom-viewer/src/image-viewer.type'
// 方法
import I18n from '../Tool/Language'
interface ImageInfo  {
    post_img_id?: number;
    post_thumb_url?: string;
    post_med_url?: string;
    originUrl?: string;
    post_url?: string;
}

interface Props {
    post_url: ImageInfo[];
    index: number;
    onClose(): void;
}

interface State {
    images: IImageInfo[];
}

const defaultProps = {
    index: 0
}

function mapPostURLToImages(post_url: ImageInfo[]): IImageInfo[]  {
    const { width } = Dimensions.get('window')
    // devlog('mapPostURLToImages width', width)
    // devlog('ImageShow origin', origin)
    return post_url.map((ele) => {
        var _url = ele.originUrl || ele.post_med_url || ele.post_url
        return {
            url:  getImageURL(_url),
            width
        }
    })
}

class ImageShow extends Component<Props, State> {
    static defaultProps = defaultProps

    post_url = this.props.post_url.map((ele: ImageInfo): ImageInfo => {
        if (ele.post_med_url || ele.originUrl || ele.post_url) {
            return ele
        }
        if (ele.post_thumb_url) {
            const post_med_url = ele.post_thumb_url.replace('_thumb', '')
            return { ...ele, post_med_url }
        }
        return ele
    })

    state = {
        images: mapPostURLToImages(this.post_url),
    }

    // 初始化的时候会触发
    onShow = (): void => {
        // devlog('onShow')
    }

    // 按返回的时候触发
    onClose = (): void => {
        devlog('onClose')
        this.props.onClose()
    }

    onCancel = (): void => {
        // devlog('onCancel')
        this.props.onClose()
    }

    onChange = (index?: number): void => {
        devlog('index', index)
        // this.getImage(index)
        // this.setState({ index })
    }

    onClick = (fn?: Function): void => {
        // devlog('fn', fn)
        if (typeof fn == 'function') fn()
        // this.getImage(index)
        // this.setState({ index })
    }

    onSaveToCamera = (index?: number): void => {
        devlog('onSaveToCamera index: ', index)
    }

    onSave = (url: string) => {
        devlog('onSave url: ', url)

        if(Platform.OS === 'ios'){
                    //iOS暂无问题，安卓待定？？？
                    let promise = CameraRoll.saveToCameraRoll(url);
                    promise.then(result=>{
                        // Toast.info(I18n.t('invite.Invite_save_success'),config.ToestTime,null,false)
                        AlertIOS.alert(
                            '提示',
                            '保存图片成功'
                           );
                    }).catch(function(url) {
                        // Toast.fail(I18n.t('invite.Invite_save_fail'),Config.ToestTime,null,false);
                    });
        }else{
            // this.refs.viewShot.capture().then(uri => {
            //     let promise = CameraRoll.saveToCameraRoll(uri);
            //     promise.then(function(result) {
            //         Toast.info(I18n.t('invite.Invite_save_success'),Config.ToestTime,null,false)
            //     }).catch(function(error) {
            //         Toast.info(I18n.t('invite.Invite_setting'),Config.ToestTime,null,false);
            //     });
            // }).catch(function(error) {
            //     Toast.fail(I18n.t('invite.Invite_save_fail'),Config.ToestTime,null,false);
            // });
        }
        // let promise = CameraRoll.saveToCameraRoll(url);
        // promise.then(res => {
        //     devlog('res: ', res)
        // }).catch(err => {
        //     console.error('CameraRoll.saveToCameraRoll err: ', err)
        // })
    }

   
    // renderImage = (props) => {
    //     devlog('props', props)
    //     return <DoubleSourceImage {...props} />
    // }

    render () {
        const { images } = this.state
        const { index } = this.props

        // devlog('render index: ', index)

        return (
            <Modal visible={true}
                transparent={true}
                onRequestClose={this.onClose}
                animationType='fade'
                onShow={this.onShow}
            >
                {
                    images.length > 0 &&
                    <ImageViewer
                        onCancel={this.onCancel}
                        imageUrls={images}
                        index={index}
                        onChange={this.onChange}
                        enableSwipeDown
                        onSaveToCamera={this.onSaveToCamera}
                        onSave={this.onSave}
                        onClick={this.onClick}
                    />
                }
            </Modal>
        )
    }

}


export default ImageShow
