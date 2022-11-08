import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './login.css';
import { getCookie } from '../common.js';

import shajs from 'sha.js';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
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
        data.append('email', this.state.email);
        data.append('password', shajs('sha256').update(this.state.password).digest('hex'));

        fetch("http://api.dg.lazyprojects.com/login/", {
            method: "POST",
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
            },
            body: data
        })            
        .then((response) => {
            if (Math.floor(response.status / 100) == 2) {
                return response.json();
            }
        })
        .then((data) => {            
            console.log(data);
            // document.cookie = "token=" + data.token + "; SameSite=None; "
            document.cookie = `token=${data.token}`;
        });
    }

    render() {
        return (
            <div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div>
                    <h1>登入</h1>

                    <Form style={{ border: "1px solid black", borderRadius: ".375rem", padding: "16px" }}>
                        <Form.Group className="mb-3">
                            <Form.Label>信箱</Form.Label>
                            <Form.Control placeholder="輸入信箱" name="email" value={this.state.email} onChange={this.handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>密碼</Form.Label>
                            <Form.Control type="password" placeholder="輸入密碼" name="password" value={this.state.password} onChange={this.handleChange} />
                        </Form.Group>
                        <div style={{ textAlign: "right" }}>
                            <Button onClick={()=>this.handleSubmit()}>
                                登入
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}

export default Login;