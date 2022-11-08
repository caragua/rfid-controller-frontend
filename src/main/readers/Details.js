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

            serial: '',
            nickname: '',
            systemName: '',
            purpose: 0,
            data: '',
            status: 1
        }

        this.cardReaderId = 'new';

        this.isloading = false;

        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.loadData = this.loadData.bind(this);
    }

    handleClose() {
        this.props.navigate('/cardReaders');
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
        if (this.cardReaderId == "new"){
            fetch("http://api.rfid-demo.lazyprojects.com/v1/cardReaders/", {
                method: "post",
                body: JSON.stringify({
                    serial:         this.state.serial,
                    nickname:       this.state.nickname,
                    systemName:     this.state.systemName,
                    purpose:        this.state.purpose,
                    data:           this.state.data
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
            fetch("http://api.rfid-demo.lazyprojects.com/v1/cardReaders/" + this.cardReaderId, {
                method: "put",
                body: JSON.stringify({
                    serial:         this.state.serial,
                    nickname:       this.state.nickname,
                    systemName:     this.state.systemName,
                    purpose:        this.state.purpose,
                    data:           this.state.data,
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
        const { cardReaderId } = this.props.params;
        this.cardReaderId = cardReaderId;

        const { reloadData } = this.props.outletContext;
        this.reloadData = reloadData;

        if (!this.isloading) {
            this.isloading = true;
            if (cardReaderId == 'new') {
                this.loadData('/?codes');
            }
            else {
                this.loadData('/' + cardReaderId);
            }
        }
    }

    loadData(condition) {
        fetch('http://api.rfid-demo.lazyprojects.com/v1/cardReaders' + condition)
            .then((response) => {
                if (response.status == 200) {
                    return response.json()
                }
            })
            .then((data) => {
                if (this.cardReaderId == 'new') {
                    this.setState({ codes: data.codes});
                }
                else {
                    this.setState({
                        codes: data.codes,

                        serial:         data.cardReader.serial,
                        nickname:       data.cardReader.nickname,
                        systemName:     data.cardReader.systemName,
                        purpose:        data.cardReader.purpose,
                        data:           data.cardReader.data,
                        status:         data.cardReader.status
                    });
                }
            });
    }

    render() {
        let submitButtonText = "更新"; 
        let modalTitle = "更新場地資訊"

        if (this.cardReaderId == 'new') {
            submitButtonText = "新增";
            modalTitle = "新增讀卡機";
        }

        return (
            <>
                <Modal size="sm" show={this.props.params.cardReaderId} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{modalTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Container>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>編號</Form.Label>
                                            <InputGroup>
                                                <Form.Control name="serial" value={this.state.serial} onChange={this.handleChange} />
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>暱稱</Form.Label>
                                            <InputGroup>
                                                <Form.Control name="nickname" value={this.state.nickname} onChange={this.handleChange} />
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>識別名稱（限英文）</Form.Label>
                                            <InputGroup>
                                                <Form.Control name="systemName" value={this.state.systemName} onChange={this.handleChange} />
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>用途</Form.Label>
                                            <Form.Select name="purpose" value={this.state.purpose} onChange={this.handleChange} >
                                                <DropDownOptions codes={this.state.codes} name="purpose"/>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>設定內容</Form.Label>
                                            <InputGroup>
                                                <Form.Control name="data" value={this.state.data} onChange={this.handleChange} />
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <hr />
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>狀態</Form.Label>
                                            <Form.Select name="status" value={this.state.status} onChange={this.handleChange} disabled={this.cardReaderId == 'new'} >
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