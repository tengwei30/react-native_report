'use strict';
import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    StatusBar,
    ScrollView,
} from 'react-native';

import {connect} from 'react-redux';
import commonStyles from '../../common/commonStyles';
import AdsHeader from '../header';
import HourReaport from './hourReport'
import DailyReaport from './dailyReport'
import PublisherReaport from './publisherReport'
import AreaReaport from './areaReport'
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';

class DataViews extends Component {
    constructor(props) {
      super(props);
    
      this.state = {
        text:'默认',
      };
    }

    shouldComponentUpdate(nextProps){
        if(nextProps.changeTabItem==this.props.changeTabItem){
            return true;
        }
        return false;
    }

    render() {
        const {advertiser,dataChartState,dispatch} = this.props;
        return (
           
            <ScrollableTabView
                  style={styles.wrap}
                  tabBarBackgroundColor='#283a49'
                  tabBarActiveTextColor='#5aaaea'
                  tabBarInactiveTextColor='#ccc'
                  tabBarUnderlineStyle={styles.selectLine}
                  page={dataChartState.initPage}
                  renderTabBar={() => <DefaultTabBar 
                    style={{height:60,paddingTop:20}}
                   />}
                >
               
                <HourReaport {...this.props} tabLabel='小时报表'  />
                <DailyReaport {...this.props} tabLabel='日报表'  />
                <PublisherReaport {...this.props} tabLabel='媒体报表'  />         
                <AreaReaport {...this.props} tabLabel='地域报表'  />          
                </ScrollableTabView>
              
        );
    }
}

function select(state){
  return{
    dataChartState:state.dataChartState,
  }
}

export default connect(select)(DataViews);


const styles=StyleSheet.create({
    wrap:{
        backgroundColor:'#fff',
    },
    selectLine:{
        backgroundColor:'#5aaaea',
        height:3,
    }
});