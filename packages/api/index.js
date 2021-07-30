import { Router } from 'itty-router'
import { withContent } from 'itty-router-extras'

// Create a new router
const router = Router()

router.get("/", () => {
  return new Response("go back to the main page smh")
})

// PUT: create value

router.put("/:key", withContent, async ({ content, params }) => {
  let key = decodeURIComponent(params.key).toString().toLowerCase()
  let keyLength = key.length
  if (keyLength != 64) {
    return Response("key length not 64", { status: 403 })
  } else {
    await KV.put(JSON.stringify(content))
  }
})

// GET: https://api.miamicoin.com/2d711642b726b04401627ca9fbac32f5c8530fb1903cc4db02258717921a4881
// key must be 64 characters as a string
// 2d711642b726b04401627ca9fbac32f5c8530fb1903cc4db02258717921a4881

// GET: get value
router.get("/:key", async ({ params }) => {
  let key = decodeURIComponent(params.key).toString().toLowerCase()
  let keyLength = key.length
  if (keyLength != 64) {
    return Response("key length not 64", { status: 403 })
  } else {
    const value = await KV.get(key)
    return Response(value)
  }
})

router.all("*", () => new Response("404, not found!", { status: 404 }))

addEventListener('fetch', (e) => {
  e.respondWith(router.handle(e.request))
})
