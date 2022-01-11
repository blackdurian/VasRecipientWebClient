import React, { Component } from 'react';
import {getAllVaccines} from '../../util/APIUtils';

import {Avatar, List, notification} from 'antd';
import { VACCINE_LIST_SIZE} from '../../constants';
import {Link, withRouter} from 'react-router-dom';

class VaccineList extends Component {
    //TODO: q='searchText' , filter="diseaseName"
    constructor(props) {
        super(props);
        this.state = {
            vaccines: [],
            query:"",
            size:VACCINE_LIST_SIZE,
            isLoading: false
        };
        this.loadVaccineList = this.loadVaccineList.bind(this);
    }

    loadVaccineList() {
        let promise = getAllVaccines();

        this.setState({
            isLoading: true
        });

        promise
            .then(response => {
                this.setState({
                    vaccines: response,
                    isLoading: false
                })
            }).catch(error => {
            this.setState({
                isLoading: false
            })
            notification.error({
                message: 'VAS',
                description: error.message || 'Sorry! Unable to load vaccines'
            });
        });

    }

    componentDidMount() {
        this.loadVaccineList();
    }

    componentDidUpdate(nextProps) {
        if(this.props.isAuthenticated !== nextProps.isAuthenticated) {
            // Reset State
            this.setState({
                vaccines: [],
                query:"",
                size:VACCINE_LIST_SIZE,
                isLoading: false
            });
            this.loadVaccineList();
        }
    }
//TODO: link to Disease detail
    showDiseases=(diseases)=>{
        let diseaseViews = [];
        diseases.forEach((disease, diseaseIndex) => {
            diseaseViews.push(<div>
                {disease.name}
            </div>)
        });
        return diseaseViews;
    }

    //TODO:display lowest price
    render() {
        return (
            <List
                itemLayout="vertical"
                size="small"
                pagination={{
                    onChange: page => {
                        console.log(page);
                    },
                    pageSize: VACCINE_LIST_SIZE,
                }}
                dataSource={this.state.vaccines}
                renderItem={item => (
                    <List.Item
                        key={item.id}
                        actions={this.showDiseases(item.diseases)}
                        extra={
                            <img
                                width={172}
                                alt="logo"
                                src={`https://avatars.dicebear.com/api/jdenticon/${item.id}.svg`}
                            />
                        }
                    >
                        <List.Item.Meta
                            avatar={<Avatar src={`https://avatars.dicebear.com/api/jdenticon/${item.id}.svg`} />}
                            title={<Link to={`/clinic/vaccines/${item.id}`}>{item.name}</Link>}
                            description={item.mfgCompany}
                        />
                         <p> Require: {item.doseRequire} dose(s)  </p>
                        <p> Time interval between doses: {item.gapDays||0} day(s)  </p>

                    </List.Item>
                )}
            />
        );
    }
}

export default withRouter(VaccineList);