import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { FaSearch } from 'react-icons/fa';
import { Outlet, useNavigate } from "react-router-dom";
import Table from 'react-bootstrap/Table';
import { getCookie } from '../../common.js';

function ReaderDataInfo (props) {
    switch(props.usage) {
        case 1:
            return props.accessRules[props.data].description;
        default:
            return props.data;
    }
}

function ReaderRow(props) {
    const navigate = useNavigate();

    return (
        <tr onClick={() => navigate("/cardReaders/" + props.data.id)}>
            <td>{props.data.mac_address}</td>
            <td>{props.data.nickname}</td>
            <td>{props.codes.usage[props.data.usage]}</td>
            <td><ReaderDataInfo data={props.data.data} usage={props.data.usage} accessRules={props.accessRules} /></td>
        </tr>
    );
}

function ReaderRows(props){
    if (props.data) {
        return (
            <>
                {
                    props.data.data.map((item, index) => {
                        return <ReaderRow key={index} data={item} codes={props.data.codes} accessRules={props.data.accessRules} />
                    })
                }
            </>
        )
    }

    return false;
}

class Readers extends React.Component {
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
        fetch('http://api.dg.lazyprojects.com/cardReaders', {
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

        return (
            <>
                <br />
                <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <h1 style={{ float: "left" }}>讀卡機管理</h1>
                            <span style={{ height: "8px", width: "16px" }} />
                            <Button variant="outline-secondary" size="sm" onClick={()=>this.props.navigate('/cardReaders/new')}>新增</Button>
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
                                <th>MAC</th>
                                <th>識別名稱</th>
                                <th>用途</th>
                                <th>設定內容</th>
                            </tr>
                        </thead>
                        <tbody>
                            <ReaderRows data={this.state.data} />
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

export default withNavigate(Readers);