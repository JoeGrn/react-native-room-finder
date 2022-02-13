export const getLocationProbability = (location, key) => {
    const prediction = location.find(prediction => prediction.location === key)
    let probability = prediction === undefined ? 0 : prediction.probability
    probability = probability < 0 || probability > 1 ? 1 : probability
    return probability
}
