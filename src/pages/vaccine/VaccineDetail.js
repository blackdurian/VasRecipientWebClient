import {Descriptions, notification, Tag} from "antd";
import React, {Component} from "react";

import {getVaccineById} from "../../util/APIUtils";

//TODO: shouldComponentUpdate()
class VaccineDetail extends Component {

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
            isLoading: false
        }
        this.loadVaccineById = this.loadVaccineById.bind(this);
    }

    loadVaccineById(vaccineId) {
        let promise = getVaccineById(vaccineId)
        console.log(vaccineId)
        this.setState({
            isLoading: true
        });
        promise
            .then(response => {
                console.log(response)
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

    componentDidMount() {
        console.log(this.props.vaccine)
        this.loadVaccineById(this.props.vaccine);
    }

    componentDidUpdate(nextProps) {
        console.log(this.props.vaccine)
        if(this.props.vaccine !== nextProps.vaccine) {
            // Reset State
            this.setState({
                vaccine:null,
                isLoading: false
            });
            this.loadVaccineById(this.props.vaccine);
        }
    }

    render() {
        console.log(this.props.vaccine)
        let diseaseViews = [];
        this.state.vaccine.diseases.forEach((disease, diseaseIndex) => {
            diseaseViews.push(<Tag> {disease.name} </Tag> )
        });
        return(
            <Descriptions style={{marginTop:35}} title="Vaccine Info">
                <Descriptions.Item label="Name">{this.state.vaccine.name}</Descriptions.Item>
                <Descriptions.Item label="Dose Require">{this.state.vaccine.doseRequire}</Descriptions.Item>
                <Descriptions.Item label="Manufacture Company">{this.state.vaccine.mfgCompany}</Descriptions.Item>
                <Descriptions.Item label="Time interval between doses">{this.state.vaccine.gapDays}</Descriptions.Item>
                <Descriptions.Item label="Diseases">
                    {diseaseViews}
                </Descriptions.Item>
            </Descriptions>
        );
    }

}




export default VaccineDetail;