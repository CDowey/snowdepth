import React, { useState, useEffect } from 'react'
import LineChart from './LineChart';

const SidePanel = () => {

    // Set url for api request
    const api_url = "https://www.ncdc.noaa.gov/snow-and-ice/daily-snow/VT-snow-depth-201912.json";

    //useState to set state and functions for changing state
    const [hasError, setError] = useState(false);
    const [snowdepths, setsnowdepths] = useState([]);

    // Use this variable to determine if snowdepths has been updated
    // an indicator that the api response was resolved
    const isLoading = snowdepths.length === 0
    console.log('isLoading', isLoading)
    console.log('snowdepths', snowdepths)


    // to use useEffect similar to ComponentDidMount pass second argument of an array 
    useEffect(() => {
        // Set up abort controller for clean up https://dev.to/pallymore/clean-up-async-requests-in-useeffect-hooks-90h
        const abortController = new AbortController();

        const fetchData = async () => {

            const res = await fetch(api_url, { signal: abortController.signal });
            res
                .json()
                .then(res => {

                    // Grab the mansfield data
                    const mansfield = res.data.USC00435416
                    // get starting date
                    const year = mansfield.date.substring(0, 4);
                    const month = '0' + (parseInt(mansfield.date.substring(4, 6)) - 1).toString()

                    let d3_data = []
                    console.log(Object.entries(mansfield.values))

                    for (const [day, depth] of Object.entries(mansfield.values)) {
                        let row = {
                            'date': new Date(year, month, day),
                            'depth': depth
                        }

                        d3_data.push(row)
                    }

                    // Loop through items in array and fill in missing values
                    for (const [i, { date, depth }] of d3_data.entries()) {
                        if (depth === 'M') {
                            d3_data[i].depth = d3_data[i - 1].depth
                        }
                    }

                    setsnowdepths(d3_data)
                })
                .catch(err => setError(err));
        };

        fetchData();

        // Clean up
        return () => {
            abortController.abort();
        };
    }, []);

    return (
        <div>
            {/* Use this conditional statement to change what is return based on isLoading */}
            {isLoading
                ? 'loading'
                : <LineChart data={snowdepths} />
            }

        </div>

    );
};

export default SidePanel;