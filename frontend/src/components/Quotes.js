import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CircularProgress from '@material-ui/core/CircularProgress';

import * as actions from '../actions';
import AddQuote from './AddQuote';
import QuoteGrid from './QuoteGrid';


class Quotes extends Component {

    constructor(props) {
      super(props);
    }

    componentWillMount() {
      const { quotes, loadQuotes } = this.props;
      if (!quotes) {
        loadQuotes();
      }
    }


    render() {
      const { quotes, loading, error } = this.props;
      if (error) {
        return (
          <>
            <p> Error </p>
          </>
        );
      }
      return (
        <div>
          <div>
            <AddQuote />
          </div>
          <br />
          <div>
            {quotes ?
              <QuoteGrid />
              : 
              <CircularProgress />
            }
          </div>
          <br />
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
	)(Quotes)
);