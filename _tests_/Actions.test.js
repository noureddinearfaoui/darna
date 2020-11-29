const supertest = require("supertest");
const app = require("../app");
const tokenAdmin =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZmJkM2MyN2Y0ODAxZjFjNDBmNGI4YjAiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2MDY2ODQzNzgsImV4cCI6MTYwNjc3MDc3OH0.8EjWXGXU17NUOqzU5V7zpyjDDl3NAYGw_NfnZXAZeTg";

test("get all actions ", async () => {
  await supertest(app)
    .get("/api/action/allActions")
    .set("Authorization", "Bearer " + tokenAdmin)
    .expect(200)
    .then((response) => {
      expect(Array.isArray(response.body)).toBeTruthy();
    });
});

/*test("get action details ", async () => {
  await supertest(app)
    .get("/api/action/action/5fbbeedb1762261da0e11990")
    .expect(200)
    .then((response) => {
      expect(response.body._id).toBeTruthy();
      expect(response.body.actionName).toBe("Amal action");
      expect(response.body.description).toBe("description action");
      expect(response.body.location).toBe("bardo");
    });
});*/
/*test("Echec get action details", async () => {
  await supertest(app)
    .get("/api/action/action/12345")
    .auth()
    .expect(404)
    .then((response) => {
      expect(response.body.message).toBe("Action not found ");
    });
});*/

/*test("publish action ", async () => {
  const data = {
    isPublished: true,
  };
  await supertest(app)
    .put("/api/action/publishAction/5fbbb8ec5b90c426e336e42e")
    .send(data)
    .expect(201)
    .then((response) => {
      expect(response.body.message).toBe("Action published");
    });
});*/
/*
test("Echec publish action", async () => {
  await supertest(app)
    .put("/api/action/publishAction/1475")
    .expect(404)
    .then((response) => {
      expect(response.body.message).toBe("Action not found");
    });
});*/

/*test("delete action ", async () => {
  await supertest(app)
    .delete("/api/action/deleteAction/5fbc0663650be841d8e14c98")
    .expect(200)
    .then((response) => {
      expect(response.body.message).toBe("Action deleted successfully!");
    });
}); */

// test d'echec delete action
/*test("echec delete action", async () => {
  await supertest(app)
    .delete("/api/action/deleteAction/123456")
    .expect(404)
    .then((response) => {
      expect(response.body.message).toBe("Action not found");
    });
});*/

// addAction and updateAction
