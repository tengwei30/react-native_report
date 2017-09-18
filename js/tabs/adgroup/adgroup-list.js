'user strict';
import React,{Component} from 'react';
import {
    View,
    StyleSheet,
    RefreshControl,
    ScrollView,
    LayoutAnimation,
    Platform,
} from 'react-native';

let bottomHeight=Platform.OS==='ios'?56:0;

import Dimensions from 'Dimensions';
import LoadPage from '../../common/loadPage';
import BottomLoad from '../../common/bottomLoad';
import LoadErrorPage from '../../common/loadErrorPage';
import NoDatePage from '../../common/noDatePage';
import ReloadPage from '../../common/reloadPage';
import AdgroupRow from './adgroupRow';
import AdColor from '../../common/AdColor';

export default class AdgroupList extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            activeIndex:'',
        }
    }

    renderBottom(){
        if(this.props.adgroupState.adding){
          return <BottomLoad />;
        } 
    }
    //请求广告失败，点击页面重新请求
    reload_click(){
        const {advertiser,adgroupActions,adgroupState} = this.props;
        adgroupActions.getAdgroupStart();
        adgroupActions.getAdgroup({
            token:userToken_G,
            uid:advertiser.uid,
            where:adgroupState.where,
        });
    }
    //传递给子组件一个设置当前展开项的函数，子组件点击设置activeIndex
    set_active_item(index){
        if(index==this.state.activeIndex) return;
        this.setState({
            activeIndex:index,
        });
    }
    //页面滚动到底添加更多广告
    handlScroll(e){
        const {adgroupState,advertiser,adgroupActions} = this.props;
        let ev=e.nativeEvent;
        let windHeight=Dimensions.get('window').height;

        let height=ev.contentSize.height;
        let Scroll=ev.contentOffset.y;

        //已加载完，及正在加载中无法fetch请求
        if(Scroll>(height-windHeight-56)&&(height>windHeight)){
            if(!adgroupState.adding&&!adgroupState.addAll&&!adgroupState.isRefresh){
            
                adgroupActions.addingAdgroup();
                adgroupActions.getAdgroup({
                    token:userToken_G,
                    uid:advertiser.uid,
                    where:adgroupState.where,
                    page:adgroupState.page
                });
            }
        }
    }
    
    render() {
        const {adgroupState,advertiser,navigator,adgroupActions,dispatch,changeTabItem,searchInfoState} = this.props;

        if(!adgroupState.loaded){
            return <LoadPage />
        }

        if (adgroupState.backType=='loadFail') {
            return <ReloadPage reload_click={this.reload_click.bind(this)} />
        }
       
        if (adgroupState.backType=='success'&&adgroupState.adgroupList.length === 0) {
            return <NoDatePage />
        }
        //LayoutAnimation.spring();
        const rows=adgroupState.adgroupList.map((data,ii)=>{
            return (
                    <AdgroupRow key={ii} index={ii} activeIndex={this.state.activeIndex} data={data} changeTabItem={changeTabItem} searchInfoState={searchInfoState} set_active_item={this.set_active_item.bind(this)} dispatch={dispatch} navigator={navigator} load_ad_source={adgroupActions.load_ad_source} />
            );
        });
        
        return (
            <ScrollView 
                style={styles.wrap}
                scrollEventThrottle={10}
                removeClippedSubviews={true}
                onScroll={this.handlScroll.bind(this)}
                refreshControl={
                <RefreshControl 
                    style={{backgroundColor:'transparent'}}
                    refreshing={adgroupState.isRefresh}
                    onRefresh={()=>{
                        adgroupActions.refreshAd();
                        adgroupActions.getAdgroup({
                            token:userToken_G,
                            uid:advertiser.uid,
                            where:adgroupState.where,
                        });
                    }}
                    tintColor="#ccc"
                    title="数据加载中..."
                    titleColor="#666" />
            }>
            {rows}
            {this.renderBottom()}
            </ScrollView>
        );
    }
};
const styles=StyleSheet.create({
    wrap:{
        backgroundColor:AdColor.viewBackground,
        marginBottom:0,
    },
});
