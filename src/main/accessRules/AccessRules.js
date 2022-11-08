import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { FaSearch } from 'react-icons/fa';
import { Outlet, useNavigate } from "react-router-dom";
import Table from 'react-bootstrap/Table';

function AccessRuleRow(props) {
    const navigate = useNavigate();

    return (
        <tr onClick={() => navigate("/accessRules/" + props.data.id)}>
            <td>{props.codes.status[props.data.status]}</td>
            <td>{props.sites[props.data.siteId]}</td>
            <td>{props.data.description}</td>
            <td>{props.codes.attendeeTypeCheck[props.data.attendeeTypeCheck]}</td>
            <td>{props.codes.ageCheck[props.data.ageCheck]}</td>
            <td>{props.codes.singlePass[props.data.singlePass]}</td>
        </tr>
    );
}

function AccessRuleRows(props){
    if (props.data && props.sites) {
        return (
            <>
                {
                    props.data.accessRules.map((item, index) => {
                        return <AccessRuleRow key={index} data={item} codes={props.data.codes} sites={props.sites} />
                    })
                }
            </>
        )
    }

    return false;
}

class AccessRules extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: null,

            sites: null
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
        fetch('http://api.rfid-demo.lazyprojects.com/v1/accessRules')
        .then((response) => {
            if (response.status == 200) {
                return response.json()
            }
        })
        .then((data) => {
            this.setState({ data: data });
        });

        fetch('http://api.rfid-demo.lazyprojects.com/v1/sites')
        .then((response) => {
            if (response.status == 200) {
                return response.json()
            }
        })
        .then((data) => {
            let sites = {}
            data.sites.map(item => sites[item.id] = `${item.name} (${item.location})`);

            this.setState({
                sites: sites
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
                            <h1 style={{ float: "left" }}>入場控管</h1>
                            <span style={{ height: "8px", width: "16px" }} />
                            <Button variant="outline-secondary" size="sm" onClick={()=>this.props.navigate('/accessRules/new')}>新增</Button>
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
                                <th>管制狀態</th>
                                <th>場地名稱</th>
                                <th>控管原因</th>
                                <th>身份限制</th>
                                <th>年齡限制</th>
                                <th>重複入場</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AccessRuleRows data={this.state.data} sites={this.state.sites}  />
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

export default withNavigate(AccessRules);