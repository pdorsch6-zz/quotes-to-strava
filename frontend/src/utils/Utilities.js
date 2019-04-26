
export async function fetchData(url, settings) {
    if(!url) throw new Error('No url found');
    try {
        let response = await fetch(url, settings);

        if(!response.ok) {
        throw new Error(`HTTP status code: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (err) {
        // if it fails to execute fetch, parse the JSON or something else catastrophic happens
        throw err;
    }
}

export async function createTcxFile(tcx, logId) {
    try {
        let refresh_response = await fetch(`/api/tcx/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tcx_filename: logId + ".tcx",
                tcx_file: tcx
            })
        });
        let refresh = await refresh_response.json();
        return refresh.token;
    } catch(err) {
        console.log(err);
        return null;
    }
}
  