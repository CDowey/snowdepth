import React, { useState, useEffect } from 'react'
import '../css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Accordion, Button, Card, Tabs, Nav, Row, Col, Tab } from 'react-bootstrap'



const NavPanel = () => {


    return (
        <div className='NavPanel'>
            {/* Custom Styling for React Bootstrap...couldn't figure out how to have it separate... */}
            {/* <style src="'../css/App.css'" type="text/css"></style> */}
            <style type="text/css">
                {`
                .card{
                    border: none;
                    padding: 0px 0px 0px 30px;
                }

                .card-header{
                    background-color: white;
                    border: none;
                }

                .accordion-toggle {
                    background-color: white;
                    border: none;
                    color: gray;
                }
                .nav-pills .nav-link.active{
                    background-color: gray;
                }

                .nav-pills .nav-link{
                    color: gray;
                }

                .learnmoretext{
                    font-size: small;
                }
                `}
            </style>


            <Accordion defaultActiveKey="0">
                <Card>
                    <Card.Header className='card-header'>
                        <Accordion.Toggle className='accordion-toggle' variant="outline-dark" eventKey="1">
                            Learn More
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="1">
                        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                            <Row>
                                <Col sm={3}>
                                    <Nav variant="pills" className="flex-column">
                                        <Nav.Item>
                                            <Nav.Link eventKey="first">About</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="second">Data</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </Col>
                                <Col sm={9}>
                                    <Tab.Content>
                                        <Tab.Pane eventKey="first">
                                            <div className='learnmoretext'>
                                                I createded this web application to provide an interface for exploring Vermont snow depths for the current winter season and historic records.
                                                It was inspired by the wonderful Mansfield Snow Stake page here.
                                                Any comments, questions, suggestions, leads on other data to incorporate send an email to ______
                                        </div>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="second">
                                            <div className='learnmoretext'>
                                                The <a href='https://www.ncdc.noaa.gov/snow-and-ice/daily-snow/VT/snowfall/'>NOAA Centers for Environmental Information Daily Snowfall and Snow Depth dataset</a> is the primary source of snow depths shown in this application is the
                                    Historic records are
                                    Basemap is _____.
                                    </div>
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Col>
                            </Row>
                        </Tab.Container>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
            {/* <Accordion defaultActiveKey="0">
                <Card>
                    <Card.Header className='learnmore'>
                        <Accordion.Toggle variant="outline-dark" eventKey="1">
                            Learn More
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="1">
                        <Card.Body>
                            <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                                <Tab eventKey="home" title="About">
                                </Tab>
                                <Tab eventKey="profile" title="Data">
 
                                </Tab>
                            </Tabs>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>

            </Accordion> */}
        </div>
    )

}

export default NavPanel