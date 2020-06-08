import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native'
import NavStyle from '../Tool/Style/NavStyle'
import I18n from '../Tool/Language'

export default class PrivacyPolicy extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation
    return {
      headerLeft: (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.goBack()}
          style={NavStyle.leftButton}>
          <Image
            style={NavStyle.navBackImage}
            source={require('../BTImage/navigation_back.png')}
          />
        </TouchableOpacity>
      ),
      headerRight: <Text style={NavStyle.rightButton}> </Text>,
      headerTitle: <Text style={NavStyle.navTitle}>{I18n.t('service_terms.header_title')}</Text>,
      headerTintColor: '#fff',
      headerStyle: NavStyle.navBackground
    }
  }
  render() {
    return (
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.bg}>
          <Text style={styles.centent}>
            欢迎使用 “瓦力社区
            ”服务（以下简称：本服务），本服务是铂链基于区块链技术为用户
            (以下或称 “您 ”)提供的创建私钥、使用平台等相关服务。
            为了保障您的权益，请在使用本服务前，
            详细阅读本协议的所有内容，特别是加粗部分。当您通过网络页面点击确认并进行下一步操作时，即视为您已充分理解并同意接受本协议及其项下规则。
          </Text>
          <Text style={styles.centent}>
            本协议构成您与瓦力社区达成的协议，具有法律效力。
          </Text>
          <Text style={styles.centent}>第一条 定义</Text>
          <Text style={styles.centent}>
            1、瓦力社区服务：指由瓦力社区基于区块链技术为您提供的创建私钥、加密储存数字资产和信息数据等服务。
          </Text>
          <Text style={styles.centent}>
            2、DTO：指瓦力社区数字信息生态下基于区块链技术的原生数字资产。它的产生与瓦力社区数字信息数量、用户浏览与社交行为有强关联性。
          </Text>
          <Text style={styles.centent}>
            3、瓦力值：是指用户获取DTO的影响因子，瓦力值越高，获得的DTO越多。每日确定发放DTO总数
            C，用户每日挖取到的DTO数 =C*该用户当前瓦力值值
            /所有用户瓦力值值之和。
          </Text>
          <Text style={styles.centent}>第二条 服务规则</Text>
          <Text style={styles.centent}>
            1 、您明确知悉，
            本服务涉及瓦力社区相关软件包括但不限于所有权、知识产权等一切权利归瓦力社区所有。用户在享受本服务时，应当受本协议以及软件及服务相关的具体服务条款、操作规则的约束。
          </Text>
          <Text style={styles.centent}>2 、用户资格： </Text>
          <Text style={styles.centent}>
            仅当您符合下列条件之一时，才能申请成为瓦力社区用户并使用本服务：{' '}
          </Text>
          <Text style={styles.centent}>
            {' '}
            1 ）年满十八周岁，并具有完全民事权利能力和完全民事行为能力的自然人；
          </Text>
          <Text style={styles.centent}>
            2 ）未满十八周岁，但其法定监护人予以书面同意的自然人；
          </Text>
          <Text style={styles.centent}>
            3 ）根据中华人民共和国或设立地法律、法规和 /
            或规章成立并合法存在的公司、社团组织和其他组织。无民事行为能力人、限制民事行为能力人以及无经营或特定经营资格的组织不当注册为本服务用户或超过其民事权利或行为能力范围使用本服务的，其与本服务之间的协议自始无效，瓦力社区一经发现，有权立即注销该用户使用瓦力社区及相关服务的资格且无需承担任何责任，并有权追究其（或其法定监护人）使用本服务所产生的相关法律责任。
          </Text>
          <Text style={styles.centent}>3、注册：</Text>
          <Text style={styles.centent}>
            1）您在使用 “瓦力社区
            ”之前，必须先行注册，并填写注册资料，取得瓦力社区账号、密码。
          </Text>
          <Text style={styles.centent}>
            2）瓦力社区账号注册资料包括但不限于您的账号名称、头像、密码、注册或更新瓦力社区账号时输入的所有信息。{' '}
          </Text>
          <Text style={styles.centent}>
            您在注册瓦力社区账号时承诺遵守法律法规、社会主义制度、国家利益、公民合法权益、公共秩序、社会道德风尚和信息真实性等七条底线，不得在瓦力社区账号注册资料中出现违法和不良信息，且您保证在注册和使用账号时，
            不得有以下情形：
          </Text>
          <Text style={styles.centent}>（ 1 ）违反宪法或法律法规规定的；</Text>
          <Text style={styles.centent}>
            （ 2 ）危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；
          </Text>
          <Text style={styles.centent}>
            （ 3 ）损害国家荣誉和利益的，损害公共利益的；
          </Text>
          <Text style={styles.centent}>
            （ 4 ）煽动民族仇恨、民族歧视，破坏民族团结的；
          </Text>
          <Text style={styles.centent}>
            （ 5 ）破坏国家宗教政策，宣扬邪教和封建迷信的；
          </Text>
          <Text style={styles.centent}>
            （ 6 ）散布谣言，扰乱社会秩序，破坏社会稳定的
          </Text>
          <Text style={styles.centent}>
            （ 7 ）散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；
          </Text>
          <Text style={styles.centent}>
            （ 8 ）侮辱或者诽谤他人，侵害他人合法权益的；
          </Text>
          <Text style={styles.centent}>
            （ 9 ）含有法律、行政法规禁止的其他内容的。
          </Text>
          <Text style={styles.centent}>
            3）您成功注册瓦力社区账号以后。根据相关法律、法规规定以及考虑到瓦力社区产品服务的重要性，您同意：
          </Text>
          <Text style={styles.centent}>
            （ 1 ）在注册瓦力社区账号时提交有效身份信息进行实名认证；
          </Text>
          <Text style={styles.centent}>
            （ 2 ）提供及时、详尽及准确的账户注册资料；
          </Text>
          <Text style={styles.centent}>
            （ 3
            ）不断更新注册资料，符合及时、详尽准确的要求，除法律法规规定外，对注册瓦力社区账号时填写的身份证件信息不能随意修改。
          </Text>
          <Text style={styles.centent}>
            4
            ）如果您提供任何不真实、不准确、不完整或不能反映当前情况的资料的，或瓦力社区公司有合理理由怀疑该等资料不真实、不准确、不完整或不能反映当前情况的，瓦力社区公司保留停止您使用本服务的权利，如因您资料的不真实、不准确、不完整或不能反映当前情况而给瓦力社区公司或其关联公司造成损失的，您应负责赔偿。若您以虚假信息骗取账号注册或账号头像、个人简介等注册资料存在违法和不良信息的，瓦力社区有权采取通知限期改正、暂停使用、注销登记等措施。对于冒用关联机构或社会名人注册账号名称的，瓦力社区公司有权注销该账号，并向政府主管部门进行报告。瓦力社区有权对您的瓦力社区账户进行安全性管理，包括但不限于采取限制、冻结、注销用户账户措施。
          </Text>
          <Text style={styles.centent}>
            4、您在瓦力社区中创建瓦力社区账户，瓦力社区会帮助您生成对应的区块链账户地址及私钥，地址和私钥具有唯一性，私钥可以用于特定情形下的收付DTO等用途。
          </Text>
          <Text style={styles.centent}>
            5、您知悉，您基于瓦力社区区块链所获得的区块链账户地址及相关私钥为您本人所有，您应妥善保管您的区块链账户地址及相关私钥，
            您的账户信息、私钥均储存于区块链中，不会被获取 / 储存 /
            备份于瓦力社区服务器中，区块链账户地址与相关私钥不得更改，如您不慎丢失账户地址或私钥，将无法通过瓦力社区找回，您将自行承担相关损失。
          </Text>
          <Text style={styles.centent}>
            6 、
            瓦力社区禁止用户违反瓦力社区使用规则私自赠与、借用、租用、转让或售卖任何区块链账户地址或相关私钥。您基于瓦力社区账户所进行的所有登入、兑换或相关使用行为，均视为您本人操作，代表您的真实意思表示，瓦力社区不对其产生的后果承担任何责任。
          </Text>
          <Text style={styles.centent}>
            7
            、本服务为瓦力社区基于区块链技术及瓦力社区区块链向您提供的技术服务，瓦力社区将采取合理技术措施保证瓦力社区区块链的正常运行及安全保障。
            您应确保在使用瓦力社区服务过程中不得违反任何法律、法规及相关规定或侵害任何第三人的合法权益，瓦力社区对您使用瓦力社区服务所产生的任何后果不承担任何责任。
          </Text>
          <Text style={styles.centent}>
            8 、
            瓦力社区有权制定或调整DTO的使用规则，具体DTO的发放、获取、兑换等相关规则以瓦力社区页面展示为准。
          </Text>
          <Text style={styles.centent}>
            9、用户可通过本服务提供的区块链加密技术记录并保护用户的数字信息数据，同时瓦力社区可以帮助您提供相关数字信息数据的查询功能，您可根据自身意愿将个人数字信息数据开放给其他瓦力社区用户进行查询。为鼓励用户更好的保护个人数字信息数据，发现并拓展个人数字信息数据的价值，瓦力社区会根据相关服务规则对您的数据信息保存及共享查询行为奖励瓦力值值、DTO或其他收益奖励。
            您通过瓦力社区保存并加密的数字信息数据归您本人所有，除非经您明确授权，瓦力社区不会收集、储存或使用您的任何数字信息数据，亦不对您向任何第三方提供个人数字信息数据所产生的后果承担责任。
          </Text>
          <Text style={styles.centent}>
            10 、 您不得利用DTO进行融资或从事DTO与法定货币、 “ 虚拟货币 ”
            相互之间的兑换业务，不得买卖或作为中央对手方买卖DTO，不得为DTO提供定价、信息中介等法律法规、监管政策禁止的任何活动，否则瓦力社区有权不经用户同意，立即单方注销该用户的瓦力社区账户并停止向用户继续提供服务，因此而给用户造成的任何损失，由该用户自行承担。
          </Text>
          <Text style={styles.centent}>
            11 、
            瓦力社区有权就本服务向您收取一定的手续费或服务费，具体以瓦力社区页面公示为准。
          </Text>
          <Text style={styles.centent}>
            12 、
            您同意瓦力社区有权基于司法、监管部门、监督机构的要求或自身业务原因，暂停、中断或终止向您提供全部或者部分本服务。
          </Text>
          <Text style={styles.centent}>
            13 、
            您同意不会发送不良内容和辱骂其他用户的文字和图片。我们提供举报功能，一旦您的内容被举报，我们将有权在24小时内删除您的内容，并禁止您的发帖行为，甚至封号。
          </Text>
          <Text style={styles.centent}>
            14 、
            您同意不会发送无意义的文字和图片，我们有权在24小时内删除您的内容，并禁止您的发帖行为，甚至封号。
          </Text>

          <Text style={styles.centent}>三、法律责任与免责</Text>
          <Text style={styles.centent}>
            1
            、瓦力社区对其所有服务将尽力维护其安全性及方便性，但对服务中非因瓦力社区过错所产生的信息（包括但不限于用户发布
            /
            储存的信息、账户地址、数字资产数量、信息数据等）删除或储存失败不承担任何责任。
          </Text>
          <Text style={styles.centent}>
            2
            、使用本服务涉及到互联网服务，可能会受到各个环节不稳定因素的影响，存在因不可抗力
            (
            包括但不限于战争、地震、雷击、水灾、火灾、政府行为、电信部门技术管制
            )
            、计算机病毒、黑客攻击、系统不稳定、用户所在位置、用户关机以及其他任何网络、技术、通信线路等原因造成的服务中断或不能满足用户要求的风险，用户须明白并自行承担以上风险，瓦力社区不承担任何责任。
          </Text>
          <Text style={styles.centent}>
            3
            、用户因第三方如电信运营商部门的通讯线路故障、技术问题、网络、电脑故障、系统不稳定性及其他各种不可抗力
            (
            包括但不限於战争、地震、雷击、水灾、火灾、政府行为、电信部门技术管制
            ) 原因而遭受的经济损失，瓦力社区不承担任何责任。
          </Text>
          <Text style={styles.centent}>
            4
            、因用户违反本协议或相关的服务条款的规定，导致或产生瓦力社区或其合作公司、关联方遭受任何第三方主张的任何索赔、要求或损失的（包括合理的诉讼费用和律师费用），您应承担赔偿责任。
          </Text>
          <Text style={styles.centent}>四、隐私政策</Text>
          <Text style={styles.centent}>
            您应阅读并同意铂链用户隐私政策，方可使用本服务。
          </Text>
          <Text style={styles.centent}>五、其他</Text>
          <Text style={styles.centent}>
            1 、
            您同意，瓦力社区有权随时对本协议内容进行调整和补充，瓦力社区将以网页公告等方式对该等变更予以公布。变更后的条款自公布之日起生效。若您在本协议变更的条款生效后，仍继续使用本服务的，则视为接受该等变更，若您不同意的，您有权终止本协议并停止使用本服务。
          </Text>
          <Text style={styles.centent}>
            2、本协议适用中华人民共和国法律并据其解释。
          </Text>
          <Text style={styles.centent}>
            3 、
            因本协议引起的或与本协议有关的争议，瓦力社区可与您协商解决。协商不成的，任何一方均有权向上海市浦东新区人民法院提起诉讼解决。
          </Text>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
    width: null,
    height: null
  },
  centent: {
    color: '#353B48',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 8
  }
})
