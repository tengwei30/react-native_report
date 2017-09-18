'user strict';

import React, {
    Component
} from 'react';
import {
    AsyncStorage,
    StyleSheet,
    View,
    Text,
    Image,
    Navigator,
    StatusBar,
    Platform,
    Dimensions,
    PixelRatio,
} from 'react-native';

 import {bindActionCreators} from 'redux'
 import {connect} from 'react-redux'
 import {loginActions} from './actions';
 import {USER_LOGIN_INFO} from './api';
 import LoginForm from './login/login';
 import AdvertiserPage from './advertiser/index';
 import SearchPage from './advertiser/searchPage';
 import Ads from './tabs';
 import CampaignEdite from './tabs/campaign/campaign-edite';
 import CampaignSearch from './tabs/campaign/campaignSearch';
 import CampaignSelect from './tabs/campaign/campaignSelect';
 import AdSearch from './tabs/adgroup/adSearch';
 import AdSelect from './tabs/adgroup/adSelect';
 import AdEdite from './tabs/adgroup/adEdite';
 import AdDescPage from './tabs/adgroup/adDescPage';
 import EditePwd from './tabs/userInfo/editePwd';

 import UpdDateApp from './common/upDateApp';
 import buildStyleInterpolator from 'buildStyleInterpolator';
 import globalInit from './global';

//初始化全局函数和变量
globalInit();

//定义全局变量首次登陆，login action中赋值，再次登陆从存储中拿数据赋值

AsyncStorage.getItem(USER_LOGIN_INFO)
    .then((value) => {
        value = JSON.parse(value);

        if (value == null) {
            global.userId_G = '';
            global.userpassword_G = '';
            global.userToken_G = '';
            global.userOperator_G = '';
        } else {
            global.userId_G = value.id;
            global.userpassword_G = value.password;
            global.userToken_G = value.token;
            global.userOperator_G = value.operatortype;
        }
});


class RouteNavigator extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            showAndroidLaunchImg: true,
            showTime:Platform.OS==='ios'?100:2500,
        };
    }

    componentWillMount() {
        AsyncStorage.getItem(USER_LOGIN_INFO)
            .then((value) => {
                 value = JSON.parse(value);
                let allowLogin = this.props.loginActions.allowLogin;
                setTimeout(() => {

                    if (value !== null && value.token) {
                        userId_G = value.id,
                        userpassword_G = value.password,
                        userToken_G = value.token,
                        userOperator_G = value.operatortype,
                        allowLogin();
                    }
                    this.setState({
                        showAndroidLaunchImg: false,
                    });

                }, this.state.showTime);
            });
    }

    renderScene(route, navigator) {
        const {loginInfo,loginActions} = this.props;
        StatusBar.setHidden(false, 'none');

        if (!loginInfo.loggedIn || route.loginForm) {
            return (
                <LoginForm loginInfo={loginInfo} loginActions={loginActions} navigator={navigator} />
            );
        }
        if (route.search) {
            return (
                <SearchPage navigator={navigator} {...route.params} />
            );
        }
        if (route.adverDetail) {
            return (
                <Ads {...route.params} navigator={navigator} />
            );
        }

        if (route.campaignEdite) {
            return (
                <CampaignEdite {...route.params} navigator={navigator} />
            );
        }

        if (route.campaignSearch) {
            return (
                <CampaignSearch {...route.params} navigator={navigator} />
            );
        }

        if (route.campaignSelect) {
            return (
                <CampaignSelect {...route.params} navigator={navigator} />
            );
        }

        if (route.adSelect) {
            return (
                <AdSelect {...route.params} navigator={navigator} />
            );
        }

        if (route.adEdite) {
            return (
                <AdEdite {...route.params} navigator={navigator} />
            );
        }

        if (route.adDescPage) {
            return (
                <AdDescPage {...route.params} navigator={navigator} />
            );
        }

        if (route.adSearch) {
            return (
                <AdSearch {...route.params} navigator={navigator} />
            );
        }
        if (route.editePwd) {
            return (
                <EditePwd {...route.params} navigator={navigator} />
            );
        }
        if (route.upDateApp) {
            return (
                <UpdDateApp {...route.params} navigator={navigator} />
            );
        }
        return (<AdvertiserPage navigator={navigator} />);
    }
    configureScene(route) {

        if (route.search || route.campaignSearch || route.adSearch||route.upDateApp) {
            //设置搜索页动画只有opacity变化
            return {
                ...Navigator.SceneConfigs.FloatFromRight,
                gestures: null,
                defaultTransitionVelocity: 100,
                animationInterpolators: {
                    into: buildStyleInterpolator(NoTransition),
                    out: buildStyleInterpolator(NoTransition),
                }
            };
        }
        return CustomPushfromRight;
    }

    render() {
        
        if (this.state.showAndroidLaunchImg) {
            StatusBar.setHidden(true, 'none');
            return (
                <View style={styles.container}>
                   {Platform.OS=='android'&&<Image   style={styles.backgroundImage} source={require('./img/hello_page_bg.png')} />}
                </View>
            );
        } else {
            return (
                <Navigator
                initialRoute={{}}
                configureScene={this.configureScene}
                renderScene={this.renderScene.bind(this)} />
            );
        }
    }
};

function mapStateToProps(state) {

    return {
        loginInfo: state.loginInfo
    }
}

function mapDispatchToprops(dispatch) {
    return {
        loginActions: bindActionCreators(loginActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToprops)(RouteNavigator);

//定义不同路由切换动画效果
const NoTransition = {
    opacity: {
        value: 1,
        type: 'constant',
    },
};

const SCREEN_WIDTH = Dimensions.get('window').width;

const ToTheLeftCustom = {
    transformTranslate: {
        from: {x: 0,y: 0,z: 0},
        to: {x: -SCREEN_WIDTH,y: 0, z: 0}, 
        min: 0,
        max: 1,
        type: 'linear',
        extrapolate: false,
        round: PixelRatio.get(),
    },
    opacity: {
        value: 1.0,
        type: 'constant',
    },
};
const ToTheRightCustom = {
    transformTranslate: {
        from: {x: SCREEN_WIDTH,y: 0,z: 0},
        to: {x: 0,y: 0,z: 0},
        min: 0,
        max: 1,
        type: 'linear',
        extrapolate: false,
        round: PixelRatio.get(),
    },
    opacity: {
        value: 1.0,
        type: 'constant',
    },
};

const baseInterpolators = Navigator.SceneConfigs.PushFromRight.animationInterpolators;
const customInterpolators = Object.assign({}, baseInterpolators, {
    into: buildStyleInterpolator(ToTheRightCustom),
    out: buildStyleInterpolator(ToTheLeftCustom),
});
const baseConfig = Navigator.SceneConfigs.PushFromRight;
const CustomPushfromRight = Object.assign({}, baseConfig, {
    animationInterpolators: customInterpolators,
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'cover',
    },
});