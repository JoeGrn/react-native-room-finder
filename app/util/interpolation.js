/**
 *
 * @param guess [{probability:number,location:string}]
 */
import {floorToNumber, numberToFloor} from "./find3Nav";

export function weightedMeanCenter(guess) {
    const center = guess
        .filter(({probability}) => probability!==undefined)
        .map(({probability,location}) => {
            const [f,x,y] = location.split(',')
            const fN = floorToNumber(f)
            return [fN*probability,x*probability,y*probability]
        })
        .reduce((acc,val) => {
            if(acc===null) {
                return val
            }
            return [
                acc[0]+val[0],
                acc[1]+val[1],
                acc[2]+val[2],
            ]
        },null)
    return [
        numberToFloor(Math.round(center[0])),
        Math.round(center[1]),
        Math.round(center[2]),
    ].join(',')
}
