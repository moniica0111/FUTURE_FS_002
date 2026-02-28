import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = "./leads.json";

// Read leads
const getLeads = () => {
  if (!fs.existsSync(DATA_FILE)) return [];
  const data = fs.readFileSync(DATA_FILE);
  return JSON.parse(data);
};

// Save leads
const saveLeads = (leads) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(leads, null, 2));
};

// GET all leads
app.get("/api/leads", (req, res) => {
  const leads = getLeads();
  res.json(leads);
});

// CREATE lead
app.post("/api/leads", (req, res) => {
  const leads = getLeads();

  const newLead = {
    id: Date.now().toString(),
    name: req.body.name,
    email: req.body.email,
    company: req.body.company,
    status: "New",
  };

  leads.unshift(newLead);
  saveLeads(leads);

  res.status(201).json(newLead);
});

// UPDATE status
app.put("/api/leads/:id/status", (req, res) => {
  let leads = getLeads();

  leads = leads.map((lead) =>
    String(lead.id) === String(req.params.id)
      ? { ...lead, status: req.body.status }
      : lead
  );

  saveLeads(leads);

  res.json({ message: "Status Updated" });
});

// DELETE lead
app.delete("/api/leads/:id", (req, res) => {
  let leads = getLeads();

  leads = leads.filter(
    (lead) => String(lead.id) !== String(req.params.id)
  );

  saveLeads(leads);

  res.json({ message: "Deleted successfully" });
});

const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});