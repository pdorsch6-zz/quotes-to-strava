import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import QuoteTile from './QuoteTile';
  
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

class QuoteTable extends Component {

    render() {
        let quotes = this.props.quotes;
        const { classes } = this.props;
        return (
          <div className={classes.root}>
            <Grid container spacing={24}>
              {quotes.map((quote, index) => <QuoteTile quote={quote} key={index} /> )}
            </Grid>
          </div>
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
	return bindActionCreators({ ...actions.quotes }, dispatch);
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(withStyles(styles)(QuoteTable))
);