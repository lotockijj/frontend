import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';

function TaskEdit() {
    const { taskId } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();

    // Initialize state with location state or empty values
    const [task, setTask] = useState(state?.task || {
        id: taskId,
        title: '',
        description: '',
        status: '',
        account: '' // Make sure this is included if needed
    });

    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Optional: Fetch task if not passed via state
    useEffect(() => {
        if (!state?.task) {
            fetch(`/api/tasks/${taskId}`)
                .then(res => res.json())
                .then(data => setTask(data))
                .catch(err => setError(err.message));
        }
    }, [taskId, state]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            console.log(JSON.stringify(task));
            // Include ALL required fields in payload
            const payload = {
                id: parseInt(task.id, 10), // Make sure to include the ID
                title: task.title,
                description: task.description,
                status: task.status,
                account: { id: parseInt(task.account, 10) } // Include if your backend needs it
            };

            console.log('Sending:', payload); // Verify before sending
            const response = await fetch(`/api/tasks/${task.account}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload) // Send the complete payload
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Update failed');
            }

            navigate(`/account/${task.account}`, {
                state: {
                    message: 'Task updated successfully!',
                    updatedTask: responseData // Use the returned data
                }
            });

        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
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
                        className="d-flex align-items-center" // Added for vertical alignment
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