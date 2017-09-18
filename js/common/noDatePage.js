'use strict';
import React,{Component} from 'react';
import {
	View,
	Text,
	StyleSheet,
	Image,
} from 'react-native';

export default class NoDatePage extends Component{
	constructor(props) {
	  super(props);
	
	  this.state = {};
	}
	render(){
		return(
			<View style={styles.wrap} >
					<Image source={require('./img/no_data_icon.png')} style={styles.img} />
				<Text>抱歉，暂无数据</Text>
			</View>
		);
	}
};

const styles=StyleSheet.create({
	wrap:{
		flex:1,
		marginTop:100,
		alignItems:'center',
	},
	img:{
		width:60,
		height:60,
		marginBottom:12,
	}
});
