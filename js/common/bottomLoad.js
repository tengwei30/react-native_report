'use strict';
import React,{Component} from 'react';
import {
	View,
	Text,
	StyleSheet,
	ActivityIndicator,
	Image,
} from 'react-native';

const styles=StyleSheet.create({
	wrap:{
		paddingTop:4,
		paddingBottom:18,
		flex:1,
		justifyContent:'center',
		alignItems:'center',
		flexDirection: 'row',
	},
	image:{
		width:80,
		height:80,
	},
});

export default class BottomLoad extends Component{
	constructor(props) {
	  super(props);
	
	  this.state = {};
	}
	render(){
		return(
			<View style={styles.wrap} >
				<ActivityIndicator color="#666" />
				<Text>数据加载中…</Text>
			</View>
		);
	}
};
