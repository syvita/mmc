import { sha256 } from 'sha256-wasm'
import { aes256 } from 'aes256'

if (!Sha256.SUPPORTED) {
    throw new Error("WebAssembly couldn't run the SHA256 library")
}

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
    const loadedObject = await getUnencryptedObject(address, appPrivateKey)
    var modifiedObject = loadedObject

    for (block in blocks) {
        modifiedObject.minedBlocks.push(block)
    }

    try {
        const res = await putUnencryptedObject(address, appPrivateKey, modifiedObject)
    } catch (error) {
        throw new Error(error)
        const res = false
    }

    if (res == true) {
        return true
    } else {
        throw new Error("Couldn't add mined blocks")
        return false
    }
}

export async function addStackedCycles(address, appPrivateKey, cycles) {
    const loadedObject = await getUnencryptedObject(address, appPrivateKey)
    var modifiedObject = loadedObject

    for (cycle in cycles) {
        modifiedObject.stackedCycles.push(cycle)
    }

    try {
        const res = await putUnencryptedObject(address, appPrivateKey, modifiedObject)
    } catch (error) {
        throw new Error(error)
        const res = false
    }

    if (res == true) {
        return true
    } else {
        throw new Error("Couldn't add stacked cycles")
        return false
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
    const res = await fetch(`https://api.minemiamicoin.com/${KvId}`)
    const parsed = JSON.parse(res)
    if (!parsed.success) {
        throw new Error(parsed.result)
    } else {
        const encryptedData = parsed.result.encrypted_data
        const decryptedData = aes256.decrypt(appPrivateKey, encryptedData)
        return JSON.parse(decryptedData)
    }
}
  
async function putUnencryptedObject(address, appPrivateKey, object) {
    const KvId = getKvId(address, appPrivateKey)
    // encrypt object
    const stringified = JSON.stringify(object)
    const encryptedData = aes256.encrypt()
    const result = JSON.parse(await putEncryptedObject(KvId, encryptedData))

    if (result.success == true) {
        return true
    } else {
        throw new Error(result.result)
    }
}

async function putEncryptedObject(KvId, object) {
    await fetch(`https://api.minemiamicoin.com/${KvId}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json'
        },
        body: object
    })
}

function getKvId(address, appPrivateKey) {
    var hash = sha256()
        .update(`${address}${appPrivateKey}`) // uses UTF8 encoding
        .digest('hex')
    console.log(hash)
    return hash
}