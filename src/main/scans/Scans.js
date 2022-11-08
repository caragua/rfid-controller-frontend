import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { FaSearch } from 'react-icons/fa';
import { Outlet, useNavigate } from "react-router-dom";
import Table from 'react-bootstrap/Table';

function ScanRow(props) {
    const navigate = useNavigate();

    return (
        <tr onClick={() => navigate("/scans/" + props.data.id)}>
            <td>{props.codes.status[props.data.status]}</td>
            <td>{props.cardReaders[props.data.cardReaderId]}</td>
            <td>{props.data.cardUID}</td>
            <td>{props.data.description}</td>
            <td>{props.data.created}</td>
        </tr>
    );
}

function ScanRows(props){
    if (props.data && props.cardReaders) {
        return (
            <>
                {
                    props.data.scans.map((item, index) => {
                        return <ScanRow key={index} data={item} codes={props.data.codes} cardReaders={props.cardReaders} />
                    })
                }
            </>
        )
    }

    return false;
}

class Scans extends React.Component {
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
        fetch('http://api.rfid-demo.lazyprojects.com/v1/scans')
        .then((response) => {
            if (response.status == 200) {
                return response.json()
            }
        })
        .then((data) => {
            this.setState({ data: data });
        });

        fetch('http://api.rfid-demo.lazyprojects.com/v1/cardReaders')
        .then((response) => {
            if (response.status == 200) {
                return response.json()
            }
        })
        .then((data) => {
            let cardReaders = {}
            data.cardReaders.map(item => cardReaders[item.id] = `${item.nickname} (${item.systemName})`);

            this.setState({
                cardReaders: cardReaders
            });
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
                            <h1 style={{ float: "left" }}>感應記錄</h1>
                            <span style={{ height: "8px", width: "16px" }} />
                            <Button variant="outline-secondary" size="sm" onClick={()=>this.props.navigate('/scans/new')}>新增</Button>
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
                                <th>讀卡機</th>
                                <th>卡片號碼</th>
                                <th>描述</th>
                                <th>時間</th>
                            </tr>
                        </thead>
                        <tbody>
                            <ScanRows data={this.state.data} cardReaders={this.state.cardReaders} />
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

export default withNavigate(Scans);