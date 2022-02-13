import Button from './Button'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import React from "react";

describe('<Button/>',() => {

    const onPress = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should render', () => {

        const { getByTestId, getByText, queryByTestId, asJSON } = render(
            <Button title="my button" onPress={onPress}/>
        )

        expect(asJSON()).toMatchSnapshot();

    })

})
