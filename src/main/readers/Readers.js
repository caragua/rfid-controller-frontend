import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { FaSearch } from 'react-icons/fa';
import { Outlet, useNavigate } from "react-router-dom";
import Table from 'react-bootstrap/Table';

function ReaderRow(props) {
    const navigate = useNavigate();

    return (
        <tr onClick={() => navigate("/cardReaders/" + props.data.id)}>
            <td>{props.codes.status[props.data.status]}</td>
            <td>{props.data.serial}</td>
            <td>{props.data.nickname}</td>
            <td>{props.data.systemName}</td>
            <td>{props.codes.purpose[props.data.purpose]}</td>
            <td>{props.data.data}</td>
            <td>最後回報時間</td>
        </tr>
    );
}

function ReaderRows(props){
    if (props.data) {
        return (
            <>
                {
                    props.data.cardReaders.map((item, index) => {
                        return <ReaderRow key={index} data={item} codes={props.data.codes} />
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
        fetch('http://api.rfid-demo.lazyprojects.com/v1/cardReaders')
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
                                <th>狀態</th>
                                <th>編號</th>
                                <th>暱稱</th>
                                <th>識別名稱</th>
                                <th>用途</th>
                                <th>設定內容</th>
                                <th>最後回報時間</th>
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