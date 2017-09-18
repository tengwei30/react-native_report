'user strict';
import React, {
    Component
} from 'react';
import {
    View,
    StyleSheet,
    RefreshControl,
    LayoutAnimation,
    ScrollView,
} from 'react-native';

import Dimensions from 'Dimensions';
import BottomLoad from '../common/bottomLoad';
import LoadPage from '../common/loadPage';
import LoadErrorPage from '../common/loadErrorPage';
import NoDatePage from '../common/noDatePage';
import AdvertiserRow from './advertiserRow';
import AdColor from '../common/AdColor';
import ReloadPage from '../common/reloadPage';
import {getUserInfo} from '../actions/user';

export default class AdvertiserList extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {}
    }

    reload_click() {
        const {advertiserDpActions,advertiser} = this.props;

        if(!networkStatus){
            return;
        }
        advertiserDpActions.loadAdvertiserListStart();
        advertiserDpActions.getAdvertiserList({
            token: userToken_G,
        });
        store.dispatch(getUserInfo({
            token: userToken_G,
            id: userId_G,
        }));
    }

    renderBottom() {
        if (this.props.advertiser.adding) {
            return <BottomLoad />;
        }
    }

    handlScroll(e) {
        const {
            advertiser,
            advertiserDpActions
        } = this.props;
        let ev = e.nativeEvent;
        let windHeight = Dimensions.get('window').height;

        let height = ev.contentSize.height;
        let Scroll = ev.contentOffset.y;
        if(!networkStatus){
            return;
        }
        //已加载完，及正在加载中无法fetch请求
        if (!advertiser.adding && !advertiser.addAll && !advertiser.isRefresh) {

            if (Scroll > (height - windHeight) && (height > windHeight)) {

                advertiserDpActions.addingAdvertiserList();
                advertiserDpActions.getAdvertiserList({
                    token: userToken_G,
                    uid: advertiser.uid,
                    page: advertiser.page
                });
            }
        }
    }

    render() {
        const {advertiser,navigator,advertiserDpActions} = this.props;

        if (!advertiser.loaded) {
            return <LoadPage />
        }

        if (advertiser.status == 'success' && advertiser.advertiserList.length === 0) {
            return <NoDatePage />
        }

        if (advertiser.status == 'loadFail') {
            return <ReloadPage reload_click={this.reload_click.bind(this)} />
        }

        //LayoutAnimation.spring();

        const rows = advertiser.advertiserList.map((data, ii) => {
            return (
                <AdvertiserRow key={ii} advertiser={data} navigator={navigator} />
            );
        });

        return ( 
            <ScrollView 
                style = {{backgroundColor: AdColor.viewBackground}}
                scrollEnabled={!advertiser.adding}
                scrollEventThrottle = {100}
                onScroll = {
                    this.handlScroll.bind(this)
                }
            refreshControl = { 
                <RefreshControl
                style={{backgroundColor:'transparent'}}
                refreshing = {advertiser.isRefresh}
                onRefresh = {
                    () => {
                        advertiserDpActions.refreshAdvertiserList();
                        advertiserDpActions.getAdvertiserList({
                            token: userToken_G,
                            uid: advertiser.uid,
                        });
                    }
                }
                tintColor = "#ccc"
                title = "数据加载中..."
                titleColor = "#ccc" />
            }>
            {rows} 
            {this.renderBottom()} 
            </ScrollView>
        );
    }
};