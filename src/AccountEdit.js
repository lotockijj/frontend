import React, { useState, useEffect } from 'react';  // Added React import
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';

// Convert class component to functional component
function AccountEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = React.useState({
    id: '',
    firstName: '',
    lastName: '',
    email: ''
  });
  const [error, setError] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    fetch(`/api/account/${id}`)
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch');
        return response.json();
      })
      .then(data => setAccount(data))
      .catch(error => setError(error.message));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccount(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    fetch(`/api/account/${account.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(account)
    })
    .then(response => {
        if (!response.ok) throw new Error('Update failed');
        // Show success message but stay on same page
        setError(null); // Clear any previous errors
        //alert('Account updated successfully!'); // Or use a toast notification
    })
    .catch(error => {
    setError(error.message);
    })
    .finally(() => {
        setIsSubmitting(false);
    });
  };

  return (
    <div className="container mt-4">
      <h2>Edit Account</h2>
      {error && <Alert color="danger">{error}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        {/* First Name */}
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

        {/* Last Name */}
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

        {/* Email */}
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

        {/* Submit Button */}
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