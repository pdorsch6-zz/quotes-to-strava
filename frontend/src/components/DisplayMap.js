import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import CustomSnackbar from './CustomSnackbar';

import FitbitService from '../utils/fitbit';
import StravaService from '../utils/strava';
import { randomQuote } from '../utils/Utilities';
import UploadToStrava from './UploadToStrava';

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, "../../", '.env') });


const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  white: {
    color: 'white'
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

class DisplayMap extends Component {

  constructor(props) {
    super(props);

    this.state = {
      logId: "",
      token: "",
      open: false,
      loading: false,
    }

    this.randomQuote = this.randomQuote.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClickClose = this.handleClickClose.bind(this);
    this.getTcxMap = this.getTcxMap.bind(this);
  }

  async componentDidMount() {
    let logId = this.props.logId;
    this.setState({logId});
    await this.randomQuote();
  }

  async randomQuote() {
    let title = await randomQuote();

    this.setState({title});
  }

  validateToken() {
    let { token } = this.state;
    return token === process.env.VALIDATION_TOKEN;
  }

  async handleClickOpen() {
    getTcxMap();
    this.setState({
      open: true,
      loading: true
    });
  };

  async getTcxMap() {

  }

  handleClickClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    const { classes } = this.props;
    let activity = this.props.activity;
    return (
      <>
      <Button variant="contained" color="primary" onClick={this.handleClickOpen}>
        Display Map
      </Button>
      <Dialog open={this.state.open} onClose={this.handleClickClose} aria-labelledby="simple-dialog-title">
        <DialogTitle id="dialog-title">Map</DialogTitle>
        <div id="map" className="map">
        </div>
        <DialogActions>
          <Button onClick={this.handleClickClose} color="secondary" variant="contained">
            Close
          </Button>
          <UploadToStrava logId={activity.logId}/>
        </DialogActions>
      </Dialog>
      </>
    );
  }
}

export default withStyles(styles)(DisplayMap);