import * as reportService from "../../services/reportServices.js";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";

let averData;
let objectsMorningM;

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
    
    const errors = [];

    let sports = await params.has('sports') ? params.get('sports'): '';
    let study = await params.has('study') ?  params.get('study'): '';
    let eating = await params.has('eating') ? params.get('eating'): '';
    let moodEvening = await params.has('moodEvening') ?  params.get('moodEvening'): '';
    let date = await params.get('date');
    let user = await session.get('user');

    if (!params.has('sports') || Number(params.get('sports')) < 0 ) {
        errors.push('Invalid sports Duration');
    } 
    if (!params.has('study') || Number(params.get('study')) < 0 ) {
        errors.push('Invalid study Duration');
    } 

    if (!params.has('eating') || Number(params.get('eating')) < 1
    || Number(params.get('eating')) > 5 )  {
        errors.push('Invalid eating Quality');
    }

    if (!params.has('moodEvening') || Number(params.get('moodEvening')) < 1
    || Number(params.get('moodEvening')) > 5 )  {
        errors.push('Invalid moodEvening mood value');
    }

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
    || Number(params.get('sleepQuality')) > 5 )  {
        errors.push('Invalid Sleep Quality');
    }

    if (!params.has('moodMorning') || Number(params.get('moodMorning')) < 1
    || Number(params.get('moodMorning')) > 5 )  {
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
  

const getAverage = async (user, yyyy, mm, dd, flag) => {
    const objectsMorning = await reportService.getWeeklyMorningReport(user,yyyy ,mm,dd, flag);
    
    let Aver_sleepduration = objectsMorning[0];
    let Aver_sleepquality = objectsMorning[1];
    let Aver_moodmorning = objectsMorning[2];
    
    const objectsEvening = await reportService.getWeeklyEveningReport(user,yyyy ,mm,dd, flag);

    let Aver_sports = objectsEvening[0];
    let Aver_study = objectsEvening[1];
    let Aver_eating = objectsEvening[2];
    let Aver_evening = objectsEvening[2];
    let Aver_mood = (Number(Aver_evening) + Number(Aver_moodmorning)) / 2;

    return {Aver_sleepduration: objectsMorning[0],            
        Aver_sleepquality:objectsMorning[1],
        Aver_moodmorning:objectsMorning[2], 
        Aver_sports : objectsEvening[0],
        Aver_study : objectsEvening[1],
        Aver_eating : objectsEvening[2],
        Aver_evening : objectsEvening[3],
        Aver_mood: Aver_mood
    }
}

const getSummarization = async({render, session}) => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    
    today = yyyy + '-' + mm + '-' + dd;

    const user = await session.get('user');

    averData = await getAverage(user,yyyy ,mm,dd, "week");
    objectsMorningM = await getAverage(user,yyyy ,mm,dd, "month");

    if(averData.length != 0 && objectsMorningM.length != 0)
    {
        render('summary.ejs', {  
            sleepDuration: averData.Aver_sleepduration, 
            sports:averData.Aver_sports, 
            study:averData.Aver_study, 
            sleepQuality: averData.Aver_sleepquality,
            mood:averData.Aver_mood, 
            sleepDurationM: objectsMorningM.Aver_sleepduration, sportsM:objectsMorningM.Aver_sports, 
            studyM:objectsMorningM.Aver_study, 
            sleepQualityM: objectsMorningM.Aver_sleepquality, moodM:objectsMorningM.Aver_mood
        });
    }
    else
    {
        console.log("don't exist evening data");
    }
}
  
function getDateOfWeek(w, y) {
    var d = (1 + (w - 1) * 7); // 1st of January + 7 days for each week

    return new Date(y, 0, d);
}

const postSummarization = async({render,request, session}) => {
    const body = request.body();
    const params = await body.value;
    
    const errors = [];
    const user = await session.get('user');
    if(params.has('hiddenWeek'))
    {
        console.log("weekChange");
        let weekNumber = params.has('weekNumber') ? params.get('weekNumber'): '';
        let week = Number(weekNumber.slice(6));
        let year = Number(weekNumber.slice(0,4));

        let date = getDateOfWeek(week,year);
        var dd = String(date.getDate()).padStart(2, '0');
        var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = date.getFullYear();


        averData = await getAverage(user,yyyy ,mm,dd, "week");
        console.log(averData.length);
  
        if(averData.length != 0)
        {
            render('summary.ejs', { 
                sleepDuration: averData.Aver_sleepduration, 
                sports:averData.Aver_sports, 
                study:averData.Aver_study, 
                sleepQuality: averData.Aver_sleepquality,
                mood:averData.Aver_mood, 
                sleepDurationM: objectsMorningM.Aver_sleepduration, sportsM:objectsMorningM.Aver_sports, 
                studyM:objectsMorningM.Aver_study, 
                sleepQualityM: objectsMorningM.Aver_sleepquality, moodM:objectsMorningM.Aver_mood
            });
            
        }
        else if ((params.has('hiddenMonth')))
        {
            console.log("don't exist evening data");
        }
    }
    else
    {
        console.log("monthChange");

        let monthNumber = params.has('monthNumber') ? params.get('monthNumber'): '';
        console.log(monthNumber);
        let mm = Number(monthNumber.slice(5));
        let yyyy = Number(monthNumber.slice(0,4));
        let dd = new Date(yyyy, mm+1, 0);
        console.log(dd);
        dd = String(dd.getDate()).padStart(2, '0');
        console.log(dd);

        objectsMorningM = await getAverage(user,yyyy , mm, dd, "month");
        console.log(objectsMorningM);
  
        if(averData.length != 0)
        {
            render('summary.ejs', { 
                sleepDuration: averData.Aver_sleepduration, 
                sports:averData.Aver_sports, 
                study:averData.Aver_study, 
                sleepQuality: averData.Aver_sleepquality,
                mood:averData.Aver_mood, 
                sleepDurationM: objectsMorningM.Aver_sleepduration, sportsM:objectsMorningM.Aver_sports, 
                studyM:objectsMorningM.Aver_study, 
                sleepQualityM: objectsMorningM.Aver_sleepquality, moodM:objectsMorningM.Aver_mood
            });
            
        }
        else if ((params.has('hiddenMonth')))
        {
            console.log("don't exist evening data");
        }
    }
    

}

export { showLoginForm, showRegistrationForm, postRegistrationForm, postLoginForm, addMorningReport, showMorningReport, getWeeklyMorningReport,addEveningReport, showEveningReport, behaviorReporting,getSummarization,postSummarization};