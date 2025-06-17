import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';

function TaskEdit() {
    const { taskId } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();

    // Helper to ensure location is always an object with formattedAddress
    const normalizeLocation = (loc) => {
        if (!loc) return { formattedAddress: '' };
        if (typeof loc === 'string') return { formattedAddress: loc };
        if (typeof loc === 'object' && loc.formattedAddress !== undefined) return loc;
        return { formattedAddress: '' };
    };

    // Initialize state with location state or empty values
    const [task, setTask] = useState(() => {
        const initial = state?.task || {
            id: taskId,
            title: '',
            description: '',
            status: '',
            account: '',
            location: { formattedAddress: '' }
        };
        return {
            ...initial,
            location: normalizeLocation(initial.location)
        };
    });

    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    // Optional: Fetch task if not passed via state
    useEffect(() => {
        if (!state?.task) {
            fetch(`/api/tasks/${taskId}`)
                .then(res => res.json())
                .then(data => setTask({
                    ...data,
                    location: normalizeLocation(data.location || data.locationDto)
                }))
                .catch(err => setError(err.message));
        }
    }, [taskId, state]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask(prev => {
            if (name === 'location') {
                return {
                    ...prev,
                    location: { formattedAddress: value }
                };
            }
            return { ...prev, [name]: value };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Prepare payload with location as object
            const payload = {
                id: parseInt(task.id, 10),
                title: task.title,
                description: task.description,
                status: task.status,
                account: { id: parseInt(task.account, 10) },
                location: {
                    formattedAddress: task.location.formattedAddress
                }
            };

            const response = await fetch(`/api/tasks/${task.account}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Update failed');
            }

            navigate(`/account/${task.account}`, {
                state: {
                    message: 'Task updated successfully!',
                    updatedTask: responseData
                }
            });

        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSearchChange = async (e) => {
        const value = e.target.value;
        setQuery(value);
        setTask(prev => ({
            ...prev,
            location: { formattedAddress: value }
        }));

        if (value.length > 2) {
            const res = await fetch(`/cities?address=${value}`);
            const data = await res.json();
            setSuggestions(data); // array of string city names
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (city) => {
        setTask(prev => ({
            ...prev,
            location: { formattedAddress: city }
        }));
        setQuery(city);
        setSuggestions([]);
    };

    return (
        <div className="container mt-4">
            <h2>Edit Task</h2>
            {error && <Alert color="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label>Account</Label>
                    <Input
                        name="account"
                        value={task.account}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Title</Label>
                    <Input
                        name="title"
                        value={task.title}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Description</Label>
                    <Input
                        type="textarea"
                        name="description"
                        value={task.description}
                        onChange={handleChange}
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Status</Label>
                    <Input
                        type="select"
                        name="status"
                        value={task.status}
                        onChange={handleChange}
                        className="d-flex align-items-center"
                    >
                        {['Created', 'Progress', 'Completed'].map((status) => (
                            <option
                                key={status}
                                value={status}
                                className={`text-white ${
                                    status === 'Completed' ? 'bg-success' :
                                        status === 'Progress' ? 'bg-warning' : 'bg-secondary'
                                }`}
                            >
                                {status}
                            </option>
                        ))}
                    </Input>
                </FormGroup>

                <FormGroup>
                    <Label>Location</Label>
                    <Input
                        type="text"
                        name="locationSearch"
                        value={task.locationDto.formattedAddress}
                        onChange={handleSearchChange}
                        placeholder="Start typing city name..."
                    />
                    {suggestions.length > 0 && (
                        <ul className="suggestions-list">
                            {suggestions.map((city, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleSuggestionClick(city)}
                                    style={{ cursor: 'pointer', padding: '5px' }}
                                >
                                    {city}
                                </li>
                            ))}
                        </ul>
                    )}
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

export default TaskEdit;
