const defaultHeaders = {
    "content-type": "application/json;charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*"
}

export function jsonResponseInit(statusCode) {
    if (statusCode != null) {
        return {
            headers: defaultHeaders,
            status: statusCode
        }
    } else {
        return {
            headers: defaultHeaders
        }
    }
}
