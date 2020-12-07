import React, { useState } from 'react'
import '../css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const OptionsPane = (props) => {

    const title = props.title
    const options = props.options
    const toggle = props.toggle

    const [expanded, setExpanded] = useState(false);
    const subItems = expanded

    const toggleExpanded = () => setExpanded(value => !value);


    const optionsOutput = Object.keys(options).map(item =>

        <div key={item}>
            <label key={item}>
                <input
                    key={item}
                    name={item}
                    type="checkbox"
                    defaultChecked={options[item]}
                    onChange={() => toggle(title, item, options[item])}
                />
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