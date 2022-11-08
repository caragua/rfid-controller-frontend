import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { FaSearch } from 'react-icons/fa';
import { Outlet, useNavigate } from "react-router-dom";
import Table from 'react-bootstrap/Table';
import { getCookie } from '../../common.js';

function SiteRow(props) {
    const navigate = useNavigate();

    return (
        <tr onClick={() => navigate("/sites/" + props.data.id)}>
            <td>{props.data.name}</td>
            <td>{props.data.location}</td>
        </tr>
    );
}

function SiteRows(props){
    if (props.data) {
        return (
            <>
                {
                    props.data.data.map((item, index) => {
                        return <SiteRow key={index} data={item} codes={props.data.codes} />
                    })
                }
            </>
        )
    }

    return false;
}

class Sites extends React.Component {
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
        fetch('http://api.dg.lazyprojects.com/sites', {
            method: "GET", 
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${getCookie('token')}`,
                'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
            }
        })
        .then((response) => {
            if (response.status == 200) {
                return response.json()
            }
        })
        .then((data) => {
            this.setState({ data: data });
        });
    }

    render() {
        const { navigate } = this.props;

        return (
            <>
                <br />
                <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <h1 style={{ float: "left" }}>場地管理</h1>
                            <span style={{ height: "8px", width: "16px" }} />
                            <Button variant="outline-secondary" size="sm" onClick={()=>this.props.navigate('/sites/new')}>新增</Button>
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
                                <th>名稱</th>
                                <th>位置</th>
                            </tr>
                        </thead>
                        <tbody>
                            <SiteRows data={this.state.data} />
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

export default withNavigate(Sites);