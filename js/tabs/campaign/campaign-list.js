'use strict';
import React,{Component} from 'react';
import{
    View,
    Text,
    StyleSheet,
    RefreshControl,
    ScrollView,
    LayoutAnimation,
    Platform,
} from 'react-native';
let bottomHeight=Platform.OS==='ios'?56:0;
import Dimensions from 'Dimensions';
import {campaignActions} from '../../actions';
import ReloadPage from '../../common/reloadPage';
import LoadPage from '../../common/loadPage';
import BottomLoad from '../../common/bottomLoad';
import NoDatePage from '../../common/noDatePage';
import CampaignRow from './campaignRow';
import AdColor from '../../common/AdColor';

export default class CampaignList extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            activeIndex:'',
        }
    }

    renderBottom(){
        if(this.props.campaignState.adding){
          return <BottomLoad />;
        } 
    }

    //传递给子组件一个设置当前展开项的函数，子组件点击设置activeIndex
    set_active_item(index){
        if(index==this.state.activeIndex) return;
        this.setState({
            activeIndex:index,
        });
    }

    reload_click(){
        const {advertiser,campaignActions,campaignState} = this.props;
        campaignActions.getCampaignStart();
        campaignActions.getCampaign({
            token:userToken_G,
            uid:advertiser.uid,
            where:campaignState.where,
        });
    }

    handlScroll(e){
        const {campaignState,advertiser,campaignActions} = this.props;
        let ev=e.nativeEvent;
        let windHeight=Dimensions.get('window').height;

        let height=ev.contentSize.height;
        let Scroll=ev.contentOffset.y;

        //已加载完，及正在加载中无法fetch请求
        if(Scroll>(height-windHeight-56)&&(height>windHeight)){
            if(!campaignState.adding&&!campaignState.addAll&&!campaignState.isRefresh){

                campaignActions.addingCampaign();
                campaignActions.getCampaign({
                    token:userToken_G,
                    uid:advertiser.uid,
                    where:campaignState.where,
                    page:campaignState.page
              });
            }
        }
    }

    render() {

        const {campaignState,campaignActions,advertiser,navigator,dispatch,changeTabItem,searchInfoState} = this.props;

        if(!campaignState.loaded){
            return <LoadPage />
        }

        if (campaignState.backType=='loadFail') {
            return <ReloadPage reload_click={this.reload_click.bind(this)} />
        }
        
        if (campaignState.backType=='success'&&campaignState.campaignList.length === 0) {
            return  <NoDatePage />
        }
        //LayoutAnimation.spring();
        const rows=campaignState.campaignList.map((data,i)=>{
            return (
                    <CampaignRow key={i} index={i} {...this.props}
                    activeIndex={this.state.activeIndex} set_active_item={this.set_active_item.bind(this)} data={data} />
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
                    refreshing={campaignState.isRefresh}
                    onRefresh={()=>{
                        campaignActions.refreshCampaign();
                        campaignActions.getCampaign({
                            token:userToken_G,
                            uid:advertiser.uid,
                            where:campaignState.where,
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
}
const styles=StyleSheet.create({
    wrap:{
        backgroundColor:AdColor.viewBackground,
        marginBottom:0,
    },
});
