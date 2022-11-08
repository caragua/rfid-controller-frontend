import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { FaArrowRight } from 'react-icons/fa';
import Details from './Details';

class Registration extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            attendeeId: false
        }

        this.setAttendeeId = this.setAttendeeId.bind(this);
    }

    setAttendeeId(id) {
        this.setState({ attendeeId: id });
    }

    render() {
        return (
            <>
                <br />
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <div>
                        <h1>報到</h1>
                        <br />
                        <Form>
                            <div style={{ display: "flex", alignItems: "top" }}>
                                <div>
                                    <h3>查詢卡片</h3>
                                    <div style={{ border: "1px solid black", borderRadius: ".375rem", padding: "32px" }}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>讀卡機</Form.Label>
                                            <Form.Select>
                                                <option>abc</option>
                                            </Form.Select>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>卡片號碼</Form.Label>
                                            <InputGroup>
                                                <Form.Control placeholder="掃描或輸入卡片號碼" />
                                                <Button variant="outline-secondary" onClick={() => this.setAttendeeId(123)}><FaArrowRight /></Button>
                                            </InputGroup>
                                        </Form.Group>
                                    </div>
                                </div>
                                <div style={{ marginLeft: "32px" }}>
                                    <h3>查詢資料</h3>
                                    <div style={{ border: "1px solid black", borderRadius: ".375rem", padding: "32px" }}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>報名編號</Form.Label>
                                            <InputGroup>
                                                <Form.Control placeholder="輸入報名編號" />
                                                <Button variant="outline-secondary" onClick={() => this.setAttendeeId(123)}><FaArrowRight /></Button>
                                            </InputGroup>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>電子郵件</Form.Label>
                                            <InputGroup>
                                                <Form.Control placeholder="輸入電子郵件" />
                                                <Button variant="outline-secondary" onClick={() => this.setAttendeeId(123)}><FaArrowRight /></Button>
                                            </InputGroup>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>電話號碼</Form.Label>
                                            <InputGroup>
                                                <Form.Control placeholder="輸入電話號碼" />
                                                <Button variant="outline-secondary" onClick={() => this.setAttendeeId(123)}><FaArrowRight /></Button>
                                            </InputGroup>
                                        </Form.Group>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
                <Details
                    attendeeId={this.state.attendeeId}
                    clearAttendeeId={() => this.setAttendeeId(false)}
                />
            </>

        );
    }
}

export default Registration;