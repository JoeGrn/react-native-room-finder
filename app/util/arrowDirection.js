const arrowDirection = optimalRoute => {
    const UP = 0
    const DOWN = 180
    const LEFT = 270
    const RIGHT = 90

    const [current, next] = optimalRoute
    const [curF, curX, curY] = current.split(',')
    const [nextF, nextX, nextY] = next.split(',')

    if (nextY < curY) {
        return UP
    } else if (nextY > curY) {
        return DOWN
    } else if (nextX > curX) {
        return RIGHT
    } else if (nextX < curX) {
        return LEFT
    }
}

export default arrowDirection
