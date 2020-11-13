const request = require("supertest");
// we also need our app for the correct routes!
const app = require("../../app");
const { test } = require("../../user/controller/userController");
describe("My Test Suite", () => {
  it("My Test Case", () => {
    expect(true).toEqual(true);
  });
});

describe("updated /user/id", () => {
  it("It responds with a message of Updated", async () => {
    const updateStudent = await request(app).put(
      "/update/5fa548164e3d2337c30e071f"
    );
    expect(updateStudent.body).toEqual({ message: "User est banni" });
    // expect(updateStudent.statusCode).toBe(200);
  });
});
