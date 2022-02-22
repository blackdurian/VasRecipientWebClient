import {Steps} from "antd";
import React, {Component} from "react";
import NewAppointment from "./NewAppointment";
import moment from "moment";

const { Step } = Steps;

const getNumberWithOrdinal = (i)=> {
    let j = i % 10,
        k = i % 100;
    if (j === 1 && k !== 11) {
        return i + "st";
    }
    if (j === 2 && k !== 12) {
        return i + "nd";
    }
    if (j === 3 && k !== 13) {
        return i + "rd";
    }
    return i + "th";
}

const getStatusStepIndex = (appStatus)=>{
    switch (appStatus){
        case "SCHEDULED":
            return 1;
        case "CANCELLED":
        case "COMPLETED":
        case "DOSE_COMPLETED":
        case "CANCELLED_BY_RECIPIENT":
            return 2;
        case "PENDING":
        case "PROCESSING":
        default:
            return 0;
    }
}

export const AppointmentProgress =(props)=> {
    const {doseNumber,shift,clinic,vaccine,status} =  props.appointment;
    let  finalSteps;
    let newAppModal=<div/>
    switch (status){
        case "SCHEDULED":
            finalSteps=<Step title="Completed" description="This appointment has completed." />
            break;
        case "CANCELLED":
            finalSteps=<Step title="CANCELLED_BY_RECIPIENT" description="This appointment has been cancelled." />
            break;
        case "COMPLETED":
            finalSteps=<Step title="Completed" description="This appointment has completed." />
            break;
        case "DOSE_COMPLETED":
            finalSteps=
                <Step title={ getNumberWithOrdinal(doseNumber) + "Dose Completed" }
                      description={`${ getNumberWithOrdinal(doseNumber)} dose has completed please process to ${ getNumberWithOrdinal(doseNumber+1)} dose`}>
                </Step>
            newAppModal =       <NewAppointment
                clinic={clinic}
                vaccine={vaccine}
                doseNumber={doseNumber+1}
                auth={ props.auth}
            />
            break;
        case "CANCELLED_BY_RECIPIENT":
            finalSteps=<Step title="Cancelled by recipient" description="This appointment has been cancelled by recipient." />
            break;
        case "PENDING":
        case "PROCESSING":
        default:
            finalSteps=<Step title="Completed" description="This appointment has completed." />
            break;
    }
    return(
<div>
    <Steps progressDot current={ getStatusStepIndex(  status)} >
        <Step title="Pending" />
        <Step title="Scheduled" description={ `${ moment(shift.start).format('YYYY/MM/DD HH:mm')} - ${moment(shift.end).format('YYYY/MM/DD HH:mm')}` } />
        {finalSteps}
    </Steps>
    {newAppModal}
</div>


    );

}



  // PENDING,PROCESSING, SCHEDULED, CANCELLED_BY_RECIPIENT, CANCELLED, COMPLETED, DOSE_COMPLETED