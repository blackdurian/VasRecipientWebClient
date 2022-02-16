import React, { Component } from 'react';
import './App.css';
import {
  Route,
  withRouter,
  Switch
} from 'react-router-dom';

import { getCurrentUser } from '../util/APIUtils';
import { ACCESS_TOKEN } from '../constants';


import Login from '../pages/user/login/Login';
import Signup from '../pages/user/signup/Signup';
import Profile from '../pages/user/profile/Profile';
import AppHeader from '../common/AppHeader';
import NotFound from '../common/NotFound';
import LoadingIndicator from '../common/LoadingIndicator';
import PrivateRoute from '../common/PrivateRoute';

import { Layout, notification } from 'antd';

import VaccineList from "../pages/vaccine/VaccineList";
import ClinicList from "../pages/clinic/ClinicList";
import {AuthContext} from '../context/AuthContext';

const { Content } = Layout;


//TODO: #important! upgrade to react 17.0.2 /react 18
//TODO: refactor to react router v6
//TODO: role check
//TODO: real time data refresh
//TODO: refactor to function component and useState/useEffect, when update to latest react
class App extends Component {
  constructor(props) {
    super(props);

    notification.config({
      placement: 'topRight',
      top: 70,
      duration: 3,
    });

    //TODO: fetch refresh token along with username, move loadCurrentUser to reducer action
    this.loadCurrentUser = ()=>{
      getCurrentUser()
          .then(response => {
            this.setState({
              auth:{
                authState: true,
                currentUser:response,
              },
              isLoading: false
            });
          }).catch(error => {
        this.setState({
          isLoading: false
        });
      });
    };


    this.handleLogout = (redirectTo="/", notificationType="success", description="You're successfully logged out.") =>{
      localStorage.removeItem(ACCESS_TOKEN);

      this.setState({
        auth:{
          authState: false,
          currentUser:null,
        }
      });

      this.props.history.push(redirectTo);

      notification[notificationType]({
        message: 'VAS',
        description: description,
      });
    };

    //TODO: useAuthState
    this.handleLogin = (redirectTo) =>{
      notification.success({
        message: 'VAS',
        description: "You're successfully logged in.",
      });
      this.loadCurrentUser();
      this.props.history.push(redirectTo);
    }
    this.redirectToLogin = (redirectTo="/login") => {
      this.props.history.push(redirectTo);
    }

    this.state = {
      auth:{
        authState: false,
        currentUser:null,
        handleLogout:this.handleLogout,
        loadCurrentUser:this.loadCurrentUser,
        redirectToLogin:this.redirectToLogin,
      },
      currentUser: null,
      isAuthenticated: false,
      isLoading: true
    }

  }


  componentDidMount() {
    this.loadCurrentUser();
  }

  render() {
    if(this.state.isLoading) {
      return <LoadingIndicator />
    }

    return (
        <Layout className="app-container">
          <AppHeader isAuthenticated={this.state.auth.authState}
            currentUser={this.state.auth.currentUser}
            onLogout={this.handleLogout} />

          <Content className="app-content">
            <div className="container">
              <Switch>

                <AuthContext.Provider value={this.state.auth}>
                  <Route exact path="/" component={VaccineList}/>
                  <Route path="/login"  render={(props) => <Login onLogin={this.handleLogin} {...props} />}/>
                  <Route path="/signup" component={Signup}/>
                  <Route exact path="/clinic/vaccines/:vaccine"
                         render={(props) => <ClinicList auth={this.state.auth}
                                                       {...props} />}
                  />
                  <Route path="/users/:username"
                         render={(props) => <Profile isAuthenticated={this.state.auth.authState} currentUser={this.state.auth.currentUser} {...props}  />}
                  />

                </AuthContext.Provider>
                  <Route component={NotFound}/>
              </Switch>
            </div>
          </Content>
        </Layout>
    );
  }
}

export default withRouter(App);
