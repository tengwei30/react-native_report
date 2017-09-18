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
export default  class NumberModal extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	visible:false,
	  	transparent:true,
	  	disable:false,
	  	value:this.props.defaultValue==0?'':this.props.defaultValue,
	  };
	}
	_closeModal(){
		this.setState({
			visible:false,
			value:this.props.defaultValue==0?'':this.props.defaultValue,
		});
	}
	show(){
		this.setState({
			visible:true,
		});
		this.validCheck(this.state.value)
	}

	editeValue(){
		const {onEdite,rowKey} = this.props;
		this._closeModal();
		this.setState({
			value:this.refs.numberInput._getText(),
		});
		onEdite(this.state.value.trim(),rowKey);
	}

	editeValueNoLimit(){
		const {onEdite,rowKey} = this.props;
		this._closeModal();
		this.setState({
			value:'0',
		});
		onEdite(0,rowKey);
	}

	validCheck(value){
		if(isNaN(value)||value<=0){
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
		const {defaultValue,titleText,unlimitBtn} = this.props;
		const sureStyle=this.state.disable?styles.cancel:styles.normal;

		const buttonBox=unlimitBtn?[styles.buttonBox,{justifyContent:'space-between',}]:[styles.buttonBox,{justifyContent:'flex-start',}];
		const button=unlimitBtn?styles.button:styles.buttonMargin;

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
						ref='numberInput'
						autoCapitalize='none' 
						autoCorrect={false}
						returnKeyType='search'
						autoFocus={true}
						underlineColorAndroid = "transparent"
						enablesReturnKeyAutomatically={true}
						keyboardType='numeric'
						placeholderTextColor='#999'
						style={styles.input} 
						defaultValue={this.state.value}
						maxLength={30}
						
						onChangeText={(value)=>{
						    this.handValueChange(value)
						    }} />
						    </View>
						 <Text style={styles.noticText} >
						 	请输入大于0的有效数字
						 </Text>
						 <View style={buttonBox} >
							<TouchableWithoutFeedback 
								disabled={this.state.disable}
							onPress={this.editeValue.bind(this)}  >
								<View style={[button,sureStyle]} >
								<Text style={styles.buttonText} >确定</Text>
								</View>
							</TouchableWithoutFeedback>
							<TouchableWithoutFeedback onPress={this._closeModal.bind(this)}  >
								<View style={[button,styles.cancel]} >
								<Text style={styles.buttonText} >取消</Text>
								</View>
							</TouchableWithoutFeedback>
							{unlimitBtn&&<TouchableWithoutFeedback onPress={this.editeValueNoLimit.bind(this)}  >
								<View style={[button,styles.normal]} >
								<Text style={styles.buttonText} >不限</Text>
								</View>
							</TouchableWithoutFeedback>}
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
		borderRadius:4,
		padding:20,
		backgroundColor:'#fff',
	},
	titleText:{
		fontSize:16,
		fontWeight:'bold',
		paddingBottom:16,
	},
	noticText:{
		fontSize:14,
		paddingTop:16,
		color:'#666',
		paddingBottom:10,
	},
	inputWrap:{
		borderWidth:1,
	    borderRadius:4,
	    width:boxWidth-30,
	    height:40,
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
		alignItems:'center',
	},
	buttonText:{
		color:'#fff',
		fontSize:14,
	},
	button:{
		width:70,
		height:32,
		borderRadius:3,
		alignItems:'center',
		justifyContent:'center',
	},
	buttonMargin:{
		width:70,
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