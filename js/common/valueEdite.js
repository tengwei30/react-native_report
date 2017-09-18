import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Modal,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Dimensions,
	TextInput,
} from 'react-native';

const screenWidth=Dimensions.get('window').width;
const screenHeight=Dimensions.get('window').height;
const boxWidth=screenWidth-20;
export default  class ValueEdite extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	visible:false,
	  	transparent:true,
	  	disable:false,
	  	value:'',
	  };
	}
	_closeModal(){
		this.setState({
			visible:false,
		});
	}
	show(){
		this.setState({
			visible:true,
		});
		this.validCheck(this.state.value);
	}

	editeValue(){
		const {onEdite,rowKey} = this.props;
		this._closeModal();
		onEdite(this.state.value.trim(),rowKey);
	}

	validCheck(value){
		const {format} = this.props;
		const reg=new RegExp(format);
		if(!reg.test(value)||value.trim()==''){
			this.setState({
				disable:true,
			});
		}else{
			this.setState({
				disable:false,
			});
		}
	}

	handValueChange(value){
		this.validCheck(value)
		this.setState({
			value:value,
		});
	}
	render() {
		const {cueMsg,titleText,keybordType,secureInput} = this.props;
		const sureStyle=this.state.disable?styles.cancel:styles.normal;
		const secure=secureInput?true:false;
		return (
			<View>
				<Modal
				visible={this.state.visible}
				transparent={this.state.transparent} >
				<TouchableOpacity onPress={this._closeModal.bind(this)} style={styles.bg} >
				</TouchableOpacity>
					<View style={styles.box} >
						<Text style={styles.titleText} >
							{titleText}
						</Text>
						<View style={styles.inputWrap} >
						<TextInput 
						ref='Input'
						autoCapitalize='none' 
						autoCorrect={false}
						returnKeyType='search'
						autoFocus={true}
						enablesReturnKeyAutomatically={true}
						keyboardType={keybordType}
						placeholderTextColor='#999'
						underlineColorAndroid = "transparent"
						style={styles.input} 
						defaultValue={this.state.value}
						secureTextEntry={secure}
						onChangeText={(value)=>{
						    this.handValueChange(value)
						    }} />
						    </View>
						 <Text style={styles.noticText} >
						 	{cueMsg}
						 </Text>
						 <View style={styles.buttonBox} >
							<TouchableWithoutFeedback 
								disabled={this.state.disable}
							onPress={this.editeValue.bind(this)}  >
								<View style={[styles.button,sureStyle]} >
								<Text style={styles.buttonText} >确定</Text>
								</View>
							</TouchableWithoutFeedback>
							<TouchableWithoutFeedback onPress={this._closeModal.bind(this)}  >
								<View style={[styles.button,styles.cancel]} >
								<Text style={styles.buttonText} >取消</Text>
								</View>
							</TouchableWithoutFeedback>
						 </View>
					</View>
				</Modal>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	showText: {
		width:100,
		backgroundColor:'#ccc',

	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	bg:{
		position:'absolute',
		left:0,
		top:0,
		width:screenWidth,
		height:screenHeight,
		backgroundColor:'rgba(0,0,0,0.3)',
	},
	box:{
		position:'absolute',
		left:(screenWidth-boxWidth)/2,
		top:100,
		width:boxWidth,
		padding:20,
		borderRadius:4,
		backgroundColor:'#fff',
	},
	titleText:{
		fontSize:16,
		paddingBottom:16,
		fontWeight:'bold',
	},
	noticText:{
		fontSize:14,
		paddingTop:14,
		color:'#666',
		paddingBottom:10,
	},
	inputWrap:{
		width:boxWidth-40,
	    height:40,
	    borderWidth:1,
	    borderRadius:4,
	    borderColor:'#ccc',
	    justifyContent:'center',
	},
	input:{
		flex:1,
	    fontSize:16,
	    marginLeft:8,
	},
	buttonBox:{
		flexDirection:'row',
		justifyContent:'flex-start',
		alignItems:'center',
	},
	buttonText:{
		color:'#fff',
		fontSize:14,
	},
	button:{
		width:80,
		height:32,
		borderRadius:3,
		alignItems:'center',
		justifyContent:'center',
		marginRight:30,
	},
	normal:{
		backgroundColor:'#40c5fc'
	},
	cancel:{
		backgroundColor:'#ccc',
	}
});