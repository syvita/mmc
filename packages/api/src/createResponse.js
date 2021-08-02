export function createResponse(success, result) {
    return JSON.stringify({
        success: success,
        result: result
    })
}