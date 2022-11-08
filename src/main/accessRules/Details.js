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

import { useParams, useOutletContext, useNavigate } from "react-router-dom";

class Details extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            codes: null,

            siteId: 0,
            description: '',
            attendeeTypeCheck: 0,
            ageCheck: 0,
            singlePass: 0,

            status: 1,

            sites: null
        }

        this.accessRuleId = 'new';

        this.isloading = false;

        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.loadData = this.loadData.bind(this);
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
        if (this.accessRuleId == "new"){
            fetch("http://api.rfid-demo.lazyprojects.com/v1/accessRules/", {
                method: "post",
                body: JSON.stringify({
                    siteId:             this.state.siteId,
                    description:        this.state.description,
                    attendeeTypeCheck:  this.state.attendeeTypeCheck,
                    ageCheck:           this.state.ageCheck,
                    singlePass:         this.state.singlePass
                })
            })            
            .then((response) => {
                if (response.status == 200) {
                    this.reloadData();
                    this.handleClose();
                }
            });
        }
        else {            
            fetch("http://api.rfid-demo.lazyprojects.com/v1/accessRules/" + this.accessRuleId, {
                method: "put",
                body: JSON.stringify({
                    siteId:             this.state.siteId,
                    description:        this.state.description,
                    attendeeTypeCheck:  this.state.attendeeTypeCheck,
                    ageCheck:           this.state.ageCheck,
                    singlePass:         this.state.singlePass,
                    status:             this.state.status
                })
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
        const { accessRuleId } = this.props.params;
        this.accessRuleId = accessRuleId;

        const { reloadData } = this.props.outletContext;
        this.reloadData = reloadData;

        if (!this.isloading) {
            this.isloading = true;
            if (accessRuleId == 'new') {
                this.loadData('/?codes');
            }
            else {
                this.loadData('/' + accessRuleId);
            }
        }
    }

    loadData(condition) {
        fetch('http://api.rfid-demo.lazyprojects.com/v1/accessRules' + condition)
        .then((response) => {
            if (response.status == 200) {
                return response.json()
            }
        })
        .then((data) => {
            if (this.accessRuleId == 'new') {
                this.setState({ codes: data.codes});
            }
            else {
                this.setState({
                    codes: data.codes,

                    siteId:             data.accessRule.siteId,
                    description:        data.accessRule.description,
                    attendeeTypeCheck:  data.accessRule.attendeeTypeCheck,
                    ageCheck:           data.accessRule.ageCheck,
                    singlePass:         data.accessRule.singlePass,
                    status:             data.accessRule.status
                });
            }
        });

        fetch('http://api.rfid-demo.lazyprojects.com/v1/sites')
        .then((response) => {
            if (response.status == 200) {
                return response.json()
            }
        })
        .then((data) => {
            let sites = {}
            data.sites.map(item => sites[item.id] = `${item.name} (${item.location})`);

            if (this.accessRileId == "new") {
                this.setState({
                    sites: sites,
    
                    siteId: data.sites[0].id
                });
            }
            else {
                this.setState({
                    sites: sites,
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
                                            <Form.Label>狀態</Form.Label>
                                            <Form.Select name="status" value={this.state.status} onChange={this.handleChange} disabled={this.accessRuleId == 'new'} >
                                                <DropDownOptions codes={this.state.codes} name="status"/>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>場地</Form.Label>
                                            <Form.Select name="siteId" value={this.state.siteId} onChange={this.handleChange}>
                                                <DropDownOptions items={this.state.sites} name="siteId"/>
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
                                            <Form.Select name="attendeeTypeCheck" value={this.state.attendeeTypeCheck} onChange={this.handleChange}>
                                                <DropDownOptions codes={this.state.codes} name="attendeeTypeCheck"/>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>年齡限制</Form.Label>
                                            <Form.Select name="ageCheck" value={this.state.ageCheck} onChange={this.handleChange}>
                                                <DropDownOptions codes={this.state.codes} name="ageCheck"/>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>重複入場</Form.Label>
                                            <Form.Select name="singlePass" value={this.state.singlePass} onChange={this.handleChange}>
                                                <DropDownOptions codes={this.state.codes} name="singlePass"/>
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