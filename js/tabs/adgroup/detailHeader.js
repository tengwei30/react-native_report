'use strict';
import React,{Component} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    Image,
    View,
} from 'react-native';

import {Heading2} from '../../common/AdText';
import {normalize} from  '../../utils';
import {connect} from 'react-redux';

class AdDetailHeader extends Component {
    handlBack(){
        const {dispatch,navigator} = this.props;
        gNavigator.jumpBack();
    }
    render() {
        const {navigator,headerName} = this.props;
        return (
            <View style={styles.header}>
                <TouchableOpacity 
                style={styles.imageWrap} 
                onPress={this.handlBack.bind(this)} >
                <Image style={styles.image} source={require('../icons/icon_back.png')} />
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
export default connect()(AdDetailHeader);

const styles = StyleSheet.create({
    header: {
        height: 60,
        paddingTop:16,
        backgroundColor: '#283a49',
        paddingRight: 10,
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
