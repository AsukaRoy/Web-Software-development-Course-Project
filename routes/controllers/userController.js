import * as reportService from "../../services/reportServices.js";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";

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

    if (Object.keys(res).length === 0) {
        errors.push('Invalid email');
        render('login.ejs', { errors: errors, email: "", password: '' });
        return;
    }
  
    // take the first row from the results
    const userObj = res;
    const hash = userObj.password;
    const passwordCorrect = await bcrypt.compare(password, hash);

    if (!passwordCorrect) {
        errors.push('Invalid password');
        render('login.ejs', { errors: errors, email: "", password: "" });
        return;
    }

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
      response.body = 'Invalid second password!';
      return;
    }
  
    const existingUsers = await reportService.getUser(email);
    if (existingUsers.rowCount > 0) {
      errors.push('The email is already reserved.');
      render('register.ejs', { errors: errors, email: email, password: "",verification:""  });
      response.body = 'IThe email is already reserved.';
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

const showRoot = async({render}) => {
    const data = reportService.getAverageMood();
    let info;
    let averToday = Number((await data).averToday); 
    let averYesterday = Number((await data).averYesterday);
    if(averToday >= averYesterday)
    {
        info = "Things are looking bright today";
    }
    else
    {
        info = "Things are looking gloomy today";
    }
    
    render('index.ejs', {averToday:averToday, averYesterday:averYesterday,info:info});
}

const logout = async({response, session}) => {
    await session.set('authenticated', false);
    response.body = 'logout successful!';
}

export { showLoginForm, showRegistrationForm, postRegistrationForm, postLoginForm,showRoot, logout}