'use strict';
import React,{Component} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Image,
    Text,
    View,
    InteractionManager,
} from 'react-native';

import {connect} from 'react-redux';
import AdHeader from './adHeader';
import AdEditeBasic from './adEditeBasic';
import AdEditeHeight from './adEditeHeight';
import SlidableTabBar from '../../common/segmentView';
import {editeSearchAdInit,editeInit} from '../../actions/adgroup';

class AdEdite extends Component {
    constructor(props, context){
        super(props, context);
        this.state = {};
    }

    render() {
        const { data,navigator,index,adgroupState,dispatch} = this.props;

        return (
            <View style={styles.container}>
                <AdHeader navigator={navigator} dispatch={dispatch} headerName={data.name} />
                <SlidableTabBar top={8} >
                    <AdEditeBasic {...this.props} title="基本设置" />
                    <AdEditeHeight {...this.props} title="高级设置" />
                </SlidableTabBar>
            </View>
        );
    }
};

function select (state){
  return{
    adgroupState:state.adgroupState,
    shAdState:state.shAdState,
  }
}
export default connect(select)(AdEdite);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',
    },
});
