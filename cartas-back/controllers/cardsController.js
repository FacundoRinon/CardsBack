const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Card = require("../models/Card");

// Display a listing of the resource.
async function index(req, res) {
  console.log("Entra a index de cards");
  try {
    console.log("entra al find de Cards");
    const cards = await Card.find();
    return res.json(cards);
  } catch (error) {
    return res.status(500).json({ message: "Error occurred while processing the request" });
  }
}

// Display the specified resource.
async function show(req, res) {}

// Show the form for creating a new resource
async function create(req, res) {}

// Store a newly created resource in storage.
async function store(req, res) {}

// Show the form for editing the specified resource.
async function edit(req, res) {}

// Update the specified resource in storage.
async function update(req, res) {}

// Remove the specified resource from storage.
async function destroy(req, res) {}

// Otros handlers...
// ...

module.exports = {
  index,
  show,
  create,
  store,
  edit,
  update,
  destroy,
};
