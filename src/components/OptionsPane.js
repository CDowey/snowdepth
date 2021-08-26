import React, { useState } from 'react'
import Toggle from 'react-toggle'
import '../css/App.css';

const OptionsPane = (props) => {

    const title = props.title
    const options = props.options
    const toggle = props.toggle

    const [expanded, setExpanded] = useState(false);
    const subItems = expanded

    const toggleExpanded = () => setExpanded(value => !value);

    // function for making class names without leading numbers
    const cleanClassNames = (incomingclassname) => {
        if (incomingclassname === '1-σ'){
            return 'sigma1'
        }
        else if (incomingclassname === '2-σ'){
            return 'sigma2'
        }
        else if (incomingclassname === 'Modelled Snow Depth'){
            return 'ModelledSnowDepth'
        }
        else {
            return incomingclassname
        }
    }


    const optionsOutput = Object.keys(options).map(item =>


        <div key={item}>
            <label key={item}>
                    <Toggle
                        key={item}
                        className= {cleanClassNames(item)} 
                        defaultChecked={options[item]}
                        icons={false}
                        disabled={item === 'Modelled Snow Depth' ? true : false}
                        onChange={() => toggle(title, item, options[item])} />
                    <span>{' ' + item}</span>
            </label>
        </div>
    )

    return (
        <div className="graphOptions">
            <div className="graphOptions-title" onClick={toggleExpanded}>
                {expanded ? <span>&minus;</span> : <span>+</span>} {title}
            </div>
            <div className="graphOptions-items">
                {subItems && optionsOutput}
            </div>
        </div >
    );
};

export default OptionsPane