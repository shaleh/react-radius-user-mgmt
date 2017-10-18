// @flow

import React, { Component } from 'react';
import './App.css';
import { UserList } from './User';

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
