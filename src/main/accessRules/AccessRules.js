import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { FaSearch } from 'react-icons/fa';
import { Outlet, useNavigate } from "react-router-dom";
import Table from 'react-bootstrap/Table';
import { getCookie } from '../../common.js';

function AccessRuleRow(props) {
    const navigate = useNavigate();

    let siteName = '';

    if (props.data.site_id in props.sites){
        siteName = props.sites[props.data.site_id].name;
    }

    let attendeeType = '';

    if (props.data.check_attendee_type in props.codes.attendee_type){
        attendeeType = props.codes.attendee_type[props.data.check_attendee_type];
    }

    return (
        <tr onClick={() => navigate("/accessRules/" + props.data.id)}>
            <td>{siteName}</td>
            <td>{props.data.description}</td>
            <td>{attendeeType}</td>
            <td>{props.codes.check_age[props.data.check_age]}</td>
            <td>{props.codes.single_pass[props.data.single_pass]}</td>
        </tr>
    );
}

function AccessRuleRows(props){
    if (props.data) {
        return (
            <>
                {
                    props.data.data.map((item, index) => {
                        return <AccessRuleRow key={index} data={item} codes={props.data.codes} sites={props.data.sites} />
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
        fetch('http://api.dg.lazyprojects.com/accessRules', {
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