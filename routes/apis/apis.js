import * as newsService from "../../services/newsServices.js";
import * as reportService from "../../services/reportServices.js";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";

const getNewsList = async({response}) => {
    response.body = await newsService.getNewsList();
};

const getNewsItem = async({params, response}) => {
    response.body = await newsService.getNewsItem(params.id);
};

const showMorningReport = ({render}) => {
    render('morning.ejs');
}

const addMorningReport = async({request, response, session}) => {
    const body = request.body();
    const params = await body.value;
    
    const sleepDuration = params.get('sleepDuration');
    const sleepQuality = await params.get('sleepQuality');
    const moodMorning = params.get('moodMorning');
    const date = await params.get('date');
    const user = await session.get('user');
    await reportService.addMorningReport(sleepDuration,sleepQuality,moodMorning,date,user);
    response.status = 200;
};

const postLoginForm = async({request, response, session}) => {
    const body = request.body();
    const params = await body.value;
  
    const email = params.get('email');
    const password = params.get('password');
  
    // check if the email exists in the database
    const res = await reportService.getUser(email);
    
    if (res === {}) {
        response.status = 401;
        return;
    }
  
    // take the first row from the results
    const userObj = res;
    const hash = userObj.password;
    const passwordCorrect = await bcrypt.compare(password, hash);
    if (!passwordCorrect) {
        response.status = 401;
        return;
    }

    console.log("authenticated");
    await session.set('authenticated', true);
    await session.set('user', {
        id: userObj.id,
        email: userObj.email
    });
    response.body = 'Authentication successful!';
}

const postRegistrationForm = async({request, response}) => {
    const body = request.body();
    const params = await body.value;
    
    const email = params.get('email');
    const password = params.get('password');
    const verification = params.get('verification');
  
    if (password !== verification) {
      response.body = 'The entered passwords did not match';
      return;
    }
  
    const existingUsers = await reportService.getUser(email);
    if (existingUsers.rowCount > 0) {
      response.body = 'The email is already reserved.';
      return;
    }
  
    const hash = await bcrypt.hash(password);
    await reportService.addUser(email, hash);
    response.body = 'Registration successful!';
};

const showRegistrationForm = ({render}) => {
    render('register.ejs');
}

const showLoginForm = ({render}) => {
    render('login.ejs');
}
  
export { showLoginForm, showRegistrationForm, postRegistrationForm, postLoginForm, addMorningReport, showMorningReport};