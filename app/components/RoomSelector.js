import React from 'react'
import { StyleSheet, Picker } from 'react-native'

const rooms = [
    ['Asquith', 'g,6,0'],
    ['Vroom', 'g,7,0'],
    ['Pocket Tap', 'g,5,2'],
    ['Travellers Rest', 'g,4,3'],
    ['Digital', 'g,6,4'],
    ['Enterprise', 'g,6,6'],
    ['Small Room', 'g,6,7'],
    ['Orb', 'g,1,2'],
    ['Dog & Duck', 'g,1,3'],
    ['Make Things Simple', 'g,1,3'],
    ['Diversity', 'g,1,3'],
    ['Wine Tasting Room', '1,0,7'],
    ['Doing the Right Thing', '1,0,3'],
    ['Playing to Win', '1,2,5'],
    ['Momentum', '1,4,4'],
    ['Little Strategy Room', '1,5,5'],
    ['G1', '1,7,2'],
    ['G2', '1,7,3'],
    ['G3', '1,7,4'],
    ['Meeting Room 4', '1,7,5'],
    ['Meeting Room 5', '1,7,5'],
    ['Meeting Room 7', '1,7,6'],
    ['Meeting Room 8', '1,6,3'],
    ['Meeting Room 9', '1,6,3'],
    ['Meeting Room 10', '1,6,4'],
    ['Meeting Room 11', '1,6,4'],
    ['Meeting Room 12', '1,6,4'],
    ['Meeting Room 13', '1,6,4'],
    ['Little Room', '1,7,6'],
    ['Retail', '2,7,0'],
    ['Rollback', '2,5,0'],
    ['His', '2,7,4'],
    ['Hers', '2,7,5'],
    ['Mindstep', '2,3,7'],
    ['Cops', '2,1,1'],
    ['Sparkle', '2,1,2'],
    ['Think Tank', '2,0,3'],
    ['One 3', '2,0,6'],
    ['Insight', '2,0,6'],
    ['Bentonville', '2,0,7'],
]

const RoomSelector = ({ onRoomChanged }) => {
    return (
        <Picker testID="picker" onValueChange={itemValue => onRoomChanged(itemValue)}>
            {rooms.map(room => (
                <Picker.Item key={room[0]} label={room[0]} testID={room[0]} value={room} />
            ))}
        </Picker>
    )
}

export default RoomSelector
