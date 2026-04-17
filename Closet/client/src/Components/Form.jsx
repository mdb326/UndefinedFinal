import React, { useState } from "react";

export default function Form() {
  const [formData, setFormData] = useState({
    companyName: "",
    positionTitle: "",
    status: "",
    notes: "",
    dateApplied: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    //do api request
    e.preventDefault();
    fetch('http://localhost:3000/application', {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
        },
      body: JSON.stringify({
          "companyName": formData.companyName,
          "positionTitle": formData.positionTitle,
          "status": formData.status,
          "notes": formData.notes,
          "dateApplied": formData.dateApplied
      })
  }).then(res => res.text())
  .then(data => console.log(data))
  //need to clear
};

  return (
    <div>
      <form id="appForm" onSubmit={handleSubmit}>
        <h2>Contact Form</h2>

        <label>Company Name</label>
        <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required/>

        <label>Position Title</label>
        <input type="text" name="positionTitle" value={formData.positionTitle} onChange={handleChange} required/>

        <label>Status</label>
        <select name="status" value={formData.status} onChange={handleChange} required>
          <option value="">Select status</option>
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
        </select>

        <label>Notes</label>
        <input type="text" name="notes" value={formData.notes} onChange={handleChange}/>

        <label>Date Applied</label>
        <input type="date" name="dateApplied" value={formData.dateApplied} onChange={handleChange} required/>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
