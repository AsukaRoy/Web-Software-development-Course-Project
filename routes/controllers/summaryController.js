import * as reportService from "../../services/reportServices.js";

let averData;
let objectsMorningM;

function getDateOfWeek(w, y) {
    var d = (1 + (w - 1) * 7); // 1st of January + 7 days for each week

    return new Date(y, 0, d);
}

const getAverage = async (user, yyyy, mm, dd, flag) => {
    const objectsMorning = await reportService.getWeeklyMorningReport(user,yyyy ,mm,dd, flag);
    
    let Aver_moodmorning = objectsMorning[2];
    
    const objectsEvening = await reportService.getWeeklyEveningReport(user,yyyy ,mm,dd, flag);
    
    let Aver_evening = objectsEvening[2];
    let Aver_mood = (Number(Aver_evening) + Number(Aver_moodmorning)) / 2;

    return {Aver_sleepquality: objectsMorning[0],            
        Aver_sleepduration:objectsMorning[1],
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

export {getSummarization,postSummarization};