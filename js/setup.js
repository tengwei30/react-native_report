import React,{Component} from 'react';
import {Text} from 'react-native';
import RouteNavigator from './navigator';
import {Provider} from 'react-redux';
import configureStore from './store/configureStore'

global.store=configureStore();

export default class Setup extends Component{

    render(){	
        return(
            <Provider store={store} >
                <RouteNavigator/>
            </Provider>
        );
    }
}


