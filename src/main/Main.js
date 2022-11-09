import React from 'react';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import './main.css';
import { Outlet, useNavigate, useLocation } from "react-router-dom";

function MyNavLink (props) {
    const navigate = useNavigate();
    const location = useLocation();

    if (location.pathname.indexOf(props.to) == 0) {
        return <Nav.Link href={`${props.to}`} onClick={(e) => {e.preventDefault(); navigate(props.to);}} style={{color: "white"}}>{props.children}</Nav.Link>
    }
    else {
        return <Nav.Link href={`${props.to}`} onClick={(e) => {e.preventDefault(); navigate(props.to);}}>{props.children}</Nav.Link>
    }    
}

class Main extends React.Component {
    render() {
        return (
            <>
                <Navbar bg="dark" variant="dark">
                    <Container>
                        <Navbar.Brand href="">測試管理系統</Navbar.Brand>
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <MyNavLink to="/registration">報到</MyNavLink>
                                <MyNavLink to="/attendees">參加者</MyNavLink>
                                <MyNavLink to="/sites">場地</MyNavLink>
                                <MyNavLink to="/accessRules">入場控管</MyNavLink>
                                <MyNavLink to="/cardReaders">讀卡機</MyNavLink>
                                <MyNavLink to="/scans">感應記錄</MyNavLink>
                                <MyNavLink to="/points">加扣點記錄</MyNavLink>
                                <MyNavLink to="/stats">統計</MyNavLink>
                                <MyNavLink to="/users">使用者</MyNavLink>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <Container>
                    <Outlet />
                </Container>
            </>
        );
    }
}

export default Main;