import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input, Alert, Table } from 'reactstrap';

function AccountEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [account, setAccount] = useState({
        id: '',
        firstName: '',
        lastName: '',
        email: ''
    });
    const [tasks, setTasks] = useState([]); // New state for tasks
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingTasks, setIsLoadingTasks] = useState(false); // New loading state for tasks

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

        const fetchTasks = async () => {
            setIsLoadingTasks(true);
            try {
                const response = await fetch(`/api/tasks/get/${id}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const text = await response.text();
                const data = text ? JSON.parse(text) : [];

                setTasks(data);
            } catch (error) {
                console.error('Failed to fetch tasks:', error);
                setError(`Failed to load tasks: ${error.message}`);
            } finally {
                setIsLoadingTasks(false);
            }
        };

        fetchAccount();
        fetchTasks();
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
            <h2 className="mt-5">Tasks</h2>
            {isLoadingTasks ? (
                <p>Loading tasks...</p>
            ) : (
                <Table striped>
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tasks.length > 0 ? (
                        tasks.map(task => (
                            <tr key={task.id}>
                                <td>{task.title}</td>
                                <td>{task.description}</td>
                                <td>
                                        <span className={`badge ${
                                            task.status === 'Completed' ? 'bg-success' :
                                                task.status === 'Progress' ? 'bg-warning' : 'bg-secondary'
                                        }`}>
                                            {task.status}
                                        </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="text-center">No tasks found</td>
                        </tr>
                    )}
                    </tbody>
                </Table>
            )}
        </div>
    );
}

export default AccountEdit;