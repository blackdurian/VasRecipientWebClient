import { API_BASE_URL, ACCESS_TOKEN } from '../constants';
//TODO: context provider/ reducer hook
//TODO: refactor to axios
const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })
    
    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
    .then(response => 
        response.json().then(json => {
            if(!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );
};

export function getVaccineById(id) {
    return request({
        url: API_BASE_URL + "/vaccines/"+id ,
        method: 'GET'
    });
}

export function getAllVaccines() {
    return request({
        url: API_BASE_URL + "/vaccines" ,
        method: 'GET'
    });
}

export function getAllClinicsByVaccineId(vaccineId) {
    return request({
        url: API_BASE_URL + "/clinic/vaccines?id="+vaccineId ,
        method: 'GET'
    });
}

export function createAppointment(AppointmentData) {
    return request({
        url: API_BASE_URL + "/appointments",
        method: 'POST',
        body: JSON.stringify(AppointmentData)
    });
}

export function getCurrentRecipientAppointments(){
    return request({
        url: API_BASE_URL + "/appointments/recipient",
        method: 'GET'
    });
}

export function getAppointmentById(id){
    return request({
        url: API_BASE_URL + "/appointments/" + id,
        method: 'GET'
    });
}


export function createShiftOptions(clinicId) {
    return request({
        url: API_BASE_URL + "/shift/available/options?clinic="+clinicId ,
        method: 'GET'
    });
}



export function login(loginRequest) {
    //TODO: decode password
    return request({
        url: API_BASE_URL + "/auth/login",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}
//TODO
export function checkUsernameAvailability(username) {
    return request({
        url: API_BASE_URL + "/user/checkUsernameAvailability?username=" + username,
        method: 'GET'
    });
}
//TODO
export function checkEmailAvailability(email) {
    return request({
        url: API_BASE_URL + "/user/checkEmailAvailability?email=" + email,
        method: 'GET'
    });
}


export function getCurrentUser() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/user/me",
        method: 'GET'
    });
}

export function getUserProfile(username) {
    return request({
        url: API_BASE_URL + "/profile/" + username,
        method: 'GET'
    });
}


