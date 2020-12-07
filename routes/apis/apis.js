import * as reportService from "../../services/reportServices.js";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";



const addEveningReport = async({request, response, session}) => {
    const body = request.body();
    const params = await body.value;
    
    const sports = params.get('sports');
    const study = await params.get('study');
    const eating = params.get('eating');
    const moodEvening = await params.get('moodEvening');
    const date = await params.get('date');
    const user = await session.get('user');

    await reportService.addEveningReport(sports,study,eating,moodEvening,date,user);

    response.status = 200;
};

const getWeeklyMorningReport = async({request, response,session}) => {
    const body = request.body();
    const params = await body.value;

    //const date = await params.get('date');
    const user = await session.get('user');
    console.log("Reports");
    console.log(user);
    const objects = await reportService.getWeeklyMorningReport(user);
    console.log(objects);
    
    let result = {
        Aver_sleepduration:0.0,
        Aver_sleepquality:0.0,
        Aver_moodmorning:0.0
    }

    objects.forEach((object) => {
        result.Aver_sleepquality += parseFloat(object.sleepquality);
    });
    result.Aver_sleepquality /= objects.length;
    response.status = 200;
};

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

const postLoginForm = async({request, response, session,render}) => {
    const body = request.body();
    const params = await body.value;
    
    const errors = [];

    let email = params.has('email') ? params.get('email'): '';
    let password = params.has('password') ? params.get('password'): '';
  
    if (!params.has('email') || params.get('email').length < 4) {
        errors.push('Invalid email');
    } 
    
    if (!params.has('password') || params.get('password').length < 4) {
        errors.push('Invalid password');
    }

    // check if the email exists in the database
    const res = await reportService.getUser(email);
    console.log(res);
    console.log(res === {});
    if (Object.keys(res).length === 0) {
        errors.push('Invalid email');
        console.log("Invalid email");
        render('login.ejs', { errors: errors, email: "", password: '' });
        return;

    }
  
    // take the first row from the results
    const userObj = res;
    const hash = userObj.password;
    const passwordCorrect = await bcrypt.compare(password, hash);
    console.log("Finish compare");
    if (!passwordCorrect) {
        errors.push('Invalid password');
        console.log("Invalid password");
        render('login.ejs', { errors: errors, email: "", password: "" });
        return;
    }
    console.log("errors");
    if (errors.length === 0) {
        email = '';
        password = '';
    }

    ;
    await session.set('authenticated', true);
    await session.set('user', {
        id: userObj.id,
        email: userObj.email
    });
    response.body = 'Authentication successful!';
}

const postRegistrationForm = async({request, response, render}) => {
    const body = request.body();
    const params = await body.value;
  
    const errors = [];

    let email = params.has('email') ? params.get('email'): '';
    let password = params.has('password') ? params.get('password'): '';
    let verification = params.has('verification') ? params.get('verification'): '';

    if (!params.has('email') || params.get('email').length < 4) {
        errors.push('Invalid email');
    } 
    
    if (!params.has('password') || params.get('password').length < 4) {
        errors.push('Invalid password');
    }

    if (!params.has('verification') || params.get('verification').length < 4) {
        errors.push('Invalid second password');
    }

    console.log("compare");
    if (password !== verification) {
      errors.push('Invalid second password');
      console.log("Invalid second password");
      render('register.ejs', { errors: errors, email: email, password: "",verification:""  });
      return;
    }
  
    const existingUsers = await reportService.getUser(email);
    if (existingUsers.rowCount > 0) {
      errors.push('The email is already reserved.');
      render('register.ejs', { errors: errors, email: email, password: "",verification:""  });
      return;
    }
  
    const hash = await bcrypt.hash(password);
    await reportService.addUser(email, hash);
    response.body = 'Registration successful!';
};

const showRegistrationForm = ({render}) => {
    render('register.ejs', { errors: [], email: '', password: '', verification:""   });
}

const showLoginForm = ({render}) => {
    render('login.ejs', { errors: [], email: '', password: ''});
}

const showMorningReport = ({render}) => {
    render('morning.ejs');
}

const showEveningReport = ({render}) => {
    render('evening.ejs');
}
  
export { showLoginForm, showRegistrationForm, postRegistrationForm, postLoginForm, addMorningReport, showMorningReport, getWeeklyMorningReport,addEveningReport, showEveningReport};