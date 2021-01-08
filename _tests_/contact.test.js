const supertest = require("supertest");
const app = require("../app");
const tokenAdmin ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZmJkM2MyN2Y0ODAxZjFjNDBmNGI4YjAiLCJyb2xlIjoiYWRtaW4iLCJmaXJzdE5hbWUiOiJhZG1pbiIsImxhc3ROYW1lIjoiYWRtaW4iLCJ1cmxJbWFnZSI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvdXNlci9hcHAvaW1hZ2VzLzVmYmQzYzI3ZjQ4MDFmMWM0MGY0YjhiMC5wbmciLCJpYXQiOjE2MTAxMTI3NjQsImV4cCI6MTYxMDE5OTE2NH0.JAYA42LSCma05aKYBbrsKg8VaMzWoFz3ohDpkgtPV68";

test("manage contact test forbidden add ", async () => {
    const data = {
        address: "adresse darna",
        phone:"12345678",
        email:"darna@gmail.com"
      };
  await supertest(app)
    .post("/api/contact/manageContact")
    .set("Authorization", "Bearer " + tokenAdmin)
    .send(data)
    .expect(403)
    .then((response) => {
        expect(response.body.message).toBe("Ajout interdit");
    });
});

test("get contact ", async () => {
  await supertest(app)
    .get("/api/contact/getContact")
    .expect(200)
    .then((response) => {
        expect(Array.isArray(response.body)).toBeTruthy();
    });
});
