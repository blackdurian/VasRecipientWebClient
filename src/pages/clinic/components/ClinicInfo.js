import React from "react";

export const ClinicInfo = ({clinic})=>{

    return(
        <div>
            <h3> Clinic </h3>
            <p> Name : {clinic.name}</p>
            <p> Address : {clinic.suite}, {clinic.street}, {clinic.city} {clinic.zipcode}</p>
        </div>
    );
}