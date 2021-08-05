import { uintCV, cvToHex, hexToCV, cvToString } from '@syvita/transactions'
import { baseURL } from './constants'

// const contractAddress = 'SP466FNC0P7JWTNM2R9T199QRZN1MYEDTAR0KP27'
// const contractName = 'miamicoin-core-v1'
// const senderAddress = 'SP466FNC0P7JWTNM2R9T199QRZN1MYEDTAR0KP27'

const contractAddress = 'ST3CK642B6119EVC6CT550PW5EZZ1AJW6608HK60A'
const contractName = 'citycoin-core-v4'
const senderAddress = 'ST3CK642B6119EVC6CT550PW5EZZ1AJW6608HK60A'

export async function getBlockWinner(blockHeight) {
    const blockWinnerUID = await getBlockWinnerUID(blockHeight)
    const blockWinnerAddress = await getAddressFromUID(blockWinnerUID)
    return blockWinnerAddress
}

async function getBlockWinnerUID(blockHeight) {
    const buffer = cvToHex(uintCV(blockHeight))
    const functionName = 'get-block-winner-id'

    const body = {
        sender: senderAddress,
        arguments: [buffer],
    }

    const res = await callReadOnlyFunc(body, functionName)
    console.log(res.result)
    const result = cvToString(hexToCV(res.result))
    if (result === 'none') {
        return null
    } else {
        return parseInt(
            result
                .replace('(some ', '')
                .replace(')', '')
                .replace('u', '')
        )
    }
}

export async function getAddressFromUID(uid) {
    const buffer = cvToHex(uintCV(uid))
    const functionName = 'get-user'

    const body = {
        sender: senderAddress,
        arguments: [buffer],
    }

    const res = await callReadOnlyFunc(body, functionName)
    console.log(res.result)
    const address = cvToString(hexToCV(res.result))
        .replace('(some ', '')
        .replace(')', '')
    console.log(address)
    return address
}

async function callReadOnlyFunc(body, functionName) {
    const req = await fetch(
        `${baseURL}/v2/contracts/call-read/${contractAddress}/${contractName}/${functionName}`,
        {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept-Encoding': 'gzip, deflate, br',
            },
            referrerPolicy: '',
            body: JSON.stringify(body),
        }
    )
    const res = await req.json()
    return res
}
