import { assertEquals, assertMatch, superoak } from "../../../deps.js";
import app from "../../../app.js";
import * as userController from "../../../routes/controllers/userController.js";
import * as reportService from "../../../services/reportServices.js";

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

const getRandomEmail = async () => {
  const email = `a${Math.floor(Math.random() * 10000000)}@a.a`;
  const existingUsers = await reportService.getUser(email);
  if (existingUsers.rowCount > 0) {
    return await getRandomEmail();
  } else {
    return email;
  }
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

Deno.test("postRegistrationForm success", async () => {
  const testClient = await superoak(app);

  const email = await getRandomEmail();

  await testClient
    .post("/auth/register")
    .send(`email=${email}`, "password=1234", "verification=1234")
    .expect("Registration successful!");
});

Deno.test("postLoginForm success", async () => {
  let testClient = await superoak(app);
  // let checkValue = {};
  // const mockSessionSet = (key, value) => {
  //   checkValue[key] = value;
  // };
  // const mockContext = {
  //   session: {
  //     set: mockSessionSet,
  //   },
  // };
  const email = await getRandomEmail();

  await testClient
    .post("/auth/register")
    .send(`email=${email}`, "password=1234", "verification=1234")
    .expect("Registration successful!");
  testClient = await superoak(app);
  const response = await testClient
    .post("/auth/login")
    .send(`email=${email}`, "password=1234")
    .expect("Authentication successful!");
  assertMatch(response.headers["set-cookie"], /sid=/i);
  // console.log(
  //   "🚀 ~ file: userController_test.js ~ line 83 ~ Deno.test ~ response",
  //   response
  // );
});
