import { fetchData } from './Utilities';
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, "../../", '.env') });

const STRAVA_REDIRECT = process.env.STRAVA_REDIRECT;
const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;


function stravaAccessUrl() {
  let url = new URL("https://www.strava.com/oauth/authorize"),
    params = {
      client_id: STRAVA_CLIENT_ID,
      response_type: 'code',
      redirect_uri: STRAVA_REDIRECT,
      scope: 'read,activity:write'
    };
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  // let settings = {
  //   method: 'GET',
  //   mode: 'cors',
  //   headers: {
  //     'Content-Type': 'application/x-www-form-urlencoded',
  //   },
  // };
  // let response = await fetchData(url, settings);
  return url;
}

async function getTokens(code) {
  let url = new URL("https://www.strava.com/oauth/token"),
    params = {
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code'
    };
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  let settings = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
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
  let access_url = 'api/token/strava_access';
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
        type: 'strava_access',
        token: access
      })
    });
  }

  let refresh_url = 'api/token/strava_refresh';
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
        type: 'strava_refresh',
        token: refresh
      })
    });
  }
}

async function getAccessToken() {
  try {
    let access_response = await fetch(`/api/token/strava_access`, {
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
    let refresh_response = await fetch(`/api/token/strava_refresh`, {
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

async function getUser(access) {
  try {
    let user_response = await fetch(`https://www.strava.com/api/v3/athlete`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access}`
      },
    });
    if(!user_response.ok) {
      return null;
    }
    let user = await user_response.json();
    return user;
  } catch(err) {
    console.log(await err.json());
    return null;
  }
}

async function refresh(refresh_token) {
  try {
    let url = new URL("https://www.strava.com/oauth/token"),
    params = {
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      refresh_token: refresh_token,
      grant_type: 'refresh_token'
    };
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    let settings = {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    let refresh_response = await fetchData(url, settings);
    await updateAccessRefresh(refresh_response.access_token, refresh_response.refresh_token);
    return true;
  } catch(err) {
    console.log(err);
    return false;
  }
}

async function uploadTcx(tcx, title, description) {
  let access = (await getAccessToken()).token;
  let formData = new FormData();
  formData.append('file', tcx);
  formData.append('name', title);
  formData.append('description', description);
  formData.append('trainer', 'false');
  formData.append('commute', 'false');
  formData.append('data_type', 'tcx');
  let url = "https://www.strava.com/api/v3/uploads";
  let settings = {
    method: 'POST',
    mode: 'cors',
    headers: {
      // 'Content-Type': 'application/octet-stream',
      'Authorization': `Bearer ${access}`
    },
    body: formData
  };
  try {
    let response = await fetch(url, settings);
    return response;
  } catch(err) {
    console.log(err);
    return null;
  }
}

export default { stravaAccessUrl, getTokens, getAccessToken, getRefreshToken, getUser, refresh, uploadTcx };
