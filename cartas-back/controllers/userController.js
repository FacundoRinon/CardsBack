const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { isEmail } = require("validator");

async function login(req, res) {
  console.log(req.body);
  const isEmailImput = isEmail(req.body.username);

  let user;

  if (isEmailImput) {
    user = await User.findOne({ email: req.body.username })
      .populate("team")
      .populate("unlockedCards");
  } else {
    user = await User.findOne({ username: req.body.username })
      .populate("team")
      .populate("unlockedCards");
  }
  if (!user) {
    return res.json("Credenciales invalidas 1");
  } else if (!(await bcrypt.compare(req.body.password, user.password))) {
    return res.json("Credenciales invalidas 2");
  } else {
    const token = jwt.sign({ id: user._id }, process.env.SESSION_SECRET);
    return res.json({
      token,
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      unlockedCards: user.unlockedCards,
      team: user.team,
    });
  }
}

// Display a listing of the resource.
async function index(req, res) {}

// Display the specified resource.
async function show(req, res) {}

// Show the form for creating a new resource
async function create(req, res) {}

// Store a newly created resource in storage.
async function store(req, res) {
  const usernameExist = await User.findOne({ username: req.body.username });
  const emailExist = await User.findOne({ email: req.body.email });
  if (req.body.password === req.body.confirmedPassword) {
    if (usernameExist || emailExist) {
      return res.json("Username or email already exist");
    } else {
      const user = await new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        avatar: "nullAvatar.png",
      });
      await user.save();
      const token = jwt.sign(
        {
          id: user._id,
        },
        process.env.SESSION_SECRET,
      );
      return res.json({
        token,
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        unlockedCards: user.unlockedCards,
        team: user.team,
      });
    }
  } else {
    return res.json("Passwords do not match");
  }
}

// Show the form for editing the specified resource.
async function edit(req, res) {}

// Update the specified resource in storage.
async function updateTeam(req, res) {
  try {
    const user = await User.findById(req.auth.id);
    if (user.team.includes(req.params.id)) {
      user.team.pull(req.params.id);
    } else {
      user.team.push(req.params.id);
    }
    await user.save();
    res.status(200).json({ message: "toggle team succesfull" });
  } catch (error) {
    console.log(error);
  }
}

// Remove the specified resource from storage.
async function destroy(req, res) {}

// Otros handlers...
// ...

module.exports = {
  login,
  index,
  show,
  create,
  store,
  edit,
  updateTeam,
  destroy,
};
