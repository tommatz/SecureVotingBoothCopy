import { useState, useEffect } from 'react'

const SendFile = (url, file) => {

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file })
    };

    fetch(url + "/voter/setup_contest", requestOptions)
        .then(async response => {
            const isJson = response.headers.get('content-type')?.includes('application/json');
            const data = isJson && await response.json();

            // check for error response
            if (!response.ok) {
                // get error message from body or default to response status
                const error = (data && typeof (data) == "object" && data["detail"][0]["msg"]) || data || response.status;
                return Promise.reject(error);
            }

        })
        .catch(error => {
            return (error);
        });

    return (response);
}

export default useServer