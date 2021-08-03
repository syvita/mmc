import sha256 from 'crypto-js/sha256'
const aes256 = require("aes256")

// external functions:
//   - add mined blocks [DONE]
//   - add stacked cycles [DONE]
//   - get mined blocks [DONE]
//   - get stacked cycles [DONE]

// private functions:
//   - retrieve unencrypted object of file to modify [DONE]
//   - put unencrypted object of modified file [DONE]
//   - get id from address & appPrivateKey [DONE]

// EXTERNAL FUNCTIONS

export async function addMinedBlocks(address, appPrivateKey, blocks) {
    var loadedObject = await getUnencryptedObject(address, appPrivateKey)
    if (loadedObject == false) {
        var modifiedObject = {
            minedBlocks: [0],
            stackedCycles: [0]
        }
    } else {
        var modifiedObject = loadedObject
    }

    var minedBlocks = modifiedObject.minedBlocks
    console.log(`MODIFIEDOBJECT: ${JSON.stringify(modifiedObject)}`)
    minedBlocks.push(blocks)
    modifiedObject.minedBlocks = minedBlocks

    var res = await putUnencryptedObject(address, appPrivateKey, modifiedObject)
    res = await res.json()
    if (res.success == true) {
        return true
    } else {
        throw new Error("Couldn't add mined blocks")
    }
}

export async function addStackedCycles(address, appPrivateKey, cycles) {
    const loadedObject = await getUnencryptedObject(address, appPrivateKey)

    if (loadedObject == false) {
        var modifiedObject = {
            minedBlocks: [0],
            stackedCycles: [0]
        }
    } else {
        var modifiedObject = loadedObject
    }

    modifiedObject.stackedCycles.push(cycles)

    try {
        var res = await putUnencryptedObject(address, appPrivateKey, modifiedObject)
    } catch (error) {
        var res = false
        throw new Error(error)
    }

    if (res == true) {
        return true
    } else {
        throw new Error("Couldn't add stacked cycles")
    }
}

export async function getMinedBlocks(address, appPrivateKey) {
    const result = await getUnencryptedObject(address, appPrivateKey)
    return result.minedBlocks
}

export async function getStackedCycles(address, appPrivateKey) {
    const result = await getUnencryptedObject(address, appPrivateKey)
    return result.stackedCycles
}

// PRIVATE FUNCTIONS

async function getUnencryptedObject(address, appPrivateKey) {
    const KvId = getKvId(address, appPrivateKey)
    const res = await fetch("https://api.minemiamicoin.com/" + KvId)
    const result = await res.json()
    const status = res.status
    console.log(status)

    if (result.result == '404, not found!') {
        return false
    } else {
        if (!result.success) {
            throw new Error(result.result)
        } else {
            console.log(result.result.encrypted_data)
            const encryptedData = result.result.encrypted_data
            const decryptedData = aes256.decrypt(appPrivateKey, encryptedData)
            console.log(decryptedData)
            return JSON.parse(decryptedData)
        }
    }
}
  
async function putUnencryptedObject(address, appPrivateKey, object) {
    const KvId = getKvId(address, appPrivateKey)
    // encrypt object
    const stringified = JSON.stringify(object)

    console.log(`VALUE OF STRINGIFIED: ${stringified}`);
    const encryptedData = aes256.encrypt(appPrivateKey, stringified)
    console.log(`ENCRYPTED DATA: ${encryptedData}`)

    try {
        const result = await putEncryptedObject(KvId, encryptedData)
        console.log(`result: ${result}`)
        return result
    } catch (error) {
        throw new Error(error)
    }
}

async function putEncryptedObject(KvId, encryptedData) {
    const object = {
        encrypted_data: encryptedData
    }
    
    const req = await fetch(('https://api.minemiamicoin.com/' + KvId), {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          'Accept-Encoding': 'gzip, deflate, br',
        },
        referrerPolicy: '',
        body: JSON.stringify(object)
    })

    return req
}

function getKvId(address, appPrivateKey) {
    const hash = sha256(`${address}${appPrivateKey}`)
    console.log(hash)
    return hash
}