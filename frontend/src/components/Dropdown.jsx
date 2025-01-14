import React from 'react';

const Dropdown = ({ label, data, setSelected, valueKey, labelKey }) => {
  // Ensure that data is an array, otherwise fallback to an empty array
  const options = Array.isArray(data) ? data : [];

  return (
    <div>
      <label>{label}</label>
      <select onChange={(e) => setSelected(e.target.value)} defaultValue="">
        <option value="">Select {label}</option>
        {options.length > 0 ? (
          options.map(item => (
            <option key={item[valueKey]} value={item[valueKey]}>
              {item[labelKey]}
            </option>
          ))
        ) : (
          <option disabled>No {label}s available</option>  // In case there's no data
        )}
      </select>
    </div>
  );
};

export default Dropdown;
