'use strict';
import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';

import AdColor from './AdColor';
import {Text1} from './AdText';
import {searchInfoCurAid,searchBasicInfoClear} from '../actions/searchInfo';
import {clearSelectAd} from '../actions/adgroup';

export default class SelectBox extends Component{
	constructor(props) {
	  super(props);
	
	  this.state = {};
	}

	handFilterCam(){
	    const {navigator,advertiser,dispatch} = this.props;
	    navigator.push({
	        campaignSelect:true,
	        params:{
	            uid:advertiser.uid,
	            getAdSimpleList:true,
	        }
	    });
	}

	handFilterAd(){
	    const {navigator,advertiser,dispatch} = this.props;

	    navigator.push({
	        adSelect:true,
	        params:{
	            uid:advertiser.uid,
	            getAidData:(data)=>{
	                dispatch(searchInfoCurAid(data.aid,data.name));
	            }
	        }
	    });
	}

	resetSelect(){
		const {dispatch} = this.props;
		dispatch(searchBasicInfoClear());
		dispatch(clearSelectAd());
	}

	render(){
		const {curCidName,curAidName} = this.props.searchInfoState;
		return(
			<View style={styles.wrap} >
				<TouchableOpacity style={[styles.selectBox,{marginRight:4}]} onPress={this.handFilterCam.bind(this)} >
				    <Text1 numberOfLines={1} >{curCidName}</Text1>
				</TouchableOpacity>

				<TouchableOpacity style={styles.selectBox} onPress={this.handFilterAd.bind(this)} >
				    <Text1 numberOfLines={1} >{curAidName}</Text1>
				</TouchableOpacity>
				<TouchableOpacity style={styles.reset} 
				onPress={this.resetSelect.bind(this)} >
					<Text1 style={styles.resetText} >重置</Text1>
				</TouchableOpacity>
			</View>	
		);
	}
}

const styles=StyleSheet.create({
	wrap:{
		height:30,
		marginBottom:6,
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'space-between',
	},
	selectBox:{
        flex:1,
        height:28,
        borderWidth:1,
        alignItems:'center',
        borderColor:AdColor.borderColor,
        justifyContent:'center',
    },
    reset:{
    	paddingRight:6,
    	paddingLeft:6,
    	height:28,
    	alignItems:'center',
    	justifyContent:'center',
    },
    resetText:{
    	color:'#5aaaea'
    }
});

