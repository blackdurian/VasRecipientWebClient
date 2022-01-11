import React, { Component } from 'react';
import './App.css';
import {
  Route,
  withRouter,
  Switch
} from 'react-router-dom';

import { getCurrentUser } from '../util/APIUtils';
import { ACCESS_TOKEN } from '../constants';

import NewPoll from '../pages/poll/NewPoll';
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

const { Content } = Layout;

//TODO: #important! upgrade to react 17.0.2 /react 18
//TODO: refactor to react router v6
//TODO: role check
//TODO: real time data refresh
//TODO: refactor to function component and useState/useEffect, when update to latest react
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: true
    }
    this.handleLogout = this.handleLogout.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.handleLogin = this.handleLogin.bind(this);

    notification.config({
      placement: 'topRight',
      top: 70,
      duration: 3,
    });
  }

//TODO: fetch refresh token along with username, move loadCurrentUser to reducer action
  loadCurrentUser() {
    getCurrentUser()
    .then(response => {
      this.setState({
        currentUser: response,
        isAuthenticated: true,
        isLoading: false
      });
    }).catch(error => {
      this.setState({
        isLoading: false
      });
    });
  }

  componentDidMount() {
    this.loadCurrentUser();
  }
//TODO: useDispatch
  handleLogout(redirectTo="/", notificationType="success", description="You're successfully logged out.") {
    localStorage.removeItem(ACCESS_TOKEN);

    this.setState({
      currentUser: null,
      isAuthenticated: false
    });

    this.props.history.push(redirectTo);

    notification[notificationType]({
      message: 'VAS',
      description: description,
    });
  }
//TODO: useAuthState
  handleLogin() {
    notification.success({
      message: 'VAS',
      description: "You're successfully logged in.",
    });
    this.loadCurrentUser();
    this.props.history.push("/");
  }

  render() {
    if(this.state.isLoading) {
      return <LoadingIndicator />
    }

    return (
        <Layout className="app-container">
          <AppHeader isAuthenticated={this.state.isAuthenticated}
            currentUser={this.state.currentUser}
            onLogout={this.handleLogout} />

          <Content className="app-content">
            <div className="container">
              <Switch>
{/*                <Route exact path="/"
                       render={(props) => <PollList isAuthenticated={this.state.isAuthenticated}
                                                    currentUser={this.state.currentUser} {...props} />}
                />*/}
                <Route exact path="/" component={VaccineList}/>
                <Route path="/login"  render={(props) => <Login onLogin={this.handleLogin} {...props} />}/>
                <Route path="/signup" component={Signup}/>
                <Route exact path="/clinic/vaccines/:vaccine"
                       render={(props) => <ClinicList isAuthenticated={this.state.isAuthenticated}
                                                    handleLogout={this.handleLogout} {...props} />}
                />
                <Route path="/users/:username"
                  render={(props) => <Profile isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}
                />
                <PrivateRoute authenticated={this.state.isAuthenticated} path="/poll/new" component={NewPoll} handleLogout={this.handleLogout}/>
                <PrivateRoute
                    authenticated={this.state.isAuthenticated}
                    path="/appointment/new"
                    component={NewPoll}
                    handleLogout={this.handleLogout}
                    currentUser={this.state.currentUser}
                />
                <Route component={NotFound}/>
              </Switch>
            </div>
          </Content>
        </Layout>
    );
  }
}

export default withRouter(App);
