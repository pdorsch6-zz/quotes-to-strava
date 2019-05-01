import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import FitbitService from '../utils/fitbit';
import StravaService from '../utils/strava';
import { createTcxFile, randomQuote } from '../utils/Utilities';

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
      description: ""
    }

    this.randomQuote = this.randomQuote.bind(this);
    this.uploadTcx = this.uploadTcx.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClickClose = this.handleClickClose.bind(this);
  }

  async componentDidMount() {
    let logId = this.props.logId;
    this.setState({logId});
    await this.randomQuote();
  }

  async uploadTcx() {
    if(this.validateToken()) {
      let { logId, title, description } = this.state;
      let tcx = await FitbitService.getTcx(logId);
      await StravaService.uploadTcx(tcx, title, description);
      this.handleClickClose();
    } else {
      this.setState({uploadError: "Incorrect validation token"});
    }
  }

  async randomQuote() {
    let title = await randomQuote();

    this.setState({title});
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

  onFieldChange(name, e) {
    this.setState({ [name]: e });
  }

  render() {
    const { classes } = this.props;
    let { uploadError, title, description, token } = this.state;
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
          <Button onClick={this.uploadTcx} color="primary" variant="contained">
            Upload
          </Button>
        </DialogActions>
      </Dialog>
      </>
    );
  }
}

export default withStyles(styles)(UploadToStrava);