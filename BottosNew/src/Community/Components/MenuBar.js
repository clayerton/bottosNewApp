import React, { PureComponent } from 'react'
import { Text, View, TouchableOpacity, FlatList } from 'react-native'
//redux组件
import { connect } from 'react-redux'

class MenuBar extends PureComponent {
  _onPress = value => {
    const { onPress } = this.props
    onPress && onPress(value)
  }

  render() {
    const { data, CurrentMenuOption } = this.props
    let currentID = CurrentMenuOption.data.option_name
      ? CurrentMenuOption.data.option_id
      : 2
    return (
      <FlatList
        data={data}
        extraData={currentID}
        horizontal={true}
        keyExtractor={item => item.key + item.option_id}
        renderItem={item => this._renderItem(item, currentID)}
      />
    )
  }

  _renderItem({ item }, currentID) {
    return (
      <View>
        <TouchableOpacity
          style={{
            height: 64,
            justifyContent: 'flex-end',
            paddingLeft: 8,
            paddingRight: 8
          }}
          onPress={() => this._onPress(item)}>
          <Text
            style={{
              fontSize: currentID == item.option_id ? 34 : 14,
              color: currentID == item.option_id ? '#212833' : '#828999',
              fontWeight: 'bold',
              marginBottom: 6
            }}>
            {item.option_name}
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            backgroundColor: currentID == item.option_id ? '#046FDB' : '#FFF',
            width: 15,
            height: 2.5,
            alignSelf: 'center'
          }}
        />
      </View>
    )
  }
}

export default connect()(MenuBar)
