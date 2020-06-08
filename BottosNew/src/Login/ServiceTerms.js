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

export default class ServiceTerms extends Component {
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
      headerTitle: (
        <Text style={NavStyle.navTitle}>
         {I18n.t('privacy_policy.header_title')} 
        </Text>
      ),
      headerTintColor: '#fff',
      headerStyle: NavStyle.navBackground
    }
  }

  render() {
    return (
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.bg}>
          <Text style={styles.centent}>
          尊敬的用户：
          </Text>

          <Text style={styles.centent}>瓦力社区（以下简称“瓦力社区”或“我们”）尊重并保护用户（以下简称“您”或“用户”）的隐私，您使用瓦力社区时，瓦力社区将按照本隐私政策（以下简称“本政策”）收集、使用您的个人信息。
瓦力社区建议您在使用本产品之前仔细阅读并理解本政策全部内容, 针对免责声明等条款在内的重要信息将以加粗的形式体现。本政策有关关键词定义与瓦力社区《瓦力社区服务协议》保持一致。
本政策可由瓦力社区在线随时更新，更新后的政策一旦公布即代替原来的政策，如果您不接受修改后的条款，请立即停止使用瓦力社区，您继续使用瓦力社区将被视为接受修改后的政策。经修改的政策一经在瓦力社区上公布，立即自动生效。
您知悉本政策及其他有关规定适用于瓦力社区及瓦力社区上所自主拥有的DApp。
</Text>
          <Text style={styles.centent}>
          一、 我们收集您的哪些信息
          </Text>
          <Text style={styles.centent}>
          请您知悉，我们收集您的以下信息是出于满足您在瓦力社区服务需要的目的，且我们十分重视对您隐私的保护。在我们收集您的信息时，将严格遵守“合法、正当、必要”的原则。且您知悉，若您不提供我们服务所需的相关信息，您在瓦力社区的服务体验可能因此而受到影响。

          </Text>
          <Text style={styles.centent}>
            1. 我们将收集您的移动设备信息、操作记录、交易记录、钱包地址等个人信息。
          </Text>
          <Text style={styles.centent}>2. 为满足您的特定服务需求，我们将收集您的姓名、银行卡号、手机号码、邮件地址等信息。</Text>
          <Text style={styles.centent}>
          3. 您知悉：您在瓦力社区 上的钱包密码、私钥、助记词、Keystore并不存储或同步至瓦力社区服务器。瓦力社区不提供找回您的钱包密码、私钥、助记词、Keystore的服务。
          </Text>
          <Text style={styles.centent}>
          4. 除上述内容之外，您知悉在您使用瓦力社区特定功能时，我们将在收集您的个人信息前向您作出特别提示，要求向您收集更多的个人信息。如您选择不同意，则视为您放弃使用瓦力社区该特定功能。
          </Text>
          <Text style={styles.centent}>5. 当您跳转到第三方DApp后，第三方DApp会向您收集个人信息。瓦力社区不持有第三方DApp向您收集的个人信息。</Text>
          <Text style={styles.centent}>
          6. 在法律法规允许的范围内，瓦力社区可能会在以下情形中收集并使用您的个人信息无需征得您的授权同意：
          </Text>
          <Text style={styles.centent}>（1） 与国家安全、国防安全有关的；
</Text>
          <Text style={styles.centent}>
          （2） 与公共安全、公共卫生、重大公共利益有关的；
          </Text>
          <Text style={styles.centent}>（3） 与犯罪侦查、起诉、审判和判决执行等有关的；</Text>
          <Text style={styles.centent}>
          （4） 所收集的个人信息是您自行向社会公众公开的；
          </Text>
          <Text style={styles.centent}>
          （5） 从合法公开披露的信息中收集您的个人信息，如合法的新闻报道，政府信息公开等渠道；
          </Text>
          <Text style={styles.centent}>
          （6） 用于维护服务的安全和合规所必需的，例如发现、处理产品和服务的故障；
          </Text>
          <Text style={styles.centent}>
          （7） 法律法规规定的其他情形。
          </Text>
          <Text style={styles.centent}>
          7. 我们收集信息的方式如下：
          </Text>
          <Text style={styles.centent}>
          （1） 您向我们提供信息。例如，您在“个人中心”页面中填写姓名、手机号码或银行卡号，或在反馈问题时提供邮件地址，或在使用我们的特定服务时，您额外向我们提供。

          </Text>
          <Text style={styles.centent}>（2） 我们在您使用瓦力社区的过程中获取信息，包括您移动设备信息以及您对瓦力社区的操作记录等信息；</Text>
          <Text style={styles.centent}>
          （3） 我们通过区块链系统，拷贝您全部或部分的交易记录。但交易记录以区块链系统的记载为准。
          </Text>
          <Text style={styles.centent}>
          二、 我们如何使用您的信息
          </Text>
          <Text style={styles.centent}>
          1. 我们通过您移动设备的唯一序列号，确认您与您的钱包的对应关系。
          </Text>
          <Text style={styles.centent}>
          2. 我们将向您及时发送重要通知，如软件更新、服务协议及本政策条款的变更。
          </Text>
          <Text style={styles.centent}>
          3. 我们在瓦力社区的“系统设置”中为您提供“指纹登录”选项，让您方便且更安全地管理您的数字资产。
          </Text>
          <Text style={styles.centent}>
          4. 我们通过收集您公开的钱包地址和提供的移动设备信息来处理您向我们提交的反馈。

          </Text>
          <Text style={styles.centent}>
          5. 我们收集您的个人信息进行瓦力社区内部审计、数据分析和研究等，以期不断提升我们的服务水平。
          </Text>
          <Text style={styles.centent}>
          6. 依照《瓦力社区服务协议》及瓦力社区其他有关规定，瓦力社区将利用用户信息对用户的使用行为进行管理及处理。
          </Text>
          <Text style={styles.centent}>
          7. 法律法规规定及与监管机构配合的要求。

          </Text>
          <Text style={styles.centent}>
          三、 您如何控制自己的信息
          </Text>
          <Text style={styles.centent}>
          您在瓦力社区中拥有以下对您个人信息自主控制权：
          </Text>
          <Text style={styles.centent}>
          1. 您可以通过同步钱包的方式，将您的其他钱包导入瓦力社区中，或者将您在瓦力社区的钱包导入到其他数字资产管理钱包中。瓦力社区将向您显示导入钱包的信息。
          </Text>
          <Text style={styles.centent}>
          2. 您知悉您可以通过“资产”版块内容修改您的数字资产种类、进行转账及收款等活动。
           </Text>
          <Text style={styles.centent}>3. 您知悉在瓦力社区“我”的版块您可以自由选择进行如下操作：</Text>
          <Text style={styles.centent}>
          （1） 在“联系人”中，您可以随时查看并修改您的“联系人”；
          </Text>
          <Text style={styles.centent}>
          （2） 在“系统设置”中，您可以选择不开启“指纹登录”选项，即您可以选择不使用苹果公司提供的Touch ID验证服务；
          </Text>
          <Text style={styles.centent}>
          （3） 在“个人中心”中，您并不需要提供自己的姓名、手机号码、银行卡等信息，但当您使用特定服务时，您需要提供以上信息；
          </Text>
          <Text style={styles.centent}>
          （4） 在“提交反馈”中，您可以随时向我们提出您对瓦力社区问题及改进建议，我们将非常乐意与您沟通并积极改进我们的服务。
           </Text>
          <Text style={styles.centent}>
          4. 您知悉当我们出于特定目的向您收集信息时，我们会提前给予您通知，您有权选择拒绝。但同时您知悉，当您选择拒绝提供有关信息时，即表示您放弃使用瓦力社区的有关服务。
          </Text>
          <Text style={styles.centent}>
          5. 您知悉，您及我们对于您交易记录是否公开并没有控制权，因为基于区块链交易系统的开源属性，您的交易记录在整个区块链系统中公开透明。
          </Text>
          <Text style={styles.centent}>1.使用不雅或不恰当ID和昵称；</Text>
          <Text style={styles.centent}>
          6. 您知悉当您使用瓦力社区的功能跳转至第三方DApp之后，我们的《瓦力社区服务协议》、《瓦力社区隐私政策》将不再适用，针对您在第三方DApp上对您个人信息的控制权问题，我们建议您在使用第三方DApp之前详细阅读并了解其隐私规则和有关用户服务协议等内容。
          </Text>
          <Text style={styles.centent}>7. 您有权要求我们更新、更改、删除您的有关信息。</Text>
          <Text style={styles.centent}>
          8. 您知悉我们可以根据本政策第一条第6款的要求收集您的信息而无需获得您的授权同意。
          </Text>
          <Text style={styles.centent}>
          四、 我们可能分享或传输您的信息
          </Text>
          <Text style={styles.centent}>
          1. 瓦力社区在中华人民共和国境内收集和产生的用户个人信息将存储在中华人民共和国境内的服务器上。若瓦力社区确需向境外传输您的个人信息，将在事前获得您的授权，且按照有关法律法规政策的要求进行跨境数据传输，并对您的个人信息履行保密义务。
          </Text>
          <Text style={styles.centent}>
          2. 未经您事先同意，瓦力社区不会将您的个人信息向任何第三方共享或转让，但以下情况除外：
          </Text>
          <Text style={styles.centent}>
          （1） 事先获得您明确的同意或授权；
          </Text>
          <Text style={styles.centent}>
          （2） 所收集的个人信息是您自行向社会公众公开的；
          </Text>
          <Text style={styles.centent}>（3） 所收集的个人信息系从合法公开披露的信息中收集，如合法的新闻报道，政府信息公开等渠道； </Text>
          <Text style={styles.centent}>
          （4） 与瓦力社区的关联方共享，我们只会共享必要的用户信息，且受本隐私条款中所声明的目的的约束；
          </Text>
          <Text style={styles.centent}>
          （5） 根据适用的法律法规、法律程序的要求、行政机关或司法机关的要求进行提供；
          </Text>
          <Text style={styles.centent}>（6） 在涉及合并、收购时，如涉及到个人信息转让，瓦力社区将要求个人信息接收方继续接受本政策的约束。</Text>
          <Text style={styles.centent}>3.瓦力社区会在您同意或授权的情况下，上传您的地理位置信息到我们的服务器，为了给您提供更好的服务。</Text>
          <Text style={styles.centent}>
          4.瓦力社区会在您同意或授权的情况下，公布您的DTO排名信息。
           </Text>
          <Text style={styles.centent}>
          五、 我们如何保护您的信息
          </Text>
          <Text style={styles.centent}>
          1. 如瓦力社区停止运营，瓦力社区将及时停止继续收集您个人信息的活动，将停止运营的通知公告在瓦力社区上，并对所持有的您的个人信息在合理期限内进行删除或匿名化处理。

          </Text>
          <Text style={styles.centent}>
          2. 为了保护您的个人信息，瓦力社区将采取数据安全技术措施，提升内部合规水平，增加内部员工信息安全培训，并对相关数据设置安全访问权限等方式安全保护您的隐私信息。
          </Text>
          <Text style={styles.centent}>
          3. 我们将在瓦力社区“消息中心”中向您发送有关信息安全的消息，并不时在瓦力社区“帮助中心”版块更新钱包使用及信息保护的资料，供您参考。
          </Text>
          <Text style={styles.centent}>
          六、 对未成年人的保护
          </Text>
          <Text style={styles.centent}>我们对保护未满18周岁的未成年人做出如下特别约定：</Text>
          <Text style={styles.centent}>
          1. 未成年人应当在父母或监护人指导下使用瓦力社区相关服务。
          </Text>
          <Text style={styles.centent}>
          2. 我们建议未成年人的父母和监护人应当在阅读本政策、《瓦力社区服务协议》及我们的其他有关规则的前提下，指导未成年人使用瓦力社区。

          </Text>
          <Text style={styles.centent}>
          3. 瓦力社区将根据国家相关法律法规的规定保护未成年人的个人信息的保密性及安全性。
          </Text>
          <Text style={styles.centent}>
          七、 免责声明
          </Text>
          <Text style={styles.centent}>
          1. 请您注意，您通过瓦力社区接入第三方DApp后，将适用该第三方DApp发布的隐私政策。该第三方DApp对您个人信息的收集和使用不为瓦力社区所控制，也不受本政策的约束。瓦力社区无法保证第三方DApp一定会按照瓦力社区的要求采取个人信息保护措施。

          </Text>
          <Text style={styles.centent}>
          2. 您应审慎选择和使用第三方DApp，并妥善保护好您的个人信息，瓦力社区对其他第三方DApp的隐私保护不负任何责任。

          </Text>
          <Text style={styles.centent}>
          3. 瓦力社区将在现有技术水平条件下尽可能采取合理的安全措施来保护您的个人信息，以避免信息的泄露、篡改或者毁损。瓦力社区系利用无线方式传输数据，因此，瓦力社区无法确保通过无线网络传输数据的隐私性和安全性。

          </Text>
          <Text style={styles.centent}>
          八、 其他

          </Text>
          <Text style={styles.centent}>
          1. 如您是中华人民共和国以外的用户，您需全面了解并遵守您所在司法辖区与使用瓦力社区服务所有相关法律、法规及规则。
          </Text>
          <Text style={styles.centent}>
          2. 您在使用瓦力社区服务过程中，如遇到任何有关个人信息使用的问题，您可以通过在瓦力社区提交反馈等方式联系我们。
          </Text>
          <Text style={styles.centent}>
          3. 您可以在瓦力社区中查看本政策及瓦力社区其他服务规则。我们鼓励您在每次访问瓦力社区时都查阅瓦力社区的服务协议及隐私政策。
          </Text>
          <Text style={styles.centent}>
          4. 本政策的任何译文版本仅为方便用户而提供，无意对本政策的条款进行修改。如果本政策的中文版本与非中文版本之间存在冲突，应以中文版本为准。

          </Text>
          <Text style={styles.centent}>
          5. 本政策自2018年5月22日起适用。

          </Text>
          <Text style={styles.centent}>
          本政策未尽事宜，您需遵守瓦力社区不时更新的公告及相关规则。
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
