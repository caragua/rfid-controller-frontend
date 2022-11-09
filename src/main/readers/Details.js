import React, { Children } from 'react';
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

function ShowDataOption ( props ) {
    if ((!props.exceptFor && props.value == props.target) || (!props.target && props.value != props.exceptFor)) {
        return props.children;
    }
    else {
        return false;
    }
}

class Details extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            codes:          null,
            accessRules:    null,

            mac_address:    '',
            nickname:       '',
            usage:          0,
            data:           '',
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
        let data = new URLSearchParams();
        data.append('mac_address',  this.state.mac_address);
        data.append('nickname',     this.state.nickname);
        data.append('usage',        this.state.usage);
        data.append('data',         this.state.data);

        if (this.cardReaderId == "new"){
            fetch("http://api.dg.lazyprojects.com/cardReaders/", {
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
            fetch(`http://api.dg.lazyprojects.com/cardReaders/${this.cardReaderId}`, {
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
        const { cardReaderId } = this.props.params;
        this.cardReaderId = cardReaderId;

        const { reloadData } = this.props.outletContext;
        this.reloadData = reloadData;

        if (!this.isloading) {
            this.isloading = true;
            if (cardReaderId == 'new') {
                this.loadData('/options');
            }
            else {
                this.loadData('/' + cardReaderId);
            }
        }
    }

    loadData(condition) {
        fetch('http://api.dg.lazyprojects.com/cardReaders' + condition, {method: "GET", headers: {'Authorization': `Bearer ${getCookie('token')}`}})
        .then((response) => {
            if (response.status == 200) {
                return response.json()
            }
        })
        .then((res) => {
            if (this.cardReaderId == 'new') {
                this.setState({ codes: res.codes, accessRules: res.accessRules });
            }
            else {
                if (!res.data.data)
                {
                    res.data.data = '';
                }

                this.setState({
                    codes:          res.codes,
                    accessRules:    res.accessRules,

                    mac_address:    res.data.mac_address,
                    nickname:       res.data.nickname,
                    usage:          res.data.usage,
                    data:           res.data.data,
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
                                            <Form.Label>MAC</Form.Label>
                                            <InputGroup>
                                                <Form.Control name="mac_address" value={this.state.mac_address} onChange={this.handleChange} />
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
                                            <Form.Label>用途</Form.Label>
                                            <Form.Select name="usage" value={this.state.usage} onChange={this.handleChange} >
                                                <DropDownOptions codes={this.state.codes} name="usage"/>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3" >
                                    <Col>
                                        <Form.Group>         
                                            <ShowDataOption value={this.state.usage} exceptFor="1" >
                                                <Form.Label>參數</Form.Label>
                                                <InputGroup>
                                                    <Form.Control name="data" value={this.state.data} onChange={this.handleChange} />
                                                </InputGroup>
                                            </ShowDataOption>   
                                            <ShowDataOption value={this.state.usage} target="1" >                          
                                                <Form.Label>入場規則</Form.Label>
                                                <InputGroup>
                                                    <Form.Select name="data" value={this.state.data} onChange={this.handleChange} >
                                                        <DropDownOptions items={this.state.accessRules} name="description"/>
                                                    </Form.Select>
                                                </InputGroup>
                                            </ShowDataOption>                                     
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