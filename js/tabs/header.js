'use strict';
import React,{Component} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    Image,
    View,
} from 'react-native';

import {Heading2} from '../common/AdText';
import {normalize} from  '../utils';
import {connect} from 'react-redux';
import {homeInfoClear} from '../actions/home';
import {searchInfoClear} from '../actions/searchInfo';
import {searchAdvertiserClear} from '../actions/searchAdvertiser';


class AdsHeader extends Component {
    handlBack(){
        const {navigator,dispatch} = this.props;       
        navigator.jumpBack(); 
        dispatch(homeInfoClear());
        dispatch(searchInfoClear());
        dispatch(searchAdvertiserClear());
    }
    render() {
        const {headerName} = this.props;
        
        return (
            <View style={styles.wrap} >
                <TouchableOpacity 
                style={styles.imageWrap} 
                onPress={this.handlBack.bind(this)} >
                <Image style={styles.image} source={require('./icons/icon_back.png')} />

                </TouchableOpacity>

                <View style={styles.center} >
                <Heading2 
                style={{color:'#fff'}}
                numberOfLines={1}>
                    {headerName}
                </Heading2>
                </View>
            </View>
        );
    }
};
export default connect()(AdsHeader);

const styles = StyleSheet.create({
    wrap: {
        flexDirection: 'row',       
    },
    imageWrap:{
        width:44,
        justifyContent:'center',
        alignItems:'center',
    },
    image:{
        width:28,
        height:28,
    },
    center:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    }
});
