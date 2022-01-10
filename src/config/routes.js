import {Login} from "../pages/user/login/Login";
import {ClinicList} from "../pages/clinic/ClinicList";
import {NotFound} from "../pages/error/NotFound";

const routes = [
    {
        path: '/login',
        component: Login,
        isPrivate: false,
    },
    {
        path: '/',
        component: ClinicList,
        isPrivate: false,
    },
    {
        path: '*',
        component: NotFound,
        isPrivate: true,
    },
];

export default routes;