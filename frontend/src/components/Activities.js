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

    abortController = new AbortController();

    async componentDidMount() {
        this.checkCode();
        //FITBIT
        let fitbitTokens = await this.authenticateFitbit();

        //STRAVA
        let stravaTokens = await this.authenticateStrava();

        await this.getActivityList(fitbitTokens.access);
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    async authenticateStrava() {
        let accessToken = await StravaService.getAccessToken();
        let refreshToken = await StravaService.getRefreshToken();
        let stravaUser = await StravaService.getUser(accessToken.token);
        if(!stravaUser) {
            await StravaService.refresh(refreshToken.token);
            accessToken = await StravaService.getAccessToken();
            refreshToken = await StravaService.getRefreshToken();
            stravaUser = await StravaService.getUser(accessToken.token);
        }
        if(!accessToken || !refreshToken) {
            let authLink = await StravaService.stravaAccessUrl();
            this.setState({ stravaAuthLink: authLink });
        } else {
            let access = accessToken.token;
            let refresh = refreshToken.token;
            this.setState({stravaUser, stravaAuthState: "authorized"});
            return { access, refresh }
        }
    }

    async authenticateFitbit() {
        let accessToken = await FitbitService.getAccessToken();
        let refreshToken = await FitbitService.getRefreshToken();
        let fitbitUser = await FitbitService.getUser(accessToken.token, this.abortController.signal);
        if(!fitbitUser) {
            await FitbitService.refresh(refreshToken.token);
            accessToken = await FitbitService.getAccessToken();
            refreshToken = await FitbitService.getRefreshToken();
            fitbitUser = await FitbitService.getUser(accessToken.token, this.abortController.signal);
        }
        if(!accessToken || !refreshToken) {
            let authLink = await FitbitService.createAuthLink();
            this.setState({ fitbitAuthLink: authLink });
        } else {
            let access = accessToken.token;
            let refresh = refreshToken.token;
            this.setState({fitbitUser, fitbitAuthState: "authorized"});
            return { access, refresh }
        }
    }

    async getActivityList(accessToken) {
        try{
            let activityList = await FitbitService.activities(accessToken, this.abortController.signal);
            this.setState({ activityList: JSON.stringify(activityList), fitbitAuthState: "authorized"});
        } catch(err) {
            if(err.name === 'AbortError') {
                console.log('Aborted');
                return;
            }
        }
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