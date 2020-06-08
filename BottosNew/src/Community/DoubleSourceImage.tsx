import React, { Component } from 'react'
import { Image, ImageProps, ImageURISource } from 'react-native'
import config from '../Tool/Config'
import { devlog , getRequestURL, getImageURL} from '../Tool/FunctionTool'

interface NetImageURISource extends ImageURISource {
  uri: string;
}

interface NetImageProps extends ImageProps {
  source: NetImageURISource;
}

interface State {
  uri: string;
}

// 由于加载的是网络图片
// 所以 source 一定是一个 object
// 且一定有 uri 这个属性
class DoubleSourceImage extends Component<NetImageProps, State> {
  constructor(props: NetImageProps) {
    super(props)
    const uri = props.source.uri

    this.state = {
      uri
    }
  }

  onError = () => {
    devlog('Image onError')
    const uri = this.state.uri.replace(getRequestURL(), 'http://139.219.185.167/')
    this.setState({uri})
  }

  render() {
    const { source, ...props } = this.props
    const uri = this.state.uri
    const _source = {...source, uri}

    return (
      <Image source={_source} {...props} onError={this.onError} />
    )
  }
}

export default DoubleSourceImage