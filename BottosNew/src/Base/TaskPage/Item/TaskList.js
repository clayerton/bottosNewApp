import React from 'react'
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity
} from 'react-native'
import { devlog , getRequestURL, getImageURL} from '../../../Tool/FunctionTool'
import Config from '../../../Tool/Config'

const TaskList = props => {
  const _onPress = (value, id) => {
    const { onPress } = props
    onPress && onPress(value, id)
  }

  const isDisabled = id => {
    const { isSign, isVerified, isBindEthAddress, isBoostingGold } = props
    devlog('isSign ', isSign)
    devlog('isVerified ', isVerified)
    devlog('isBindEthAddress ', isBindEthAddress)

    if (id === 1 && isSign) {
      return true
    }
    if (id === 6 && isVerified) {
      return true
    }
    if (id === 7 && isBindEthAddress) {
      return true
    }
    if (id === 14 && isBoostingGold){
        return true
    }

    return false
  }
  const { data } = props
  
  return (
    <View style={styles.mainBackground}>
      <Text style={styles.taskHeader}>{data.title}</Text>
      <FlatList
        keyExtractor={item => item.task_name}
        horizontal={true}
        data={data.data}
        extraData={this.props}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.taskItem}
              disabled={isDisabled(item.task_id)}
              onPress={() => {
                _onPress(item.task_name, item.task_id)
              }}>
              <Image
                style={styles.taskItemIcon}
                source={{uri: getImageURL(item.task_icon)}}
              />
              <View
                style={
                  isDisabled(item.task_id)
                    ? {
                        backgroundColor: '#DFEFFE',
                        color:'#3B5998',
                        marginTop: 15,
                        borderRadius: 3,
                        paddingLeft: 9,
                        paddingRight: 9,
                        fontSize:13,
                      }
                    : {
                        color:'#596379',
                        marginTop: 15,
                        borderRadius: 3,
                        /*paddingLeft: 9,
                        paddingRight: 9,*/
                        fontSize:13,
                      }
                }>
                <Text
                  style={[
                    styles.taskItemTitle,
                    isDisabled(item.task_id) ? { color: '#353B48' } : {}
                  ]}>
                  {item.task_name}
                </Text>
              </View>
            </TouchableOpacity>
          )
        }}
      />
    </View>
  )
}

export default TaskList

const styles = StyleSheet.create({
  mainBackground: {
    marginLeft: 24,
    marginRight: 24
  },
  taskHeader: {
    marginTop: 16,
    marginBottom: 16,
    color: '#596379',
    fontSize: 14
  },
  taskItem: {
    backgroundColor: '#fff',
    width: 99,
    height: 104,
    marginRight: 16,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth:1,
    borderColor:'#DFEFFE',
    borderRadius:4,
  },
  taskItemIcon: {
    width: 40,
    height: 40,
  },
  taskItemTitle: {
    color: '#596379',
    fontSize: 13,
      lineHeight:18,
  },

  icStyles: {
    width: 14,
    height: 14,
    marginLeft: 24,
    marginRight: 16
  }
});
