'use strict';
import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    TouchableWithoutFeedback,
} from 'react-native';

export default class ConfirmButton extends Component{
	constructor(props) {
	  super(props);
	
	  this.state = {};
	}
	handClick(){
		this.props.handClick();
	}
	render(){
		const {fetching,text,disabled,customeStyle} = this.props;
		let restStyle=fetching||disabled?[styles.button,styles.disabledButton]:[styles.button];

		if(customeStyle){
			restStyle.push(customeStyle);
		}

		return(	
				<View style={styles.wrap} >
				<TouchableWithoutFeedback 
				onPress={this.handClick.bind(this)}
				disabled={fetching?true:disabled} >
				    <View style={restStyle} >
				    {fetching&&<ActivityIndicator color="#efefef" />}
				    <Text style={styles.buttonText} >{text}</Text>
				    </View>
				</TouchableWithoutFeedback>
				</View>
		);
			
	}
}

const styles=StyleSheet.create({
	wrap:{
		flex:1,
		flexDirection:'row',
		paddingTop:24,
        paddingRight:10,
        paddingLeft:10,
	},
    button:{
    	flex:1,
        height:34,
        borderRadius:8,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#40c5fc',
        flexDirection:'row',
    },
    disabledButton:{
        backgroundColor:'#ccc'
    },
    buttonText:{
        color:'#fff',
        letterSpacing:10,
        alignSelf:'center',
    }
});