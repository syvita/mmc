import { baseURL } from './constants'

export async function getCurrentBlockHeight() {
    let res = await fetch(baseURL + 'v2/info')
    let cycleData = await res.json()
    const currentBlockHeight = cycleData.stacks_tip_height
    return currentBlockHeight //as int
}
