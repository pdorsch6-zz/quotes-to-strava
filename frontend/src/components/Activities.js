import React, { Component } from "react";
import Button from '@material-ui/core/Button';
import { createAuthLink, getAccessRefresh, getAccessToken, getRefreshToken, refresh, activities } from '../utils/fitbit';
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, "../../", '.env') });

const FITBIT_REDIRECT = process.env.FITBIT_REDIRECT;
const FITBIT_CLIENT_ID = process.env.FITBIT_CLIENT_ID;


class Activities extends Component {

    constructor(props) {
        super(props);

        this.state = {
            authLink: "",
            authState: "unauthorized",
            activityList: ""
        };
    }

    async componentDidMount() {
        let accessToken = await getAccessToken();
        let refreshToken = await getRefreshToken();
        if(!accessToken || !refreshToken) {
            let url = new URL(window.location.href);
            let code = url.searchParams.get("code");
            if(code) {
                console.log(code);
                await getAccessRefresh(code);
            }
            let authLink = await createAuthLink();
            this.setState({ authLink });
        }
        await refresh(refreshToken.token);
        let activityList = await activities(accessToken.token);
        console.log(typeof activityList);

        this.setState({ activityList: JSON.stringify(activityList) });
        // console.log(accessToken.token);
        // console.log(refreshToken.token);
        //
        // await refresh(refreshToken.token);
        // accessToken = await getAccessToken();
        // refreshToken = await getRefreshToken();
        // console.log(accessToken.token);
        // console.log(refreshToken.token);
    }

    render() {
        let { authLink, activityList } = this.state;

        return (
            <div>
                <a href={ authLink }>Authorize with Fitbit</a>
                <p>
                    { activityList }
                </p>
            </div>
        );
    }
}

export default Activities;