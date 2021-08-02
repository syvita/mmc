export function jsonResponseInit(statusCode) {
    if (statusCode != null) {
        return {
            headers: {
                "content-type": "application/json;charset=UTF-8"
            },
            status: statusCode
        }
    } else {
        return {
            headers: {
                "content-type": "application/json;charset=UTF-8"
            },
        }
    }
}