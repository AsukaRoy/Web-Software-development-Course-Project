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

export { getNewsList, getNewsItem, deleteNewsItem, addNewsItem };
