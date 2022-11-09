import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { FaSearch } from 'react-icons/fa';
import { Outlet, useNavigate } from "react-router-dom";
import Table from 'react-bootstrap/Table';
import { getCookie } from '../../common.js';

function AttendeeRow(props) {
    const navigate = useNavigate();

    return (
        <tr onClick={() => navigate("/attendees/" + props.data.id)}>
            <td>{props.data.inscription_number}</td>
            <td>{props.codes.type[props.data.type]}</td>
            <td>{props.data.nickname}</td>
            <td>{props.data.card_number}</td>
        </tr>
    );
}

function AttendeeRows(props) {
    if (props.data) {
        return (
            <>
                {
                    props.data.data.map((item, index) => {
                        return <AttendeeRow key={index} data={item} codes={props.data.codes} />
                    })
                }
            </>
        )
    }

    return false;
}

class Attendees extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: null
        }

        this.isloading = false;

        this.loadData = this.loadData.bind(this);
    }

    componentDidMount() {
        if (!this.isloading) {
            this.isloading = true;
            this.loadData();
        }
    }

    loadData() {
        fetch('http://api.dg.lazyprojects.com/attendees', {
            method: "GET", 
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${getCookie('token')}`,
                'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
            }
        })
        .then((response) => {
            if (Math.floor(response.status / 100) == 2) {
                return response.json()
            }
        })
        .then((data) => {
            this.setState({ data: data });
        });
    }

    render() {
        const { navigate } = this.props;
        const test = 123456;

        return (
            <>
                <br />
                <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <h1 style={{ float: "left" }}>參加者管理</h1>
                            <span style={{ height: "8px", width: "16px" }} />
                            <Button variant="outline-secondary" size="sm" onClick={()=>this.props.navigate('/attendees/new')}>新增</Button>
                        </div>
                        <div>
                            <InputGroup>
                                <Form.Control placeholder="搜尋" />
                                <Button variant="outline-secondary"><FaSearch /></Button>
                            </InputGroup>
                        </div>
                    </div>
                    <div style={{ clear: "both" }} />
                    <br />
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>編號</th>
                                <th>身份</th>
                                <th>暱稱</th>
                                <th>卡號</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AttendeeRows data={this.state.data} />
                        </tbody>
                    </Table>
                </div>
                <Outlet context={{reloadData: this.loadData}} />
            </>

        );
    }
}

const withNavigate = Component => props => {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
};

export default withNavigate(Attendees);