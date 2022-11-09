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

            inscriptionNumber:  '',
            type:               '',
            nickname:           '',
            cardNumber:         '',
        }

        this.attendeeId = 'new';

        this.isloading = false;

        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.loadData = this.loadData.bind(this);
    }

    handleClose() {
        this.props.navigate('/attendees');
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
        data.append('inscription_number',   this.state.inscriptionNumber);
        data.append('nickname',             this.state.nickname);
        data.append('type',                 this.state.type);
        data.append('card_number',          this.state.cardNumber);

        if (this.cardReaderId == "new"){
            fetch("http://api.dg.lazyprojects.com/attendees/", {
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
            fetch("http://api.dg.lazyprojects.com/attendees/" + this.attendeeId, {
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

    loadData(condition) {
        fetch('http://api.dg.lazyprojects.com/attendees' + condition, {method: "GET", headers: {'Authorization': `Bearer ${getCookie('token')}`}})
        .then((response) => {
            if (Math.floor(response.status / 100) == 2) {
                return response.json()
            }
        })
        .then((result) => {
            if (this.accessRuleId == 'new') {
                this.setState({ codes: result.codes });
            }
            else {
                this.setState({
                    codes: result.codes,

                    inscriptionNumber:  result.data.inscription_number,
                    nickname:           result.data.nickname,
                    type:               result.data.type,
                    cardNumber:         result.data.card_number,
                });
            }
        });
    }

    componentDidMount() {
        const { attendeeId } = this.props.params;
        this.attendeeId = attendeeId;

        const { reloadData } = this.props.outletContext;
        this.reloadData = reloadData;

        if (!this.isloading) {
            this.isloading = true;
            if (attendeeId == 'new') {
                this.loadData('/options');
            }
            else {
                this.loadData('/' + attendeeId);
            }
        }
    }

    render() {
        let submitButtonText = "更新"; 
        let modalTitle = "更新參加者資訊"

        if (this.attendeeId == 'new') {
            submitButtonText = "新增";
            modalTitle = "新增參加者";
        }

        return (
            <>
                <Modal size="md" show={this.props.params.attendeeId} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{modalTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Container>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>報名編號</Form.Label>
                                            <Form.Control name="inscriptionNumber" value={this.state.inscriptionNumber} onChange={this.handleChange}  />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>暱稱</Form.Label>
                                            <Form.Control name="nickname" value={this.state.nickname} onChange={this.handleChange}  />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>身份別</Form.Label>
                                            <Form.Select name="type" value={this.state.type} onChange={this.handleChange} >
                                                <DropDownOptions codes={this.state.codes} name="type"/>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>卡片號碼</Form.Label>
                                            <InputGroup >
                                                <Form.Control placeholder="輸入卡片號碼" name="cardNumber" value={this.state.cardNumber} onChange={this.handleChange} />
                                                <Button variant="outline-secondary"><AiOutlineScan /></Button>
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