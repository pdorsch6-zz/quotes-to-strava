import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';


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

class ManipulateQuote extends Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      quote: "",
      author: "",
      category: "",
    }

    this.fillInputs = this.fillInputs.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClickClose = this.handleClickClose.bind(this);
  }

  async componentDidMount() {

  }

  fillInputs() {
    let quote = this.props.quote.quote;
    let author = this.props.quote.author.name;
    let category = this.props.quote.category.category;
    this.setState({quote,author,category})
  }

  handleClickOpen = () => {
    this.fillInputs();
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
    let { classes } = this.props;
    let { quote, author, category } = this.state;
    return (
      <>
        <Button variant="contained" color="primary" onClick={this.handleClickOpen}>
          Edit
        </Button>
        <Dialog open={this.state.open} onClose={this.handleClickClose} aria-labelledby="simple-dialog-title">
          <DialogTitle id="dialog-title">Edit</DialogTitle>
          <form className={classes.container} noValidate>
            <TextField
              label="Quote"
              value={quote}
              multiline
              fullWidth
              onChange={e => this.onFieldChange('quote',  e.target.value)}
              className={classes.textField}
              margin="normal"
              variant="outlined"
            />
            <TextField
              label="Author"
              value={author}
              fullWidth
              onChange={e => this.onFieldChange('author',  e.target.value)}
              className={classes.textField}
              margin="normal"
              variant="outlined"
            />
            <TextField
              label="Category"
              value={category}
              onChange={e => this.onFieldChange('category',  e.target.value)}
              className={classes.textField}
              margin="normal"
              fullWidth
              variant="outlined"
            />
          </form>
          <DialogActions>
            <Button onClick={this.handleClickClose} variant="contained">
              Cancel
            </Button>
            <Button onClick={this.handleClickClose} color="secondary" variant="contained">
              Delete
            </Button>
            <Button onClick={this.uploadTcx} color="primary" variant="contained">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

export default withStyles(styles)(ManipulateQuote);