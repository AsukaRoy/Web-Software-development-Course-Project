import { executeQuery } from "../database/database.js";


const getTodayMorningReport = async(user) => {
    console.log(user);
    const res = await executeQuery("SELECT * FROM morningReports WHERE user_id = $1 AND date = CURRENT_DATE" , user.id);
    if (res.rowCount === 0) {
        return {};
    }
    return res.rowsOfObjects();
}

const getTodayEveningReport = async(user) => {
    const res = await executeQuery("SELECT * FROM eveningReports WHERE user_id = $1 AND date = CURRENT_DATE" , user.id);
    if (res.rowCount === 0) {
        return {};
    }
    return res.rowsOfObjects();
}

const getWeeklyMorningReport = async(user, yyyy ,mm, dd, flag) => {
    if(flag === "week")
    {
        console.log(flag);
        var res = await executeQuery("SELECT AVG(sleepQuality), AVG(sleepDuration), AVG(moodMorning) FROM morningReports WHERE user_id = $1 AND date > make_date($2, $3, $4) - 7 AND date <=  make_date($2, $3, $4)" , user.id, Number(yyyy),Number(mm),Number(dd));

    }
    else if(flag === "month")
    {
        
        var res = await executeQuery("SELECT AVG(sleepQuality), AVG(sleepDuration), AVG(moodMorning) FROM morningReports WHERE user_id = $1 AND date > make_date($2, $3, $4) - 30 AND date <=  make_date($2, $3, $4)" , user.id, Number(yyyy),Number(mm),Number(dd));

    }
    

    if (res.rows[0][0] === null) {
        console.log("null");
        return [];
    }
    return res.rows[0];
}


const getWeeklyEveningReport = async(user, yyyy ,mm, dd, flag) => {

    if(flag === "week")
    {
        var res = await executeQuery("SELECT AVG(sports), AVG(study), AVG(eating) , AVG(moodEvening) FROM eveningReports WHERE user_id = $1 AND date > make_date($2, $3, $4) - 7 AND date <=  make_date($2, $3, $4)" , user.id, Number(yyyy),Number(mm),Number(dd));

    }
    else if(flag === "month")
    {
        var res = await executeQuery("SELECT AVG(sports), AVG(study), AVG(eating) , AVG(moodEvening) FROM eveningReports WHERE user_id = $1 AND date > make_date($2, $3, $4) - 30 AND date <=  make_date($2, $3, $4)" , user.id, Number(yyyy),Number(mm),Number(dd));
    }

    if (res.rows[0][0] === null) {
        console.log("null");
        return [];
    }
    return res.rows[0];
}

const addMorningReport = async(sleepDuration,sleepQuality,moodMorning,date, user) => {

    const res =  await executeQuery("SELECT * FROM morningReports WHERE user_id = $1 AND date = $2;", user.id, date);
    console.log(date);
    if (res.rowCount === 0) {
        console.log("INSERT");
        await executeQuery("INSERT INTO morningReports (sleepDuration,sleepQuality,moodMorning,date, user_id) VALUES ($1, $2, $3, $4, $5)", sleepDuration,sleepQuality,moodMorning, date, user.id);
    }else{
        console.log("UPDATE");
        await executeQuery("UPDATE morningReports SET sleepDuration = $1 ,sleepQuality = $2,moodMorning = $3 WHERE date = $4 AND user_id = $5", sleepDuration,sleepQuality,moodMorning, date, user.id);
    }
}

const addEveningReport = async(sports,study,eating,moodEvening,date,user) => {

    const res =  await executeQuery("SELECT * FROM eveningReports WHERE user_id = $1 AND date = $2;", user.id, date);

    if (res.rowCount === 0) {
        console.log("INSERT");
        await executeQuery("INSERT INTO eveningReports (sports, study, eating,  moodEvening, date, user_id) VALUES ($1, $2, $3, $4, $5, $6)", sports,study, eating, moodEvening, date, user.id);
    }else{
        console.log("UPDATE");
        await executeQuery("UPDATE eveningReports SET sports = $1 ,study = $2,eating = $3 moodEvening = $4 WHERE date = $5 AND user_id = $6", sports,study, eating, moodEvening, date, user.id);
    }
}

const getUser = async(email) => {
    console.log(email);
    const res =  await executeQuery("SELECT * FROM users WHERE email = $1;", email);
    console.log(res.rowCount);
    console.log(res.rows.length);
    if (res.rowCount === 0) {
        console.log('return {}');
        return {};
    }

    return res.rowsOfObjects()[0];
}

const addUser = async(email, hash) => {
    const res =  await executeQuery("INSERT INTO users (email, password) VALUES ($1, $2);", email, hash);
    if (res.rowCount === 0) {
        return {};
    }

    return res.rowsOfObjects()[0];
}

export { getUser, addUser, addMorningReport, getWeeklyMorningReport, addEveningReport, getWeeklyEveningReport, getTodayMorningReport, getTodayEveningReport};
