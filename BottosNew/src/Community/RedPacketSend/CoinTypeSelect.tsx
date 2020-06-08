import React, { PureComponent } from 'react'
import { Text, View, StyleSheet, Image } from 'react-native'

// 组件
import ThrottledTouchableOpacity from '../../Tool/View/ThrottledTouchableOpacity'
import BTBackButton from '../../Tool/View/BTBackButton'

import { styles as BBStyles } from './BorderedBox'
import I18n from '../../Tool/Language'

interface BoxProps {
  coin_name: string;
  coin_amount: null | string;
  is_selected: boolean;
  onPress(coin_name: string): void;
}

function BlueBorderBox(props: BoxProps) {
  const { coin_name, coin_amount, is_selected, onPress } = props
  
  function handlePress() {
    if (onPress) {
      onPress(coin_name)
    }
  }
  return <ThrottledTouchableOpacity onPress={handlePress} style={[BBStyles.redBorder, BBStyles.flexBox, styles.coinSelectBox]}>
    <View style={styles.coinNameContainer}>
      <Text style={styles.coinName}>{coin_name}</Text>
      {
        is_selected &&
        <Image style={styles.sureImg} resizeMode='contain' source={require('../../BTImage/CommunityImages/community_red_packet_sure.png')} />
      }
    </View>
    <View style={BBStyles.separator} />
    <Text style={styles.amount}>{coin_amount || 0}</Text>
  </ThrottledTouchableOpacity>

}

export interface CoinInfo {
  currency_id: number;
  intro: string;
  name: string;
  value: null | string;
}

interface Props {
  onClose(): void;
  onChange(coin_name: string): void;
  default_coin?: string;
  coin_infos: CoinInfo[];
}

interface State {
  selected_coin: string;
}

export default class CoinTypeSelect extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    const default_coin = props.default_coin
  
    this.state = {
      selected_coin: default_coin || 'DTO'
    }
  }
  

  handlePress = (coin_name: string) => {
    this.setState({ selected_coin: coin_name })
    const onChange = this.props.onChange
    onChange && onChange(coin_name)
  }

  render() {
    const { selected_coin } = this.state
    const { coin_infos, onClose } = this.props

    const lists = coin_infos.map(ele => {
      if (ele.value == null) return null;
      return <BlueBorderBox key={ele.name} onPress={this.handlePress}
        coin_name={ele.name}
        coin_amount={ele.value}
        is_selected={selected_coin == ele.name}
      />
    })

    return (
      <View style={styles.wrap}>

        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{I18n.t('community.selectToken')}</Text>
        </View>
        <BTBackButton style={styles.back} onPress={onClose} />
        {lists}
      </View>
    )
  }
}


const styles = StyleSheet.create({
  wrap: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  titleContainer: {
    marginBottom: 10,
    height: 54,
    padding: 16,
    alignItems: 'center',
    borderBottomColor: '#EFF0F3',
    borderBottomWidth: 1,
  },
  titleText: {
    fontSize: 16,
    color: '#353B48',
    textAlign: 'center',
  },
  sureImg: {
    position: 'absolute',
    top: 3,
    left: 15,
    width: 20,
    height: 15,
  },
  coinNameContainer: {
    width: '49%',
    // flexGrow: 1
  },
  coinName: {
    textAlign: 'center'
  },
  amount: {
    flexGrow: 1,
    textAlign: 'center'
  },
  back: {
    position: 'absolute',
    top: 5,
  },
  coinSelectBox: {
    borderColor: '#DFEFFE',
    marginLeft: 16,
    marginRight: 16,
  }
})