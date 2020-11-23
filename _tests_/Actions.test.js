const supertest = require("supertest");
const app = require("../app");

test("get all actions ", async () => {
  await supertest(app).get("/api/action/allActions").expect(200);
});

test("get action details ", async () => {
  await supertest(app)
    .get("/api/action/action/5fbbb8ec5b90c426e336e42e")
    .expect(200);
});

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
test("Echec publish action", async () => {
  await supertest(app)
    .put("/api/action/publishAction/1475")
    .expect(404)
    .then((response) => {
      expect(response.body.message).toBe("Action not found");
    });
});

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
