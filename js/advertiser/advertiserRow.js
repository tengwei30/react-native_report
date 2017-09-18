import React,{Component} from 'react';
import {
    View,
    StyleSheet,
    TouchableHighlight,
} from 'react-native';

import AdColor from '../common/AdColor';
import {Heading3,Text1} from '../common/AdText';
import {AdvertiserStatus} from '../utils';

export default class AdvertiserRow extends Component{
    handleViewAdvertiser(advertiser) {
        const { navigator} = this.props;
        if(navigator) {
            navigator.push({
                adverDetail: true,
                params: {
                    advertiser: advertiser,
                },
            })
        }      
    }
    render(){
        const {advertiser} =this.props;
        return(
           <TouchableHighlight underlayColor='#d9d9d9'
           onPress={this.handleViewAdvertiser.bind(this, advertiser)}
            >
           <View style={styles.container} >
                <View style={styles.title}>
                        <View style={styles.titleName} >
                        <Heading3 style={{fontWeight:'bold'}} numberOfLines={1} >{advertiser.name}</Heading3>
                        </View>
                        <View style={styles.account} >
                        <Text1 style={styles.red}>账户:</Text1>
                        <Text1 style={styles.red} >{advertiser.balance}</Text1>
                        </View>
                        {AdvertiserStatus(advertiser.status)}
                </View>
                <View style={styles.col} >
                    <View style={styles.row} >
                        <Text1>推广计划：</Text1>
                        <Text1 style={styles.num}>{advertiser.campaign_total}</Text1>
                    </View>
                    <View style={[styles.row,styles.borderLeft]} >
                        <Text1>广告：</Text1>
                        <Text1 style={styles.num}>{advertiser.adgroup_total}</Text1>
                    </View>
                </View>
            </View>
            </TouchableHighlight>
        );
    }
};

const styles=StyleSheet.create({
    container: {
        marginBottom:8,
        backgroundColor:'#fff',
        overflow:'hidden',
    },
    title:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        height:36,
        paddingLeft:10,
        paddingRight:10,
        borderBottomColor:AdColor.borderColor,
        borderBottomWidth:1,
    },
    titleName:{
        flex:4,
    },
    account:{
        flex:3,
        flexDirection:'row',
    },
    borderLeft:{
        borderLeftWidth:1,
        borderLeftColor:AdColor.borderColor,
    },
    col:{
        flex:1,
        flexDirection:'row',
        height:30,
    },
    row:{
        flex:1,
        paddingLeft:10,
        flexDirection:'row',
        alignItems:'center',
    },
    red:{
        color:AdColor.lightRed,
    },
    num:{
        color:'#5aaaea',
        marginTop:2,
    }
});

