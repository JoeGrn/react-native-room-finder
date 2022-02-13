import {
    Text,
    View,
    PermissionsAndroid,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native'
import React from 'react'
import Map from '../components/Map'
import { NativeModules } from 'react-native'
import Button from '../components/Button'
import axios from 'axios'
import RoomSelector from '../components/RoomSelector'
import { floorToNumber, numberToFloor } from '../util/find3Nav'
import LocationName from "../util/LocationName";

const IndoorPositioning = NativeModules.IndoorPositioning

const deviceName = 'device1'
const familyName = 'RoomFinder'
//const serverAddress = 'http://10.0.2.2:8005'
const serverAddress = 'http://35.189.117.128:8003'

class Home extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            locationName: null,
            location: [{ location: '2,0,7', probability: 0.7 }, { location: '2,3,7', probability: 0.3 }],
            goal: `g,0,0`,
            route: null,
            error: null,
            trainingEnabled: false,
            predictEnabled: false,
            isTraining: false,
            isPredicting: false
        }
        this.trainInterval = null
        this.predictInterval = null
    }

    clearError() {
        this.setState({ error: null })
    }

    static async requestLocationPermission() {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Room Finder needs to access your location',
                message: 'Room Finder needs to access your location ',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can access Location')
        } else {
            throw new Error('Cannot Access Fine Location')
        }
    }

    async train(predict) {
        const { locationName } = this.state

        this.clearError();

        if (predict !== true && locationName === null) {
            this.setState({ error: new Error("Can't train, location is not set") })
            return;
        }

        try {
            console.log("Requesting location permission from android")
            await Home.requestLocationPermission()
        } catch (error) {
            this.setState({ error })
            return;
        }

        let result;
        try {
            console.log("Requesting scan data from native code")
            result = await IndoorPositioning.getScanData()
        } catch (error) {
            this.setState({ error })
            return;
        }

        const scanData = {
            "f": familyName,
            "d": deviceName,
            "l": predict ? '' : LocationName.toBackend(locationName),
            "t": Date.now(),
            "s": result
        }

        try {
            console.log("Sending data to backend", scanData)
            let response = await axios.post(`${serverAddress}/data`, scanData)
        } catch (error) {
            console.log(error)
            this.setState({ error })
            return;
        }

        console.log("Backend trained successfully")
    }

    async predict() {
        this.clearError();

        try {
            console.log("Sending scan data before predict")
            await this.train(true)

            console.log("Requesting location from backend")
            const response = await axios.get(
                `${serverAddress}/api/v1/location/${familyName}/${deviceName}`,
            )

            const { message, success } = response.data
            if (success === false) {
                throw new Error("Failed to predict: " + message)
            }

            console.log("Got predictions", response.data.analysis.guesses)

            let guesses = response.data.analysis.guesses
            guesses = guesses.map(guess => ({
                ...guess,
                location: LocationName.toFrontend(guess.location),
            }))

            this.setState({ location: guesses })
        } catch (error) {
            this.setState({ error })
            return;
        }
    }

    navigateStairs(up) {
        const { location } = this.state
        const [f, x, y] = location[0].location.split(',')
        const fn = floorToNumber(f)

        let moveFloor = numberToFloor(fn + (up ? 1 : -1))
        if (moveFloor === null) {
            moveFloor = f
        }

        const newlocation = `${moveFloor},${x},${y}`

        this.setState({
            location: [{ location: newlocation, probability: 1 }],
        })
    }

    startStopTraining() {
        if (this.trainInterval !== null) {
            clearInterval(this.trainInterval)
            this.setState({ trainingEnabled: false })
            this.trainInterval = null
            return
        }
        this.setState({ trainingEnabled: true })
        this.trainInterval = setInterval(async () => {
            this.setState({isTraining: true})
            await this.train()
            this.setState({isTraining: false})
        }, 10000)
    }

    startStopPredict() {
        if (this.predictInterval !== null) {
            clearInterval(this.predictInterval)
            this.setState({ predictEnabled: false })
            this.predictInterval = null
            return
        }
        this.setState({ predictEnabled: true })
        this.predictInterval = setInterval(async () => {
            this.setState({isPredicting: true})
            await this.predict()
            this.setState({isPredicting: false})
        }, 10000)
    }

    render() {
        const { route, error } = this.state

        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                {
                    error &&
                    <View style={[styles.infoWrapper, { marginTop: 10 }]}>
                        <Text style={{ color: '#d55', flex: 3 }}>{error.message}</Text>
                        <TouchableOpacity style={{ flex: 1, alignSelf: 'flex-end' }} onPress={e => this.clearError()}>
                            <Text>Dismiss</Text>
                        </TouchableOpacity>
                    </View>
                }
                <View style={styles.infoWrapper}>
                    <View style={{ flex: 1 }}>
                        <RoomSelector onRoomChanged={room => this.setState({ goal: room[1] })} />
                    </View>
                    <Text style={styles.infoWrapperContent}>Distance: {route && route.length}</Text>
                </View>
                <Map
                    onPressLocation={locationName => {
                        this.setState({
                            locationName,
                            location: [{ location: locationName, probability: 1 }],
                        })
                    }}
                    location={this.state.location}
                    goal={this.state.goal}
                />
                <View style={styles.bottomBar}>
                    <View style={styles.buttonGroup}>
                        <Button
                            style={styles.bottomBarButton}
                            title="Up"
                            onPress={e => this.navigateStairs(true)}
                        />
                        <Button
                            style={styles.bottomBarButton}
                            title="Down"
                            onPress={e => this.navigateStairs(false)}
                        />
                    </View>

                    <View style={styles.buttonGroup}>
                        <Button
                            style={[styles.bottomBarButton, this.state.trainingEnabled && styles.disabled]}
                            title={this.state.predictEnabled ? 'Stop'  : 'Predict'}
                            onPress={e => this.startStopPredict()}
                            disabled={this.state.trainingEnabled}
                        />
                        {this.state.isPredicting && <ActivityIndicator color="blue"/>}
                        <Button
                            style={[styles.bottomBarButton, this.state.predictEnabled && styles.disabled]}
                            title={this.state.trainingEnabled ? 'Stop'  : 'Train'}
                            onPress={e => this.startStopTraining()}
                            disabled={this.state.predictEnabled}
                        />
                        {this.state.isTraining && <ActivityIndicator color="blue"/>}
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    buttonGroup: {
        alignSelf: 'center',
        flexDirection: 'row',
    },
    infoWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    infoWrapperContent: {
        flex: 1,
    },
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingBottom: 5,
    },
    bottomBarButton: {
        marginHorizontal: 5,
    },
    disabled: {
      opacity: 0.5
    },
})

export default Home
