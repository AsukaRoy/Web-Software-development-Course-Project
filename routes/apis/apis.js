import * as reportService from "../../services/reportServices.js";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";

const getAverageWeeklyReport = async({response}) => {

    response.body = JSON.stringify(await reportService.getAverageWeeklyReport());
}

const getAverageDailyReport = async({response, params}) => {
    const yyyy = params.year;
    const mm = params.month;
    const dd = params.day;

    response.body = JSON.stringify(await reportService.getAverageDailyReport(yyyy,mm,dd));
}

export { getAverageWeeklyReport, getAverageDailyReport}