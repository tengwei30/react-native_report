'use strict';
import React,{Component} from 'react';
import {
    TabBarIOS,
    Text,
    Image,
    View,
} from 'react-native';

import HomeView from './home';
import CampaignView from './campaign';
import AdgroupView from './adgroup';
import DataViews from './data';
import UserView from './userInfo';
import AdColor from '../common/AdColor';
import TabNavigator from 'react-native-tab-navigator';
import {connect} from 'react-redux';

class Ads extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedTab: 'home'
        };
    }

    changeTabItem(tabName) {
        this.setState({
            selectedTab: tabName
        });
    }

    render() {
        const {dispatch} = this.props;

        return (
            <TabNavigator
                tabBarStyle={{backgroundColor:AdColor.themeColor,height:56,alignItems:'center',justifyContent:'center'}}
            >
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'home'}
                    title="首页"
                    selectedTitleStyle={{color:'#5aaaea'}}
                    renderIcon={() => <Image source={require('./icons/icon-home.png')} />}
                    renderSelectedIcon={() => <Image source={require('./icons/icon-home-s.png')} />}
                    onPress={() =>{
                        this.changeTabItem('home');
                    }}>
                    <HomeView {...this.props} />
                  </TabNavigator.Item>

                  <TabNavigator.Item
                      selected={this.state.selectedTab === 'campaign'}
                      title="推广"
                      selectedTitleStyle={{color:'#5aaaea'}}
                      renderIcon={() => <Image source={require('./icons/icon-campaign.png')} />}
                      renderSelectedIcon={() => <Image source={require('./icons/icon-campaign-s.png')} />}
                      onPress={() =>{
                          this.changeTabItem('campaign');
                      }}>
                      <CampaignView changeTabItem={this.changeTabItem.bind(this)} {...this.props}/>
                    </TabNavigator.Item>

                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'adgroup'}
                        title="广告"
                        selectedTitleStyle={{color:'#5aaaea'}}
                        renderIcon={() => <Image source={require('./icons/icon-adgroup.png')} />}
                        renderSelectedIcon={() => <Image source={require('./icons/icon-adgroup-s.png')} />}
                        onPress={() =>{
                            this.changeTabItem('adgroup');
                        }}>
                        <AdgroupView changeTabItem={this.changeTabItem.bind(this)}  {...this.props} {...this.props}/>
                      </TabNavigator.Item>

                      <TabNavigator.Item
                          selected={this.state.selectedTab === 'data'}
                          title="报表"
                          selectedTitleStyle={{color:'#5aaaea'}}
                          renderIcon={() => <Image source={require('./icons/icon-data.png')} />}
                          renderSelectedIcon={() => <Image source={require('./icons/icon-data-s.png')} />}
                          onPress={() =>{
                              this.changeTabItem('data');
                          }}>
                          <DataViews  {...this.props}/>
                        </TabNavigator.Item>

                        <TabNavigator.Item
                            selected={this.state.selectedTab === 'user'}
                            title="我的"
                            selectedTitleStyle={{color:'#5aaaea'}}
                            renderIcon={() => <Image source={require('./icons/icon-user.png')} />}
                            renderSelectedIcon={() => <Image source={require('./icons/icon-user-s.png')} />}
                            onPress={() =>{
                                this.changeTabItem('user');
                            }}>
                            <UserView  {...this.props}/>
                          </TabNavigator.Item>

            </TabNavigator>
        );
    }
};

export default connect()(Ads);

