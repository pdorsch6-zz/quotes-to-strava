import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';
import { withStyles } from '@material-ui/core/styles';
import ManipulateQuote from './ManipulateQuote';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
  
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
    },
    italics: {
        fontStyle: 'italic',
    },
    noPadding: {
        padding: '0px !important'
    }
  });

class QuoteRow extends Component {
    

    render() {
        let quote = this.props.quote;
        const { classes } = this.props;
        return (
            <Grid item xs={12} sm={6} md={4}>
            <Paper className={classes.paper}>
              <Grid container spacing={24}>
                <Grid item xs={12} className={`${classes.right} ${classes.noPadding}`}>
                    <ManipulateQuote quote={quote} />
                </Grid>
                <Grid item xs={12} className={`${classes.left}`}>
                    {quote.quote}
                </Grid>
                <Grid item xs={6} className={`${classes.left} ${classes.italics}`}>
                    - {quote.author ? 
                        quote.author.name.toLowerCase()
                        .split(' ')
                        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                        .join(' ')
                         : 
                         '---'
                    }
                </Grid>
                <Grid item xs={6} className={classes.right}>
                    {quote.category ? quote.category.category.charAt(0).toUpperCase() +
                        quote.category.category.substring(1) 
                    : '---'}
                </Grid>
              </Grid>
            </Paper>
          </Grid>
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
	)(withStyles(styles)(QuoteRow))
);