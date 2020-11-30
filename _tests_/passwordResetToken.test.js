//npm test jest passwordResetToken.test.js : run one test file
const supertest = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

test("forgot password", async () => {
  const data = {
    email: "amalbouabdallahh1@gmail.com",
  };
  await supertest(app)
    .post("/api/user/forgotPassword")
    .send(data)
    .expect(200)
    .then(async (response) => {
      expect(response.body.message).toBe("Email envoyé");
    });
});
