import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';

import { AiOutlineScan } from 'react-icons/ai';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class Details extends React.Component {
    constructor (props) {
        super(props);

        this.handleClose = this.handleClose.bind(this);
    }

    handleClose () {
        this.props.clearAttendeeId();
    }

    render() {
        return (
            <>
                <Modal size="lg" show={this.props.attendeeId} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>參加者資訊</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Container>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>報名編號</Form.Label>
                                            <Form.Control />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>識別證狀態</Form.Label>
                                            <Form.Select>
                                                <option>未領取</option>
                                                <option>已領取</option>
                                                <option>他人代領</option>
                                                <option>事前寄送</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>身份別</Form.Label>
                                            <Form.Select>
                                                <option>現場報名（一日）</option>
                                                <option>現場報名（二日）</option>
                                                <option>一般參加者</option>
                                                <option>一般贊助者</option>
                                                <option>超級贊助者</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>卡片號碼</Form.Label>
                                            <InputGroup>
                                                <Form.Control placeholder="輸入卡片號碼" />
                                                <Button variant="outline-secondary"><AiOutlineScan /></Button>
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>報名狀態</Form.Label>
                                            <Form.Select>
                                                <option>已報到</option>
                                                <option>未報到</option>
                                                <option>尚未完成</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <hr />
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>姓名</Form.Label>
                                            <Form.Control />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>電話</Form.Label>
                                            <Form.Control />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>身份證末五碼</Form.Label>
                                            <Form.Control />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>信箱</Form.Label>
                                            <Form.Control />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <hr />
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>隊伍選擇</Form.Label>
                                            <Form.Select>
                                                <option>A</option>
                                                <option>B</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Container>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary">
                            確認報到
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>

        );
    }
}

export default Details;