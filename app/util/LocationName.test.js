import LocationName from './LocationName'

describe('LocationName class', () => {

    test('toBackend', () => {
        expect(LocationName.toBackend('g,1,2')).toEqual('g-1-2')
    })

    test('toFrontend', () => {
        expect(LocationName.toFrontend('g-2-3')).toEqual('g,2,3')
    })

})
