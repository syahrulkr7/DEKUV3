"use strict";
const axios = require("axios");

module.exports = function (defaultFuncs, api, ctx) {
    return function getUID(id, callback) {
        var resolveFunc = function () {};
        var rejectFunc = function () {};
        var returnPromise = new Promise(function (resolve, reject) {
            resolveFunc = resolve;
            rejectFunc = reject;
        });

        if (
            typeof callback !== "function" &&
            typeof callback !== "async function"
        ) {
            callback = function (err, data) {
                if (err) {
                    return rejectFunc(err);
                }
                resolveFunc(data);
            };
        }

        // Check if the URL is a valid Facebook URL
        if (!isValidFacebookUrl(id)) {
            return Promise.reject(
                new Error("Please use a valid Facebook link (0)"),
            );
        }

        // Extracting ID from URL
        const extractedId = extractIdFromUrl(id);
        if (extractedId) {
            return Promise.resolve(extractedId);
        }

        const url = "https://userid.click/getUID";
        const postField = { url: id };

        axios
            .post(url, postField, {
                headers: { "Content-Type": "application/json" },
            })
            .then((response) => {
                if (response.status === 200) {
                    const responseData = response.data;
                    if (responseData.id) {
                        callback(null, responseData.id);
                    } else {
                        callback(
                            new Error("Please use a valid Facebook link (1)"),
                        );
                    }
                } else if (response.status === 500) {
                    callback(new Error("Please use a valid Facebook link"));
                } else if (
                    response.status === 404 ||
                    (response.status >= 400 && response.status < 500)
                ) {
                    callback(
                        new Error(
                            "Something error on the API.",
                        ),
                    );
                } else {
                    // Handle other status codes
                    callback(
                        new Error(
                            `Unknown error occurred with status code ${response.status}`,
                        ),
                    );
                }
            })
            .catch((err) => {
                if (err.response && err.response.status === 500) {
                    // Handle specific 500 error message
                    return callback(
                        new Error("Please use a valid Facebook link (1)"),
                    );
                } else {
                    console.error("getUID", "Error:", err);
                    log.error(
                        "getUID",
                        "Error: getUID may be caused by excessive spamming, please try again!",
                    );
                    return callback(err);
                }
            });

        return returnPromise;
    };
};

// Function to check if URL is a valid Facebook URL
function isValidFacebookUrl(url) {
    return /^(?:https?:\/\/)?(?:www\.)?(?:fb\.com|facebook\.com)/i.test(url);
}

// Function to extract ID from URL
function extractIdFromUrl(url) {
    const matches = url.match(
        /(?:https?:\/\/)?(?:www\.)?(?:fb\.com|facebook\.com)\/(?:.*\?.*id=)?(\d+)/i,
    );
    return matches ? matches[1] : null;
}
