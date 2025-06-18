import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import { Link } from 'react-router-dom';

class ClientList extends Component {
    constructor(props) {
        super(props);
        this.state = { accounts: [] };
        this.remove = this.remove.bind(this);
    }

    async remove(id) {
        try {
            await fetch(`/api/account/${id}`, {  // Fixed: Using backticks for template literal
                method: 'DELETE'
            });
            this.setState(prevState => ({
                accounts: prevState.accounts.filter(account => account.id !== id)
            }));
        } catch (error) {
            console.error('Delete error:', error);
        }
    }

    componentDidMount() {
        const token = localStorage.getItem('accessToken'); // or wherever you store your token

        fetch('/api/account', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => this.setState({ accounts: data }))
            .catch(error => {
                console.error('Error fetching accounts:', error);
                // Handle error (e.g., show error message to user)
            });
    }

    render() {
        const { accounts } = this.state;

        return (
            <div>
                <Container fluid>
                    <h2>Accounts</h2>
                    <Table striped>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accounts.map(account => (
                                <tr key={account.id}>
                                    <td>{account.id}</td>
                                    <td>{account.firstName}</td>
                                    <td>{account.lastName}</td>
                                    <td>{account.email}</td>
                                    <td>
                                        <ButtonGroup>
                                            <Button
                                                color="primary"
                                                tag={Link}
                                                to={`/account/${account.id}`}  // Fixed route path
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                color="danger"
                                                onClick={() => this.remove(account.id)}
                                            >
                                                Delete
                                            </Button>
                                        </ButtonGroup>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Container>
                <div><Link to="/register">Register</Link></div>
            </div>
        );
    }
}

export default ClientList;