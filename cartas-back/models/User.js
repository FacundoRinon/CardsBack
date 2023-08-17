const { mongoose, Schema } = require("../db");

const bcrypt = require("bcryptjs");

const userSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    avatar: { type: String, required: true },
    password: { type: String, required: true },
    // collection: [{ type: Schema.Types.ObjectId, ref: "Card" }],
    // team: [{ type: Schema.Types.ObjectId, ref: "Card" }],
  },
  { timestamps: true },
);

userSchema.method.comparePassword = async function comparePassword(password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 8);
  next();
});
userSchema.pre("insertMany", async function (next, users) {
  for (const user of users) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.method.toJSON = function () {
  const user = this.toObject();
  user.id = user._id.toString();
  delete user.password;
  delete user._id;
  return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
// Crear esquema y modelo User...
