import Map from './Map'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import React from "react";

describe('<Map/>',() => {

    it('should render', () => {

        const { getByTestId, getByText, queryByTestId, asJSON } = render(
            <Map
                onPressLocation={locationName => {}}
                onRouteUpdate={route => {}}
                location={[{ location: '2,0,7', probability: 1 }]}
                goal={'1,1,1'}
            />
        )

        expect(asJSON()).toMatchSnapshot();

    })

})
