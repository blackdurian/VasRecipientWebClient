import React, { Component } from 'react';
import {getAllClinicsByVaccineId, getAppointmentById, getVaccineById} from '../../util/APIUtils';

import {Avatar, Card, Descriptions, Divider, Icon, Input, List, notification} from 'antd';
import {APPOINTMENT_LIST_SIZE, CLINIC_LIST_SIZE} from '../../constants';
import {withRouter} from 'react-router-dom';
import {VaccineDetail} from "../vaccine/VaccineDetail";



class AppointmentList extends Component {
    //TODO: q='searchText' , filter="diseaseName"
    //TODO: GeoLocation

    constructor(props) {
        super(props);
        this.state = {
            selectedAppointment:{},
            appointments: [],
            size:APPOINTMENT_LIST_SIZE,
            isLoading: false
        };
        this.loadAppointments = this.loadAppointments.bind(this);
        this.loadAppointmentById = this.loadAppointmentById.bind(this);
    }

    loadAppointmentById(appointmentId) {
        let promise = getAppointmentById(appointmentId)
        this.setState({
            isLoading: true
        });
        promise
            .then(response => {
                this.setState({
                    vaccine: response,
                    isLoading: false
                })
            }).catch(error => {
            this.setState({
                isLoading: false
            })
            notification.error({
                message: 'VAS',
                description: error.message || 'Sorry! Unable to load Vaccine'
            });
        });
    }

    loadAppointments(recipient) {
        let promise = getAllAppointmentsByRecipient(recipient)

        this.setState({
            isLoading: true
        });

        promise
            .then(response => {
                this.setState({
                    appointments: response,
                    isLoading: false
                })
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
        this.loadAppointments(this.props.match.params.vaccine);
        this.loadAppointmentById(this.props.match.params.vaccine);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    render() {
        /*      const {text, match: {params}} = this.props;

              const {vaccine} = params;*/
        let appointmentView
        if(this.state.clinics.length===0){
            appointmentView = <div>You have no vaccine appointment record. Please book you vaccination in <a href="https://ant.design">vaccine page</a>} </div>
        }
        else{
            appointmentView =
                <List
                    itemLayout="horizontal"
                    dataSource={this.state.appointments}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                title={<a href="https://ant.design">{item.title}</a>}
                                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                            />
                        </List.Item>
                    )}
            />
        }
        return (
            <React.Fragment>
                <div style={{marginTop:35}} >
                    <VaccineDetail  vaccine={this.state.vaccine}/>
                </div>
                <Divider />
                {appointmentView}
            </React.Fragment>
        );
    }
}

export default withRouter(AppointmentList);