import React, {Component} from 'react'
import { Image } from 'react-native'
import Config from '../Config';
import {devlog, getRequestURL,getImageURL} from "../FunctionTool";
//加载网络图片失败时候调用
export default class BTImageView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            imageUrl: getImageURL(),
        }

    }

    componentDidMount() {

    }

    handleImageErrored1() {
        this.setState({ imageUrl: 'http://139.219.185.167/' });
    }

    render() {
        const { style} = this.props
        return (<Image
            style={style}
            resizeMode={'cover'}
            source={{uri: this.state.imageUrl + this.props.source}}
            onError={this.handleImageErrored1.bind(this)}
        />)
    }





}