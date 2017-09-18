'user strict';

import React,{Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    Platform,
} from 'react-native';

import {connect} from 'react-redux';
import {loginOut} from '../actions/login';
import AdColor from '../common/AdColor';
import codePush from "react-native-code-push";

class AdvertiserNav extends Component {

    renderSearch(){
        const {navigator} = this.props;
        if(navigator){
            navigator.push({
                search:true,
                params:{
                    ...this.props
                }
            });
        }
    }

    _loginOut(){
       const {navigator,dispatch} = this.props;
        if(navigator){
            dispatch(loginOut());
            navigator.push({
                loginForm:true
            });
        } 
    }

    componentDidMount() {
        codePush.notifyApplicationReady();
    }

    componentWillMount(){
       //检查更新，如有可用的更新显示更新页面
       codePush.checkForUpdate()
        .then((update) => {
            if (!update) {
                logger.debug("APP 已经是最新版了"); 
            } else {
                logger.debug('更新包信息',update);
                //如果更新失败，就不弹出更新UI
                if(update.failedInstall&&!__DEV__) return;

                this.props.navigator.push({
                    upDateApp:true
                });
            }
        });  
    }

    render() {
        const {navigator} = this.props;
        if(Platform.OS==='ios'){
            StatusBar.setBarStyle(1);
        }else{
            StatusBar.setBackgroundColor('transparent');
            StatusBar.setTranslucent(true);
        }
        
        return (
            <View style={styles.nav}>
                <View style={styles.title} >
                <Text style={styles.titleText} >智云众DSP</Text>
                </View>
                <TouchableOpacity 
                onPress={this.renderSearch.bind(this)} 
                style={styles.searchWrap}>
                    <Image  
                    source={require('../common/img/icon-search-gray.png')} 
                    style={styles.searchIcon}/>
                    <Text style={styles.label} >请输入广告主名称</Text>
                </TouchableOpacity>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    nav: {
        height: 60,
        paddingTop:10,
        backgroundColor:AdColor.themeColor,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    title: {
        width:90,
    },
    titleText:{
        color: '#68abec',
        fontSize: 16,  
    },
    searchIcon: {
        width:20,
        height:20,
    },
    searchWrap:{
        width:200,
        height:26,
        flexDirection:'row',
        backgroundColor:'#515e67',
        borderWidth:1,
        justifyContent:'center',
        borderColor:'#364451',
        borderRadius:13,
        justifyContent:'center',
        alignItems:'center',
    },
    label:{
        fontSize:12,
        color:'#ccc',
    },
    avatar: {
        width:25,
        height:25
    },
});


export default connect()(AdvertiserNav);

