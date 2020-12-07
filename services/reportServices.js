import { executeQuery } from "../database/database.js";

const getNewsList = async() => {
    const res = await executeQuery("SELECT * FROM news");
    if (!res) {
        return [];
    }
    return res.rowsOfObjects();
}



const deleteNewsItem = async(id) => {
    await executeQuery("DELETE FROM news WHERE id = $1", id);
}

const addNewsItem = async(title, content) => {
    await executeQuery("INSERT INTO news (title, content) VALUES ($1, $2)", title, content);
}

const getWeeklyMorningReport = async(user) => {
    console.log(user);
    const res = await executeQuery("SELECT * FROM morningReports WHERE user_id = $1 AND date >= CURRENT_DATE - 7" , user.id);
    if (!res) {
        return {};
    }
    return res.rowsOfObjects();
}

const getWeeklyEveningReport = async(user) => {
    console.log(user);
    const res = await executeQuery("SELECT * FROM eveningReports WHERE user_id = $1 AND date >= CURRENT_DATE - 7" , user.id);
    if (!res) {
        return {};
    }
    return res.rowsOfObjects();
}

const addMorningReport = async(sleepDuration,sleepQuality,moodMorning,date, user) => {
    await executeQuery("INSERT INTO morningReports (sleepDuration,sleepQuality,moodMorning,date, user_id) VALUES ($1, $2, $3, $4, $5)", sleepDuration,sleepQuality,moodMorning, date, user.id);
}

const addEveningReport = async(sports,study,eating,moodEvening,date,user) => {
    await executeQuery("INSERT INTO eveningReports (sports, study, eating,  moodEvening, date, user_id) VALUES ($1, $2, $3, $4, $5, $6)", sports,study, eating, moodEvening, date, user.id);
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
    if (!res) {
        return {};
    }

    return res.rowsOfObjects()[0];
}

export { getUser, addUser, addMorningReport, getWeeklyMorningReport, addEveningReport, getWeeklyEveningReport};
