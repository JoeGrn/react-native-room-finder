import { calculateOptimumRoute } from './find3Nav'

export function printRoute(map, yMax, xMax, route) {
    for (let y = 0; y <= yMax; y++) {
        let rowStr = ''
        for (let x = 0; x < xMax; x++) {
            const node = `g,${x},${y}`

            if (map[node] === undefined) {
                rowStr += '   '
            } else if (route.includes(node)) {
                rowStr += '[X]'
            } else {
                rowStr += '[ ]'
            }
        }
        console.log(rowStr)
    }
}

let map = {}
for (let x = 0; x <= 80; x++) {
    for (let y = 0; y <= 80; y++) {
        map[`g,${x},${y}`] = null
    }
}

// for (let x = 0; x <= 80; x++) {
//     for (let y = 0; y <= 80; y++) {
//         if (Math.random() < 0.5) {
//             delete map[`g,${x},${y}`]
//         }
//     }
// }

const route = calculateOptimumRoute(map, 'g,0,0', 'g,77,77')

printRoute(map, 80, 80, route)
