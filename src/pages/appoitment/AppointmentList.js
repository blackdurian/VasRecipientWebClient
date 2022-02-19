import React, { Component } from 'react';
import shortid from 'shortid'

import {
    getCurrentRecipientAppointments,
} from '../../util/APIUtils';

import {Divider, List, notification, Table, Tag} from 'antd';

import {Link, withRouter} from 'react-router-dom';
import {ClinicInfo} from "../clinic/components/ClinicInfo";
import {VaccineInfo} from "../vaccine/components/VaccineInfo";
import {AppointmentProgress} from "./AppointmentProgress";
import ColumnGroup from "antd/es/table/ColumnGroup";
import Column from "antd/es/table/Column";


class AppointmentList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedAppointment:null,
            appointments: [],
            isLoading: false
        };
        this.loadAppointments = this.loadAppointments.bind(this);
    }

    loadAppointments() {
        let promise = getCurrentRecipientAppointments()
        this.setState({
            isLoading: true
        });

        promise
            .then(response => {
                console.log(response[0]);
                console.log(response.length);
                if(response.length>0){
                    this.setState({
                        appointments: response,
                        selectedAppointment:response[0],
                        isLoading: false
                    })
                }
            }).catch(error => {
            this.setState({
                isLoading: false
            })
            notification.error({
                message: 'VAS',
                description: error.message || 'Sorry! Unable to load clinics'
            });
        });
    }

    componentDidMount() {
        this.loadAppointments();
    }

    render() {
        if(this.state.appointments.length===0||this.state.selectedAppointment===null){
            return(<div style={{marginTop:35}}>You have no vaccine appointment record. Please book you vaccination in <Link to="/">Vaccine page</Link> </div>);
        }
        else{
            return (
                <React.Fragment>
                    <Divider>Appointments detail</Divider>
                    <div style={{marginTop:35}} >
                        <ClinicInfo clinic={this.state.selectedAppointment.clinic}/>
                        <VaccineInfo vaccine={this.state.selectedAppointment.vaccine}/>
                        <div style={{marginTop:45}}>
                            <AppointmentProgress appointment={this.state.selectedAppointment} auth={this.props.auth} />
                        </div>

                    </div>
                    <Divider>My Appointments</Divider>
                    <Table dataSource={this.state.appointments}
                           onRow={(record, rowIndex) => {
                               return {
                                   onClick: event => {this.setState({selectedAppointment:record})}, // click row
                               };
                           }}
                          rowKey={((record, index) => (record.id))}
                    >
                            <Column title="Time" dataIndex="shift.start" key="shift.id"  />
                        <ColumnGroup title="Clinic ">
                            <Column title="name" dataIndex="clinic.name" key={shortid.generate()} />
                            <Column title="suite" dataIndex="clinic.suite" key={shortid.generate()} />
                            <Column title="street" dataIndex="clinic.street" key={shortid.generate()} />
                            <Column title="city" dataIndex="clinic.city" key={shortid.generate()} />
                        </ColumnGroup>
                        <ColumnGroup title="Vaccine ">
                            <Column title="Vaccine Name" dataIndex="vaccine.name" key={shortid.generate()} />
                            <Column title="Dose Number" dataIndex="doseNumber" key={shortid.generate()} />
                            <Column
                                title="Tags"
                                dataIndex="vaccine.diseases"
                                key="vaccine.diseases"
                                render={tags => (
                                    <React.Fragment>
                                        {tags.map(tag => (
                                            <Tag color="blue" key={tag.id} title={tag.name}>
                                                {tag.name}
                                            </Tag>
                                        ))}
                                    </React.Fragment>
                                )}
                            />
                        </ColumnGroup>
                    </Table>
                </React.Fragment>
            );
        }

    }
}

export default withRouter(AppointmentList);