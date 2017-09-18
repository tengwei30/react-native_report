'use strict';
import React,{Component} from 'react';
import {
	View,
	Text,
	StyleSheet,
	ActivityIndicator,
} from 'react-native';
export default class LoadPage extends Component{

render(){
	return(
		<View style={styles.wrap} >
			<View style={styles.box} >
				<ActivityIndicator size="large" color="#fff" />
			</View>
		</View>
	);
}
};

const styles=StyleSheet.create({
	wrap:{
		flex:1,
		justifyContent:'center',
		alignItems:'center',
	},
	box:{
		width:90,
		height:90,
		justifyContent:'center',
		backgroundColor:'rgba(0,0,0,0.8)',
		borderRadius:10,
		alignItems:'center'
	},
});
