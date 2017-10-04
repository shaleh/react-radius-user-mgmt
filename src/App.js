// @flow

import { Component } from 'react';
import './App.css';

const RADIUS_API_BASE = '/api/radius/v1';

type AppProps = {};

class App extends Component<AppProps> {
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

function fetchUsers() {
    fetch(RADIUS_API_BASE + '/users/').then(checkStatus)
                                      .then(parseJSON);  // eslint-disable-line indent
}

type UserListProps = {};

type UserListState = {
    users: Array<Object>,
};

// eslint-disable-next-line no-unused-vars
class UserList extends Component<UserListProps, UserListState> {
    state = {
        users: []
    };
    timerID = null;

    render() {
        if (! this.state.users) { return null; }

        const users = this.state.users.map(user => {
            const action = actionForUser(user);
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
        fetch(action, {
            accept: 'application/json',
            method: 'PUT'
        }).then(checkStatus);
        this.tick();
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            60 * 1000
        );
        this.tick();
    }

    componentWillUnmount() {
        if (this.timerID) {
            clearInterval(this.timerID);
        }
    }

    tick() {
        fetchUsers().then(users => {
            this.setState({
                users: users
            });
        });
    }
}

function actionForUser(user) {
    const action = user.disabled ? 'reactivate' : 'disable';

    return RADIUS_API_BASE + '/users/' + user.name + '/' + action.endpoint;
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    const error = new Error(`HTTP Error ${response.statusText}`);
    console.log(error); // eslint-disable-line no-console
    throw error;
}

function parseJSON(response) {
    return response.json();
}
