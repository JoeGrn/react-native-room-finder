import React, { useState, useEffect } from 'react'
import { View, Image, Text, StyleSheet, useWindowDimensions } from 'react-native'
import { Svg, Rect, Polygon, Circle } from 'react-native-svg'
import { getLocationProbability } from '../util/find3Location'
import { calculateOptimumRoute, floorToNumber } from '../util/find3Nav'
import arrowDirection from '../util/arrowDirection'
import mapImageToFloor from '../util/mapImageToFloor'
import {weightedMeanCenter} from "../util/interpolation";

const MAP_ROWS = 8
const MAP_COLS = 8
const ASPECT_RATIO = 0.638

const FLOORS = ['g', '1', '2']
const initMapState = {}

FLOORS.forEach(floor => {
    Array.from({ length: MAP_COLS }).forEach((obj, x) => {
        Array.from({ length: MAP_ROWS }).forEach((obj, y) => {
            initMapState[`${floor},${x},${y}`] = {}
        })
    })
})

// Mark Obstacles on Map
delete initMapState['g,5,3']
delete initMapState['g,6,3']
delete initMapState['g,6,2']
delete initMapState['1,2,3']
delete initMapState['1,2,4']
delete initMapState['1,5,3']
delete initMapState['1,5,4']
delete initMapState['2,2,3']
delete initMapState['2,2,4']
delete initMapState['2,3,3']
delete initMapState['2,3,4']
delete initMapState['2,4,3']
delete initMapState['2,4,4']
delete initMapState['2,5,3']
delete initMapState['2,5,4']

// Mark Stairs on the Map
initMapState['g1s,0,1'] = null
initMapState['12s,0,1'] = null
initMapState['g1s,4,7'] = null
initMapState['12s,4,7'] = null
initMapState['g1s,6,0'] = null
initMapState['12s,6,0'] = null

/**
 * Indexing the map [floor,column,row] or [floor,x,y]
 * @param onPressLocation
 * @param location
 * @param goal
 * @returns {*}
 * @constructor
 */

const Map = ({ onPressLocation, location, goal }) => {
    const [map, setMap] = useState(initMapState)
    const { width: windowWidth, } = useWindowDimensions()
    const [layout, setLayout] = useState(null)
    const start = weightedMeanCenter(location)
    const userFloor = start.split(',')[0]
    const optimalRoute = calculateOptimumRoute(initMapState, start, goal)
    const mapImage = mapImageToFloor(userFloor)

    let optimalRouteStartX = null
    let optimalRouteStartY = null
    let optimalRouteEndX = null
    let optimalRouteEndY = null

    if (optimalRoute) {
        const start = optimalRoute[0].split(',')
        const end = optimalRoute[optimalRoute.length - 1].split(',')

        optimalRouteStartX = start[1]
        optimalRouteStartY = start[2]
        optimalRouteEndX = end[1]
        optimalRouteEndY = end[2]
    }

    let blockWidthPx = null
    let blockHeightPx = null
    let userX = null
    let userY = null
    let marginLeft = 0 // null
    let marginTop = 0 //null
    let marginTopSvg = 0 //null

    if (layout) {
        blockWidthPx = layout.width / MAP_COLS
        blockHeightPx = (layout.width * ASPECT_RATIO) / MAP_ROWS
        userX = optimalRouteStartX * blockWidthPx + blockWidthPx / 2
        userY = optimalRouteStartY * blockHeightPx + blockHeightPx / 2
        marginTopSvg = (layout.width * (1 - ASPECT_RATIO)) / 2
    }

    return (
        <View
            style={{ width: windowWidth, }}
            onLayout={event => {
                const layout = event.nativeEvent.layout
                setLayout({
                    width: layout.width,
                    height: layout.height,
                    widthActual: layout.width,
                    heightActual: layout.height,
                })
            }}
        >
            {layout && (
                <>
                    <View>
                        <Image
                            resizeMode="contain"
                            resizeMethod="resize"
                            source={mapImage}
                            style={{
                                width: layout.width,
                                height: layout.width,
                                marginLeft,
                                marginTop,
                            }}
                        />
                    </View>
                    <View style={styles.absoluteWrapper}>
                        <Svg
                            style={{ marginTop: marginTop + marginTopSvg, marginLeft }}
                            width={layout.width}
                            height={layout.width * ASPECT_RATIO}
                        >
                            {Object.entries(map).map(([key, block]) => {
                                //Click-able grid for training the model
                                const [f, x, y] = key.split(',')

                                //Don't render stairs
                                if (f.includes('s')) {
                                    return null
                                }

                                const onRoute = optimalRoute && optimalRoute.includes(key)
                                const userOnThisFloor = userFloor === f

                                return (
                                    <Rect
                                        key={key}
                                        x={blockWidthPx * x}
                                        y={blockHeightPx * y}
                                        width={blockWidthPx}
                                        height={blockHeightPx}
                                        fill={(onRoute && userOnThisFloor) ? 'rgba(0,0,255,0.5)' : 'rgba(0,0,0,0)'}
                                        pointerEvents={userOnThisFloor ? 'auto' : 'none'}
                                        onPress={() => {
                                            onPressLocation(key)
                                        }}
                                    />
                                )
                            })}
                            {/*Render the user*/}
                            {optimalRoute && (
                                <Polygon
                                    origin={`${userX}, ${userY}`}
                                    points={`${userX + 10}, ${userY + 10} ${userX}, ${userY -
                                        10} ${userX - 10}, ${userY + 10} ${userX}, ${userY + 5}`}
                                    fill="blue"
                                    strokeWidth="1"
                                    rotation={arrowDirection(optimalRoute)}
                                />
                            )}
                            {/*Render the destination*/}
                            {optimalRoute && (
                                <Circle
                                    cx={optimalRouteEndX * blockWidthPx + blockWidthPx / 2}
                                    cy={optimalRouteEndY * blockHeightPx + blockHeightPx / 2}
                                    r={blockWidthPx / 4}
                                    fill="red"
                                />
                            )}
                        </Svg>
                    </View>
                </>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    absoluteWrapper: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
})

export default Map
