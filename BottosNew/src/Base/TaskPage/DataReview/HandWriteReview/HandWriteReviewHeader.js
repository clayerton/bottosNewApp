import React , {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ImageBackground,
    ScrollView,
} from 'react-native'
import I18n from "../../../../Tool/Language";
export default class HandWriteReviewHeader extends Component {
    constructor(props) {
        super(props);
    }
    render(){
        return (
            <View style={styles.handDetailHeader}>
                <View style={styles.handDetailHeaderText}>
                    <Text style={styles.handTextEg}>{I18n.t('dataCollection.hand_example')}</Text>
                </View>
                <View style={styles.handEgRight}>
                    <Text style={styles.handEgRightText}>understand</Text>
                    <View style={styles.handEgRightAll}>
                        <Image  style={styles.handEgRightImg} source={require('../../../../BTImage/Base/DataCollectionReview/base_task_data_collection_test1.png')} />
                        <Image  style={styles.handEgRightImgR} source={require('../../../../BTImage/Base/DataCollectionReview/base_task_data_collection_pass_highlight.png')} />
                    </View>
                </View>
                <View style={styles.handEgError}>
                    <Text style={styles.handEgRightText}>apple</Text>
                    <View style={styles.handEgRightAll}>
                        <Image  style={styles.handEgRightImg} source={require('../../../../BTImage/Base/DataCollectionReview/base_task_data_collection_test1.png')} />
                        <Image  style={styles.handEgRightImgR} source={require('../../../../BTImage/Base/DataCollectionReview/base_task_data_collection_no_pass_highlight.png')} />
                    </View>
                </View>
            </View>
        )
    }
}
const styles=StyleSheet.create({
    handDetailHeader: {
        margin: 16,
        marginBottom: 0,
        backgroundColor: '#fff',
        height: 151,
        borderRadius: 3,
    },
    handDetailHeaderText: {
        height: 30,
        borderBottomWidth: 1,
        borderColor: '#EFF0F3',
        justifyContent: 'center',
    },
    handTextEg: {
        color: '#353B48',
        fontSize: 13,
        paddingLeft: 16,
    },
    handEgRight: {
        margin: 15,
        height: 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    handEgRightText: {
        lineHeight: 32,
        height: 32,
        color: '#333',
        fontSize: 20,
    },
    handEgRightImg: {
        width: 111,
        height: 28,
        marginRight: 26,
    },
    handEgRightImgR: {
        width: 32,
        height: 32,
    },
    handEgRightAll: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    handEgError: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 15,
        borderColor: '#EFF0F3',
        borderTopWidth: 1,
    },
});