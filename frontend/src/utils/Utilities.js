
export async function fetchData(url, settings, signal) {
    if(!url) throw new Error('No url found');
    try {
        if(signal) {
            settings.signal = signal;
        }
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
        let tcx_response = await createTcx.json();
        return tcx_response;
    } catch(err) {
        console.log(err);
        return null;
    }
}

export async function randomQuote() {
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
        let id = quoteJson._id;
        author = author.toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');
        
        let quoteString = `"${quote}" - ${author}`;

        return { quoteString, id };
    } catch(err) {
        console.log(err);
        return null;
    }
}

export async function updateQuote(id, quote, author, category) {
    let authorResponse = await fetch(`/api/author`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: author
        })
    });

    let categoryResponse = await fetch(`/api/category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            category: category
        })
    });

    let categoryJson = await categoryResponse.json();
    let authorJson = await authorResponse.json();

    await fetch(`/api/quote/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            quote: quote,
            author: authorJson.author._id,
            category: categoryJson.category._id
        })
    });
}

export async function deleteQuote(id) {
    await fetch(`/api/quote/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
    });
}

  