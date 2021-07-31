import {
  Router
} from 'itty-router'
import {
  withContent,
  withParams
} from 'itty-router-extras'
import { json404ResponseInit, jsonResponseInit } from './responseInits'

// Create a new router
const router = Router()

router.get("/", () => {
  return new Response("go back to the main page smh")
})

// PUT: create value
// 2062f80093066633876b542212c496501a5e79523cc4ea9b28667dff065afd8f
router.put("/:key", withContent, withParams, async ({
  content,
  params
}) => {
  let key = decodeURIComponent(params.key).toString().toLowerCase()
  let keyLength = key.length
  if (keyLength != 64) {
    return new Response("key length not 64", {
      status: 403
    })
  } else {
    await KV.put(key, JSON.stringify(content))
    return new Response("done")
  }
})

// GET: get value
router.get("/:key", async ({
  params
}) => {
  const key = decodeURIComponent(params.key).toString().toLowerCase()
  const keyLength = key.length
  
  if (keyLength != 64) {
    return new Response("key length not 64", {
      status: 403
    })
  } else {
    const value = await KV.get(key)
    return new Response(value, jsonResponseInit)
  }
})

router.all("*", () => new Response("404, not found!", json404ResponseInit))

addEventListener('fetch', (e) => {
  e.respondWith(router.handle(e.request))
})