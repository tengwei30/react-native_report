'use strict';
import React,{Component} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Image,
    Text,
    View
} from 'react-native';


import {connect} from 'react-redux';
import CamDetailHeader from './camHeadDetail';
import CampaignEditeBasic from './campaignEditeBasic';
import CampaignEditeHight from './campaignEditeHight';
import SlidableTabBar from '../../common/segmentView';
import {editeSearchCamInit,editeInit} from '../../actions/campaign';

 class CampaignEdite extends Component {
    constructor(props, context){
        super(props, context);
        this.state = {};
    }

    render() {
        const { data,navigator,index,campaignState,dispatch} = this.props;
    
        return (
            <View style={styles.container}>
                <CamDetailHeader dispatch={dispatch} navigator={navigator} headerName={data.name} />
                <SlidableTabBar top={8} >
                    <CampaignEditeBasic {...this.props} title="基本设置" />
                    <CampaignEditeHight {...this.props} title="高级设置" />
                </SlidableTabBar>
            </View>
        );
    }
};

function select (state){
  return{
    campaignState:state.campaignState,
    shCampaignState:state.shCampaignState,
  }
}

export default connect(select)(CampaignEdite);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',
    },
});