const supertest = require("supertest");
const app = require("../app");
const tokenAdmin =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZmJkM2MyN2Y0ODAxZjFjNDBmNGI4YjAiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2MDY2ODQzNzgsImV4cCI6MTYwNjc3MDc3OH0.8EjWXGXU17NUOqzU5V7zpyjDDl3NAYGw_NfnZXAZeTg";
const tokenMembre =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZmM0MjViNmMxN2EwNTM2ZjhmNzJmYmYiLCJyb2xlIjoibWVtYnJlIiwiaWF0IjoxNjA2NjkwNDc3LCJleHAiOjE2MDY3NzY4Nzd9.anRn-OUZHZ4uHvI_jgEzblTrSHr_Rz5KlNwbDIaIqKQ";

test("add new request ", async () => {
  await supertest(app)
    .get(
      "/api/demandeParticipation/addDemande/5fbc2c824958fa2154925495/5fbbeedb1762261da0e11990"
    )
    .set("Authorization", "Bearer " + tokenMembre)
    .expect(200)
    .then((response) => {
      expect(response.body._id).toBeTruthy();
      expect(response.body.status).toBe("attente");
      expect(response.body.participated).toBe(false);
    });
});

test("Echec add new request with wrong idUser", async () => {
  await supertest(app)
    .get("/api/demandeParticipation/addDemande/123/5fbbeedb1762261da0e11990")
    .set("Authorization", "Bearer " + tokenMembre)
    .expect(404)
    .then((response) => {
      expect(response.body.message).toBe("Utilisateur non trouvé");
    });
});
test("Echec add new request with wrong idAction", async () => {
  await supertest(app)
    .get("/api/demandeParticipation/addDemande/5fbc2c824958fa2154925495/123")
    .set("Authorization", "Bearer " + tokenMembre)
    .expect(404)
    .then((response) => {
      expect(response.body.message).toBe("Action non trouvé");
    });
});

test("update status of request ", async () => {
  const data = {
    status: "acceptée",
  };
  await supertest(app)
    .put("/api/demandeParticipation/updateStatus/5fbd2201f4801f1c40f4b8af")
    .set("Authorization", "Bearer " + tokenAdmin)
    .send(data)
    .expect(201)
    .then((response) => {
      expect(response.body.message).toBe("Status modifié");
    });
});

test("Echec update status with wrong objectId form ", async () => {
  const data = {
    status: "acceptée",
  };
  await supertest(app)
    .put("/api/demandeParticipation/updateStatus/1234")
    .set("Authorization", "Bearer " + tokenAdmin)
    .expect(404)
    .send(data)
    .then((response) => {
      expect(response.body.message).toBe("Demande non trouvée");
    });
});

test("Echec update status of request that not exist and empty data", async () => {
  const data = {};
  await supertest(app)
    .put("/api/demandeParticipation/updateStatus/54865")
    .set("Authorization", "Bearer " + tokenAdmin)
    .expect(404)
    .send(data)
    .then((response) => {
      expect(response.body.message).toBe("Demande non trouvée");
    });
});

test("update participated  ", async () => {
  const data = {
    participated: true,
  };
  await supertest(app)
    .put(
      "/api/demandeParticipation/updateParticipation/5fbd9c5e30c3204a4c0ef8c6"
    )
    .set("Authorization", "Bearer " + tokenAdmin)
    .send(data)
    .expect(201)
    .then((response) => {
      expect(response.body.message).toBe("Participation modifiée");
    });
});

test("Echec update participation with wrong objectId form ", async () => {
  const data = {
    participated: true,
  };
  await supertest(app)
    .put("/api/demandeParticipation/updateParticipation/1234")
    .set("Authorization", "Bearer " + tokenAdmin)
    .expect(404)
    .send(data)
    .then((response) => {
      expect(response.body.message).toBe("Demande non trouvée");
    });
});

test("Echec update participation of request that not exist and empty data", async () => {
  const data = {};
  await supertest(app)
    .put("/api/demandeParticipation/updateParticipation/1257")
    .set("Authorization", "Bearer " + tokenAdmin)
    .expect(404)
    .send(data)
    .then((response) => {
      expect(response.body.message).toBe("Demande non trouvée");
    });
});

test("get participation requests by member ", async () => {
  await supertest(app)
    .get(
      "/api/demandeParticipation/participationRequestByMember/5fbc2c824958fa2154925495"
    )
    .set("Authorization", "Bearer " + tokenAdmin)
    .expect(200)
    .then((response) => {
      expect(Array.isArray(response.body)).toBeTruthy();
    });
});

test("echec participation requests by member ", async () => {
  await supertest(app)
    .get("/api/demandeParticipation/participationRequestByMember/123")
    .set("Authorization", "Bearer " + tokenAdmin)
    .expect(404)
    .then((response) => {
      expect(response.body.message).toBe("Utilisateur non trouvé");
    });
});

test("get requests by action  ", async () => {
  await supertest(app)
    .get("/api/demandeParticipation/requestsByAction/5fbbeedb1762261da0e11990")
    .set("Authorization", "Bearer " + tokenAdmin)
    .expect(200);
});

test("echec get requests by action ", async () => {
  await supertest(app)
    .get("/api/demandeParticipation/requestsByAction/123")
    .set("Authorization", "Bearer " + tokenAdmin)
    .expect(404)
    .then((response) => {
      expect(response.body.message).toBe("Action non trouvée");
    });
});

test("get request by member and action ", async () => {
  await supertest(app)
    .get(
      "/api/demandeParticipation/requestForActionByMember/5fb6bc9204d7070017766560/5fbbeedb1762261da0e11990"
    )
    .set("Authorization", "Bearer " + tokenAdmin)
    .expect(200)
    .then((response) => {
      expect(response.body._id).toBeTruthy();
      expect(response.body.status).toBe("acceptée");
      expect(response.body.participated).toBe(false);
    });
});

test("echec get request by member and action ", async () => {
  await supertest(app)
    .get("/api/demandeParticipation/requestForActionByMember/123/456")
    .set("Authorization", "Bearer " + tokenAdmin)
    .expect(404)
    .then((response) => {
      expect(response.body.message).toBe("wrong ObjectId Form");
    });
});

test("getAcceptedDemandesByAction ", async () => {
  await supertest(app)
    .get(
      "/api/demandeParticipation/numberOfAcceptedDemandes/5fbbeedb1762261da0e11990"
    )
    .set("Authorization", "Bearer " + tokenAdmin)
    .expect(200)
    .then((response) => {
      expect(Number.isInteger(response.body)).toBeTruthy();
    });
});

test("echec get request by member and action ", async () => {
  await supertest(app)
    .get("/api/demandeParticipation/numberOfAcceptedDemandes/12345")
    .set("Authorization", "Bearer " + tokenAdmin)
    .expect(404)
    .then((response) => {
      expect(response.body.message).toBe("Forme incorrecte");
    });
});

