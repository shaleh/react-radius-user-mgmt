// @flow
import React, { Component } from 'react';
import { checkStatus, parseJSON } from './Util';
import './User.css';

const RADIUS_API_BASE = '/api/radius/v1';

type User = {
    disabled: boolean,
    name: string,
}

type UserListProps = {};

type UserListState = {
    frequency: number,
    users: Array<Object>,
};

class UserList extends Component<UserListProps, UserListState> {
    state = {
        frequency: 60 * 1000, // once a minute
        users: []
    };
    timerID = null;  // used for automatic UI updates

    render() {
        if (! (this.state.users && this.state.users.length)) {
            return (
                <div className='noUsers'>No users found</div>
            );
        }

        const output = this.state.users.map(user => {
            const info = infoForUser(user);
            return (
                <li key={user.name}>
                    <button className={'user user' + info.label} onClick={() => this.updateUser(info.action)}>
                        {user.name}
                    </button>
                </li>
            );
        });

        return (
            <ul>{output}</ul>
        );
    }

    updateUser(action: string) {
        fetch(action, {
            accept: 'application/json',
            method: 'PUT'
        }).then(checkStatus);  // there is nothing useful in the response
        this.tick();  // force an update to show the user's new state
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            this.state.frequency
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
    return fetch(RADIUS_API_BASE + '/users/').then(checkStatus) // FIXME: figure out the eslint option
                                             .then(parseJSON);  // eslint-disable-line indent
}

function infoForUser(user: User) {
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

// other than UserList, these are exported for ease of testing
export { UserList, infoForUser, RADIUS_API_BASE };
