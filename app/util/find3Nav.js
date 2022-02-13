export const floorToNumber = f => {
    switch (f) {
        case 'g':
            return 0
        case 'g1s':
            return 0.5
        case '1':
            return 1
        case '12s':
            return 1.5
        case '2':
            return 2
        default:
            throw new Error(`Floor ${f} does not exist`)
    }
}

export const numberToFloor = n => {
    switch (n) {
        case 0:
            return 'g'
        case 0.5:
            return 'g1s'
        case 1:
            return '1'
        case 1.5:
            return '12s'
        case 2:
            return '2'
        default:
            return null
    }
}

/**
 *
 * @param current - current position e.g. g,1,0
 * @param goal - destination position e.g. 2,5,5
 */
export const calculateDistanceToGoal = (current, goal) => {
    const [cf, cx, cy] = current.split(',')
    const [gf, gx, gy] = goal.split(',')

    const cfInt = floorToNumber(cf)
    const gfInt = floorToNumber(gf)
    const cxInt = parseInt(cx)
    const gxInt = parseInt(gx)
    const cyInt = parseInt(cy)
    const gyInt = parseInt(gy)

    return Math.sqrt(
        Math.pow(cfInt - gfInt, 2) + Math.pow(cxInt - gxInt, 2) + Math.pow(cyInt - gyInt, 2),
    )
}

/**
 * SearchNode
 * {
 *     node: String,
 *     prevNode: String,
 *     gCost: Number, //exact cost of starting node to this node
 *     hCost: Number, //estimated cost from node n to the goal node
 *     fCost: Number, //total cost of this node
 * }
 */

/**
 * Queues
 * visitedNodes = [SearchNodes]
 * yetToVisitNodes = [SearchNode]
 */

/**
 * Stopping criteria
 * Stop when the goal node is at the top [0] of the yetToVisitNodes queue
 */

/**
 * Rebuilding optimum path once complete
 * Get 'prev' from node at top of nodes queue
 * Find that node in visitedNodes, get the `prev` from that node
 * Repeat, the sequence of `prev` is the optimum path in reverse
 */

/**
 * Updating cost
 * If we find a node that is already in the yetToVisitNodes
 * And the gCost to get to that node, is cheaper than the gCost stored in the node
 * Set the prev of that node to the current node
 * Update the gCost of that node too (based on cost to current node)
 */

export const calculateOptimumRoute = (map, start, goal) => {
    const visitedNodes = []
    const yetToVisitNodes = []
    let topNode

    const startHCost = calculateDistanceToGoal(start, goal)

    yetToVisitNodes.push({
        node: start,
        prevNode: null,
        gCost: 0,
        hCost: startHCost,
        fCost: startHCost,
    })

    // If yetToVisitNodes is empty, there is no route to the target
    // Must terminate the while. This case is caught below.
    while (yetToVisitNodes.length > 0 && yetToVisitNodes[0].node !== goal) {
        topNode = yetToVisitNodes.shift()
        visitedNodes.push(topNode)

        const visitedList = visitedNodes.map(visited => visited.node)

        nextNodes(map, topNode.node, visitedList).forEach(nextNode => {
            const gCost = topNode.gCost + 1
            const hCost = calculateDistanceToGoal(nextNode, goal)
            const fCost = gCost + hCost

            let newYvn = {
                node: nextNode,
                prevNode: topNode.node,
                gCost: gCost,
                hCost: hCost,
                fCost: fCost,
            }
            const existingYvn = yetToVisitNodes.find(yvn => yvn.node === nextNode)

            if (!existingYvn) {
                yetToVisitNodes.push(newYvn)
            }

            if (existingYvn && existingYvn.gCost > gCost) {
                existingYvn.gCost = gCost
                existingYvn.fCost = existingYvn.gCost + existingYvn.hCost
                existingYvn.prevNode = topNode.node
            }
        })
        yetToVisitNodes.sort((a, b) => {
            return a.fCost - b.fCost
        })
    }

    if (yetToVisitNodes.length === 0) {
        return [start]
    }

    const route = []

    //The node we finish on is the termination state (destination found)
    const finishNode = yetToVisitNodes[0]
    route.push(finishNode.node)

    //Find the prevNode in visitedNodes, step back through our optimal route
    let node = visitedNodes.find(visitedNode => visitedNode.node === finishNode.prevNode)

    //Repeat stepping back until prevNode is null, meaning the beginning of the path is found
    if (node !== undefined) {
        while (node.prevNode !== null) {
            route.push(node.node)
            node = visitedNodes.find(visitedNode => visitedNode.node === node.prevNode)
        }
        route.push(node.node)
    }

    //Since we stepped back from finish > start, reverse the route
    route.reverse()

    return route
}

export const nextNodes = (map, current, prevList) => {
    const [sF, sX, sY] = current.split(',')

    const f = floorToNumber(sF)
    const x = parseInt(sX)
    const y = parseInt(sY)

    const forwardNode = `${sF},${x},${y - 1}`
    const backwardNode = `${sF},${x},${y + 1}`
    const leftNode = `${sF},${x - 1},${y}`
    const rightNode = `${sF},${x + 1},${y}`

    const nextNodes = [
        forwardNode,
        backwardNode,
        leftNode,
        rightNode,
        // forwardRightNode,
        // forwardLeftNode,
        // backwardRightNode,
        // backwardLeftNode,
    ]

    const stairsAbove = map.hasOwnProperty(`${numberToFloor(f + 0.5)},${x},${y}`)
    const stairsBelow = map.hasOwnProperty(`${numberToFloor(f - 0.5)},${x},${y}`)

    if (stairsAbove) {
        const upFloor = `${numberToFloor(f + 1)},${x},${y}`
        nextNodes.push(upFloor)
    }
    if (stairsBelow) {
        const downFloor = `${numberToFloor(f - 1)},${x},${y}`
        nextNodes.push(downFloor)
    }

    const forwardRightNode = `${f},${x + 1},${y - 1}`
    const forwardLeftNode = `${f},${x - 1},${y - 1}`
    const backwardRightNode = `${f},${x + 1},${y + 1}`
    const backwardLeftNode = `${f},${x - 1},${y + 1}`

    const filteredNodes = nextNodes.filter(direction => {
        const inPrevs = prevList.includes(direction)
        const existsInMap = map.hasOwnProperty(direction)
        const keptInFilter = !inPrevs && existsInMap

        return keptInFilter
    })
    return filteredNodes
}
