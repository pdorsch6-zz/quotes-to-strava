
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
        let createTcx = await fetch(`/api/tcx/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tcx_filename: logId + ".tcx",
                tcx_file: tcx
            })
        });
        let tcx = await createTcx.json();
        return tcx;
    } catch(err) {
        console.log(err);
        return null;
    }
}

export async function randomQuote(tcx, logId) {
    try {
        let quoteResp = await fetch(`/api/quote/random`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        let quoteJson = (await quoteResp.json()).quote;
        let quote = quoteJson.quote;
        let author = quoteJson.author.name;
        author = author.toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');
        
        let quoteString = `"${quote}" - ${author}`;

        return quoteString;
    } catch(err) {
        console.log(err);
        return null;
    }
}
  