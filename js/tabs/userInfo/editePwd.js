import React,{Component} from 'react';
import {
	View,
	StyleSheet,
	Image,
	TouchableOpacity,
	TextInput,
	ScrollView,
} from 'react-native';

import {
    USER_LOGIN_INFO,
} from '../../api';

import {connect} from 'react-redux';
import DismissKeyboard from 'dismissKeyboard';
import {Text,Text1} from '../../common/AdText';
import AdsHeader from '../header';
import AdColor from '../../common/AdColor';
import commonStyles from '../../common/commonStyles';
import {editeUserInfo} from '../../actions/user';

class EditePwd extends Component{
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	password:'',
	  	repeatPwd:'',
	  };
	}
	_onPress(){
		const {password,repeatPwd} = this.state;
		const {navigator,dispatch}= this.props;
		const reg=/(?=.*[a-z])(?=.*\d)(?=.*[#@!~%^&*])[a-z\d#@!~%^&*]{2,10}/;

		if(!reg.test(password)||! reg.test(repeatPwd)){
			showToast({msg:'密码必须是8-16位的英文字母，数字，字符组合'});
			return;
		}else if(password!=repeatPwd){
			showToast({msg:'两次输入不一致，请确认'});
			return;
		}
		dispatch(editeUserInfo({
			token:userToken_G,
			id:userId_G,
			passwd:password,
		}));
		navigator.pop();
	}

	cancel(){
		DismissKeyboard();
		this.props.navigator.pop();
	}

	render(){
		const {navigator} = this.props;

		return(
			<View style={styles.bg} >
				<View style={commonStyles.header} >
				<AdsHeader navigator={navigator} headerName='密码重置' />
				</View>
				<ScrollView
				keyboardDismissMode='on-drag'
            	keyboardShouldPersistTaps={true}
				>
				<View style={styles.noticBox} >
					<Text1 style={styles.noticText} >为了您的账号安全，新的密码至少需要包含数字、字母、特殊字符的组合，长度为8~16位</Text1>
				</View>
				<View style={styles.midBox} >
					<View style={styles.rows} >
						<View style={styles.label} >
							<Text>密码</Text>
						</View>
					    <TextInput style={styles.inputBox}
					    keyboardType="default" 
					    autoCapitalize="none"
					    secureTextEntry={true}
					    autoCorrect={false}
					    autoFocus={true}
					    placeholder="请设置密码"
					    clearButtonMode="while-editing"
					    onSubmitEditing={this._onPress.bind(this)}
					    defaultValue={this.state.password}

					    onChangeText={(text)=>{
					        this.setState({
					            password:text
					        });
					    }}
						/>
					</View>
					<View style={styles.rows} >
						<View style={styles.label} >
							<Text>确认密码</Text>
						</View>
					    <TextInput style={styles.inputBox}
					    keyboardType="default" 
					    autoCapitalize="none"
					    secureTextEntry={true}
					    autoCorrect={false}
					    placeholder="请设置密码"
					    clearButtonMode="while-editing"
					    onSubmitEditing={this._onPress.bind(this)}
					    defaultValue={this.state.repeatPwd}

					    onChangeText={(text)=>{
					        this.setState({
					            repeatPwd:text
					        });
					    }}
						/>
					</View>
					<View style={styles.rows} >
						<TouchableOpacity onPress={this._onPress.bind(this)} style={styles.btn} >
							<Text style={{color:'green'}} >确认</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={this.cancel.bind(this)} style={styles.btn} >
						<Text>取消</Text>
						</TouchableOpacity>
					</View>
				</View>
				</ScrollView>
			</View>
		);
	}
}

export default connect()(EditePwd);

const styles=StyleSheet.create({
	bg:{
		flex:1,
		backgroundColor:AdColor.viewBackground
	},
	noticBox:{
		height:100,
		padding:30,
		justifyContent:'center',
	},
	noticText:{
		lineHeight:24,
		color:'#666',
	},
	midBox:{
		backgroundColor:'#fff',
		borderTopWidth:1,
		borderBottomWidth:1,
		borderColor:AdColor.borderColor,
	},
	rows:{
		height:40,
		flexDirection:'row',
		marginLeft:20,
		borderTopWidth:1,
		borderColor:AdColor.borderColor,
	},
	label:{
		width:80,
		justifyContent:'center',
	},
	inputBox:{
		flex:1,
		width:100,
	},
	btn:{
		flex:1,
		alignItems:'center',
		justifyContent:'center',

	}
});