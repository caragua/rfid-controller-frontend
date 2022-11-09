import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';

import { AiOutlineScan } from 'react-icons/ai';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { DropDownOptions } from '../Common';
import { getCookie } from '../../common.js';

import { useParams, useOutletContext, useNavigate } from "react-router-dom";

class Details extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            codes: null,

            name: '',
            location: '',
        }

        this.siteId = 'new';

        this.isloading = false;

        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.loadData = this.loadData.bind(this);
    }

    handleClose() {
        this.props.navigate('/sites');
    }

    handleChange(event){    
        let target = event.target;

        let value;
        if (target.type == 'checkbox') {
            value = target.checked;
        }
        else {
            value = target.value;
        }

        let name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit (event) {
        let token = getCookie('token');
        
        let data = new URLSearchParams();
        data.append('name', this.state.name);
        data.append('location', this.state.location);

        if (this.siteId == "new"){
            fetch("http://api.dg.lazyprojects.com/sites/", {
                method: "POST",
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${getCookie('token')}`,
                    'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
                },
                body: data
            })    
            .then((response) => {
                if (response.status == 200) {
                    this.reloadData();
                    this.handleClose();
                }
            });
        }
        else {            
            fetch(`http://api.dg.lazyprojects.com/sites/${this.siteId}`, {
                method: "PUT",
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${getCookie('token')}`,
                    'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
                },
                body: data
            })             
            .then((response) => {
                if (response.status == 200) {
                    this.reloadData();
                    this.handleClose();
                }
            });
        }
    }

    componentDidMount() {
        const { siteId } = this.props.params;
        this.siteId = siteId;

        const { reloadData } = this.props.outletContext;
        this.reloadData = reloadData;

        if (!this.isloading) {
            this.isloading = true;
            if (siteId == 'new') {
                this.loadData('/options');
            }
            else {
                this.loadData('/' + siteId);
            }
        }
    }

    loadData(condition) {
        fetch('http://api.dg.lazyprojects.com/sites' + condition, {method: "GET", headers: {'Authorization': `Bearer ${getCookie('token')}`}})
            .then((response) => {
                if (response.status == 200) {
                    return response.json()
                }
            })
            .then((data) => {
                if (this.siteId == 'new') {
                    this.setState({ codes: data.codes});
                }
                else {
                    this.setState({
                        codes: data.codes,

                        name: data.data.name,
                        location: data.data.location,
                    });
                }
            });
    }

    render() {
        let submitButtonText = "更新"; 
        let modalTitle = "更新場地資訊"

        if (this.siteId == 'new') {
            submitButtonText = "新增";
            modalTitle = "新增場地";
        }

        return (
            <>
                <Modal size="sm" show={this.props.params.siteId} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{modalTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Container>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>名稱</Form.Label>
                                            <InputGroup>
                                                <Form.Control name="name" value={this.state.name} onChange={this.handleChange} />
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>位置</Form.Label>
                                            <Form.Control name="location" value={this.state.location} onChange={this.handleChange} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Container>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.handleSubmit}>{submitButtonText}</Button>
                    </Modal.Footer>
                </Modal>
            </>

        );
    }
}

const withParams = Component => props => {
    const params = useParams();
    const navigate = useNavigate();
    const outletContext = useOutletContext();
    return <Component {...props} params={params} navigate={navigate} outletContext={outletContext} />;
};

export default withParams(Details);