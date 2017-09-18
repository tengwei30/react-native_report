'use strict';
import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    ScrollView,
    StatusBar,
    TouchableOpacity,
    AsyncStorage,
} from 'react-native';

import {
    USER_LOGIN_INFO,
} from '../../api';

import {connect} from 'react-redux';
import AdsHeader from '../header';
import md5 from 'md5';
import commonStyles from '../../common/commonStyles';
import ValueEdite from '../../common/valueEdite';
import {getCampaign} from '../../actions/campaign';
import {Heading3,Heading1,Text1,Text} from '../../common/AdText';
import AdColor from '../../common/AdColor';
import {loginOut} from '../../actions/login';
import {getUserInfo,editeUserInfo} from '../../actions/user';

class UserView extends Component {
    constructor(props, context) {
        super(props, context);
    }

    _editePhoneNum(value){
        const {dispatch} = this.props;
        dispatch(editeUserInfo({
            token:userToken_G,
            id:userId_G,
            mobile:value,
        }));
    }

    _editeEmail(value){
        const {dispatch} = this.props;
        dispatch(editeUserInfo({
            token:userToken_G,
            id:userId_G,
            email:value,
        }));
    }

    _editeqq(value){
        const {dispatch} = this.props;
        dispatch(editeUserInfo({
            token:userToken_G,
            id:userId_G,
            QQ:value,
        }));
    }

    _editePwd(value){
        const {navigator} = this.props;

        if(userpassword_G==md5(value)){
            if(navigator){
                navigator.push({
                    editePwd:true,
                });
            }
        }else{
            showToast({msg:'密码错误'});
        }
    }

    _loginOut(){
        const {dispatch,navigator} = this.props;
        navigator.popToTop();
        dispatch(loginOut());
    }

    componentDidMount() {

        const {dispatch,userInfoState} = this.props;
        statistics('用户信息');
    }

    render() {
    const {navigator,userInfoState} = this.props;

    return(
        <View style={styles.wrap} >
            <View style={[commonStyles.header,{justifyContent:'center'}]} >
                <Text style={styles.titleText} >账号设置</Text>
            </View>
            <View style={styles.base} >
                <View style={[styles.infoRow,{borderTopWidth:0}]} >
                    <Text>姓名</Text>
                    <Text>{userInfoState.realname}</Text>
                </View>
                <View style={styles.infoRow} >
                    <Text>所在公司</Text>
                    <Text>{userInfoState.companyname}</Text>
                </View>

                <TouchableOpacity style={styles.infoRow} 
                onPress={()=>{this.editePhone.show()}} >
                    <Text>手机号码</Text>
                    <View style={styles.arrowBox} >
                        <Text>{userInfoState.mobile}</Text>
                        <Image style={styles.arrow_image} source={require('../icons/arrow-right.png')} />
                    </View>
                </TouchableOpacity>
                <ValueEdite 
                titleText='修改手机号码'
                cueMsg='请输入正确的11位手机号码'
                format='^1[3|4|5|7|8]\d{9}$'
                keybordType='numeric'
                onEdite={this._editePhoneNum.bind(this)}
                ref={(n)=>this.editePhone=n} />

                <TouchableOpacity style={styles.infoRow} 
                onPress={()=>{this.editeEmail.show()}} >
                    <Text>Email</Text>
                    <View style={styles.arrowBox} >
                        <Text>{userInfoState.email}</Text>
                        <Image style={styles.arrow_image} source={require('../icons/arrow-right.png')} />
                    </View>
                </TouchableOpacity>

                <ValueEdite 
                titleText='修改邮箱'
                cueMsg='请输入正确的邮箱地址'
                format='(^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$)|(^$)'
                keybordType='email-address'
                onEdite={this._editeEmail.bind(this)}
                ref={(n)=>this.editeEmail=n} />

                <TouchableOpacity style={styles.infoRow} 
                onPress={()=>{this.editeqq.show()}} >
                    <Text>QQ</Text>
                    <View style={styles.arrowBox} >
                        <Text>{userInfoState.QQ}</Text>
                        <Image style={styles.arrow_image} source={require('../icons/arrow-right.png')} />
                    </View>
                </TouchableOpacity>

                <ValueEdite 
                titleText='修改QQ'
                cueMsg='请输入正确的QQ号码'
                format='^[1-9][0-9]{4,9}$'
                keybordType='numeric'
                onEdite={this._editeqq.bind(this)}
                ref={(n)=>this.editeqq=n} />

            </View>
            <TouchableOpacity onPress={()=>{
                this.editePwd.show()
            }} style={[styles.infoRow,styles.pwdBox]} >
                <Text>密码修改</Text>
                <View style={styles.arrowBox} >
                    <Image style={styles.arrow_image} source={require('../icons/arrow-right.png')} />
                </View>
            </TouchableOpacity>
            <ValueEdite 
            titleText='为了您的账号安全请先输入旧密码进行验证'
            cueMsg='请输入正确的密码'
            format='.'
            secureInput={true}
            keybordType='default'
            onEdite={this._editePwd.bind(this)}
            ref={(n)=>this.editePwd=n} />

            <TouchableOpacity style={styles.buttonBox} onPress={this._loginOut.bind(this)} >
                <View style={styles.button} >
                    <Text style={styles.buttonText} >退出登录</Text>
                </View>
            </TouchableOpacity>

        </View>
    );
    }
};
function select(state){
    return{
        userInfoState:state.userInfoState,
    };
}
export default connect(select)(UserView);

const styles = StyleSheet.create({
    wrap:{
        flex:1,
        backgroundColor:AdColor.viewBackground,
    },
    titleText:{
        color:'#fff',
        fontSize:16,
        letterSpacing:4,
    },
    base:{
        marginTop:14,
        borderTopWidth:1,
        borderBottomWidth:1,
        borderColor:AdColor.borderColor,
        backgroundColor:'#fff',
    },
    infoRow:{
       height:40,
       marginLeft:14,
       paddingRight:14,
       borderTopWidth:1,
       borderColor:AdColor.borderColor,
       flexDirection:'row',
       alignItems:'center',
       justifyContent:'space-between',
    },
    arrowBox:{
        flexDirection:'row',
    },
    arrow_image:{
        width:16,
        height:16,  
    },
    pwdBox:{
        backgroundColor:'#fff',
        marginTop:14,
        marginLeft:0,
        paddingLeft:14,
    },
    buttonBox:{
        marginTop:50,
        justifyContent:'center',

    },
    button:{
        marginRight:20,
        marginLeft:20,
        borderRadius:6,
        height:34,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#40c5fc',
    },
    buttonText:{
        color:'#fff',
        letterSpacing:4,
    }
});
