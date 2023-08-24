const Card = require("../models/Card");
const cards = require("./cardsDB");

module.exports = async () => {
  for (const card of cards) {
    const character = new Card({
      name: card.name,
      description: card.description,
      character: card.character,
      background: card.background,
      ability: card.ability,
      intelligence: card.intelligence,
      physicalPower: card.physicalPower,
      cursedPower: card.cursedPower,
    });
    await character.save();
  }
  console.log("Se corrio el seeder de Cards");
};
