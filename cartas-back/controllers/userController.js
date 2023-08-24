const User = require("../models/User");
const Card = require("../models/Card");
const jwt = require("jsonwebtoken");
const formidable = require("formidable");
const path = require("path");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");

const { isEmail } = require("validator");

if (!process.env.SUPABASE_URL) {
  throw new error("supabaseURL miss");
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
  auth: { persistSession: false },
});

async function login(req, res) {
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
      intelligencePoints: user.intelligencePoints,
      physicalPower: user.physicalPower,
      cursedPower: user.cursedPower,
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
        intelligencePoints: 0,
        physicalPower: 0,
        cursedPower: 0,
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
        intelligencePoints: user.intelligencePoints,
        physicalPower: user.physicalPower,
        cursedPower: user.cursedPower,
      });
    }
  } else {
    return res.json("Passwords do not match");
  }
}

// Show the form for editing the specified resource.
async function edit(req, res) {}

// Update the specified resource in storage.

async function update(req, res) {
  const user = await User.findById(req.auth.id);
  const id = req.auth.id;
  const form = formidable({
    multiples: false,
    keepExtensions: true,
  });
  form.parse(req, async (err, fields, files) => {
    const ext = path.extname(files.avatar.filepath);
    const newFileName = `image_${Date.now()}${ext}`;
    const avatarFileName = newFileName;

    const { data, error } = await supabase.storage
      .from("cards")
      .upload(avatarFileName, fs.createReadStream(files.avatar.filepath), {
        cacheControl: "3600",
        upsert: false,
        contentType: files.avatar.mimetype,
        duplex: "half",
      });
    const { firstname, lastname, username } = fields;
    const values = {
      firstname,
      lastname,
      username,
    };
    const existingUsername = await User.findOne({ username });
    const thisUser = await User.findOne({ _id: id });

    if (existingUsername && existingUsername.id !== thisUser.id) {
      return res.json("ExistingUsername");
    } else {
      if (files.avatar.size) {
        values.avatar = avatarFileName;
      }

      const updatedValues = {
        $set: values,
      };
      const response = await User.findOneAndUpdate({ _id: id }, updatedValues, { new: true });
      return res.json({
        ...user,
        firstname: response.firstname,
        lastname: response.lastname,
        username: response.username,
        avatar: response.avatar,
      });
    }
  });
}

async function updateTeam(req, res) {
  try {
    const user = await User.findById(req.auth.id);
    const card = await Card.findById(req.params.id);
    if (user.team.includes(req.params.id)) {
      user.team.pull(req.params.id);
      card.onTeam = false;
    } else if (user.team.length >= 3) {
      return res.json("teamComplete");
    } else {
      user.team.push(req.params.id);
      card.onTeam = true;
    }
    await user.save();
    await card.save();
    res.status(200).json({ message: "toggle team succesfull" });
  } catch (error) {
    console.log(error);
  }
}

async function updateUnlocked(req, res) {
  try {
    const user = await User.findById(req.auth.id);
    if (user.unlockedCards.includes(req.params.id)) {
      return res.json("alreadyUnlocked");
    } else {
      user.unlockedCards.push(req.params.id);
    }
    await user.save();
    res.status(200).json({ message: "new card unlocked" });
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
  update,
  updateTeam,
  updateUnlocked,
  destroy,
};
