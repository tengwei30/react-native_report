import React, { Component, PropTypes } from 'react';
import { Image, View, Text, TouchableOpacity, StyleSheet,Dimensions, LayoutAnimation} from 'react-native';
import moment from 'moment';

import { TouchableView } from './helpers';
import CalendarDay from './day';
import CalendarDayLabel from './dayLabel';

import chevronLeft from './assets/chevronLeft.png';
import chevronRight from './assets/chevronRight.png';
const ScreenWidth=Dimensions.get('window').width;
const ScreenHeight=Dimensions.get('window').height;
const RANGE = 'range';

const SINGLE = 'single';
const MONTH_NAMES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const DAY_NAMES = ['日', '一', '二', '三', '四', '五', '六'];

class Calendar extends Component {
  static propTypes = {
    clearText: PropTypes.string,
    closeText: PropTypes.string,
    date: PropTypes.oneOfType([
      PropTypes.instanceOf(Date),
      PropTypes.instanceOf(moment),
      PropTypes.object,
    ]),
    selectionType: PropTypes.oneOf([RANGE, SINGLE]),
    onClose: PropTypes.func,
    onDateChange: PropTypes.func,
  };

  static defaultProps = {
    clearText: '清除选择',
    sureText:'确认',
    closeText: '关闭',
    date: moment(),
    selectionType: SINGLE,
    onClose: () => true,
    onDateChange: () => false,
  };

  constructor(props) {
    super(props);

    this.isRange = props.selectionType === RANGE;
    let selected;
    let year;
    let month;
    if (this.isRange){
      if (!moment.isMoment(props.date) && props.date.min && props.date.max) {
        selected = {
          min: props.date.min,
          max: props.date.max
        };
        year = props.date.max.year();
        month = props.date.max.month();
      } else {
        selected = {};
        year = moment().year();
        month = moment().month();
      }
    } else {
      selected = props.date;
      year = props.date.year();
      month = props.date.month();
    }

    this.state = {
      year,
      month,
      selected,
      calendarHeight:0,
    };
  }

  componentDidMount() {
    setTimeout(()=>{
      this.measureSize()
    })
  }

