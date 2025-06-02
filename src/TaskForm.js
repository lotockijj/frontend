import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function TaskForm() {
    const { accountId } = useParams();
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        description: '',
        status: 'CREATED',
        account: '' // initialize as empty
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Set accountId after mount
    useEffect(() => {
        if (accountId) {
            setFormData(prev => ({ ...prev, account: accountId }));
        }
    }, [accountId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.title) newErrors.title = 'Title is required';
        if (!formData.description) newErrors.description = 'Description is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Task creation failed.');
            }

            const task = await response.json();
            navigate(`/account/${task.account}`);
        } catch (error) {
            setErrors({ submit: error.message });
        }
    };

    return (
        <div className="container mt-4">
            <h1>Task creation form</h1>
            {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input
                        type="text"
                        className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                    />
                    {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="account" className="form-label">Account</label>
                    <input
                        type="text"
                        className="form-control"
                        id="account"
                        name="account"
                        value={formData.account}
                        onChange={handleChange}
                        disabled // optionally make it read-only
                    />
                </div>

                <button type="submit" className="btn btn-primary">Create task</button>
            </form>
        </div>
    );
}

export default TaskForm;
