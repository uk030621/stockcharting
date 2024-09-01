/* eslint-disable react/no-unescaped-entities */

"use client";

import { useEffect, useState } from 'react';
import BarChart from '../components/BarChart';

export default function Home() {
  const [data, setData] = useState([]);
  const [date, setDate] = useState('');
  const [value, setValue] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/statistics');
      const result = await res.json();
      setData(result.data);
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Convert the date to ISO 8601 format (YYYY-MM-DD)
  const formattedDate = new Date(date).toISOString().split('T')[0];

  const newData = {
    date: formattedDate,
    value: parseFloat(value), // Convert value to a number
  };

  if (editId) {
    // Updating existing data
    const res = await fetch('/api/statistics', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: editId, ...newData }),
    });

    if (res.ok) {
      const updatedData = await res.json();
      setData(updatedData.data);
      setEditId(null); // Reset editId to null
      setDate(''); // Clear the date field
      setValue(''); // Clear the value field
    } else {
      console.error('Failed to update data');
    }
  } else {
    // Adding new data
    const res = await fetch('/api/statistics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData),
    });

    if (res.ok) {
      const updatedData = await res.json();
      setData(updatedData.data);
      setDate('');
      setValue('');
    } else {
      console.error('Failed to add data');
    }
  }
};


const handleBarClick = (index) => {
  const selectedData = data[index];
  if (selectedData) {
    console.log("Selected Data:", selectedData);  // Debugging line

    // Ask for confirmation to delete the entry
    const shouldDelete = confirm(`Do you want to delete the entry from ${selectedData.date}?`);
    if (shouldDelete) {
      handleDelete(selectedData._id);
    }
  }
};

  
  
  const handleDelete = async (id) => {
    try {
      const response = await fetch('/api/statistics', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error:', errorData.error);
      } else {
        const data = await response.json();
        console.log('Success:', data.message);
  
        // Refresh the page to reflect changes
        window.location.reload();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  return (
    <div>
      <a className='hyperlink1' href="https://fetchstockftse1.vercel.app/" onClick="window.close()" rel="noopener noreferrer"style={{ color: 'black' }}>Stock Portfolio Data</a>
    
      <h1 className='heading'>FTSE Stock: <span className='advisor'>Personal <span className='advisor-type'>Stock Portfolio</span> Tracking</span></h1>
      <p className='sub-heading'>Update Weekly...</p>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          alignItems: 'flex-end', // Align items at the bottom of the container
          gap: '10px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column'}}> 
          <label className='date'>Date:</label>
          <input style={{padding: '8px 10px'}}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label className='value'>Value:</label>
          <input style={{padding: '9px 10px'}}
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
        </div>
        <button className='add-button' type="submit">{editId ? 'Update Data' : 'Add Data'}</button>     
      </form>

      <p className='delete-option'>Note: Click on a 'bar' to receive a delete option.</p>
      
      {data.length > 0 ? <BarChart data={data} onBarClick={handleBarClick} /> : <p>Loading...</p>}
    </div>
  );
}
