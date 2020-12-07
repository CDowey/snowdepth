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


    const optionsOutput = Object.keys(options).map(item =>

        <div key={item}>
            <label key={item}>
                    <Toggle
                        key={item}
                        className={item}
                        defaultChecked={options[item]}
                        icons={false}
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