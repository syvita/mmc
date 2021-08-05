import { Router } from 'itty-router'
import { withContent, withParams } from 'itty-router-extras'
import { jsonResponseInit } from './responseInits'
import { createResponse } from './createResponse'
import Toucan from 'toucan-js'
import * as Sentry from './sentry'
import { getAddressFromUID } from './readOnly'
import { getCurrentBlockHeight } from './blockHeight'
import { getBlockWinner } from './readOnly'

// Create a new router
const router = Router()

router.get('/', () => {
    console.log(getAddressFromUID(100))
    return new Response('go back to the main page smh')
})

// PUT: create value

router.put(
    '/:key',
    withContent,
    withParams,
    async ({ content, params }, sentry) => {
        Sentry.log(sentry, 'Decoding URI params')
        let key = decodeURIComponent(params.key)
            .toString()
            .toLowerCase()
        let keyLength = key.length
        if (keyLength != 64) {
            return new Response(
                createResponse(false, 'Key not 64 characters long.'),
                jsonResponseInit(400)
            )
        } else {
            Sentry.log(sentry, 'Putting object into KV...')
            try {
                await KV.put(key, JSON.stringify(content))
            } catch (error) {
                Sentry.err(sentry, error)
                return new Response(
                    createResponse(false, "Couldn't create/update KV value"),
                    jsonResponseInit(500)
                )
            }
            Sentry.log(
                sentry,
                'Object put successfully into KV, returning Response'
            )
            return new Response(createResponse(true, ''), jsonResponseInit())
        }
    }
)

router.get('/blocks/winner/:block', async ({ params }, sentry) => {
    const block = decodeURIComponent(params.block).toString()
    const result = await KV.get(block)
    if (result !== null) {
        const blockWinner = JSON.parse(result).winner
        return new Response(
            createResponse(true, blockWinner),
            createResponse(200)
        )
    } else {
        return new Response(
            createResponse(false, "Couldn't find block winner"),
            createResponse(404)
        )
    }
})

router.get('/blocks/wonblocks/:address', async ({ params }, sentry) => {
    const address = decodeURIComponent(params.address).toString()
    const result = await KV.get(address)

    if (result !== null) {
        return new Response(
            createResponse(true, JSON.parse(result)),
            createResponse(200)
        )
    } else {
        return new Response(
            createResponse(false, "Couldn't find any blocks"),
            createResponse(404)
        )
    }
})

// GET: get value

router.get('/:key', async ({ params }, sentry) => {
    function log(msg) {
        sentry.addBreadcrumb({
            message: msg,
            category: 'log',
        })
    }

    function err(error) {
        sentry.captureException(error)
    }

    log('Decoding URI params')
    const key = decodeURIComponent(params.key)
        .toString()
        .toLowerCase()
    const keyLength = key.length

    if (keyLength != 64) {
        return new Response(
            createResponse(false, 'key length not 64'),
            jsonResponseInit(400)
        )
    } else {
        log('Retrieving object from KV...')
        try {
            var value = await KV.get(key)
        } catch (error) {
            err(error)
            return new Response(
                createResponse(false, "Couldn't retrieve KV value"),
                jsonResponseInit(500)
            )
        }

        if (value == null) {
            log('Object not found in KV, returning 404 Response')
            new Response(
                createResponse(false, 'Key not found!'),
                jsonResponseInit(404)
            )
        } else {
            log('Object retrieved from KV, returning Response')
            return new Response(
                createResponse(true, JSON.parse(value)),
                jsonResponseInit()
            )
        }
    }
})

router.all(
    '*',
    () =>
        new Response(
            createResponse(false, '404, not found!'),
            jsonResponseInit(200)
        )
)

addEventListener('fetch', e => {
    const sentry = new Toucan({
        dsn: 'https://6c2a0bedac06463b8fea519e8603f873@logs.syvita.org/3',
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
    sentry.setUser({ ip_address: '0.0.0.0' })

    e.respondWith(router.handle(e.request, sentry))
})

addEventListener('scheduled', e => {
    e.waitUntil(handleScheduled(e))
})

async function handleScheduled(event) {
    const currentBlockHeight = getCurrentBlockHeight()
    const targetBlock = parseInt(currentBlockHeight - 100)
    const firstRedeemableBlock = 24497

    const lastBlockCached = parseInt(await KV.get('lastBlockCached'))
    const blockWinner = await getBlockWinner(targetBlock)

    if (currentBlockHeight >= firstRedeemableBlock) {
        if (lastBlockCached == targetBlock - 1) {
            if (blockWinner !== 'none') {
                await KV.put(
                    targetBlock,
                    JSON.stringify({ winner: blockWinner })
                )
                await KV.put('lastBlockCached', targetBlock)
                await addBlockToAddress(blockWinner, targetBlock)
                return new Response('done')
            } else {
                await KV.put('lastBlockCached', targetBlock)
                return new Response('done')
            }
        } else {
            const howManyMissedBlocks = targetBlock - lastBlockCached
            for (block in howManyMissedBlocks) {
                const missedBlock = block + lastBlockCached
                if (blockWinner !== 'none') {
                    await KV.put(
                        missedBlock,
                        JSON.stringify({ winner: blockWinner })
                    )
                    await KV.put('lastBlockCached', missedBlock.toString())
                    await addBlockToAddress(blockWinner, missedBlock)
                    return new Response('done')
                } else {
                    await KV.put('lastBlockCached', missedBlock.toString())
                    return new Response('done')
                }
            }
        }
    } else {
        return new Response('done')
    }
}

async function addBlockToAddress(address, block) {
    const res = await KV.get(address)
    const parsed = JSON.parse(res)
    let blocks = parsed
    blocks.push(block)
    const updated = JSON.stringify(blocks)
    await KV.put(address, updated)
    return true
}