  measureSize(){
    this.refs.calendarWrap.measure((ox, oy, width, height, px, py)=>{
          this.setState({
            calendarHeight:height,
          });
      });
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Implemented this custom update because we don't want to have to re-render
    // 30+ views if we don't have to because the external state of this component changed.
    let shouldUpdate = this._checkProps(this.props, nextProps);
    if (shouldUpdate) {
      return true;
    }

    shouldUpdate = this._checkState(this.state, nextState);
    return shouldUpdate;
  }
  render() {
    let calendarMonth = new moment().year(this.state.year).month(this.state.month).date(1);
    let dayOffset = calendarMonth.day();
    let monthNumberOfDays = calendarMonth.endOf('month').date();

    let calendarDates = this._getCalendarDates(monthNumberOfDays, dayOffset, this.state.year, this.state.month);
    let calendarTop=(ScreenHeight-this.state.calendarHeight)/2;
    return (
      <View style={[styles.calendarContainer,{top:calendarTop}]} ref='calendarWrap' >
        <View style={styles.calendarTopContainer}>
          <TouchableView style={styles.calendarTopPrevContainer} onPress={this._handlePrevPress}>
            <Image source={chevronLeft} style={{ height: 15, width: 27 }} resizeMode="contain" />
          </TouchableView>
          <View style={styles.calendarTopMonthYearContainer}>
            <Text style={styles.calendarTopMonthYearText}>
              {`${this.state.year}年${MONTH_NAMES[this.state.month]}月`}
            </Text>
          </View>
          <TouchableView style={styles.calendarTopNextContainer} onPress={this._handleNextPress}>
            <Image source={chevronRight} style={{ height: 15, width: 27 }} resizeMode="contain" />
          </TouchableView>
        </View>
        <View style={styles.calendarDayLabelContainer}>
          {DAY_NAMES.map((day, index) => (
            <CalendarDayLabel key={index} day={day} />
          ))}
        </View>
        {calendarDates.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.calendarWeekRow}>
            {row.map((day, dayIndex) => this._buildCalendarDate(day, dayIndex))}
          </View>
        ))}
        <View style={styles.buttonBox}>

          <TouchableView onPress={this.props.onSure} style={styles.clearRangeContainer}>
            <Text style={styles.clearRangeText}>{this.props.sureText}</Text>
          </TouchableView>

          <TouchableView onPress={this.props.onClose} style={[styles.clearRangeContainer,styles.buttonGray]}>
            <Text style={styles.clearRangeText}>{this.props.closeText}</Text>
          </TouchableView>
          
          {this.isRange &&
            <TouchableView onPress={this._handleClearRange} style={[styles.clearRangeContainer,styles.buttonGray]}>
              <Text style={styles.clearRangeText}>{this.props.clearText}</Text>
            </TouchableView>
          }
        </View>
      </View>
    );
  }
  _checkProps = (current, next) => {
    // We only check the date matches the initial date since that is the only prop
    // that would change on the re-render.
    if (this.isRange && !moment.isMoment(current.date)) {
      if (!current.date.min) {
        return true;
      }

      let update = current.date.min.isSame(next.date.min, 'day');
      if (update) {
        return true;
      }

      return current.date.max.isSame(next.date.max, 'day');
    }

    return !current.date.isSame(next.date, 'day');
  };
  _checkState = (current, next) => {
    // State is a bit more tricky since we are dealing with moment objects. We need to an actual comparison of selected.
    if (current.year !== next.year) {
      return true;
    }

    if (current.month !== next.month) {
      return true;
    }

    if (this.isRange) {
      if (!current.selected.min && !current.selected.max) {
        // means we are setting it for the first time.
        return true;
      }

      if (!next.selected.min && !next.selected.max) {
        // means we cleared the range.
        return true;
      }

      if (current.selected.min.isBefore(next.selected.min, 'day')) {
        // means we moved the range to an earlier date.
        return true;
      }

      if (!current.selected.max.isSame(next.selected.max, 'day')) {
        return true;
      }

      return false;
    } else {
      if (!current.selected.isSame(next.selected, 'day')) {
        return true;
      }

      return false;
    }
  };
  _getCalendarDates = (numberOfDays, offset, year, month) => {
    let calendar = [];
    let currentRow = [];
    for(let i = 0; i < numberOfDays + offset; i++) {
      if (i !== 0 && i % 7 === 0) {
        calendar.push(currentRow);
        currentRow = [];
      }

      if (i < offset) {
        currentRow.push(null);
      } else {
      	let day = i + 1 - offset;
        currentRow.push(new moment().year(year).month(month).date(day));
      }
    }

    if (currentRow.length) {
      if (currentRow.length < 7) {
        let difference = 7 - currentRow.length;
        for (let i = 0; i < difference; i++) {
          currentRow.push(null);
        }
      }

      calendar.push(currentRow);
    }

    return calendar;
  };
  _buildCalendarDate = (day, dayIndex) => {
    let selected = false;

    if (this.isRange) {
      if (this.state.selected.min && this.state.selected.max) {
        selected = day && day.isBetween(this.state.selected.min, this.state.selected.max, 'day');
        if (!selected) {
          selected = (day && day.isSame(this.state.selected.min, 'day')) || (day && day.isSame(this.state.selected.max, 'day'));
        }
      }
    } else {
      selected = this.state.selected.isSame(day, 'day');
    }
    return <CalendarDay key={dayIndex} day={day} selected={selected} onDatePress={this._handleDateChange} />;
  };
  _handlePrevPress = () => {
    let month = this.state.month;
    let year = this.state.year;

    if (month === 0) {
      month = 11;
      year--;
    } else {
      month--;
    }

    let state = Object.assign({}, this.state, {
      month,
      year,
    });

    this.setState(state);
  };
  _handleNextPress = () => {
    let month = this.state.month;
    let year = this.state.year;

    if (month === 11) {
      month = 0;
      year++;
    } else {
      month++;
    }

    this.setState({
      month,
      year,
    });
  };
  _handleClearRange = () => {
    selected = {};
    this.setState({
      selected,
    });
    this.props.onDateChange(selected);
  };
  _handleDateChange = (date) => {
    let selected = date;
    
    if (this.isRange) {
      selected = Object.assign({}, this.state.selected);
      // Need to short cicuit if the date is the same as the min and both min and max are set.
      // This clears the range.
      if (date.isSame(selected.min, 'day') && (selected.min && selected.max)) {
        selected = {};
        this.setState({
          selected,
        });
        this.props.onDateChange(selected);
        return;
      }

      if (date.isBefore(selected.min, 'day') || !selected.min) {
        selected.min = date;
      }

      selected.max = date;
    }

    this.setState({
      selected,
    });

    this.props.onDateChange(selected);
  };
}

const styles = StyleSheet.create({
  calendarTextBase: {
    fontFamily: 'avenir',
  },
  calendarContainer: {
    alignSelf: 'stretch',
    position:'absolute',
    left:10,
    width:ScreenWidth-20,
    padding:10,
    backgroundColor:'#fff',
    borderRadius:4,
  },
  // 控制年月选择框样式
  calendarTopContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    //backgroundColor:'red',
  },
  calendarTopPrevContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height:40,
  },
  calendarTopPrevText: {
    flex: 1,
    fontFamily: 'avenir',
    fontSize: 15,
    color: '#B6B6B6'
  },
  calendarTopMonthYearContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarTopMonthYearText: {
    flex: 1,
    fontFamily: 'avenir',
    fontSize: 16
  },
  calendarTopNextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height:40,
  },
  calendarTopNextText: {
    flex: 1,
    fontFamily: 'avenir',
    fontSize: 15,
    color: '#B6B6B6'
  },
  calendarDayLabelContainer: {
    flexDirection: 'row',
  },
  calendarWeekRow: {
    flexDirection: 'row',
  },
  buttonBox:{
   flexDirection: 'row', 
   alignItems: 'center',
   justifyContent:'space-between',
   paddingTop:6,
   paddingBottom:6 
  },
  buttonGray:{
    backgroundColor:'#ccc',
  },
  clearRangeContainer: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#32BBA8',
    width:80,
     paddingTop:6,
     paddingBottom:6,
    borderRadius:4,
  },
  clearRangeText: {
    flex: 1,
    fontFamily: 'avenir',
    fontSize: 14,
    color: '#fff'
  }
});

export default Calendar;
