// /**
//  * El seeder no es más que un archivo que contiene una función que se encarga
//  * de insertar datos (generalmente de prueba) en una base de datos.
//  *
//  * El nombre seeder es una convención y significa semillero.
//  *
//  * Además, en este caso, se está usando una librería llamada Faker
//  * (https://fakerjs.dev/) para facilitar la creación de datos ficticios como
//  * nombres, apellidos, títulos, direcciones y demás textos.
//  *
//  * Suele ser común que en los seeders exista un `for` donde se define la
//  * cantidad de registros de prueba que se insertarán en la base de datos.
//  *
//  */

const { faker } = require("@faker-js/faker");
const User = require("../models/User");

faker.locale = "es";

module.exports = async () => {
  const user = new User({
    firstname: "Invited",
    lastname: "User",
    email: "invited@user.com",
    username: "InvitedUser",
    password: "jeje",
    avatar: "nullAvatar.png",
    intelligencePoints: 0,
    physicalPower: 0,
    cursedPower: 0,
  });
  await user.save();
  console.log("[Database] Se corrió el seeder de Users.");
};
