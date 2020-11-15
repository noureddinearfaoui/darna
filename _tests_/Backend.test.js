const supertest = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../user/model/user");

/*describe("Test if jest working or not", () => {
  it("should test that true === true", () => {
    expect(true).toBe(true);
  });
});*/
beforeEach((done) => {
  mongoose.connect(
    "mongodb+srv://darna:darna123456@cluster0.vrjcg.mongodb.net/projet-darna?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done()
  );
});

afterEach((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
});

test("Ajout d'un nouveau membre", async () => {
  const data = {
    email: "bejaouitarek4@gmail.com",
    firstName: "tarek",
    lastName: "bejaoui",
    adress: "jedeida",
    tel: "20202020",
    dateOfBirth: "1996-01-05",
  };

  await supertest(app)
    .post("/api/user/addMember")
    .send(data)
    .expect(201)
    .then(async (response) => {
      //Check the response
      expect(response.body.message).toBe("member added successfully");
      //expect(response.body.user._id).toBeTruthy();
      expect(response.body.user.email).toBe(data.email);
      expect(response.body.user.firstName).toBe(data.firstName);
      expect(response.body.user.lastName).toBe(data.lastName);
      expect(response.body.user.adress).toBe(data.adress);
      expect(response.body.user.tel).toBe(data.tel);
      //expect(response.body.user.dateOfBirth).toBe(data.dateOfBirth);

      // Check the data in the database
      /* const user = await User.findOne({ _id: response.body.user._id });
      expect(user).toBeTruthy();
      expect(user.email).toBe(data.email);
      expect(user.firstName).toBe(data.firstName);
      expect(user.lastName).toBe(data.lastName);
      expect(user.adress).toBe(data.adress);
      expect(user.tel).toBe(data.tel);*/
      //expect(user.dateOfBirth).toBe(data.dateOfBirth);
    });
});
