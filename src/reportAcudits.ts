let tempReportAcudit: ReportAcudit[] = [];
let reportAcudits: ReportAcudit[] = [];

interface ReportAcudit {
    joke: string;
    score: number;
    date: string;
}

export function report(joke: string, rating: number) {
    const date = new Date().toISOString();

    const reportEntry: ReportAcudit = {
        joke: joke,
        score: rating,
        date: date
    };

    tempReportAcudit.pop();
    tempReportAcudit.push(reportEntry);
    console.log("tempReportAcudit: ", tempReportAcudit);
}

export function setReport(){
    localStorage.setItem('reportAcudits', JSON.stringify(reportAcudits));
    reportAcudits = [...reportAcudits, ...tempReportAcudit];
    tempReportAcudit = [];
    //console.log("tempReportAcudit setReport: ", tempReportAcudit);
    console.log("reportAcudits[] : ", reportAcudits);
}