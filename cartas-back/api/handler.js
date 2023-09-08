const cron = require("node-cron");
const User = require("../models/User");

export default async function handler(request, response) {
  cron.schedule("0 17 * * *", async () => {
    const users = await User.find().populate("team");

    for (const user of users) {
      let intelligencePointsToAdd = 0;
      let physicalPowerToAdd = 0;
      let cursedPowerToAdd = 0;

      for (const card of user.team) {
        intelligencePointsToAdd += card.intelligence;
        physicalPowerToAdd += card.physicalPower;
        cursedPowerToAdd += card.cursedPower;
      }

      user.intelligencePoints += intelligencePointsToAdd * 60;
      user.physicalPower += physicalPowerToAdd * 60;
      user.cursedPower += cursedPowerToAdd * 60;

      await user.save();
    }
  });
}
