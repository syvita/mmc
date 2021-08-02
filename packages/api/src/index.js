import { Router } from 'itty-router'
import { withContent, withParams } from 'itty-router-extras'
import { jsonResponseInit } from './responseInits'
import { createResponse } from './createResponse'
import Toucan from "toucan-js"
import * as Sentry from './sentry'

// Create a new router
const router = Router()

router.get("/", () => {
  return new Response("go back to the main page smh")
})

// PUT: create value

router.put("/:key", withContent, withParams, async (
  {
    content,
    params
  },
  sentry
) => {
  Sentry.log(sentry, "Decoding URI params")
  let key = decodeURIComponent(params.key).toString().toLowerCase()
  let keyLength = key.length
  if (keyLength != 64) {
    return new Response(createResponse(false, "Key not 64 characters long."), jsonResponseInit(400))
  } else {
    Sentry.log(sentry, "Putting object into KV...")
    try {
      await KV.put(key, JSON.stringify(content))
    } catch (error) {
      Sentry.err(sentry, error)
      return new Response(createResponse(false, "Couldn't create/update KV value"), jsonResponseInit(500))
    }
    Sentry.log(sentry, "Object put successfully into KV, returning Response")
    return new Response(createResponse(true, ""), jsonResponseInit())
  }
})

// GET: get value

router.get("/:key", async (
  { params },
  sentry
) => {
  function log(msg) {
    sentry.addBreadcrumb({
      message: msg,
      category: "log",
    })
  }
  
  function err(error) {
    sentry.captureException(error)
  }

  log("Decoding URI params")
  const key = decodeURIComponent(params.key).toString().toLowerCase()
  const keyLength = key.length

  if (keyLength != 64) {
    return new Response(createResponse(false, "key length not 64"), jsonResponseInit(400))
  } else {
    log("Retrieving object from KV...")
    try {
      var value = await KV.get(key)
    } catch (error) {
      err(error)
      return new Response(createResponse(false, "Couldn't retrieve KV value"), jsonResponseInit(500))
    }

    if (value == null) {
      log("Object not found in KV, returning 404 Response")
      new Response(createResponse(false, "Key not found!"), jsonResponseInit(404))
    } else {
      log("Object retrieved from KV, returning Response")
      return new Response(createResponse(true, JSON.parse(value)), jsonResponseInit())
    }
  }
})

router.all("*", () => new Response(createResponse(false, "404, not found!"), jsonResponseInit(404)))

addEventListener('fetch', (e) => {
  const sentry = new Toucan({
    dsn: "https://6c2a0bedac06463b8fea519e8603f873@logs.syvita.org/3",
    debug: false,
    event: e,
    environment: 'prod',
  })

  // this acts as a safeguard to ensure everyone can prove that we are not 
  // collecting user IPs. we don't want it or need it. we also have enhanced privacy
  // controls to remove personally identifiable information (PII) as well as source 
  // code in things like notifications. we prevent IPs being stored client-side,
  // and also scrub things like passwords, MAC addresses and other similar PII from
  // ever being stored on our Sentry instances.
  sentry.setUser({ ip_address: "0.0.0.0" })

  e.respondWith(router.handle(e.request, sentry))
})