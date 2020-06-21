import React, { useState, useEffect } from 'react'
import { Accordion, Button, Card, Tabs, Tab } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';



const NavPanel = () => {

    return (
        <div className='NavPanel'>
            <Accordion defaultActiveKey="0">
                <Card>
                    <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="1">
                            dafasfds
             </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="1">
                        <Card.Body>                        <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                            <Tab eventKey="home" title="Home">
                                fdsafdasf
                            </Tab>
                            <Tab eventKey="profile" title="Profile">
                                asdfadsf
                            </Tab>
                            <Tab eventKey="contact" title="Contact" disabled>
                                asdfasd
                            </Tab>
                        </Tabs>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>

            </Accordion>
        </div>
    )

}

export default NavPanel