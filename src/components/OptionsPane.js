import React, { useState } from 'react'
import '../css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const OptionsPane = (props) => {

    const title = props.title
    const options = props.options

    console.log('title', title)
    console.log('options', options)

    const [expanded, setExpanded] = useState(false);
    const [median, setMedian] = useState();
    const [sig1, setSig1] = useState();
    const [sig2, setSig2] = useState();
    const subItems = expanded

    const toggleExpanded = () => setExpanded(value => !value);

    const medianToggle = React.useCallback(
        () => {
            setMedian(!median)
            console.log('toggle median')
        }
        , [median]);

    const sig1Toggle = React.useCallback(
        () => setSig1(!sig1)
        , [sig1]);

    const sig2Toggle = React.useCallback(
        () => setSig2(!sig2)
        , [sig2]);

    const optionsOutput = options.map(item =>
        <div key={Object.keys(item)[0]}>

        <input
        key = {Object.keys(item)[0]}
        name={Object.keys(item)[0]}
        type="checkbox"
        checked={Object.values(item)[0]}
        // onChange={} 
        />
        <span className='graphOptionsSelectors'>{' ' + Object.keys(item)[0]}</span>
  </div>
    )

    // options.map(item => {
    //     const optionName = 

    //     return (
    //     <div>{Object.keys(Object.values(item)[0])}</div>
    //     // <div>
    //     //     <input
    //     key = 
    //     //         name="medianShow"
    //     //         type="checkbox"
    //     //         checked={Object.values(item)[0]}
    //     //         //onChange={} 
    //     //         />
    //     //     <span className='graphOptionsSelectors'>{' ' + Object.keys(item)[0]}</span>
    //     // </div>
    //     )
    // })


    return (
        <div className="graphOptions">
            <div className="graphOptions-title" onClick={toggleExpanded}>
                {expanded ? <span>&minus;</span> : <span>+</span>} {title}
            </div>
            <div className="graphOptions-items">
                {subItems && optionsOutput
                    // < div >
                    // <div>
                    //     <input
                    //         name="medianShow"
                    //         type="checkbox"
                    //         checked={median}
                    //         onChange={medianToggle} />
                    //     <span className='graphOptionsSelectors'>{' '}Median</span>
                    // </div>
                    // <div>
                    //     <input
                    //         name="1SigShow"
                    //         type="checkbox"
                    //         checked={sig1}
                    //         onChange={sig1Toggle}
                    //     />
                    //     <span className='graphOptionsSelectors'>{' '}1-σ</span>
                    // </div>
                    // <div>
                    //     <input
                    //         name="2SigShow"
                    //         type="checkbox"
                    //         checked={sig2}
                    //         onChange={sig2Toggle}
                    //     />
                    //     <span className='graphOptionsSelectors'>{' '}2-σ</span>
                    // </div>
                    // </div>
                }
            </div>
        </div >
    );
};

export default OptionsPane