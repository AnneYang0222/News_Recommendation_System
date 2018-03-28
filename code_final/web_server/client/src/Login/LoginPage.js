import React from 'react';
import Auth from '../Auth/Auth';
import LoginForm from './LoginForm';
import PropTypes from 'prop-types';

class LoginPage extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            errors: {},
            user: {
                email: '',
                password: ''
            }
        };
    }

    processForm(event) {
        event.preventDefault();

        const email = this.state.user.email;
        const password = this.state.user.password;

        console.log('email:', email);
        console.log('password:', password);

        //TODO: post login data.
        const url = 'http://' + window.location.hostname + ':3000' + '/auth/login';
        const request = new Request(
            url,
            {
                method: 'Post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: this.state.user.email,
                    password: this.state.user.password
                })
            }
        );

        fetch(request).then(response => {
            if (response.status === 200) {
                this.setState({
                    errors: {}
                });
                response.json().then(json => {
                    console.log(json);
                    Auth.authenticateUser(json.token,email);
                    this.context.router.replace('/');
                });
            } else {
                console.log('Login failed');
                response.json().then(json => {
                    const errors = json.errors ? json.errors : {};
                    errors.summary = json.message;
                    this.setState({errors});
                });
            }
        });
    }

    changeUser(event) {
        const field = event.target.name;
        const user = this.state.user;
        user[field] = event.target.value;

        this.setState({user});
    }

    render() {
        return (
            <LoginForm
             onSubmit={(e) => this.processForm(e)}
             onChange={(e) => this.changeUser(e)}
             errors={this.state.errors}
             user={this.state.user}

            />
        );
    }
}

// To make react-router work.
LoginPage.contextTypes = {
    router: PropTypes.object.isRequired
};

export default LoginPage;