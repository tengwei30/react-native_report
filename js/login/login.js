'use strict';
import React, {
    Component
} from 'react';
import {
    StyleSheet,
    TouchableHighlight,
    View,
    ScrollView,
    TextInput,
    Image,
    Animated,
    Easing,
    ActivityIndicator,
    Keyboard,
} from 'react-native';

import DismissKeyboard from 'dismissKeyboard';
import md5 from 'md5';
import {Text,Heading1,Heading2} from '../common/AdText';
import {normalize} from '../utils';
export default class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            top: new Animated.Value(80),
        };
    }

    onPress() {
        const {loginInfo,navigator} = this.props;
        //如果正在登陆中，终止用户点击

        if (loginInfo.isLoging) {
            return;
        }
        //判断用户输入是否为空
        const {username,password} = this.state;

        if (username == '') {
            showToast({
                msg:'请输入用户名',
            });
            return;
        }

        if (password == '') {
            showToast({
                msg:'请输入密码',
            });
            return;
        }

        //输入不为空后开始post登陆
        this.props.loginActions.loginIn(username, md5(password));
    }

    _animation(top){
        Animated.timing(
            this.state.top, {
                toValue: top,
                duration: 150,
                easing: Easing.linear,
            },
        ).start(); 
    }

    _focusname() {
        this._animation(-30);
    }

    _focuspwd(){
        this._animation(-80);
    }

    _Endediting() {
        this._animation(80);
    }

    componentDidMount(){
        statistics('登录');
        //监控键盘消失事件，键盘消失则输入框都复位
        this.listenkeyboard = Keyboard.addListener(
            'keyboardDidHide', () => { 
               this._Endediting();
            });
    }

    componentWillUnmount(){
        //this.listenkeyboard.remove();
    }

    renderLoginButton(isLoging) {
        if (isLoging) {
            return (
                <View style={styles.bottonWrap}>
                    <ActivityIndicator color="#666" style={styles.buttonIndicator}/>
                    <Text style={styles.buttonText}>正在登陆...</Text>
                </View>
            )
        }
        return (
            <View style={styles.bottonWrap}>
                <Text style={styles.buttonText}>登陆</Text>
            </View>
        );
    }

    render() {

        const {
            loginInfo
        } = this.props;
        var buttonClass = loginInfo.isLoging ? styles.disableButton : styles.normalButton;
        var underlayColor = loginInfo.isLoging ? '#cdcdcd' : '#99d9f4';
        var activeOpacity = loginInfo.isLoging ? 1 : 0;

        return (
            <View style={styles.wrap} >
                <Animated.View  style={[styles.container,{marginTop:this.state.top}]}  >
                <View style={styles.header}>
                    <Image source={require('../img/logo.jpg')} />
                </View>
                <View style={styles.iptwrap}>
                    <Heading2>用户名</Heading2>
                    <View style={styles.iptWrap} >
                    <TextInput style={styles.ipt}
                    editable={loginInfo.editable}
                    autoCapitalize="none"
                    autoFocus={true}
                    clearButtonMode="while-editing"
                    keyboardType="email-address" 
                    defaultValue={this.state.username}
                    onFocus={this._focusname.bind(this)}
                    underlineColorAndroid = "transparent"
                    onEndEditing={this._Endediting.bind(this)}
                    onBlur={this._Endediting.bind(this)}
                    onChangeText={(text)=>{
                        this.setState({
                            username:text
                        });
                    }}
                    placeholder="请输入用户名"
                />
                </View>
                </View>
                <View style={styles.iptwrap}>
                    <Heading2>密码</Heading2>
                    <View style={styles.iptWrap} >
                    <TextInput style={styles.ipt}
                    editable={loginInfo.editable}
                    keyboardType="default" 
                    autoCapitalize="none"
                    secureTextEntry={true}
                    autoCorrect={false}
                    underlineColorAndroid = "transparent"
                    placeholder="请输入密码"
                    returnKeyType="send"
                    clearButtonMode="while-editing"
                    onSubmitEditing={this.onPress.bind(this)}
                    defaultValue={this.state.password}
                    onFocus={this._focuspwd.bind(this)}
                    onEndEditing={this._Endediting.bind(this)}
                    onBlur={this._Endediting.bind(this)}
                    onChangeText={(text)=>{
                        this.setState({
                            password:text
                        });
                    }}
                />
                </View>
                </View>
                
                <TouchableHighlight style={[styles.button, buttonClass]} onPress={this.onPress.bind(this)} underlayColor={underlayColor} activeOpacity={activeOpacity}>
                    {this.renderLoginButton(this.props.loginInfo.isLoging)}
                </TouchableHighlight>
                </Animated.View>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    wrap:{
        flex:1,
        backgroundColor:'#fff',
    },
    container: {
        padding: 20,
        flex: 1,
        backgroundColor: '#fff',
    },
    title: {
        alignSelf: 'center',
        justifyContent: 'center',
    },
    header: {
        marginTop: normalize(14),
        marginBottom: normalize(14),
        alignItems: 'center',

    },
    iptwrap: {
        paddingTop: normalize(14),
        paddingBottom: normalize(14),
    },
    iptWrap:{
       borderColor: '#ccc',
       borderRadius: 4, 
       borderWidth: 1,
       marginTop: normalize(16),
    },
    ipt: {
        paddingLeft: normalize(8),
        height: 40,
    },
    button: {
        height: 40,
        borderWidth: 1,
        borderRadius: 8,
        marginTop: normalize(30),
        alignSelf: 'stretch',
        justifyContent: 'center',
    },
    bottonWrap: {
        flexDirection: 'row',
        justifyContent: 'center',
        flex: 1,
    },
    normalButton: {
        backgroundColor: '#48bbec',
        borderColor: '#48bbec',
    },
    disableButton: {
        backgroundColor: '#cdcdcd',
        borderColor: '#cdcdcd',
    },
    buttonIndicator: {
        marginRight: 5,
    },
    buttonText: {
        fontSize: 16,
        color: 'white',
        alignSelf: 'center'
    },
});