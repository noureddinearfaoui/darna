const supertest = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../user/model/user");
const tokenAdmin =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZmJkM2MyN2Y0ODAxZjFjNDBmNGI4YjAiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2MDY2ODQzNzgsImV4cCI6MTYwNjc3MDc3OH0.8EjWXGXU17NUOqzU5V7zpyjDDl3NAYGw_NfnZXAZeTg";
const tokenMembre =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZmM0MjViNmMxN2EwNTM2ZjhmNzJmYmYiLCJyb2xlIjoibWVtYnJlIiwiaWF0IjoxNjA2NjkwNDc3LCJleHAiOjE2MDY3NzY4Nzd9.anRn-OUZHZ4uHvI_jgEzblTrSHr_Rz5KlNwbDIaIqKQ";

// test de la fonction addMember
/*test("addMember", async () => {
  const data = {
    email: "userToAdd@gmail.com",
    firstName: "addUser",
    lastName: "added",
    adress: "test",
    tel: "20506070",
    dateOfBirth: "1996-03-07",
  };
    await supertest(app)
    .post("/api/user/addMember")
    .send(data)
    .expect(201)
    .then(async (response) => {
      expect(response.body.message).toBe("member added successfully");
    });
});
*/
/*
///// Test d'echec d'ajout membre
test("The body of adding member should not be empty", async () => {
  const data = {};
  await supertest(app).post("/api/user/addMember").send(data).expect(500);
});
///// test d'ajout d'un membre avec données incomplètes
test(" the body should contains all required fields", async () => {
  const data = {
    email: "ttttt@gmail.com",
  };
  await supertest(app).post("/api/user/addMember").send(data).expect(500);
}); */
/*
// test de la fonction getAcceptedMembers
test("acceptedMembers ", async () => {
  await supertest(app)
    .get("/api/user/AcceptedMembers")
    .expect(200)
    .then((response) => {
      // Check the response type and length
      expect(Array.isArray(response.body)).toBeTruthy();
    });
});*/
/*
// test de la méthode getDemandes
test("getDemandes ", async () => {
  await supertest(app)
    .get("/api/user/Demandes")
    .expect(200)
    .then((response) => {
      // Check the response type and length
      expect(Array.isArray(response.body)).toBeTruthy();
    });
});*/

// test de la fonction deleteOneMember
/*test("Delete One Member ", async () => {
  await supertest(app)
    .delete(
      `/api/user/deleteMember/5fb25347cfcbe21200b04a23
    `
    )
    .expect(200)
    .then((response) => {
      expect(response.body.message).toBe("member deleted successfully!");
    });
}); */
/*
// test d'echec delete member

test("Member to delete is not found ", async () => {
  await supertest(app)
    .delete(
      `/api/user/deleteMember/123456
    `
    )
    .expect(404)
    .then((response) => {
      expect(response.body.message).toBe("member not found");
    });
});
*/

//test de la fonction banniMember
/*test("banniMember", async () => {
  const data = {
    banni: "true",
  };
  await supertest(app)
    .put(
      `/api/user/banni/5fb1b06af1e1e83a482ceaba
      `
    )
    .expect(201)
    .send(data)
    .then((response) => {
      expect(response.body.message).toBe("Member banni");
    });
});*/

/*
// test du cas d'echec de la fonction bannir membre
test("Echec bannirMember", async () => {
  const data = {
    banni: "false",
  };
  await supertest(app)
    .put("/api/user/banni/123456")
    .expect(404)
    .send(data)
    .then((response) => {
      expect(response.body.message).toBe("Member not found");
    });
});*/
/*
test("getUserDetails ", async () => {
  await supertest(app)
    .get("/api/user/details/5fb1b06af1e1e83a482ceaba")
    .expect(200);
});

test("Echec getUserDetails ", async () => {
  await supertest(app)
    .get("/api/user/details/12345")
    .expect(404)
    .then((response) => {
      expect(response.body.message).toBe("Member not found ");
    });
});*/

/*

/// test de la fonction AcceptMember
test("Accept member ", async () => {
  const data = {
    accepted: "true",
  };
  await supertest(app)
    .put("/api/user/accepted/5fb2551ccfcbe21200b04a24")
    .expect(200)
    .send(data);
});
*/
/*
// test d'echec de la fonction AccepMember
test("Echec accept member ", async () => {
  const data = {
    accepted: "true",
  };
  await supertest(app)
    .put("/api/user/accepted/123456")
    .expect(404)
    .send(data)
    .then((response) => {
      // Check the response type and length

      expect(response.body.message).toBe("member not found");
    });
});
*/
// Test de la fonction de renouvellemnt d'adhesion
/*
test("addNewAdhesion", async () => {
  const data = {
    nouveauAdhesionDate: new Date(),
  };
  await supertest(app)
    .post("/api/user/addNewAdhesion/5fb2551ccfcbe21200b04a24")
    .send(data)
    .expect(200)
    .then((response) => {
      expect(response.body.message).toBe("Success");
    });
});
*/

// test de la fonction update member details
/*
test('update details of member ', async() => {
  const data={
    tel:"11111111",
    firstName:"firstNameUpdatedNow"
  }
  await supertest(app)
  .put("/api/user/details/5fb2551ccfcbe21200b04a24")
  .send(data)
  .expect(200)
  
})*/

//test d'echec update member details

test("Echec update details of member ", async () => {
  const data = {
    tel: "25252525",
    firstName: "firstNameUpdated",
  };
  await supertest(app)
    .put("/api/user/details/123456")
    .set("Authorization", "Bearer " + tokenAdmin)
    .send(data)
    .expect(404)
    .then((response) => {
      expect(response.body.message).toBe("Member not found");
    });
});
