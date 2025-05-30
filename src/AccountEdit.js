import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';

function AccountEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [account, setAccount] = useState({
        id: '',
        firstName: '',
        lastName: '',
        email: ''
    });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const response = await fetch(`/api/account/${id}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const text = await response.text();
                const data = text ? JSON.parse(text) : {};

                setAccount(data);
            } catch (error) {
                console.error('Failed to parse JSON:', error);
                setError(`Failed to load account data: ${error.message}`);
            }
        };

        fetchAccount();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAccount(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/account/${account.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(account)
            });

            const text = await response.text();
            if (!response.ok) {
                const errorData = text ? JSON.parse(text) : {};
                throw new Error(errorData.message || 'Update failed');
            }

            setError(null);
            // Optionally show success message
        } catch (error) {
            console.error('Update error:', error);
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Edit Account</h2>
            {error && <Alert color="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label for="firstName">First Name</Label>
                    <Input
                        type="text"
                        name="firstName"
                        id="firstName"
                        value={account.firstName}
                        onChange={handleChange}
                    />
                </FormGroup>

                <FormGroup>
                    <Label for="lastName">Last Name</Label>
                    <Input
                        type="text"
                        name="lastName"
                        id="lastName"
                        value={account.lastName}
                        onChange={handleChange}
                    />
                </FormGroup>

                <FormGroup>
                    <Label for="email">Email</Label>
                    <Input
                        type="email"
                        name="email"
                        id="email"
                        value={account.email}
                        onChange={handleChange}
                    />
                </FormGroup>

                <Button
                    color="primary"
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
            </Form>
        </div>
    );
}

export default AccountEdit;