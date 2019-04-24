import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

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


  render() {
    let activity = this.props.activity;
    return (
      <TableRow key={this.props.key}>
        <CustomTableCell component="th" scope="row">
          {activity.activityName}
        </CustomTableCell>
        <CustomTableCell align="right">{activity.originalStartTime}</CustomTableCell>
        <CustomTableCell align="right">{activity.activeDuration}</CustomTableCell>
        <CustomTableCell align="right">
          {activity.distance ? activity.distance + " " + activity.distanceUnit : 'N/A'}
        </CustomTableCell>
      </TableRow>
    );
  }
}

export default withStyles(styles)(ActivityRow);
