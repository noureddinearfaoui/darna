const supertest = require("supertest");
const app = require("../app");

/*test("add new request ", async () => {
  await supertest(app)
    .get(
      "/api/demandeParticipation/addDemande/5fb6bc9204d7070017766560/5fbbeedb1762261da0e11990"
    )
    .expect(200)
    .then((response) => {
      expect(response.body._id).toBeTruthy();
      expect(response.body.status).toBe("attente");
      expect(response.body.participated).toBe(false);
    });
});
*/
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
    .put("/api/demandeParticipation/updateStatus/5fbbf714bd598c72bf30e5dd")
    .send(data)
    .expect(201)
    .then((response) => {
      expect(response.body.message).toBe("Status updated");
    });
});*/

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
      "/api/demandeParticipation/updateParticipation/5fbbf714bd598c72bf30e5dd"
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
      "/api/demandeParticipation/participationRequestByMember/5fb6bc9204d7070017766560"
    )
    .expect(200)
    .then((response) => {
      expect(Array.isArray(response.body)).toBeTruthy();
    });
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
    .get("/api/demandeParticipation/requestsByAction/5fbbd1d928f8ca344cafc6c8")
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
      "/api/demandeParticipation/requestForActionByMember/5fb6bc9204d7070017766560/5fbbd1d928f8ca344cafc6c8"
    )
    .expect(200)
    .then((response) => {
      expect(response.body._id).toBeTruthy();
      expect(response.body.status).toBe("acceptée");
      expect(response.body.participated).toBe(true);
    });
});

test("echec get request by member and action ", async () => {
  await supertest(app)
    .get("/api/demandeParticipation/requestForActionByMember/123/456")
    .expect(404)
    .then((response) => {
      expect(response.body.message).toBe("wrong ObjectId Form");
    });
});
