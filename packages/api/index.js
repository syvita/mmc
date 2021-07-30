import { Router } from 'itty-router'

// Create a new router
const router = Router()

router.get("/", () => {
  return new Response("go back to the main page smh")
})

// POST: create value

router.post("/:key", ({ params }) => {
  let key = decodeURIComponent(params.key)
})

// GET: get value
router.get("/:key", ({ params }) => {
  let key = decodeURIComponent(params.key)
})

// UPDATE: update value

router.update("/:key", ({ params }) => {
  let key = decodeURIComponent(params.key)
})

router.all("*", () => new Response("404, not found!", { status: 404 }))

addEventListener('fetch', (e) => {
  e.respondWith(router.handle(e.request))
})
