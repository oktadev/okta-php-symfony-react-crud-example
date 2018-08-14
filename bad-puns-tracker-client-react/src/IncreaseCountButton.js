import React, { Component } from 'react';
import { Form, Button } from 'semantic-ui-react'
import { withAuth } from '@okta/okta-react';

import { API_BASE_URL } from './config'

export default withAuth(class IncreaseCountButton extends Component {

    constructor (props) {
        super(props);
        this.state = {
            id: props.movieId,
            isUpdating: false
        }
        this.onSubmit = this.onSubmit.bind(this);
    }

    async onSubmit(e) {
        e.preventDefault();
        this.setState({
            isUpdating: true
        });

        const accessToken = await this.props.auth.getAccessToken();
        const response = await fetch(API_BASE_URL + '/movies/' + this.state.id + '/count', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
        const data = await response.json();

        this.setState({
            isUpdating: false
        });

        if (! data.errors) {
            this.props.onIncrease(data, this.state.id);
        }
    }

    render() {
        return (
            <Form onSubmit={this.onSubmit}>
                <Button type='submit' loading={this.state.isUpdating}>Increase Count</Button>
            </Form>
        )
    }
});
