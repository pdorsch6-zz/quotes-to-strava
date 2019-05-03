import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ActivityTile from './ActivityTile';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
        fontFamily: 'Montserrat, sans-serif',
    },
});

class ActivityGrid extends Component {

  render() {
    let activityList = this.props.activityList;
    let activityJson = activityList ? JSON.parse(activityList) : [];
    const { classes } = this.props;
    return (
    <div className={classes.root}>
      <Grid container spacing={24}>
        {activityJson.map((activity, index) => {
            if(activity.distance > 0) {
            return <ActivityTile activity={activity} key={index} />;
            }
        })}
      </Grid>
    </div>
    );
  }
}
export default withStyles(styles)(ActivityGrid);