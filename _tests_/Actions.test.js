const supertest = require("supertest");
const app = require("../app");

test("get all actions ", async () => {
  await supertest(app).get("/api/action/allActions").expect(200);
});

test("get action details ", async () => {
  await supertest(app)
    .get("/api/action/action/5fbbd1d928f8ca344cafc6c8")
    .expect(200);
});

test("publish action ", async () => {
  await supertest(app)
    .put("/api/action/publishAction/5fbbd1d928f8ca344cafc6c8")
    .expect(201)
    .then((response) => {
      expect(response.body.message).toBe("Action published");
    });
});
test("Echec publish action", async () => {
  await supertest(app)
    .put("/api/action/publishAction/1475")
    .expect(404)
    .then((response) => {
      expect(response.body.message).toBe("Action not found");
    });
});

/*test('delete action ', async() => {
      await supertest(app)
      .delete("/api/action/deleteAction/5fbaaec0a9be101378355fff")
      .expect(200)
      .then((response)=>{
          expect(response.body.message).toBe("Action deleted successfully!")
      })
      
  })*/

// test d'echec delete action
test("echec delete action", async () => {
  await supertest(app)
    .delete("/api/action/deleteAction/123456")
    .expect(404)
    .then((response) => {
      expect(response.body.message).toBe("Action not found");
    });
});
