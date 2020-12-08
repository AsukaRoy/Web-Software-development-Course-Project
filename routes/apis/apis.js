import * as reportService from "../../services/reportServices.js";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";

const getWeeklyMorningReport = async({request, response,session}) => {
    //const date = await params.get('date');
    const user = await session.get('user');

    const objects = await reportService.getWeeklyMorningReport(user);
    
    let result = {
        Aver_sleepduration:0.0,
        Aver_sleepquality:0.0,
        Aver_moodmorning:0.0
    }

    objects.forEach((object) => {
        result.Aver_sleepquality += parseFloat(object.sleepquality);
    });
    result.Aver_sleepquality /= objects.length;
    console.log(result.Aver_sleepquality);
    response.status = 200;
};

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


const addMorningReport = async({request, response, session, render}) => {
    const body = request.body();
    const params = await body.value;
    
    const errors = [];

    let sleepDuration = await params.has('sleepDuration') ? params.get('sleepDuration'): '';
    let sleepQuality = await params.has('sleepQuality') ? params.get('sleepQuality'): '';
    let moodMorning = await params.has('moodMorning') ? params.get('moodMorning'): '';
    const date = await params.get('date');
    const user = await session.get('user');


    if (!params.has('sleepDuration') || Number(params.get('sleepDuration')) < 0 ) {
        errors.push('Invalid Sleep Duration');
    } 
    
    if (!params.has('sleepQuality') || Number(params.get('sleepQuality')) < 1
    || Number(params.get('sleepQuality')) > 10 )  {
        errors.push('Invalid Sleep Quality');
    }

    if (!params.has('moodMorning') || Number(params.get('moodMorning')) < 1
    || Number(params.get('moodMorning')) > 10 )  {
        errors.push('Invalid morning mood value');
    }

    if (errors.length === 0) {
        await reportService.addMorningReport(sleepDuration,sleepQuality,moodMorning, date, user);
        response.status = 200;
    } else{
        render('morning.ejs', { errors: errors, sleepDuration: sleepDuration, sleepQuality: sleepQuality, moodMorning: moodMorning});
        return;
    }
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
    render('morning.ejs', { errors: [], sleepDuration: '', sleepQuality: 0,moodMorning:0});
}

const showEveningReport = ({render}) => {
    render('evening.ejs');
}

const behaviorReporting = async({render, session}) => {
    const user = await session.get('user');
    const info = [];
    let res = await reportService.getTodayMorningReport(user);
    if (Object.keys(res).length === 0) {
        info.push("Today's morning report has not finished");
    } else
    {
        info.push("Today's morning report has finished");
    }
    res = await reportService.getTodayEveningReport(user);
    if (Object.keys(res).length === 0) {
        info.push("Today's evening report has not finished");
    } else
    {
        info.push("Today's evening report has finished");
    }
    render('reporting.ejs', { info: info});
}
  
const getSummarization = async({render, session}) => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    
    today = yyyy + '-' + mm + '-' + dd;

    const user = await session.get('user');

    const objectsMorning = await reportService.getWeeklyMorningReport(user,yyyy ,mm,dd);
    console.log(objectsMorning);
 
    let Aver_sleepduration = objectsMorning[0];
    let Aver_sleepquality = objectsMorning[1];
    let Aver_moodmorning = objectsMorning[2];
    

    const objectsEvening = await reportService.getWeeklyEveningReport(user,yyyy ,mm,dd);
    console.log(objectsEvening);

    let Aver_sports = objectsEvening[0];
    let Aver_study = objectsEvening[1];
    let Aver_eating = objectsEvening[2];
    let Aver_evening = objectsEvening[2];

    let Aver_mood = (Number(Aver_evening) + Number(Aver_moodmorning)) / 2;
    if(objectsMorning.length != 0 && objectsMorning.length != 0)
    {
        render('summary.ejs', { weekNumber: 1, sleepDuration: Aver_sleepduration, sports:Aver_sports, study:Aver_study, sleepQuality: Aver_sleepquality,mood:Aver_mood});
    }
    else
    {
        console.log("don't exist evening data");
    }
}
  
const postSummarization = async({render, session}) => {

}

export { showLoginForm, showRegistrationForm, postRegistrationForm, postLoginForm, addMorningReport, showMorningReport, getWeeklyMorningReport,addEveningReport, showEveningReport, behaviorReporting,getSummarization,postSummarization};