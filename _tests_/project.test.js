const supertest = require("supertest");
const app = require("../app");
const tokenAdmin ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZmJkM2MyN2Y0ODAxZjFjNDBmNGI4YjAiLCJyb2xlIjoiYWRtaW4iLCJmaXJzdE5hbWUiOiJhZG1pbiIsImxhc3ROYW1lIjoiYWRtaW4iLCJ1cmxJbWFnZSI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvdXNlci9hcHAvaW1hZ2VzLzVmYmQzYzI3ZjQ4MDFmMWM0MGY0YjhiMC5wbmciLCJpYXQiOjE2MTAxMTI3NjQsImV4cCI6MTYxMDE5OTE2NH0.JAYA42LSCma05aKYBbrsKg8VaMzWoFz3ohDpkgtPV68";

test("add project", async () => {
  const data = {
    projectStatus: "future",
    projectDescription: "test d'ajout d'un projet",
  };
    await supertest(app)
    .post("/api/project/addProject")
    .send(data)
    .set("Authorization", "Bearer " + tokenAdmin)
    .expect(200)
    .then(async (response) => {
        expect(response.body._id).toBeTruthy();
        expect(response.body.projectStatus).toBe(data.projectStatus);
        expect(response.body.projectDescription).toBe(data.projectDescription);
    });
});

test(" test addProject without wrong status", async () => {
    const data = {
        projectStatus: "fauxStatut",
        projectDescription: "test d'ajout d'un projet",
      };
    await supertest(app)
    .post("/api/project/addProject")
    .send(data)
    .set("Authorization", "Bearer " + tokenAdmin)
    .expect(400)
    .then((response) => {
        expect(response.body.message).toBe("Statut incorrecte");
      });
    
  }); 
  test(" test addProject without description", async () => {
    const data = {
        projectStatus: "future",
      };
    await supertest(app)
    .post("/api/project/addProject")
    .send(data)
    .set("Authorization", "Bearer " + tokenAdmin)
    .expect(400)
    .then((response) => {
        expect(response.body.message).toBe("Vous devez ajouter la description du projet");
      });
    
  }); 
  
test("get all projects ", async () => {
    await supertest(app)
      .get("/api/project/getAllProjects")
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).toBeTruthy();
      });
  });
  
test("get project details ", async () => {
    await supertest(app)
      .get("/api/project/getProjectDetails/5ff60348200a2d44fd744234")
      .expect(200)
      .then((response) => {
        expect(response.body._id).toBeTruthy();
        expect(response.body.projectStatus).toBe("en-cours");
      });
  });
test("Echec get project details", async () => {
    await supertest(app)
      .get("/api/project/getProjectDetails/12345")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Projet non trouvé");
      });
  });
  

  
test("delete project ", async () => {
    await supertest(app)
      .delete("/api/project/deleteProject/5ff8bd523c8a640a0082cf77")
      .set("Authorization", "Bearer " + tokenAdmin)
      .expect(200)
      .then((response) => {
        expect(response.body.message).toBe("Projet supprimé avec succès");
      });
  });