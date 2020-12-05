import { executeQuery } from "../database/database.js";

const getNewsList = async() => {
    const res = await executeQuery("SELECT * FROM news");
    if (!res) {
        return [];
    }
    return res.rowsOfObjects();
}

const getNewsItem = async(id) => {
    const res = await executeQuery("SELECT * FROM news WHERE id = $1", id);
    if (!res) {
        return {};
    }

    return res.rowsOfObjects()[0];
}

const deleteNewsItem = async(id) => {
    await executeQuery("DELETE FROM news WHERE id = $1", id);
}

const addNewsItem = async(title, content) => {
    await executeQuery("INSERT INTO news (title, content) VALUES ($1, $2)", title, content);
}

const addMorningReport = async(sleepDuration,sleepQuality,moodMorning,date, user) => {
    await executeQuery("INSERT INTO morningReports (sleepDuration,sleepQuality,moodMorning,date, user_id) VALUES ($1, $2, $3, $4, $5)", sleepDuration,sleepQuality,moodMorning, date, user.id);
}

const getUser = async(email) => {
    const res =  await executeQuery("SELECT * FROM users WHERE email = $1;", email);
    if (!res) {
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

export { getUser, addUser, addMorningReport};
