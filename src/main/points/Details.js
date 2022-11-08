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

            attendeeId: 0,
            quantity: 0,
            description: '',
            status: 1
        }

        this.pointId = 'new';

        this.isloading = false;

        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.loadData = this.loadData.bind(this);
    }

    handleClose() {
        this.props.navigate('/points');
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
        if (this.pointId == "new"){
            fetch("http://api.rfid-demo.lazyprojects.com/v1/points/", {
                method: "post",
                body: JSON.stringify({
                    attendeeId:     this.state.attendeeId,
                    quantity:       this.state.quantity,
                    description:    this.state.description,
                    status:         this.state.status
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
            fetch("http://api.rfid-demo.lazyprojects.com/v1/points/" + this.pointId, {
                method: "put",
                body: JSON.stringify({
                    attendeeId:     this.state.attendeeId,
                    quantity:       this.state.quantity,
                    description:    this.state.description,
                    status:         this.state.status
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
        const { pointId } = this.props.params;
        this.pointId = pointId;

        const { reloadData } = this.props.outletContext;
        this.reloadData = reloadData;

        if (!this.isloading) {
            this.isloading = true;
            if (pointId == 'new') {
                this.loadData('/?codes');
            }
            else {
                this.loadData('/' + pointId);
            }
        }
    }

    loadData(condition) {
        fetch('http://api.rfid-demo.lazyprojects.com/v1/points' + condition)
            .then((response) => {
                if (response.status == 200) {
                    return response.json()
                }
            })
            .then((data) => {
                if (this.pointId == 'new') {
                    this.setState({ codes: data.codes});
                }
                else {
                    this.setState({
                        codes: data.codes,

                        attendeeId:     data.point.attendeeId,
                        quantity:       data.point.quantity,
                        description:    data.point.description,
                        status:         data.point.status
                    });
                }
            });
    }

    render() {
        let submitButtonText = "更新"; 
        let modalTitle = "更新加扣分記錄"

        if (this.pointId == 'new') {
            submitButtonText = "新增";
            modalTitle = "新增加扣分記錄";
        }

        return (
            <>
                <Modal size="sm" show={this.props.params.pointId} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{modalTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Container>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>參加者 ID
                                            </Form.Label>
                                            <InputGroup>
                                                <Form.Control name="attendeeId" value={this.state.attendeeId} onChange={this.handleChange} />
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>加扣分數量</Form.Label>
                                            <InputGroup>
                                                <Form.Control name="quantity" value={this.state.quantity} onChange={this.handleChange} />
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>描述</Form.Label>
                                            <InputGroup>
                                                <Form.Control name="description" value={this.state.description} onChange={this.handleChange} />
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>狀態</Form.Label>
                                            <Form.Select name="status" value={this.state.status} onChange={this.handleChange} >
                                                <DropDownOptions codes={this.state.codes} name="status"/>
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