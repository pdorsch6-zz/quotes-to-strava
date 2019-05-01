import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment';
import UploadToStrava from './UploadToStrava';

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
});

class ActivityRow extends Component {

  constructor(props) {
    super(props);

    this.state = {
      startTime: "",
      duration: ""
    };
  }

  componentDidMount() {
    let activity = this.props.activity;

    let startTime = activity.originalStartTime;
    startTime = moment(startTime).format('ddd, MM/DD/YY, h:mm a');
    let duration = this.msToTime(activity.activeDuration);

    this.setState({ startTime, duration });
  }

  msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return hrs + 'hr : ' + mins + 'm : ' + secs + 's';
  }

  render() {
    let activity = this.props.activity;
    let { startTime, duration } = this.state;
    return (
      <TableRow key={this.props.key}>
        <CustomTableCell component="th" scope="row">
          {activity.activityName}
        </CustomTableCell>
        <CustomTableCell>{startTime}</CustomTableCell>
        <CustomTableCell>{duration}</CustomTableCell>
        <CustomTableCell>
          {activity.distance ? activity.distance + " " + activity.distanceUnit : 'N/A'}
        </CustomTableCell>
        <CustomTableCell><UploadToStrava logId={activity.logId}/></CustomTableCell>
      </TableRow>
    );
  }
}

export default withStyles(styles)(ActivityRow);
