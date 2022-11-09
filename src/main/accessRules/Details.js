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
            sites: null,

            siteId:             0,
            description:        '',
            checkAttendeeType:  0,
            checkAge:           0,
            singlePass:         0,
        }

        this.accessRuleId = 'new';

        this.isloading = false;

        this.handleClose    = this.handleClose.bind(this);
        this.handleChange   = this.handleChange.bind(this);
        this.handleSubmit   = this.handleSubmit.bind(this);
        this.loadData       = this.loadData.bind(this);
    }

    handleClose() {
        this.props.navigate('/accessRules');
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
        let data = new URLSearchParams();
        data.append('site_id',              this.state.siteId);
        data.append('description',          this.state.description);
        data.append('check_attendee_type',  this.state.checkAttendeeType);
        data.append('check_age',            this.state.checkAge);
        data.append('single_pass',          this.state.singlePass);

        if (this.accessRuleId == "new"){
            fetch('http://api.dg.lazyprojects.com/accessRules', {
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
                if (Math.floor(response.status / 100) == 2) {
                    this.reloadData();
                    this.handleClose();
                }
            })
        }
        else {      
            fetch('http://api.dg.lazyprojects.com/accessRules/' + this.accessRuleId, {
                headers: {
                    'Accept':           'application/json',
                    'Authorization':    `Bearer ${getCookie('token')}`,
                    'X-XSRF-TOKEN':     getCookie('XSRF-TOKEN')
                },
                method:         "PUT",
                credentials:    'include',
                body:           data
            })
            .then((response) => {
                if (Math.floor(response.status / 100) == 2) {
                    this.reloadData();
                    this.handleClose();
                }
            })
        }
    }

    componentDidMount() {
        const { accessRuleId } = this.props.params;
        this.accessRuleId = accessRuleId;

        const { reloadData } = this.props.outletContext;
        this.reloadData = reloadData;

        if (!this.isloading) {
            this.isloading = true;
            if (accessRuleId == 'new') {
                this.loadData('/options');
            }
            else {
                this.loadData('/' + accessRuleId);
            }
        }
    }

    loadData(condition) {
        fetch('http://api.dg.lazyprojects.com/accessRules' + condition, {method: "GET", headers: {'Authorization': `Bearer ${getCookie('token')}`}})
        .then((response) => {
            if (Math.floor(response.status / 100) == 2) {
                return response.json()
            }
        })
        .then((result) => {
            if (this.accessRuleId == 'new') {
                this.setState({ codes: result.codes, sites: result.sites });
            }
            else {
                this.setState({
                    codes: result.codes,
                    sites: result.sites,

                    siteId:             result.data.site_id,
                    description:        result.data.description,
                    checkAttendeeType:  result.data.check_attendee_type,
                    checkAge:           result.data.check_age,
                    singlePass:         result.data.single_pass,
                });
            }
        });
    }

    render() {
        let submitButtonText = "更新"; 
        let modalTitle = "更新入場限制"

        if (this.accessRuleId == 'new') {
            submitButtonText = "新增";
            modalTitle = "新增入場限制";
        }

        return (
            <>
                <Modal size="sm" show={this.props.params.accessRuleId} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{modalTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Container>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>場地</Form.Label>
                                            <Form.Select name="siteId" value={this.state.siteId} onChange={this.handleChange}>
                                                <DropDownOptions items={this.state.sites} name="name"/>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>控管原因</Form.Label>
                                            <InputGroup>
                                                <Form.Control name="description" value={this.state.description} onChange={this.handleChange} />
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <hr />
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>身份限制</Form.Label>
                                            <Form.Select name="checkAttendeeType" value={this.state.checkAttendeeType} onChange={this.handleChange}>
                                                <DropDownOptions codes={this.state.codes} name="attendee_type"/>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>年齡限制</Form.Label>
                                            <Form.Select name="checkAge" value={this.state.checkAge} onChange={this.handleChange}>
                                                <DropDownOptions codes={this.state.codes} name="check_age"/>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>重複入場</Form.Label>
                                            <Form.Select name="singlePass" value={this.state.singlePass} onChange={this.handleChange}>
                                                <DropDownOptions codes={this.state.codes} name="single_pass"/>
                                            </Form.Select>
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