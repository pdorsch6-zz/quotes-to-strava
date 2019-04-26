import { fetchData } from './Utilities';
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, "../../", '.env') });

const STRAVA_REDIRECT = process.env.STRAVA_REDIRECT;
const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;


async function stravaAccess() {
  let url = new URL("https://api.fitbit.com/oauth2/token"),
    params = {
      clientId: STRAVA_CLIENT_ID,
      response_type: 'code',
      redirect_uri: STRAVA_REDIRECT,
      code: code,
      scope: 'activity:write'
    };
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  let settings = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
  let response = await fetchData(url, settings);
}
