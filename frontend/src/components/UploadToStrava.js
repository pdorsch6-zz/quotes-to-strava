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
import { randomQuote, markQuoteAsDeleted } from '../utils/Utilities';
import { quote } from '../actions';

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
  }
});

class UploadToStrava extends Component {

  constructor(props) {
    super(props);

    this.state = {
      logId: "",
      token: "",
      open: false,
      uploadError: "",
      title: "",
      quoteId: "",
      description: "",
      pending: false,
      snackbarOpen: false,
      snackbarStyle: 'success',
      snackbarMessage: ''
    }

    this.randomQuote = this.randomQuote.bind(this);
    this.uploadTcx = this.uploadTcx.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClickClose = this.handleClickClose.bind(this);
    this.closeSnackbar = this.closeSnackbar.bind(this);
    this.openSnackbar = this.openSnackbar.bind(this);
  }

  async componentDidMount() {
    let logId = this.props.logId;
    this.setState({logId});
    await this.randomQuote();
  }

  async uploadTcx() {
    if(this.validateToken()) {
      let { logId, title, description, quoteId } = this.state;
      this.setState({pending: true});
      try{
        let tcx = await FitbitService.getTcx(logId);
        let strava_response = await StravaService.uploadTcx(tcx, title, description);
        this.setState({pending: false});
        if(strava_response.ok) {
          this.openSnackbar('success', "Uploaded to Strava!" );
          await markQuoteAsDeleted(quoteId);
        } else {
          let error = await strava_response.json();
          this.openSnackbar('error', "Error: " + error.error );
        }
      } catch(err) {
        this.openSnackbar('error', "Error: " + err );
        this.setState({pending: false});
      }
      this.handleClickClose();
    } else {
      this.setState({uploadError: "Incorrect validation token"});
    }
  }

  async randomQuote() {
    let { quoteString, id } = await randomQuote();

    this.setState({ title: quoteString, quoteId: id });
  }

  validateToken() {
    let { token } = this.state;
    return token === process.env.VALIDATION_TOKEN;
  }

  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };

  handleClickClose = () => {
    this.setState({
      open: false,
    });
  };

  closeSnackbar = () => {
    this.setState({ snackbarOpen: false });
  };

  openSnackbar = (variant, message) => {
    this.setState({ snackbarOpen: true, snackbarStyle: variant, snackbarMessage: message });
  };

  onFieldChange(name, e) {
    this.setState({ [name]: e });
  }

  render() {
    const { classes } = this.props;
    let { uploadError, title, description, token, pending, snackbarMessage, snackbarStyle, snackbarOpen } = this.state;
    return (
      <>
      <Button variant="contained" color="primary" onClick={this.handleClickOpen}>
        Upload
      </Button>
      <Dialog open={this.state.open} onClose={this.handleClickClose} aria-labelledby="simple-dialog-title">
        <DialogTitle id="dialog-title">Upload to Strava</DialogTitle>
        <form className={classes.container} noValidate>
          <TextField
            label="Title"
            value={title}
            multiline
            fullWidth
            onChange={e => this.onFieldChange('title',  e.target.value)}
            className={classes.textField}
            margin="normal"
            variant="outlined"
          />
          <br/>
          <Button onClick={this.randomQuote} variant="contained">
            Random
          </Button>
          <br/>
          <TextField
            label="Description"
            value={description}
            multiline
            fullWidth
            onChange={e => this.onFieldChange('description',  e.target.value)}
            className={classes.textField}
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Validation Token"
            value={token}
            onChange={e => this.onFieldChange('token',  e.target.value)}
            className={classes.textField}
            margin="normal"
            fullWidth
            variant="outlined"
          />
          <div style={{color: 'red'}}>{uploadError}</div>
        </form>
        <DialogActions>
          <Button onClick={this.handleClickClose} color="secondary" variant="contained">
            Cancel
          </Button>
          <Button onClick={this.uploadTcx} color="primary" variant="contained" className={classes.white}>
            {pending ? <CircularProgress color="inherit" /> : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={this.closeSnackbar}
        >
        <CustomSnackbar
          onClose={this.closeSnackbar}
          variant={snackbarStyle}
          message={snackbarMessage}
        />
        </Snackbar>
      </>
    );
  }
}

export default withStyles(styles)(UploadToStrava);