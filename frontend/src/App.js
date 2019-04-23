import React, { Component } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import Quotes from './components/Quotes';
import Activities from './components/Activities';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    margin: '10px 40px',
  },
  base: {
    backgroundColor: '#eee',
    borderTop: '#aaa'
  }
});

class App extends Component {

  constructor(props) {
    super(props);
  }
  
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Tabs>
          <TabList>
            <Tab>Quotes</Tab>
            <Tab>Fitbit Activities</Tab>
          </TabList>
          <TabPanel className={classes.base}>
            <div className={classes.root}>
              <Grid container spacing={24}>
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <Quotes />
                  </Paper>
                </Grid>
              </Grid>
            </div>
          </TabPanel>
          <TabPanel className={classes.base}>
          <div className={classes.root}>
              <Grid container spacing={24}>
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <Activities />
                  </Paper>
                </Grid>
              </Grid>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);