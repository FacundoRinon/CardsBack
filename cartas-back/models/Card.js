const { mongoose, Schema } = require("../db");
const mongooseDelete = require("mongoose-delete");

const cardSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    character: { type: String, required: true },
    background: { type: String, required: true },
    ability: { type: String, required: true },
    intelligence: { type: Number, required: true },
    physicalPower: { type: Number, required: true },
    cursedPower: { type: Number, required: true },
    onTeam: { type: Date, default: null },
    pointsPerHour: { type: Number, default: 1 },
  },
  { timestamps: true },
);

cardSchema.set("toJSON", { virtuals: true });
cardSchema.plugin(mongooseDelete, { overrideMethods: "all" });
const Card = mongoose.model("Card", cardSchema);

module.exports = Card;
