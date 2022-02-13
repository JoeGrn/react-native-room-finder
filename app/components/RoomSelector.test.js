import RoomSelector from './RoomSelector'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import React from "react";

describe('<RoomSelector/>',() => {

    const onRoomChanged = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should render', () => {

        const { getByTestId, getByText, queryByTestId, asJSON } = render(<RoomSelector onRoomChanged={onRoomChanged} />)

        expect(asJSON()).toMatchSnapshot();

    })

})
