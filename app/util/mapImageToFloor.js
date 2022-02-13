const groundFloorImage = require('../assets/TODO')
const firstFloorImage = require('../assets/TODO')
const secondFloorImage = require('../TODO')

const mapImageToFloor = userFloor => {
    switch (userFloor) {
        case 'g':
            return groundFloorImage
        case '1':
            return firstFloorImage
        case '2':
            return secondFloorImage
    }
}

export default mapImageToFloor
