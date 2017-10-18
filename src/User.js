import React, { Component } from 'react';
import { checkStatus, parseJSON } from './Util';

const RADIUS_API_BASE = '/api/radius/v1';

type UserListProps = {};

type UserListState = {
    users: Array<Object>,
};

class UserList extends Component<UserListProps, UserListState> {
    state = {
        users: []
    };
    timerID = null;

    render() {
        if (! this.state.users) { return null; }

        const output = this.state.users.map(user => {
            const info = infoForUser(user);
            return (
                <li key={user.name}>
                    <button class={'user' + info.label} onClick={() => this.updateUser(info.action)}>
                        {user.name}
                    </button>
                </li>
            );
        });

        return (
            <ul>{output}</ul>
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

function fetchUsers() {
    return fetch(RADIUS_API_BASE + '/users/').then(checkStatus)
                                             .then(parseJSON);  // eslint-disable-line indent
}

function infoForUser(user) {
    var action = '';
    var label = '';
    if (user.disabled) {
        action = 'reactivate';
        label = 'Disabled';
    } else {
        action = 'disable';
        label = 'Active';
    }

    return {
        action: RADIUS_API_BASE + '/users/' + user.name + '/' + action,
        label: label
    };
}

export { UserList, infoForUser, RADIUS_API_BASE };
