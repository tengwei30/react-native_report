'use strict';
import React,{Component} from 'react';
import{
	View,
	Text,
	StyleSheet,
	ActivityIndicator,
	Image,
} from 'react-native';

const styles=StyleSheet.create({
	wrap:{
		paddingTop:8,
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

export default class BottomNoData extends React.Component{
	constructor(props) {
	  super(props);
	
	  this.state = {};
	}
	render(){
		return(
			<View style={styles.wrap} >
				<Text>抱歉，暂无更多数据</Text>
			</View>
		);
	}
};
