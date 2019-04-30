import React, { Component } from "react";
import Button from '@material-ui/core/Button';
import FitbitService from '../utils/fitbit';
import StravaService from '../utils/strava';
import ActivityTable from "./ActivityTable";
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, "../../", '.env') });

const FITBIT_REDIRECT = process.env.FITBIT_REDIRECT;
const FITBIT_CLIENT_ID = process.env.FITBIT_CLIENT_ID;


class Activities extends Component {

    constructor(props) {
        super(props);

        this.state = {
            fitbitAuthLink: "",
            fitbitAuthState: "unauthorized",
            fitbitUser: null,
            activityList: "",
            stravaAuthLink: "",
            stravaAuthState: "unauthorized",
            stravaUser: null
        };

        this.authenticateStrava = this.authenticateStrava.bind(this);
        this.authenticateFitbit = this.authenticateFitbit.bind(this);
        this.getActivityList = this.getActivityList.bind(this);
    }

    async componentDidMount() {
        this.checkCode();
        //FITBIT
        let fitbitTokens = await this.authenticateFitbit();

        //STRAVA
        let stravaTokens = await this.authenticateStrava();

        await this.getActivityList(fitbitTokens.access);
    }

    async authenticateStrava() {
        var accessToken = await StravaService.getAccessToken();
        var refreshToken = await StravaService.getRefreshToken();
        let stravaUser = await StravaService.getUser(accessToken.token);
        if(stravaUser) {
            this.setState({stravaUser, stravaAuthState: "authorized"});
        } else {
            if(await StravaService.refresh(refreshToken.token)) {
                var accessToken = await StravaService.getAccessToken();
                var refreshToken = await StravaService.getRefreshToken();
                let stravaUser = await StravaService.getUser(accessToken.token);
                this.setState({stravaUser, stravaAuthState: "authorized"});
            }
        }
        if(!accessToken || !refreshToken) {
            let authLink = await StravaService.stravaAccessUrl();
            this.setState({ stravaAuthLink: authLink });
        } else {
            let access = accessToken.token;
            let refresh = refreshToken.token;
            return { access, refresh }
        }
    }

    async authenticateFitbit() {
        var accessToken = await FitbitService.getAccessToken();
        var refreshToken = await FitbitService.getRefreshToken();
        let fitbitUser = await FitbitService.getUser(accessToken.token);
        if(fitbitUser) {
            this.setState({fitbitUser, fitbitAuthState: "authorized"});
        } else {
            if(await FitbitService.refresh(refreshToken.token)) {
                var accessToken = await FitbitService.getAccessToken();
                var refreshToken = await FitbitService.getRefreshToken();
                let fitbitUser = await FitbitService.getUser(accessToken.token);
                this.setState({fitbitUser, fitbitAuthState: "authorized"});
            }
        }
        if(!accessToken || !refreshToken) {
            let authLink = await FitbitService.createAuthLink();
            this.setState({ fitbitAuthLink: authLink });
        } else {
            let access = accessToken.token;
            let refresh = refreshToken.token;
            return { access, refresh }
        }
    }

    async getActivityList(accessToken) {
        let activityList = await FitbitService.activities(accessToken);
        this.setState({ activityList: JSON.stringify(activityList), fitbitAuthState: "authorized"});
    }

    async checkCode() {
        let url = new URL(window.location.href);
        let code = url.searchParams.get("code");
        if(code) {
            let fitbitCode = await FitbitService.getAccessRefresh(code);
            if(!fitbitCode) {
                await StravaService.getTokens(code);
            }
            window.history.pushState({}, document.title, "/");
        }
    }

    render() {
        let { authLink, activityList, stravaAuthLink, fitbitUser, stravaUser } = this.state;
        return (
            <div>
                <div>
                    <span style={{float: 'left'}}>
                    {fitbitUser ? `Fitbit: ${fitbitUser.fullName}` : <a href={ authLink }>Authorize Fitbit</a>}
                    </span>
                    <span style={{float: 'right'}}>
                    {stravaUser ? `Strava: ${stravaUser.firstname} ${stravaUser.lastname}` : <a href={ stravaAuthLink }>Authorize Strava</a>}
                    </span>
                </div>
                <br/>
                <hr/>
                { activityList ?
                  <ActivityTable activityList={activityList}/>
                    :
                  ""
                }
            </div>
        );
    }
}

export default Activities;