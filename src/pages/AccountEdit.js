import React, { useState, useEffect } from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom';
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
    const user = {
        name: 'Hedy Lamarr',
        imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
        imageSize: 90,
    };
    const products = [
// ...
    ];
    const listItems = products.map(product =>
        <li key={product.id}
            style={{
                color: product.isFruit ? 'magenta' : 'darkgreen'
            }}>
            {product.title}
            ({product.color})
        </li>
    );
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setError('No access token found. Please log in again.');
            return;
        }
        const fetchAccount = async () => {
            try {
                const response = await fetch(`/api/account/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

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
                const response = await fetch(`/api/tasks/get/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

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
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setError('No access token found. Please log in again.');
            setIsSubmitting(false);
            return;
        }
        try {
            const response = await fetch(`/api/account/${account.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
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

    const handleEditTasks = async (taskId) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setError('No access token found. Please log in again.');
            return;
        }
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const taskData = await response.json();

            navigate(`/tasks/${taskId}/edit`, {
                state: { task: taskData } // Pass the entire task object
            });
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
        }
    };

    const handleTaskDelete = async (taskId) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setError('No access token found. Please log in again.');
            return;
        }
        try {
            await fetch(`/api/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setTasks(tasks.filter(task => task.id !== taskId));
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
        }
    };

    const [count, setCount] = useState(0);
    function handleClick() {
        setCount(count + 1);
    }
    return (
        <div className="container mt-4">
            {(account?.roles || []).includes('ADMIN') && (
                <h3><Link to="/">Admin console</Link></h3>
            )}
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
                        <th>id</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Location</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tasks.length > 0 ? (
                        tasks.map(task => (
                            <tr key={task.id}>
                                <td>{task.id}</td>
                                <td>{task.title}</td>
                                <td>{task.description}</td>
                                <th>{task.locationDto?.formattedAddress || ''}</th>
                                <td>
                                        <span className={`badge ${
                                            task.status === 'Completed' ? 'bg-success' :
                                                task.status === 'Progress' ? 'bg-warning' : 'bg-secondary'
                                        }`}>
                                            {task.status}
                                        </span>
                                </td>
                                <td>
                                    <Button
                                        color="primary"
                                        //tag={Link}
                                        //to={`/api/tasks/${account.id}`}  // Fixed route path
                                        onClick={() => handleEditTasks(task.id)} // Use onClick instead of Link
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        color="danger"
                                        //tag={Link}
                                        //to={`/api/tasks/${account.id}`}  // Fixed route path
                                        onClick={() => handleTaskDelete(task.id)} // Use onClick instead of Link
                                    >
                                        Delete
                                    </Button>
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
            <div><Link to={`/task/new/${account.id}`}>Create a task</Link></div>
            <h1>{user.name}</h1>
            <img
                className="avatar"
                src={user.imageUrl}
                alt={'Photo of ' + user.name}
                style={{
                    width: user.imageSize,
                    height: user.imageSize
                }}
            />
            <ul>{listItems}</ul>
            <button onClick={handleClick}>
                Clicked {count} times
            </button>--
            <button onClick={handleClick}>
                Clicked {count} times
            </button>

            <div>
                <h1>Counters that update separately</h1>
                <MyButton />--
                <MyButton />
            </div>
        </div>
    );
}

function MyButton() {
    const [counter, setCount] = useState(0);

    function handleClick() {
        setCount(counter + 1);
    }

    return (
        <button onClick={handleClick}>
            Clicked {counter} times
        </button>
    );
}
export default AccountEdit;
