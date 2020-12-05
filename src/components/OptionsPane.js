import React, { useState } from 'react'
import '../css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const GraphOptions = (props) => {
    const [expanded, setExpanded] = useState(false);
    const [median, setMedian] = useState();
    const subItems = expanded
    const info = 'median'

    const toggleExpanded = () => setExpanded(value => !value);

    const medianToggle = React.useCallback(
        () => setMedian(!median)
        , [median]);

    return (
        <></>
        // <div className="graphOptions">
        //     <div className="graphOptions-title" onClick={toggleExpanded}>
        //         {expanded ? <span>&minus;</span> : <span>+</span>} Graph Options
        //     </div>
        //     <div className="graphOptions-items">
        //         {subItems &&
        //             <div>
        //                 <input
        //                     name="medianShow"
        //                     type="checkbox"
        //                     checked={median}
        //                     onChange={medianToggle} />
        //                     {' '}Median
        //     </div>
        //         }
        //     </div>
        // </div>
    );
};

export default GraphOptions