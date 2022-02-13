import {weightedMeanCenter} from "./interpolation";

describe('weightedMeanCenter', () => {

    it('Combines 1 point', () => {
        const output = weightedMeanCenter([
            {probability:1,location:'g,0,7'},
        ])

        expect(output).toEqual('g,0,7')
    })

    it('Combines 2 points', () => {

        const output = weightedMeanCenter([
            {probability:0.5,location:'g,0,7'},
            {probability:0.5,location:'g,3,7'}
        ])

        expect(output).toEqual('g,2,7')

    })

    it('Combines 3 points', () => {

        const output = weightedMeanCenter([
            {probability:0.2,location:'g,3,7'},
            {probability:0.4,location:'1,3,6'},
            {probability:0.4,location:'1,3,8'},
        ])

        expect(output).toEqual('1,3,7')

    })

})
