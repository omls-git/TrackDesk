import React, { useEffect, useState } from 'react';
import { getClientAssigniesOfRole } from '../services/Common';

const AsyncSelectEditor = ({ value, onUpdate, row }) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const assignies = await getClientAssigniesOfRole(row.project_id, 'de');
        const mapped = Array.isArray(assignies)
          ? assignies.map(a => ({
              value: a.username,
              label: a.username
            }))
          : [];
        setOptions(mapped);
      } catch (error) {
        console.error("Failed to fetch assignies:", error);
        setOptions([]);
      }
    };

    fetchOptions();
  }, [row.project_id]);

  return (
    <select
      className="form-control"
      value={value}
      onChange={(e) => onUpdate(e.target.value)}
    >
      <option value="">Select</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

export default AsyncSelectEditor;
