import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Input } from 'reactstrap';

function TaskForm() {
    const { accountId } = useParams();
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        description: '',
        status: 'CREATED',
        account: { id: '' }, // Initialize as object
        location: { formattedAddress: '' }
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    // Set accountId after mount
    useEffect(() => {
        if (accountId) {
            setFormData(prev => ({
                ...prev,
                account: { id: accountId }  // Now account is an object with id field
            }));
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

    const handleSearchChange = async (e) => {
        const value = e.target.value;
        setQuery(value);
        setFormData(prev => ({
            ...prev,
            location: { formattedAddress: value }
        }));

        if (value.length > 2) {
            try {
                const res = await fetch(`/cities?address=${value}`);
                const data = await res.json();
                setSuggestions(data); // array of string city names
            } catch (err) {
                setSuggestions([]);
            }
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (city) => {
        setFormData(prev => ({
            ...prev,
            location: { formattedAddress: city }
        }));
        setQuery(city);
        setSuggestions([]);
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
                        value={formData.account.id}
                        onChange={handleChange}
                        disabled // optionally make it read-only
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="locationSearch" className="form-label">Location</label>
                    <Input
                        type="text"
                        name="locationSearch"
                        id="locationSearch"
                        value={formData.location.formattedAddress}
                        onChange={handleSearchChange}
                        placeholder="Start typing city name..."
                        autoComplete="off"
                    />
                    {suggestions.length > 0 && (
                        <ul className="suggestions-list" style={{ border: '1px solid #ccc', borderRadius: 4, marginTop: 2, paddingLeft: 0, listStyle: 'none', maxHeight: 150, overflowY: 'auto', position: 'absolute', background: 'white', zIndex: 10 }}>
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
                </div>
                <button type="submit" className="btn btn-primary">Create task</button>
            </form>
        </div>
    );
}

export default TaskForm;
