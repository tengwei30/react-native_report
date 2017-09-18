import React,{Component} from 'react';
import {
	StyleSheet,
	View,
	Image,
	TouchableOpacity,
} from 'react-native';

export default class ToTopButton extends Component{
	constructor(props) {
	  super(props);
	
	  this.state = {};
	}
	_onClick(){
		this.props._onTopClick();
	}
	render(){
		const {bottom} = this.props;
		return(
			<TouchableOpacity onPress={this._onClick.bind(this)} style={[styles.wrap,{bottom:bottom}]} >
				<Image style={styles.imgBox}  source={require('./img/to-top-icon.png')} />
			</TouchableOpacity>
		);
	}
}

const styles=StyleSheet.create({
	wrap:{
		width:40,
        height:40,
        borderRadius:40,
        position:'absolute',
        right:10,
        borderWidth:1,
        borderColor:'#ccc',
        backgroundColor:'rgba(255,255,255,0.6)',
        justifyContent:'center',
        alignItems:'center',
	},
	imgBox:{
		width:26,
		height:26,
	}
});