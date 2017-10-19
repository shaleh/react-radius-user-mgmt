// @flow
function checkStatus(response: Response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    const error = new Error(`HTTP Error ${response.statusText}`);
    throw error;
}

function parseJSON(response: Response) {
    return response.json();
}

export { checkStatus, parseJSON };
