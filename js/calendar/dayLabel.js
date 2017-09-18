import React, { PropTypes } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CalendarDayLabel = (props) => (
  <View style={styles.labelContainer}>
    <Text style={styles.label}>{props.day}</Text>
  </View>
);

const styles = StyleSheet.create({
  labelContainer: {
    flex: 1,
  },
  label: {
    textAlign: 'center',
    fontSize: 14,
    color: '#5DCEB2',
    fontFamily: 'avenir',
  },
});

export default CalendarDayLabel;
