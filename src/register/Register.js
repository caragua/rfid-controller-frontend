import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './register.css';
import { getCookie } from '../common.js';

import shajs from 'sha.js';

class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            email: '',
            password: '',
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
        data.append('name', this.state.name);
        data.append('email', this.state.email);
        data.append('password', shajs('sha256').update(this.state.password).digest('hex'));

        fetch("http://api.dg.lazyprojects.com/register/", {
            method: "POST",
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
            },
            body: data
        })             
        .then((response) => {
            if (response.status == 200) {
            }
        });
    }

    render() {
        return (
            <div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div>
                    <h1>註冊</h1>

                    <Form style={{ border: "1px solid black", borderRadius: ".375rem", padding: "16px" }}>
                        <Form.Group className="mb-3">
                            <Form.Label>帳號</Form.Label>
                            <Form.Control placeholder="輸入帳號" name="name" value={this.state.name} onChange={this.handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>信箱
                            </Form.Label>
                            <Form.Control placeholder="輸入信箱" name="email" value={this.state.email} onChange={this.handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>密碼</Form.Label>
                            <Form.Control type="password" placeholder="輸入密碼" name="password" value={this.state.password} onChange={this.handleChange} />
                        </Form.Group>
                        <div style={{ textAlign: "right" }}>
                            <Button onClick={()=>this.handleSubmit()}>
                                註冊
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}

export default Register;