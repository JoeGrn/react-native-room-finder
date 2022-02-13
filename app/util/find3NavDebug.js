import { calculateOptimumRoute, numberToFloor } from './find3Nav'

map = {}
for (let x = 0; x <= 5; x++) {
    for (let y = 0; y <= 5; y++) {
        for (let f = 0; f < 3; f++) {
            map[`${numberToFloor(f)},${x},${y}`] = null
        }
    }
}

map['g1s,1,0'] = null
map['g1s,2,0'] = null

console.log(map)

let result = calculateOptimumRoute(map, 'g,0,0', '1,0,0')

console.log(result)
