import { assertEquals, superoak } from "../../../deps.js";
import app from "../../../app.js";
import * as userController from "../../../routes/controllers/userController.js";

const checkEjsFilePath = (theController, filePath) => {
  let checkValue;
  const mockRender = (value) => {
    checkValue = value;
  };
  const mockContext = {
    render: mockRender,
  };

  theController(mockContext);
  assertEquals(checkValue, filePath);
};

Deno.test("showLoginForm", async () => {
  const testClient = await superoak(app);
  await testClient.get("/auth/login").expect(200);

  checkEjsFilePath(userController.showLoginForm, "login.ejs");
});

Deno.test("showRegistrationForm", async () => {
  const testClient = await superoak(app);
  await testClient.get("/auth/register").expect(200);

  checkEjsFilePath(userController.showRegistrationForm, "register.ejs");
});

Deno.test("showRoot", async () => {
  const testClient = await superoak(app);
  await testClient.get("/").expect(200);

  checkEjsFilePath(userController.showRoot, "index.ejs");
});

Deno.test("postRegistrationForm success", async () => {
  const testClient = await superoak(app);

  const email = `a${Math.floor(Math.random() * 1000000)}@a.a`;

  const response = await testClient
    .post("/auth/register")
    .send(`email=${email}`, "password=1234", "verification=1234")
    .expect("Registration successful!");
});
