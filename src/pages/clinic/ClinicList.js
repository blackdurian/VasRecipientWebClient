import React, { Component } from 'react';
import {getAllClinicsByVaccineId, getVaccineById} from '../../util/APIUtils';

import {Avatar, Card, Descriptions, Divider, Icon, Input, List, notification} from 'antd';
import {CLINIC_LIST_SIZE} from '../../constants';
import {Link, withRouter} from 'react-router-dom';
import {VaccineInfo} from "../vaccine/components/VaccineInfo";
import NewAppointment  from "../appoitment/NewAppointment";


//TODO: shouldComponentUpdate()

class ClinicList extends Component {
    //TODO: q='searchText' , filter="diseaseName"
    //TODO: GeoLocation

    constructor(props) {
        super(props);
        this.state = {
            vaccine: {
                name:"",
                doseRequire:"",
                mfgCompany:"",
                gapDays:"",
                diseases:[]
            },
            clinics: [],
            size:CLINIC_LIST_SIZE,
            isLoading: false
        };
        this.loadClinicsByVaccine = this.loadClinicsByVaccine.bind(this);
        this.loadVaccineById = this.loadVaccineById.bind(this);
    }

    loadVaccineById(vaccineId) {
        let promise = getVaccineById(vaccineId)
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

    loadClinicsByVaccine(vaccineId) {
        let promise = getAllClinicsByVaccineId(vaccineId)

        this.setState({
            isLoading: true
        });

        promise
            .then(response => {
                this.setState({
                    clinics: response,
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
        this.loadClinicsByVaccine(this.props.match.params.vaccine);
        this.loadVaccineById(this.props.match.params.vaccine);
    }


    render() {
  /*      const {text, match: {params}} = this.props;

        const {vaccine} = params;*/
        let clinicView
        if(this.state.clinics.length===0){
            clinicView = <div>Opp, This vaccine is not currently available in clinics </div>
        }
        else{
            clinicView =              <List
                grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 2,
                    md: 4,
                    lg: 4,
                    xl: 6,
                    xxl: 3,
                }}
                pagination={{
                    onChange: page => {
                        console.log(page);
                    },
                    pageSize: this.state.size,
                }}
                dataSource={this.state.clinics}
                renderItem={item => (

                    <List.Item
                        key={item.id}
                    >
                        <Card
                            style={{ width: 300, marginTop: 16 }}
                            actions={[
                                <NewAppointment
                                    clinic={item}
                                    vaccine={this.state.vaccine}
                                    doseNumber={1}
                                    auth={this.props.auth}
                                />,
                            ]}
                        >
                            <Card.Meta
                                avatar={<Avatar src={`https://avatars.dicebear.com/api/initials/${item.name}.svg`} />}
                                title={item.name}
                                description={`RM ${item.vaccinePrice} per dose`}
                            />

                            <p style={{marginTop: 20}}>
                                {item.suite}, {item.street}, {item.city} {item.zipcode}
                            </p>
                            <p>
                                longitude: {item.longitude} | latitude: {item.latitude}
                            </p>
                        </Card>
                    </List.Item>
                )}
            />
        }
        return (
            <React.Fragment>
                <div style={{marginTop:35}} >
                    <VaccineInfo vaccine={this.state.vaccine}/>
                </div>
            <Divider />
                {clinicView}
            </React.Fragment>
        );
    }
}

export default withRouter(ClinicList);