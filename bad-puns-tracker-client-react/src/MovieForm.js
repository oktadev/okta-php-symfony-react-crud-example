import React, { Component } from 'react';
import { Button, Form, Message } from 'semantic-ui-react'
import { withAuth } from '@okta/okta-react';

import { API_BASE_URL } from './config'

export default withAuth(class MovieForm extends Component {

    constructor (props) {
        super(props);
        this.state = {
            title: '',
            errorMessage: '',
            error: false,
            isLoading: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({
            title: e.target.value
        })
    }

    async onSubmit(e) {
        e.preventDefault();
        this.setState({
            isLoading: true,
            error: false,
            errorMessage: ''
        });

        const accessToken = await this.props.auth.getAccessToken();
        const response = await fetch(API_BASE_URL + '/movies', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                "title": this.state.title
            })
        });
        const data = await response.json();

        if (data.errors) {
            this.setState({
                isLoading: false,
                error: true,
                errorMessage: data.errors
            });
        } else {
            this.setState({
                title: '',
                isLoading: false,
                error: false,
                errorMessage: ''
            });
            this.props.onAddition(data);
        }
    }

    render() {
        return (
            <Form error={this.state.error} onSubmit={this.onSubmit}>
                <Form.Field error={this.state.error}>
                    <label>Title</label>
                    <input placeholder='enter movie title' value={this.state.title} onChange={this.handleChange}/>
                { this.state.error &&
                <Message
                    error
                    header='Error creating movie'
                    content={this.state.errorMessage}
                />
                }
                </Form.Field>
                <Button type='submit' loading={this.state.isLoading}>Add Movie</Button>
            </Form>
        )
    }
});
