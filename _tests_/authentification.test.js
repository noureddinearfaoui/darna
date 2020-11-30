/*const supertest = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../user/model/user");

test("successful signup ", async () => {
  const data = {
    email: "testSignUp@gmail.com",
    firstName: "amal",
    lastName: "test",
    adress: "Tunis",
    tel: "52049207",
    dateOfBirth: "1996-11-02",
    password: "123456789",
  };
  await supertest(app)
    .post("/api/user/signup")
    .send(data)
    .expect(201)
    .then(async (response) => {
      expect(response.body.message).toBe("Utilisateur créé !");
    });
});

///// Test d'echec de signup
test("The body of signup should not be empty", async () => {
  const data = {};
  await supertest(app).post("/api/user/signup").send(data).expect(400);
});
///// test de signup avec données incomplètes
test(" the body should contains all required fields", async () => {
  const data = {
    email: "aaaaa@gmail.com",
  };
  await supertest(app).post("/api/user/signup").send(data).expect(400);
});

test("successful SignIn ", async () => {
  const data = {
    email: "admin@admin.com",
    password: "12345678",
  };
  await supertest(app)
    .post("/api/user/signin")
    .send(data)
    .expect(200)
    .then(async (response) => {
      expect(response.body.userId).toBe("5fbd3c27f4801f1c40f4b8b0");
      expect(response.body.token).toBeTruthy();
    });
});

test("Echec SignIn with wrong email", async () => {
  const data = {
    email: "notFound@gmail.com",
    password: "12345678",
  };
  await supertest(app)
    .post("/api/user/signin")
    .send(data)
    .expect(401)
    .then((response) => {
      expect(response.body.error).toBe("Utilisateur non trouvé !");
    });
});

test("Echec SignIn with wrong password", async () => {
  const data = {
    email: "admin@admin.com",
    password: "14795763",
  };
  await supertest(app)
    .post("/api/user/signin")
    .send(data)
    .expect(401)
    .then((response) => {
      expect(response.body.error).toBe("Mot de passe incorrect !");
    });
});

test("Echec SignIn with banned user", async () => {
  const data = {
    email: "bannedUser@gmail.com",
    password: "@Ydrroxojjng",
  };
  await supertest(app)
    .post("/api/user/signin")
    .send(data)
    .expect(401)
    .then((response) => {
      expect(response.body.error).toBe("vous êtes banni !");
    });
});
*/
