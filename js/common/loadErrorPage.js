'use strict';
import React,{Component} from 'react';
import {
	View,
	Text,
	StyleSheet,
	Image,
} from 'react-native';

const styles=StyleSheet.create({
	wrap:{
		flex:1,
		justifyContent:'center',
		alignItems:'center',
	},
});

export default class LoadErrorPage extends Component{
	constructor(props) {
	  super(props);
	
	  this.state = {};
	}
	render(){
		return(
			<View style={styles.wrap} >
				<Text>数据加载失败</Text>
			</View>
		);
	}
};
