import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { FaSearch } from 'react-icons/fa';
import { Outlet, useNavigate } from "react-router-dom";
import Table from 'react-bootstrap/Table';

function PointRow(props) {
    const navigate = useNavigate();

    return (
        <tr onClick={() => navigate("/points/" + props.data.id)}>
            <td>{props.codes.status[props.data.status]}</td>
            <td>{props.data.attendeeId}</td>
            <td>{props.data.quantity}</td>
            <td>{props.data.description}</td>
            <td>{props.data.created}</td>
        </tr>
    );
}

function PointRows(props){
    if (props.data) {
        return (
            <>
                {
                    props.data.points.map((item, index) => {
                        return <PointRow key={index} data={item} codes={props.data.codes} />
                    })
                }
            </>
        )
    }

    return false;
}

class Points extends React.Component {
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
        fetch('http://api.rfid-demo.lazyprojects.com/v1/points')
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
                            <h1 style={{ float: "left" }}>加扣分記錄</h1>
                            <span style={{ height: "8px", width: "16px" }} />
                            <Button variant="outline-secondary" size="sm" onClick={()=>this.props.navigate('/points/new')}>新增</Button>
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
                                <th>參加者編號</th>
                                <th>點數</th>
                                <th>描述</th>
                                <th>時間</th>
                            </tr>
                        </thead>
                        <tbody>
                            <PointRows data={this.state.data} />
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

export default withNavigate(Points);