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
            attendeeType: 0,
            nameCardStatus: 0,
            nickname: '',
            realname: '',
            phone: '',
            email: '',
            personalID: '',
            isMinor: 0,
            cardUID: '',
            team: 0,

            status: 1
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
        if (this.attendeeId == "new"){
            fetch("http://api.rfid-demo.lazyprojects.com/v1/attendees/", {
                method: "post",
                body: JSON.stringify({
                    serial:             this.state.serial,
                    attendeeType:       this.state.attendeeType,
                    status:             this.state.status,
                    nameCardStatus:     this.state.nameCardStatus,
                    nickname:           this.state.nickname,
                    realname:           this.state.realname,
                    phone:              this.state.phone,
                    email:              this.state.email,
                    personalID:         this.state.personalID,
                    isMinor:            this.state.isMinor,
                    cardUID:            this.state.cardUID,
                    team:               this.state.team
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
            fetch("http://api.rfid-demo.lazyprojects.com/v1/attendees/" + this.attendeeId, {
                method: "put",
                body: JSON.stringify({
                    serial:             this.state.serial,
                    attendeeType:       this.state.attendeeType,
                    status:             this.state.status,
                    nameCardStatus:     this.state.nameCardStatus,
                    nickname:           this.state.nickname,
                    realname:           this.state.realname,
                    phone:              this.state.phone,
                    email:              this.state.email,
                    personalID:         this.state.personalID,
                    isMinor:            this.state.isMinor,
                    cardUID:            this.state.cardUID,
                    team:               this.state.team,
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

    loadData(condition) {
        fetch('http://api.rfid-demo.lazyprojects.com/v1/attendees' + condition)
            .then((response) => {
                if (response.status == 200) {
                    return response.json()
                }
            })
            .then((data) => {
                if (this.attendeeId == 'new') {
                    this.setState({ codes: data.codes});
                }
                else {
                    this.setState({
                        codes: data.codes,

                        serial:             data.attendee.serial,
                        attendeeType:       data.attendee.attendeeType,
                        status:             data.attendee.status,
                        nameCardStatus:     data.attendee.nameCardStatus,
                        nickname:           data.attendee.nickname,
                        realname:           data.attendee.realname,
                        phone:              data.attendee.phone,
                        email:              data.attendee.email,
                        personalID:         data.attendee.personalID,
                        isMinor:            data.attendee.isMinor,
                        cardUID:            data.attendee.cardUID,
                        team:               data.attendee.team
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
                this.loadData('/?codes');
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
                                            <Form.Control name="serial" value={this.state.serial} onChange={this.handleChange}  />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>識別證狀態</Form.Label>
                                            <Form.Select name="nameCardStatus" value={this.state.nameCardStatus} onChange={this.handleChange} >
                                                <DropDownOptions codes={this.state.codes} name="nameCardStatus"/>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>身份別</Form.Label>
                                            <Form.Select name="attendeeType" value={this.state.attendeeType} onChange={this.handleChange} >
                                                <DropDownOptions codes={this.state.codes} name="attendeeType"/>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>卡片號碼</Form.Label>
                                            <InputGroup >
                                                <Form.Control placeholder="輸入卡片號碼" name="cardUID" value={this.state.cardUID} onChange={this.handleChange} />
                                                <Button variant="outline-secondary"><AiOutlineScan /></Button>
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>報名狀態</Form.Label>
                                            <Form.Select name="status" value={this.state.status} onChange={this.handleChange} >
                                                <DropDownOptions codes={this.state.codes} name="status"/>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>名牌內容</Form.Label>
                                            <Form.Control as="textarea" rows="2" name="nickname" value={this.state.nickname} onChange={this.handleChange}  />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <hr />
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>姓名</Form.Label>
                                            <Form.Control name="realname" value={this.state.realname} onChange={this.handleChange}  />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>電話</Form.Label>
                                            <Form.Control name="phone" value={this.state.phone} onChange={this.handleChange}  />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>身份證末五碼</Form.Label>
                                            <Form.Control name="personalID" value={this.state.personalID} onChange={this.handleChange}  />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>信箱</Form.Label>
                                            <Form.Control name="email" value={this.state.email} onChange={this.handleChange}  />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>年齡</Form.Label>
                                            <Form.Select name="isMinor" value={this.state.isMinor} onChange={this.handleChange} >
                                                <DropDownOptions codes={this.state.codes} name="isMinor"/>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <hr />
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>隊伍選擇</Form.Label>
                                            <Form.Select name="team" value={this.state.team} onChange={this.handleChange} >
                                                <DropDownOptions codes={this.state.codes} name="team"/>
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