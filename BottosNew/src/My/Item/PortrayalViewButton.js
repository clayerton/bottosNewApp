import React from 'react'
import { View, StyleSheet } from 'react-native'
import I18n from '../../Tool/Language'

// 组件
import Button from '../../Tool/View/BTButton/LongButton'

const PortrayalViewButton = props => {
  const _onPress = value => {
    const { onPress } = props
    onPress && onPress(value)
  }
  const { isFollow, isAdmin, isBlack, isFollowLoading ,isAddBlack } = props
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        flexWrap:'wrap'
      }}>
      <Button
        style={[
          styles.buttonNormal,
          isFollow ? styles.buttonSelect : {},
          isFollowLoading ? styles.buttonDisabled : {}
        ]}
        textStyle={[
          styles.fontStyle,
          isFollow ? styles.fontStyleSelect : {},
          isFollowLoading ? styles.fontStyleDisabled : {}
        ]}
        title={
          isFollow
            ? I18n.t('portrayalView.followed')
            : I18n.t('portrayalView.follow')
        }
        loading={isFollowLoading}
        onPress={() => {
          _onPress('follow')
        }}
      />
      {isAdmin ? (
        <Button
          style={[styles.buttonNormal, isBlack ? styles.buttonSelect : {}]}
          textStyle={[styles.fontStyle, isBlack ? styles.fontStyleSelect : {}]}
          title={
            isBlack
              ? I18n.t('portrayalView.account_is_disabled')
              : I18n.t('portrayalView.account_disabled')
          }
          onPress={() => {
            _onPress('forbidden')
          }}
        />
      ) : null}
      <Button
          style={[styles.buttonNormal,]}
          textStyle={[styles.fontStyle, ]}
          title={
            I18n.t('report.reportTitle')
          }
          onPress={() => {
            _onPress('report')
          }}
        />
      <Button
           style={[styles.buttonNormal, isAddBlack ? styles.buttonSelect : {}]}
           textStyle={[styles.fontStyle, isAddBlack ? styles.fontStyleSelect : {}]}
          title={
            isAddBlack ?
            '取消拉黑'
            :'拉黑'
          }
          onPress={() => {
            _onPress('isAddBlack')
          }}
        />
    </View>
  )
}

export default PortrayalViewButton
const styles = StyleSheet.create({
  buttonNormal: {
    height: 32,
    width: 96,
    marginLeft: 8,
    marginRight: 8,
    marginTop:10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#046FDB'
  },
  buttonSelect: {
    backgroundColor: '#046FDB'
  },
  buttonDisabled: {
    borderColor: '#D1D5DD'
  },

  fontStyle: {
    fontWeight: '400',
    color: '#046FDB'
  },
  fontStyleSelect: {
    fontSize: 13,
    fontWeight: '400',
    color: '#fff'
  },
  fontStyleDisabled: {
    color: '#D1D5DD'
  }
})
