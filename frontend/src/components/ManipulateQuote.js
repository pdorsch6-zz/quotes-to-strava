import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';

import { withStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

import { updateQuote, deleteQuote } from '../utils/Utilities';

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
  edit: {
    margin: '0px',
    padding: '5px',
  },
});

class ManipulateQuote extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      quote: "",
      author: "",
      category: "",
    }

    this.fillInputs = this.fillInputs.bind(this);
    this.submit = this.submit.bind(this);
    this.delete = this.delete.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClickClose = this.handleClickClose.bind(this);
  }

  async componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
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

  async submit() {
    let id = this.props.quote._id;
    let { quote, author, category } = this.state;
    await updateQuote(id, quote, author, category);
    const { loadQuotes } = this.props.quotesActions;
    await loadQuotes();
    if(this._isMounted) {
      this.setState({
        open: false,
      });
    }
  }

  async delete() {
    let id = this.props.quote._id;
    await deleteQuote(id);
    const { loadQuotes } = this.props.quotesActions;
    await loadQuotes();
    if(this._isMounted) {
      this.setState({
        open: false,
      });
    }
  }

  onFieldChange(name, e) {
    this.setState({ [name]: e });
  }

  render() {
    let { classes } = this.props;
    let { quote, author, category } = this.state;
    return (
      <>
        <IconButton aria-label="Edit" className={classes.edit} onClick={this.handleClickOpen}>
          <EditIcon fontSize="small" />
        </IconButton>
        {/* <Button variant="contained" onClick={this.handleClickOpen}>
          <i class="fas fa-edit"></i>
        </Button> */}
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
            <Button onClick={this.delete} color="secondary" variant="contained">
              Delete
            </Button>
            <Button onClick={this.submit} color="primary" variant="contained">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

const mapStateToProps = state => {
	return {
		quotes: state.quotes.data,
		loading: state.quotes.loading,
		error: state.quotes.error,
	};
};

const mapDispatchToProps = dispatch => {
	return { 
    quotesActions: bindActionCreators({ ...actions.quotes }, dispatch),
    quoteActions: bindActionCreators({ ...actions.quote }, dispatch),
  }
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(withStyles(styles)(ManipulateQuote)));