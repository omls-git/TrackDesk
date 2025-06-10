// src/components/EmployeePermissionModal.js
import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Important for accessibility

export default function EmployeePermissionModal({ isOpen, onRequestClose }) {
  const [formData, setFormData] = useState({
    employee: '',
    client: '',
    level: '',
    permission: '',
  });

  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '14px',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#333',
  };

  const buttonStyle = {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '14px',
    cursor: 'pointer',
  };

  const saveButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#4CAF50',
    color: 'white',
  };

  const cancelButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#f44336',
    color: 'white',
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log('Form Submitted:', formData);
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Employee Permission Modal"
      style={{
        content: {
          maxWidth: '400px',
          margin: 'auto',
          padding: '20px',
          border: '1px solid #333',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          backgroundColor: '#f9f9f9',
        },
      }}
    >
      <h3 style={{ textAlign: 'center', color: '#4CAF50', marginBottom: '20px' }}>
        Employee Permissions
      </h3>

      <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
        <label style={{ ...labelStyle, marginRight: '10px', flex: '0 0 30%' }}>
          Select Employee
        </label>
        <input
          type="text"
          name="employee"
          value={formData.employee}
          onChange={handleChange}
          style={{ ...inputStyle, flex: '1' }}
          placeholder="Enter employee name"
        />
      </div>

      <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
        <label style={{ ...labelStyle, marginRight: '10px', flex: '0 0 30%' }}>
          Client
        </label>
        <input
          type="text"
          name="client"
          value={formData.client}
          onChange={handleChange}
          style={{ ...inputStyle, flex: '1' }}
          placeholder="Enter client name"
        />
      </div>

      <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
        <label style={{ ...labelStyle, marginRight: '10px', flex: '0 0 30%' }}>
          Level
        </label>
        <input
          type="text"
          name="level"
          value={formData.level}
          onChange={handleChange}
          style={{ ...inputStyle, flex: '1' }}
          placeholder="Enter level"
        />
      </div>

      <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
        <label style={{ ...labelStyle, marginRight: '10px', flex: '0 0 30%' }}>
          Permission
        </label>
        <select
          name="permission"
          value={formData.permission}
          onChange={handleChange}
          style={{
            ...inputStyle,
            padding: '10px',
            backgroundColor: '#fff',
            cursor: 'pointer',
            flex: '1',
          }}
        >
          <option value="">Select</option>
          <option value="Read">Read</option>
          <option value="Write">Write</option>
          <option value="Admin">Admin</option>
        </select>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          onClick={handleSubmit}
          style={{
            ...saveButtonStyle,
            marginRight: '10px',
            padding: '10px 20px',
          }}
        >
          Save
        </button>
        <button
          onClick={onRequestClose}
          style={{
            ...cancelButtonStyle,
            padding: '10px 20px',
          }}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}
