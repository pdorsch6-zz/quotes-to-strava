import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import UploadToStrava from './UploadToStrava';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    color: theme.palette.text.primary,
    fontFamily: 'Montserrat, sans-serif',
  },
  right: {
    textAlign: 'right'
  },
  left: {
    textAlign: 'left'
  },
  head: {
    fontWeight: 'bold',
    letterSpacing: '0.1em',
    fontSize: '1.2em'
  }
});

class ActivityTile extends Component {

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
    const { classes } = this.props;
    return (
      <Grid item xs={12} sm={6} md={4}>
        <Paper className={classes.paper}>
          <Grid container spacing={24}>
            <Grid item xs={6} className={`${classes.left} ${classes.head}`}>
              {activity.activityName}
            </Grid>
            <Grid item xs={6} className={classes.right}>
              {activity.distance ? activity.distance.toFixed(2) + " " + activity.distanceUnit : 'N/A'}
            </Grid>
            <Grid item xs={6} className={classes.left}>
              {startTime}
            </Grid>
            <Grid item xs={6} className={classes.right}>
              {duration}
            </Grid>
          </Grid>
          <UploadToStrava logId={activity.logId}/>
        </Paper>
      </Grid>
    );
  }
}

export default withStyles(styles)(ActivityTile);
