const supertest = require("supertest");
const app = require("../app");
const tokenAdmin ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZmJkM2MyN2Y0ODAxZjFjNDBmNGI4YjAiLCJyb2xlIjoiYWRtaW4iLCJmaXJzdE5hbWUiOiJhZG1pbiIsImxhc3ROYW1lIjoiYWRtaW4iLCJ1cmxJbWFnZSI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvdXNlci9hcHAvaW1hZ2VzLzVmYmQzYzI3ZjQ4MDFmMWM0MGY0YjhiMC5wbmciLCJpYXQiOjE2MTAxMTI3NjQsImV4cCI6MTYxMDE5OTE2NH0.JAYA42LSCma05aKYBbrsKg8VaMzWoFz3ohDpkgtPV68";

test("add message", async () => {
  const data = {
    firstName: "amal",
    lastName: "ba",
    email: "amal@gmail.com",
    message: "testaddMessage",
  };
    await supertest(app)
    .post("/api/message/addMessage")
    .send(data)
    .expect(200)
    .then(async (response) => {
      expect(response.body.message).toBe("Message envoyé avec succès");
    });
});

test(" test addMessage without lastName", async () => {
    const data = {
        firstName: "amal",
        email: "amal@gmail.com",
        message: "testaddMessage",
    };
    await supertest(app).post("/api/message/addMessage")
    .send(data)
    .expect(400)
    .then((response) => {
        expect(response.body.message).toBe("Vous devez ajouter votre nom");
      });
    
  }); 
test("test addMessage without email", async () => {
    const data = {
        firstName: "amal",
        lastName: "ba",
        message: "testaddMessage",
    };
    await supertest(app).post("/api/message/addMessage")
    .send(data)
    .expect(400)
    .then((response) => {
        expect(response.body.message).toBe("Vous devez ajouter votre email");
      });
  }); 

test(" test addMessage without message", async () => {
  const data = {
    firstName: "amal",
    lastName: "ba",
    email: "amal@gmail.com",
  };
  await supertest(app).post("/api/message/addMessage")
  .send(data)
  .expect(400)
  .then((response) => {
    expect(response.body.message).toBe("Vous devez ajouter un message");
  });
}); 

test("get all messages ", async () => {
    await supertest(app)
      .get("/api/message/getAllMessages")
      .set("Authorization", "Bearer " + tokenAdmin)
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).toBeTruthy();
      });
  });
  
test("get message details ", async () => {
    await supertest(app)
      .get("/api/message/getMessageDetails/5fed039cdee8685c58e6905b")
      .set("Authorization", "Bearer " + tokenAdmin)
      .expect(200)
      .then((response) => {
        expect(response.body._id).toBeTruthy();
        expect(response.body.firstName).toBe("Amal");
        expect(response.body.lastName).toBe("Bou Abdallah");
        expect(response.body.email).toBe("amalbouabdallahh1@gmail.com");
        expect(response.body.message).toBe("messssssage");
      });
  });
test("Echec get message details", async () => {
    await supertest(app)
      .get("/api/message/getMessageDetails/12345")
      .set("Authorization", "Bearer " + tokenAdmin)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Message non trouvé");
      });
  });
  

  
test("delete message ", async () => {
    await supertest(app)
      .delete("/api/message/deleteMessage/5fed03a5dee8685c58e6905c")
      .set("Authorization", "Bearer " + tokenAdmin)
      .expect(200)
      .then((response) => {
        expect(response.body.message).toBe("Message supprimé avec succès");
      });
  });