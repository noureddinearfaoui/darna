const supertest = require("supertest");
const app = require("../app");

/*test("add new request ", async () => {
  await supertest(app)
    .get(
      "/api/demandeParticipation/addDemande/5fb04fe5d7f5bb175ff092cd/5fb8e9b92257660dd038d2ec"
    )
    .expect(200);
});*/

test("Echec add new request with wrong idUser", async () => {
  await supertest(app)
    .get("/api/demandeParticipation/addDemande/123/5fb8e9b92257660dd038d2ec")
    .expect(404)
    .then((response) => {
      expect(response.body.message).toBe("user Non trouvé");
    });
});
test("Echec add new request with wrong idAction", async () => {
  await supertest(app)
    .get("/api/demandeParticipation/addDemande/5fb04fe5d7f5bb175ff092cd/123")
    .expect(404)
    .then((response) => {
      expect(response.body.message).toBe("action Non trouvé");
    });
});

/*test("update status of request ", async () => {
  const data = {
    status: "acceptée",
  };
  await supertest(app)
    .put("/api/demandeParticipation/updateStatus/5fba9cdd50fb003420bf95f8")
    .send(data)
    .expect(201)
    .then((response) => {
      expect(response.body.message).toBe("Status updated");
    });
});
*/

test("Echec update status with wrong objectId form ", async () => {
  const data = {
    status: "acceptée",
  };
  await supertest(app)
    .put("/api/demandeParticipation/updateStatus/1234")
    .expect(404)
    .send(data)
    .then((response) => {
      expect(response.body.message).toBe("Demande not found");
    });
});

test("Echec update status of request that not exist and empty data", async () => {
  const data = {};
  await supertest(app)
    .put("/api/demandeParticipation/updateStatus/5fba9cdj50fb103490bf95l8")
    .expect(404)
    .send(data)
    .then((response) => {
      expect(response.body.message).toBe("Demande not found");
    });
});

/*test("update participated  ", async () => {
  const data = {
    participated: true,
  };
  await supertest(app)
    .put(
      "/api/demandeParticipation/updateParticipation/5fba9cdd50fb003420bf95f8"
    )
    .send(data)
    .expect(201)
    .then((response) => {
      expect(response.body.message).toBe("Participation updated");
    });
});*/

test("Echec update participation with wrong objectId form ", async () => {
  const data = {
    participated: true,
  };
  await supertest(app)
    .put("/api/demandeParticipation/updateParticipation/1234")
    .expect(404)
    .send(data)
    .then((response) => {
      expect(response.body.message).toBe("Demande not found");
    });
});

test("Echec update participation of request that not exist and empty data", async () => {
  const data = {};
  await supertest(app)
    .put(
      "/api/demandeParticipation/updateParticipation/5fba9cdj50fb103490bf95l8"
    )
    .expect(404)
    .send(data)
    .then((response) => {
      expect(response.body.message).toBe("Demande not found");
    });
});

test("get participation requests by member ", async () => {
  await supertest(app)
    .get(
      "/api/demandeParticipation/participationRequestByMember/5fb04fe5d7f5bb175ff092cd"
    )
    .expect(200);
});

test("echec participation requests by member ", async () => {
  await supertest(app)
    .get("/api/demandeParticipation/participationRequestByMember/123")
    .expect(404)
    .then((response) => {
      expect(response.body.message).toBe("User not found");
    });
});

test("get requests by action  ", async () => {
  await supertest(app)
    .get("/api/demandeParticipation/requestsByAction/5fb8e9b92257660dd038d2ec")
    .expect(200);
});

test("echec get requests by action ", async () => {
  await supertest(app)
    .get("/api/demandeParticipation/requestsByAction/123")
    .expect(404)
    .then((response) => {
      expect(response.body.message).toBe("Action not found");
    });
});

test("get request by member and action ", async () => {
  await supertest(app)
    .get(
      "/api/demandeParticipation/requestForActionByMember/5fb68442ee9d9f26b34e0960/5fb95c7071edfe24b453bf7a"
    )
    .expect(200);
});

test("echec get request by member and action ", async () => {
  await supertest(app)
    .get("/api/demandeParticipation/requestForActionByMember/123/456")
    .expect(404)
    .then((response) => {
      expect(response.body.message).toBe("wrong ObjectId Form");
    });
});

test("get all actions ", async () => {
  await supertest(app).get("/api/action/allActions").expect(200);
});

test("get action details ", async () => {
  await supertest(app)
    .get("/api/action/action/5fb8e9b92257660dd038d2ec")
    .expect(200);
});

/*test("publish action ", async () => {
    await supertest(app)
    .put("/api/action/publishAction/5fb8e9b92257660dd038d2ec")
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
