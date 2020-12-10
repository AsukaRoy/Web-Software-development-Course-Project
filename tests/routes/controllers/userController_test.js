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
