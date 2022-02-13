import {
    calculateDistanceToGoal,
    calculateOptimumRoute,
    nextNodes,
    numberToFloor,
} from './find3Nav'

describe('calculateDistanceToGoal', () => {
    test('distance to self is 0', () => {
        expect(calculateDistanceToGoal('g,0,0', 'g,0,0')).toEqual(0)
    })
    test('distance to next floor is 1', () => {
        expect(calculateDistanceToGoal('g,0,0', '1,0,0')).toEqual(1)
    })
    test('distance to next x is 1', () => {
        expect(calculateDistanceToGoal('g,0,0', 'g,1,0')).toEqual(1)
    })
    test('distance to next y is 1', () => {
        expect(calculateDistanceToGoal('g,0,0', 'g,0,1')).toEqual(1)
    })
    test('distance to 5x 5y away', () => {
        expect(calculateDistanceToGoal('g,3,3', 'g,8,8')).toBeCloseTo(7.07)
    })
    test('distance to 2f 4x 8y away', () => {
        expect(calculateDistanceToGoal('g,0,0', '2,4,8')).toBeCloseTo(9.165)
    })
})

describe('calculateOptimumRoute', () => {
    let map

    beforeEach(() => {
        map = {}
        for (let x = 0; x <= 5; x++) {
            for (let y = 0; y <= 5; y++) {
                for (let f = 0; f < 3; f++) {
                    map[`${numberToFloor(f)},${x},${y}`] = null
                }
            }
        }
    })

    test('navigate to self', () => {
        expect(calculateOptimumRoute(map, 'g,0,0', 'g,0,0')).toEqual(['g,0,0'])
    })

    test('navigate to same floor - right', () => {
        expect(calculateOptimumRoute(map, 'g,0,0', 'g,5,0')).toEqual([
            'g,0,0',
            'g,1,0',
            'g,2,0',
            'g,3,0',
            'g,4,0',
            'g,5,0',
        ])
    })

    test('navigate to same floor - backward', () => {
        expect(calculateOptimumRoute(map, 'g,0,0', 'g,0,5')).toEqual([
            'g,0,0',
            'g,0,1',
            'g,0,2',
            'g,0,3',
            'g,0,4',
            'g,0,5',
        ])
    })

    test('navigate to same floor - left', () => {
        expect(calculateOptimumRoute(map, 'g,5,2', 'g,0,2')).toEqual([
            'g,5,2',
            'g,4,2',
            'g,3,2',
            'g,2,2',
            'g,1,2',
            'g,0,2',
        ])
    })

    test('navigate to same floor - forward', () => {
        expect(calculateOptimumRoute(map, 'g,3,5', 'g,3,0')).toEqual([
            'g,3,5',
            'g,3,4',
            'g,3,3',
            'g,3,2',
            'g,3,1',
            'g,3,0',
        ])
    })

    test('navigate up a floor ', () => {
        map['g1s,1,0'] = null
        expect(calculateOptimumRoute(map, 'g,0,0', '1,0,0')).toEqual([
            'g,0,0',
            'g,1,0',
            '1,1,0',
            '1,0,0',
        ])
    })

    test('navigate down a floor ', () => {
        map['g1s,1,0'] = null
        expect(calculateOptimumRoute(map, '1,0,0', 'g,0,0')).toEqual([
            '1,0,0',
            '1,1,0',
            'g,1,0',
            'g,0,0',
        ])
    })

    test('navigate obstacle', () => {
        delete map['g,1,5']
        delete map['g,1,4']
        delete map['g,1,3']
        delete map['g,1,2']
        delete map['g,1,1']

        expect(calculateOptimumRoute(map, 'g,0,5', 'g,2,5')).toEqual([
            'g,0,5',
            'g,0,4',
            'g,0,3',
            'g,0,2',
            'g,0,1',
            'g,0,0',
            'g,1,0', //the only node between g,0,x and g,2,x
            'g,2,0',
            'g,2,1',
            'g,2,2',
            'g,2,3',
            'g,2,4',
            'g,2,5',
        ])
    })
})

describe('nextNodes', () => {
    test('start in corner of map', () => {
        let map = {
            'g,0,0': null,
            'g,0,1': null,
            'g,0,2': null,
            'g,1,0': null,
            'g,1,1': null,
            'g,1,2': null,
            'g,2,0': null,
            'g,2,1': null,
            'g,2,2': null,
        }
        let current = 'g,0,0'
        let prev = []
        let filteredNodes = ['g,0,1', 'g,1,0']
        expect(nextNodes(map, current, prev)).toEqual(filteredNodes)
    })
    test('start in middle of map', () => {
        let map = {
            'g,0,0': null,
            'g,0,1': null,
            'g,0,2': null,
            'g,1,0': null,
            'g,1,1': null,
            'g,1,2': null,
            'g,2,0': null,
            'g,2,1': null,
            'g,2,2': null,
        }
        let current = 'g,1,1'
        let prev = []
        let filteredNodes = ['g,1,0', 'g,1,2', 'g,0,1', 'g,2,1']
        expect(nextNodes(map, current, prev)).toEqual(filteredNodes)
    })
})
