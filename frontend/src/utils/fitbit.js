import { fetchData } from './Utilities';
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, "../../", '.env') });

const FITBIT_REDIRECT = process.env.FITBIT_REDIRECT;
const FITBIT_CLIENT_ID = process.env.FITBIT_CLIENT_ID;
const FITBIT_CLIENT_SECRET = process.env.FITBIT_CLIENT_SECRET;


async function getAccessRefresh(code) {

    let url = new URL("https://api.fitbit.com/oauth2/token"),
      params = {
        clientId: FITBIT_CLIENT_ID,
        grant_type: 'authorization_code',
        redirect_uri: FITBIT_REDIRECT,
        code: code
      };
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    let settings = {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(FITBIT_CLIENT_ID + ':' + FITBIT_CLIENT_SECRET)}`
      },
    };
    try {
      var response = await fetchData(url, settings);
    } catch(err) {
      return false;
    }
    await updateAccessRefresh(response.access_token,  response.refresh_token);
    return true;
}

async function updateAccessRefresh(access, refresh) {
  let access_url = 'api/token/access';
  let access_settings = {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      token: access
    })
  };
  let access_response = await fetch(access_url, access_settings);
  let access_json = await access_response.json();
  if(access_json.status === 404) {
    await fetch(`/api/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'access',
        token: access
      })
    });
  }

  let refresh_url = 'api/token/refresh';
  let refresh_settings = {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      token: refresh
    })
  };
  let refresh_response = await fetch(refresh_url, refresh_settings);
  let refresh_json = await refresh_response.json();
  if(refresh_json.status === 404) {
    await fetch(`/api/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'refresh',
        token: refresh
      })
    });
  }
}

async function getAccessToken() {
  try {
    let access_response = await fetch(`/api/token/access`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    let access = await access_response.json();
    return access.token;
  } catch(err) {
    console.log(err);
    return null;
  }
}

async function getRefreshToken() {
  try {
    let refresh_response = await fetch(`/api/token/refresh`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    let refresh = await refresh_response.json();
    return refresh.token;
  } catch(err) {
    console.log(err);
    return null;
  }
}

async function refresh(refresh_token) {
  try {
    let url = new URL("https://api.fitbit.com/oauth2/token"),
      params = {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      }
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    let refresh_response = await fetchData(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(FITBIT_CLIENT_ID + ':' + FITBIT_CLIENT_SECRET)}`
      },
    });
    await updateAccessRefresh(refresh_response.access_token, refresh_response.refresh_token);
    return true;
  } catch(err) {
    console.log(err);
    return false;
  }
}

async function activities(access_token, signal) {
  try {
    let url = new URL("https://api.fitbit.com/1/user/-/activities/list.json"),
      params = {
        afterDate: '2019-01-01',
        sort: 'desc',
        limit: 20,
        offset: 0
      }
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    let fullActivityList = [];
    do {
      let activities = await fetchData(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${access_token}`,
          'Accept-Language': 'en_US'
        },
      }, signal);
      activities.activities.forEach(function(activity) {
        if(activity.distance > 0) {
          fullActivityList.push(activity);
        }
      });
      url = activities.pagination.next || null;
    } while (fullActivityList.length < 8 && url);

    return fullActivityList;
  } catch(err) {
    console.log(err);
    return [];
  }
}

async function getUser(access_token, signal) {
  try {
    let url = "https://api.fitbit.com/1/user/-/profile.json";
    let user_response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${access_token}`,
        'Accept-Language': 'en_US'
      },
      signal: signal
    });
    if(!user_response.ok) {
      return null;
    }
    let user = await user_response.json();
    return user.user;
  } catch(err) {
    // console.log(await err.json());
    return null;
  }
}

async function getTcx(logId) {
  let url = `https://api.fitbit.com/1/user/-/activities/${logId}.tcx`;
  let access_token = await getAccessToken();
  access_token = access_token.token;
  let tcx = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/vnd.garmin.tcx+xml',
      'Authorization': `Bearer ${access_token}`,
      'Accept-Language': 'en_US'
    },
  });
  return await tcx.blob();
}

function createAuthLink() {
  return "https://www.fitbit.com/oauth2/authorize?" +
  `response_type=code&client_id=${encodeURIComponent(FITBIT_CLIENT_ID)}` +
  `&redirect_uri=${encodeURIComponent(FITBIT_REDIRECT)}` +
  "&scope=activity%20heartrate%20location%20nutrition%20profile%20" +
  "settings%20sleep%20social%20weight&expires_in=604800";
}

export default {createAuthLink, getAccessRefresh, getAccessToken, getRefreshToken, refresh, activities, getTcx, getUser};