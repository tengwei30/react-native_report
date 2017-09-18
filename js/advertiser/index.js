'user strict';

import React, {
    Component
} from 'react';
import {
    View,
    StyleSheet,
    ListView,
    Text,
    TextInput,
    TouchableOpacity,
    AsyncStorage,
    Platform,
    BackAndroid,
    ToastAndroid,
    UIManager,
} from 'react-native';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {advertiserActions,shAdtiserActions} from '../actions';
import AdvertiserNav from './advertiser-nav';
import AdvertiserList from './advertiser-list';
import {getUserInfo} from '../actions/user';
import {ADVERTISER_SEARCH_HISTORY_LIST} from '../api';

class AdvertiserPage extends Component {

    componentDidMount() {
        const {advertiserDpActions,advertiser,navigator} = this.props;
        statistics('广告主列表');
        //开启android layoutanimation 
         if(Platform.OS==='android'){
            
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
        advertiserDpActions.getAdvertiserList({
            token: userToken_G,
        });
        store.dispatch(getUserInfo({
            token: userToken_G,
            id: userId_G,
        }));
        //从本地存储中获取广告主搜索记录，初始化广告主搜索historyList
        AsyncStorage.getItem(ADVERTISER_SEARCH_HISTORY_LIST)
        .then((list)=>{
            list=JSON.parse(list);
            list=list == null?[]:list;
            store.dispatch(shAdtiserActions.initAdvertiserHistoryList(list));
        });
    }

    componentWillMount(){
         const {navigator} = this.props;
        //进入应用将navigator对象赋值给全局变量gNavigator,可全局调用
        global.gNavigator=navigator;
        //安卓back键处理  一次返回 两次退出
        if (Platform.OS === 'android') {
          BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }

    componentWillUnmount() {
      if (Platform.OS === 'android') {
        BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
      }
    }

    onBackAndroid=()=>{
          const routers = gNavigator.getCurrentRoutes();
          if (routers.length > 1) {
            gNavigator.pop();
            return true;
          }else{
            if(this.lastBackPressed&&this.lastBackPressed+2000>=Date.now()){
                return false;
            }
            this.lastBackPressed=Date.now();
            ToastAndroid.show('再按一次退出应用',2000);
            return true;
          }
    }

    render() {
        const {advertiser,advertiserDpActions,navigator,loginOut} = this.props;
        return (
            <View style={styles.container}>
                <AdvertiserNav 
                navigator={navigator} 
                 loginOut={loginOut}/>
               <AdvertiserList 
                navigator={navigator}
                advertiser={advertiser} 
                advertiserDpActions={advertiserDpActions} />
            </View>
        );
    }
};


function select(state) {
    return {
        advertiser: state.advertiser,
    };
}

function bindActionsToProps(dispatch) {
    return {
        advertiserDpActions: bindActionCreators(advertiserActions, dispatch)
    };
}

export default connect(select, bindActionsToProps)(AdvertiserPage);
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});