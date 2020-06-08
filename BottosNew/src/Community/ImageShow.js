import React, { Component } from 'react';
import { CameraRoll, Modal, Dimensions, Platform } from 'react-native';
import { devlog, getImageURL } from "../Tool/FunctionTool";
import ImageViewer from 'react-native-image-zoom-viewer/src';
const defaultProps = {
    index: 0
};
function mapPostURLToImages(post_url) {
    const { width } = Dimensions.get('window');
    // devlog('mapPostURLToImages width', width)
    // devlog('ImageShow origin', origin)
    return post_url.map((ele) => {
        var _url = ele.originUrl || ele.post_med_url || ele.post_url;
        return {
            url: getImageURL(_url),
            width
        };
    });
}
class ImageShow extends Component {
    constructor() {
        super(...arguments);
        this.post_url = this.props.post_url.map((ele) => {
            if (ele.post_med_url || ele.originUrl || ele.post_url) {
                return ele;
            }
            if (ele.post_thumb_url) {
                const post_med_url = ele.post_thumb_url.replace('_thumb', '');
                return Object.assign({}, ele, { post_med_url });
            }
            return ele;
        });
        this.state = {
            images: mapPostURLToImages(this.post_url),
        };
        // 初始化的时候会触发
        this.onShow = () => {
            // devlog('onShow')
        };
        // 按返回的时候触发
        this.onClose = () => {
            devlog('onClose');
            this.props.onClose();
        };
        this.onCancel = () => {
            // devlog('onCancel')
            this.props.onClose();
        };
        this.onChange = (index) => {
            devlog('index', index);
            // this.getImage(index)
            // this.setState({ index })
        };
        this.onClick = (fn) => {
            // devlog('fn', fn)
            if (typeof fn == 'function')
                fn();
            // this.getImage(index)
            // this.setState({ index })
        };
        this.onSaveToCamera = (index) => {
            devlog('onSaveToCamera index: ', index);
        };
        this.onSave = (url) => {
            devlog('onSave url: ', url);
            if (Platform.OS === 'ios') {
                //iOS暂无问题，安卓待定？？？
                let promise = CameraRoll.saveToCameraRoll(url);
                promise.then(result => {
                    // Toast.info(I18n.t('invite.Invite_save_success'),Config.ToestTime,null,false)
                    alert('保存成功！地址如下：\n' + result);
                }).catch(function (url) {
                    // Toast.fail(I18n.t('invite.Invite_save_fail'),Config.ToestTime,null,false);
                });
            }
            else {
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
        };
    }
    // renderImage = (props) => {
    //     devlog('props', props)
    //     return <DoubleSourceImage {...props} />
    // }
    render() {
        const { images } = this.state;
        const { index } = this.props;
        // devlog('render index: ', index)
        return (React.createElement(Modal, { visible: true, transparent: true, onRequestClose: this.onClose, animationType: 'fade', onShow: this.onShow }, images.length > 0 &&
            React.createElement(ImageViewer, { onCancel: this.onCancel, imageUrls: images, index: index, onChange: this.onChange, enableSwipeDown: true, onSaveToCamera: this.onSaveToCamera, onSave: this.onSave, onClick: this.onClick })));
    }
}
ImageShow.defaultProps = defaultProps;
export default ImageShow;
