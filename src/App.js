import React, { Component } from 'react';
import './App.css';

const RADIUS_API_BASE = '/api/radius/v1'

class App extends Component {
    render() {
        return (
            <div className="App">
                <div className="UserList">
                    <UserList />
                </div>
            </div>
        );
    }
}

export default App;

function fetchUsers(cb) {
    fetch(RADIUS_API_BASE + '/users/').then(checkStatus)
                                      .then(parseJSON)
                                      .then(cb);
}

class UserList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: null
        }
    }

    render() {
        if (! this.state.users) { return null }

        const users = this.state.users.map(user => {
            const action = actionForUser(user)
            const buttonClass = user.disabled ? 'userDisabled' : 'userActive';
            return (
                <li key={user.name}>
                    <button class={buttonClass} onClick={() => this.updateUser(action)}>{user.name}</button>
                </li>
            );
        });

        return (
            <ul>{users}</ul>
        );
    }

    updateUser(action) {
        fetch(action.url, {
            accept: "application/json",
            method: "PUT"
        }).then(checkStatus)
        this.tick()
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            60 * 1000
        );
        this.tick();
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        fetchUsers(users => {
            this.setState({
                users: users
            });
        });
    }
}

function actionForUser(user) {
    if (user.disabled) {
        return {url: RADIUS_API_BASE + '/users/' + user.name + '/reactivate', blurb: 'Enable'}
    }

    return {url: RADIUS_API_BASE + '/users/' + user.name + '/disable', blurb: 'Disable'}
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    const error = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.statusText;
    error.response = response;
    console.log(error); // eslint-disable-line no-console
    throw error;
}

function parseJSON(response) {
    return response.json();
}
