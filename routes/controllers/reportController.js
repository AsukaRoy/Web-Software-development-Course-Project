import * as reportService from "../../services/reportServices.js";

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

export { addEveningReport,addMorningReport , showMorningReport, showEveningReport, behaviorReporting}