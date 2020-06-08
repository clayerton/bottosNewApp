import { StyleSheet, TextStyle, ViewStyle, ImageStyle } from 'react-native'
import UserInfo from '../../Tool/UserInfo'
import { fcDarkGray, fcLightGray } from '../../Tool/Style/FontStyle'

interface Styles {
  container: ViewStyle;
  nav_header: ViewStyle;
  title_text: TextStyle;
  infoContainer: ViewStyle;
  bg_image_view: ViewStyle;
  bg_image: ImageStyle;
  avatar_view: ViewStyle;
  big_avatar: ImageStyle; // 发红包的头像
  overview_text: TextStyle; // 领取情况综述
  list_bg: ViewStyle;
  from_text: TextStyle;
  amount_text: TextStyle; // 领的总金额
  picked_detail_item: ViewStyle; // 列表项的外层容器
  small_avatar_view: ViewStyle;
  avatar_image: ImageStyle;
  picked_detail_item_value: TextStyle;
  db16: TextStyle; // 黑色粗体16号字体
  pick_time_text: TextStyle; // 领取时间
}

const bg_image_height = UserInfo.screenW / 2
const offsetRate = UserInfo.screenW / 200

export const redPacketListStyles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
  },
  nav_header: {
    backgroundColor: '#e45e52',
    borderBottomWidth: 0,
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    elevation: 0,
  },
  title_text: {
    color: '#fff',
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600"
  },
  infoContainer: {
    height: 260,
    backgroundColor: '#f7f8fa'
  },
  bg_image_view: {
    flexGrow: 1,
    paddingTop: 5,
    width: '100%',
    alignItems: 'center',
  },
  bg_image: {
    width: '100%',
    height: Math.round(bg_image_height),
  },
  avatar_view: {
    position: 'relative',
    marginTop: Math.round(15 * offsetRate),
    width: 82,
    height: 82,
  },
  big_avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  overview_text: {
    paddingLeft: 20,
    height: 24,
    lineHeight: 24,
    backgroundColor: '#EFF0F3',
    fontWeight: "600",
  },
  from_text: {
    marginTop: 5,
    color: '#FCE417',
  },
  amount_text: {
    marginTop: 5,
    fontSize: 36,
    color: '#FFFFFF',
  },
  list_bg: {
    backgroundColor: '#f7f8fa'
  },
  picked_detail_item: {
    flexDirection: 'row',
    padding: 18,
    height: 80,
  },
  small_avatar_view: {
    position: 'relative',
    marginTop: 2,
    marginRight: 10,
    width: 42,
    height: 42,
  },
  avatar_image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  picked_detail_item_value: {
    flexGrow: 1,
    textAlign: 'right',
    marginTop: 3,
  },
  db16: {
    fontSize: 16,
    fontWeight: "600",
    color: fcDarkGray
  },
  pick_time_text: {
    marginTop: 5,
    color: fcLightGray,
    fontSize: 13,
  }
})
