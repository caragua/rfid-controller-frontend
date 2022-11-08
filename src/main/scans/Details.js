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

            cardReaderId: 0,
            cardUID: '',
            description: '',
            status: 0
        }

        this.scanId = 'new';

        this.isloading = false;

        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.loadData = this.loadData.bind(this);
    }

    handleClose() {
        this.props.navigate('/scans');
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
        if (this.scanId == "new"){
            fetch("http://api.rfid-demo.lazyprojects.com/v1/scans/", {
                method: "post",
                body: JSON.stringify({
                    cardReaderId:   this.state.cardReaderId,
                    cardUID:        this.state.cardUID,
                    description:    this.state.description
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
            fetch("http://api.rfid-demo.lazyprojects.com/v1/scans/" + this.scanId, {
                method: "put",
                body: JSON.stringify({
                    cardReaderId:   this.state.cardReaderId,
                    cardUID:        this.state.cardUID,
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
        const { scanId } = this.props.params;
        this.scanId = scanId;

        const { reloadData } = this.props.outletContext;
        this.reloadData = reloadData;

        if (!this.isloading) {
            this.isloading = true;
            if (scanId == 'new') {
                this.loadData('/?codes');
            }
            else {
                this.loadData('/' + scanId);
            }
        }
    }

    loadData(condition) {
        fetch('http://api.rfid-demo.lazyprojects.com/v1/scans' + condition)
            .then((response) => {
                if (response.status == 200) {
                    return response.json()
                }
            })
            .then((data) => {
                if (this.scanId == 'new') {
                    this.setState({ codes: data.codes});
                }
                else {
                    this.setState({
                        codes: data.codes,

                        cardReaderId:   data.scan.cardReaderId,
                        cardUID:        data.scan.cardUID,
                        description:    data.scan.description,
                        status:         data.scan.status
                    });
                }
            });
    }

    render() {
        let submitButtonText = "更新"; 
        let modalTitle = "更新掃描記錄"

        if (this.scanId == 'new') {
            submitButtonText = "新增";
            modalTitle = "新增掃描記錄";
        }

        return (
            <>
                <Modal size="sm" show={this.props.params.scanId} onHide={this.handleClose}>
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
                                            <Form.Select name="status" value={this.state.status} onChange={this.handleChange} disabled={this.state.scanId == 'new'}>
                                                <DropDownOptions codes={this.state.codes} name="status"/>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>讀卡機 ID</Form.Label>
                                            <InputGroup>
                                                <Form.Control name="cardReaderId" value={this.state.cardReaderId} onChange={this.handleChange} />
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>卡片編號</Form.Label>
                                            <InputGroup>
                                                <Form.Control name="cardUID" value={this.state.cardUID} onChange={this.handleChange} />
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