import {Descriptions, notification, Tag} from "antd";
import React, {Component} from "react";

import {getVaccineById} from "../../util/APIUtils";

//TODO: fix issue rerender multiple times
export const VaccineDetail =({vaccine})=> {
        console.log(vaccine)
        let diseaseViews = [];
         vaccine.diseases.forEach((disease, diseaseIndex) => {
            diseaseViews.push(<Tag key={diseaseIndex}> {disease.name} </Tag> )
        });
        return(
            <Descriptions  title="Vaccine Info">
                <Descriptions.Item label="Name">{vaccine.name}</Descriptions.Item>
                <Descriptions.Item label="Dose Require">{vaccine.doseRequire}</Descriptions.Item>
                <Descriptions.Item label="Manufacture Company">{vaccine.mfgCompany}</Descriptions.Item>
                <Descriptions.Item label="Time interval between doses">{vaccine.gapDays}</Descriptions.Item>
                <Descriptions.Item label="Diseases">
                    {diseaseViews}
                </Descriptions.Item>
            </Descriptions>
        );
}




