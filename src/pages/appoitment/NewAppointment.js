import React, { Component } from 'react';
import {createAppointment, createShiftOptions} from '../../util/APIUtils';

import {Form, Input, Button, Select, Modal, notification} from 'antd';


import {VaccineInfo} from "../vaccine/components/VaccineInfo";
import {ClinicInfo} from "../clinic/components/ClinicInfo";
import {Route} from "react-router-dom";


const Option = Select.Option;

let DateOptions = []; //['12-12-2021',]
let TimeOptions = {}; //  times:{ 12-12-2021: [{id:1, start:'12:30', end:'13:30'}, {id:2, start:'14:30', end:'15:30'} ]}



class NewAppointmentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shiftTimes:[],
            selectedShiftId:null,
        };

        this.handleDateChange = value => {
            this.setState({
                shiftTimes: TimeOptions[value],
                selectedShiftId: TimeOptions[value][0].id,
            });
        };

        this.onTimeChange = shiftId => {
            this.setState({
                selectedShiftId:shiftId,
            });

        };

    }
    componentDidMount() {
        if(DateOptions.length>0&&TimeOptions){
            this.setState({
                shiftTimes:TimeOptions[DateOptions[0]],
                selectedShift:TimeOptions[DateOptions[0]][0].id,

            })
        }
    }
//todo: fixt <VaccineInfo> rerender
    render() {
        const {recipient, clinic, vaccine, doseNumber, visible, onCancel, onCreate, form} = this.props;
        const {shiftTimes} = this.state;
        const {getFieldDecorator} = form;
        return (
            <Modal
                visible={visible}
                title="Create a new Appointment"
                okText="Create"
                onCancel={onCancel}
                onOk={onCreate}
            >
                <ClinicInfo clinic={clinic}/>
                <VaccineInfo vaccine={vaccine}/>
                <div>
                    <p><strong> Dose Number </strong> : {doseNumber}</p>
                </div>

                <Form layout="vertical">


                    <Form.Item label="Timeslot">
                        <Select
                            defaultValue={DateOptions[0]}
                            style={{width: 120}}
                            onChange={this.handleDateChange}
                        >
                            {DateOptions.map(date => (
                                <Option key={date}>{date}</Option>
                            ))}
                        </Select>
                        {getFieldDecorator('shiftId', {
                            rules: [{required: true, message: 'Please select a timeslot.'}],
                            initialValue: this.state.selectedShiftId
                        })(
                            <Select
                                style={{width: 180}}
                                onChange={this.onTimeChange}
                            >
                                {shiftTimes.map(shift => (
                                    <Option key={shift.id} value={shift.id}>{shift.start} - {shift.end}</Option>
                                ))}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item >
                        {getFieldDecorator('remark', {
                            initialValue:""
                        })(<Input type="hidden"/>)}
                    </Form.Item>
                    <Form.Item  >
                        {getFieldDecorator('recipient', {
                            initialValue: recipient
                        })(<Input type="hidden"/>)}
                    </Form.Item>
                    <Form.Item  >
                        {getFieldDecorator('clinicId', {
                            initialValue: clinic.id
                        })(<Input type="hidden"/>)}
                    </Form.Item>
                    <Form.Item  >
                        {getFieldDecorator('doseNumber', {
                            initialValue: doseNumber
                        })(<Input type="hidden"/>)}
                    </Form.Item>
                    <Form.Item  >
                        {getFieldDecorator('vaccineId', {
                            initialValue: vaccine.id
                        })(<Input type="hidden"/>)}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

class NewAppointment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text:"Make an appointment",
            disabled:true,
            visible: false,
            isLoading: false,
            recipient:"",
        };

        this.handleCancel = () => {
            this.setState({
                visible: false,
            });

        };


        this.saveFormRef = formRef => {
            this.formRef = formRef;
        };

        this.showModal =  this.showModal.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.loadShiftOptions = this.loadShiftOptions.bind(this);

    }

    loadShiftOptions(clinicId){
        let promise = createShiftOptions(clinicId);
        this.setState({
            isLoading: true
        });
        promise
            .then(response=> {
                if(Object.keys(response).length>0){
                    DateOptions = [...Object.keys(response)];
                    TimeOptions = response;
                    this.setState({
                        text:"Make an appointment",
                        disabled:false,
                        isLoading: false,
                    })
                }else {
                    this.setState({
                        text:"No available timeslot",
                        disabled:true,
                        isLoading: false,
                    })
                }

            })
    }

    handleCreate = ( ) => {

        //TODO: useRef()
        const { form } = this.formRef.props;
        form.validateFields((err, values) => {

            console.log(values)
            if (err) {
                return;
            }
            this.setState({loading: true})
                 createAppointment(values)
                     .then(response => {
                             //todo:redirect to Appointment list, useHistory(); react 17
                         document.location.href="/appointments";
                              console.log(response)

                         }
                     ).catch(error => {
                     if(error.status === 401) {
                         this.props.auth.redirectToLogin();
                     } else {
                         notification.error({
                             message: 'VAS',
                             description: error.message || 'Sorry! Something went wrong. Please try again!'
                         });
                     }
                 });


                 form.resetFields();
                 this.setState({ loading: false, visible: false });



        });
    };



    showModal = () => {
        if(this.props.auth.authState){
            this.setState({
                visible: true
            });
        }else {
            //todo upgrade react router v6
       console.log( this.props.auth.authState )
            this.props.auth.redirectToLogin();
        }

    };



    componentDidMount() {
        if(this.props.auth.authState){
            this.setState(
                {
                    recipient:this.props.auth.currentUser.username
                }
            );
        }

        this.loadShiftOptions(this.props.clinic.id)
    }


    render() {
        const {  clinic, vaccine, doseNumber } = this.props;
        const { recipient } = this.state;
        const NewAppointmentFormWrapper =  Form.create({ name: 'NewAppointmentForm' })(NewAppointmentForm);
        return (
            <Route render={({ history}) => (
            <div>
                <Button loading={this.state.loading} disabled={this.state.disabled} onClick={this.showModal}>
                    {this.state.text}
                </Button>

                <NewAppointmentFormWrapper
                    wrappedComponentRef={this.saveFormRef}
                    recipient={recipient}
                    clinic ={clinic}
                    vaccine={vaccine}
                    doseNumber={doseNumber}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                />
            </div>
            )} />
        );
    }
}



export default NewAppointment;