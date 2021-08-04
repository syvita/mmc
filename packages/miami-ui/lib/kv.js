import sha256 from "crypto-js/sha256";
const aes256 = require("aes256");

// EXTERNAL FUNCTIONS

export async function addMinedBlocks(address, appPrivateKey, blocks) {
  var loadedObject = await getUnencryptedObject(address, appPrivateKey);
  if (loadedObject.minedBlocks == {}) {
    var modifiedObject = {
      minedBlocks: [],
      stackedCycles: [],
    };
  } else {
    modifiedObject = loadedObject;
  }
  modifiedObject.minedBlocks.push(blocks);
  modifiedObject.minedBlocks.flat();
  // console.log("MINED BLOCKS 1 " + JSON.stringify(minedBlocks));

  console.log("PUT " + JSON.stringify(modifiedObject));

  var res = await putUnencryptedObject(address, appPrivateKey, modifiedObject);
  res = await res.json();
  if (res.success == true) {
    console.log("KV SUCCESSFUL");
    return true;
  } else {
    throw new Error("Couldn't add mined blocks");
  }
}

export async function addStackedCycles(address, appPrivateKey, cycles) {
  var loadedObject = await getUnencryptedObject(address, appPrivateKey);
  if (loadedObject == false) {
    var modifiedObject = {
      minedBlocks: [],
      stackedCycles: [],
    };
  } else {
    var modifiedObject = loadedObject;
  }
  var stackedCycles = modifiedObject.stackedCycles;
  stackedCycles.push(cycles);

  modifiedObject.stackedCycles = stackedCycles.flat().filter(Number);
  modifiedObject.stackedCycles = stackedCycles.filter((int, index) => {
    return stackedCycles.indexOf(int) == index;
  });
  var res = await putUnencryptedObject(address, appPrivateKey, modifiedObject);
  res = await res.json();
  if (res.success == true) {
    console.log("KV SUCCESSFUL");
    return true;
  } else {
    throw new Error("Couldn't add stacked cycles");
  }
}

export async function getMinedBlocks(address, appPrivateKey) {
  var result = await getUnencryptedObject(address, appPrivateKey);
  return result.minedBlocks;
}

export async function getStackedCycles(address, appPrivateKey) {
  var result = await getUnencryptedObject(address, appPrivateKey);
  return result.stackedCycles;
}

// PRIVATE FUNCTIONS

async function getUnencryptedObject(address, appPrivateKey) {
  const KvId = getKvId(address, appPrivateKey);
  const res = await fetch("https://api.minemiamicoin.com/" + KvId);
  const result = await res.json();

  if (result.result == "404, not found!") {
    return false;
  } else {
    if (!result.success) {
      throw new Error(result.result);
    } else {
      const encryptedData = result.result.encrypted_data;
      // console.log(`got encrypted data: ${encryptedData}`);
      const decryptedData = aes256.decrypt(appPrivateKey, encryptedData);
      return JSON.parse(decryptedData);
    }
  }
}

async function putUnencryptedObject(address, appPrivateKey, object) {
  const KvId = getKvId(address, appPrivateKey);
  // encrypt object
  const stringified = JSON.stringify(object);
  const encryptedData = aes256.encrypt(appPrivateKey, stringified);
  // console.log(`putting ENCRYPTED DATA: ${encryptedData}`);

  try {
    const result = await putEncryptedObject(KvId, encryptedData);
    // console.log(`put result: ${JSON.stringify(result)}`);
    return result;
  } catch (error) {
    throw new Error(error);
  }
}

async function putEncryptedObject(KvId, encryptedData) {
  const object = {
    encrypted_data: encryptedData,
  };

  const req = await fetch("https://api.minemiamicoin.com/" + KvId, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
      "Accept-Encoding": "gzip, deflate, br",
    },
    referrerPolicy: "",
    body: JSON.stringify(object),
  });

  return req;
}

function getKvId(address, appPrivateKey) {
  const hash = sha256(`${address}${appPrivateKey}`);
  // console.log(hash);
  return hash;
}
