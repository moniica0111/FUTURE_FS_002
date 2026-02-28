import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5001/api/leads";

function App() {
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
  });

  // Fetch leads
  const fetchLeads = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setLeads(data);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Add lead
  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({ name: "", email: "", company: "" });
    fetchLeads();
  };

  // Update status
  const updateStatus = async (id, status) => {
    await fetch(`${API}/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    fetchLeads();
  };

  // Delete lead
  const deleteLead = async (id) => {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });

    fetchLeads();
  };

  return (
    <div className="container">
      <h1 className="title">Mini CRM Dashboard</h1>

      <form className="form" onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          placeholder="Company"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          required
        />
        <button>Add Lead</button>
      </form>

      <div className="table">
        {leads.map((lead) => (
          <div key={lead.id} className="lead-card">
            <div>
              <h3>{lead.name}</h3>
              <p>{lead.email}</p>
              <p>{lead.company}</p>
              <p>Status: <b>{lead.status}</b></p>
            </div>

            <div className="actions">
              <select
                value={lead.status}
                onChange={(e) =>
                  updateStatus(lead.id, e.target.value)
                }
              >
                <option>New</option>
                <option>Contacted</option>
                <option>Converted</option>
              </select>

              <button
                className="delete"
                onClick={() => deleteLead(lead.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;