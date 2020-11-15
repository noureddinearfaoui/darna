const supertest = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../user/model/user");

/*beforeEach((done) => {
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
});*/

/*test("addMember", async () => {
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
      expect(response.body.message).toBe("member added successfully");
    });
});
*/

/////echec d'ajout membre
test("The body of adding member should not be empty", async () => {
  const data = {};
  await supertest(app).post("/api/user/addMember").send(data).expect(500);
});
/////ajout avec données incomplètes
test(" the body should contains all required fields", async () => {
  const data = {
    email: "ttttt@gmail.com",
  };
  await supertest(app).post("/api/user/addMember").send(data).expect(500);
});

/*test("acceptedMembers ", async () => {
  await supertest(app)
    .get("/api/user/AcceptedMembers")
    .expect(200)
    .then((response) => {
      // Check the response type and length
      expect(Array.isArray(response.body)).toBeTruthy();
    });
});

test("getDemandes ", async () => {
  await supertest(app)
    .get("/api/user/Demandes")
    .expect(200)
    .then((response) => {
      // Check the response type and length
      expect(Array.isArray(response.body)).toBeTruthy();
    });
});*/

/*test("Delete One Member ", async () => {
  await supertest(app)
    .delete(
      `/api/user/deleteMember/5fafa9c469032a13b29cbd07
    `
    )
    .expect(200)
    .then((response) => {
      expect(response.body.message).toBe("member deleted successfully!");
    });
}); */

/*test("banniMember", async () => {
  const data = {
    banni: "true",
  };
  await supertest(app)
    .put(
      `/api/user/banni/5fb009e3bc56080d38c1dedd
      `
    )
    .expect(201)
    .send(data)
    .then((response) => {
      expect(response.body.message).toBe("Member banni");
    });
});*/

///////////// Echec bannir membre
/*test('Echec bannirMember', async() => {
  const data={
    banni:"false"
  }
    await supertest(app)
      .put(/api/user/banni/123456)
      .expect(404)
      .send(data)
      .then((response) => {
        expect(response.body.message).toBe("Member not found");
    
  })
  })
*/

/*
test("getUserDetails ", async () => {
  await supertest(app)
    .get("/api/user/details/5fb161860ea16745e8930db8")
    .expect(200);
});

test("Echec getUserDetails ", async () => {
  await supertest(app)
    .get("/api/user/details/12345")
    .expect(404)
    .then((response) => {
      expect(response.body.message).toBe("Member not found ");
    });
});
*/

/*

//////////////Test accept member
test("Accept member ", async () => {
  const data = {
    accepted: "true",
  };
  await supertest(app)
    .put("/api/user/accepted/5fb0569ed7f5bb175ff092d0")
    .expect(200)
    .send(data);
});
///////////// Echec accept member
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
//////////// Test renouvellemnt adhesion
/*
test("addNewAdhesion", async () => {
  const data = {
    nouveauAdhesionDate: new Date(),
  };

  await supertest(app)
    .post("/api/user/addNewAdhesion/5fb1b06af1e1e83a482ceaba")
    .send(data)
    .expect(200)
    .then((response) => {
      expect(response.body.message).toBe("Success");
    });
});
*/
//////Echec delete member
/*
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
//////test update member details
/*
test('update details of member ', async() => {
  const data={
    tel:"25252525",
    firstName:"firstNameUpdated"
  }
  await supertest(app)
  .put("/api/user/details/5fb1b06af1e1e83a482ceaba")
  .send(data)
  .expect(200)

  
})*/

//////test echec update member details
/*
test("Echec update details of member ", async () => {
  const data = {
    tel: "25252525",
    firstName: "firstNameUpdated",
  };
  await supertest(app)
    .put("/api/user/details/123456")
    .send(data)
    .expect(404)
    .then((response) => {
      expect(response.body.message).toBe("Member not found");
    });
});
*/
