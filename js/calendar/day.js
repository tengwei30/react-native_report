import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import moment from 'moment';

import { TouchableView } from './helpers';

class CalendarDay extends Component {
  static propTypes = {
    day: React.PropTypes.instanceOf(moment),
    selected: React.PropTypes.bool,
    onDatePress: React.PropTypes.func,
  };

  static defaultProps = {
    selected: false,
    onDatePress: () => false,
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.selected !== this.props.selected || (nextProps.day && !nextProps.day.isSame(this.props.day, 'day'));
  }
  render() {
    let day = this.props.day ? this.props.day.date() : ' ';
    let style = [styles.day];
    let textStyle=[styles.dayText];

    if (this.props.selected) {
      style.push(styles.selected);
      textStyle.push(styles.dayTextSelected);
    }

    return (
      <TouchableView style={styles.dayContainer} onPress={this._handlePress} viewStyle={style}>
        <Text style={textStyle}>{day}</Text>
      </TouchableView>
    )
  }
  _handlePress = () => {
    this.props.day && this.props.onDatePress(this.props.day);
  };
}

const styles = StyleSheet.create({
  dayContainer: {
    flex: 1,
  },
  day: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 10,
    paddingBottom: 10,
  },
  dayText: {
    fontSize: 18,
    fontFamily: 'avenir'
  },
  dayTextSelected:{
    color:'#fff',
  },
  selected: {
    backgroundColor: '#5DCEB2',
  }
});

export default CalendarDay;
