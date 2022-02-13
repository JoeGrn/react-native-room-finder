export default class LocationName {
    static toBackend(locationName) {
        return locationName.replace(/,/g,'-')
    }
    static toFrontend(locationName) {
        return locationName.replace(/-/g,',')
    }
}
