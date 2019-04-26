import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import { getTcx } from '../utils/fitbit';
import { createTcxFile } from '../utils/Utilities';

class UploadToStrava extends Component {

  constructor(props) {
    super(props);

    this.state = {
      logId: ""
    }

    this.uploadTcx = this.uploadTcx.bind(this);
  }

  componentDidMount() {
    let logId = this.props.logId;
    this.setState({logId});
  }

  async uploadTcx() {
    let { logId } = this.state;
    console.log(logId);
    let tcx = await getTcx(logId);
    await createTcxFile(tcx, logId);
  }

  render() {

    return (
      <Button variant="contained" color="primary" onClick={this.uploadTcx}>
        Upload
      </Button>
    );
  }
}

export default UploadToStrava;