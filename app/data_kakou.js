const fs = require('fs');
const csv = require('csv');
const papaparse = require('papaparse');
const jsonObject = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
const FileSaver = require('file-saver');
const header = ['YearMonthDay', 'Infected person(Accumulation)', 'Patient(Accumulation)', 'Discharge(Accumulation)', 'Deceased(Accumulation)','Severely ill(Accumulation)', 'Infected person(Previous day difference)', 'Patient(Previous day difference)', 'Discharge(Previous day difference)', 'Deceased(Previous day difference)', 'Severely ill(Previous day difference)'];
const result = [];
//感染者数・患者数・を入れる。
result.push(header);
for(var i=0;i<jsonObject['transition']['carriers'].length;i++){

    let month = '';
    let day = '';
    let yeatMonthDay = '';
    let Infected = 0;//感染者数
    let deceased = 0;//死亡者数
    let serious = 0;//重症者
    let discharge = 0;//退院者数
    let infected_Person_Difference = 0;//感染者前日差異
    let patient_Difference = 0;//患者数前日差異
    let discharge_Difference = 0;//退院者前日差異
    let deceased_Difference = 0;//死亡者数前日差異
    let severely_ill_Difference = 0;//重傷者前日差異
    let infected_Growth_Rate = 0;//感染者増加率
    //年月日の加工YYYYMMDD
if((''+jsonObject['transition']['carriers'][i][1]).length == 1){
    month = '0'+jsonObject['transition']['carriers'][i][1];
}else{
    month = jsonObject['transition']['carriers'][i][1];
}

if((''+jsonObject['transition']['carriers'][i][2]).length == 1){
    day = '0' + jsonObject['transition']['carriers'][i][2];
}else{
    day = jsonObject['transition']['carriers'][i][2];
}
//感染者数の計算
Infected = jsonObject['transition']['carriers'][i][3] +jsonObject['transition']['carriers'][i][4] +　jsonObject['transition']['carriers'][i][5];

//退院者数の計算
discharge = jsonObject['transition']['discharged'][i][3] + jsonObject['transition']['discharged'][i][4]; 
//2020年2月14日から死者が発生したので、それにあわせる。

    deceased = jsonObject['transition']['deaths'][i][3] + jsonObject['transition']['deaths'][i][4];

//2020年2月17日から重症者が発生したので、それにあわせる。
    serious = jsonObject['transition']['serious'][i][3];


//感染者数・患者数・退院数前日差異・感染者増加率を求める
if(i>0){
    infected_Person_Difference = Infected - jsonObject['transition']['carriers'][i-1][3] - jsonObject['transition']['carriers'][i-1][4] - jsonObject['transition']['carriers'][i-1][5];
    deceased_Difference = deceased - jsonObject['transition']['deaths'][i-1][3] - jsonObject['transition']['deaths'][i-1][4]; 
    patient_Difference = jsonObject['transition']['cases'][i][3] - jsonObject['transition']['cases'][i-1][3];
    severely_ill_Difference = jsonObject['transition']['serious'][i][3] -  jsonObject['transition']['serious'][i-1][3];
    discharge_Difference = discharge - jsonObject['transition']['discharged'][i-1][3] - jsonObject['transition']['discharged'][i-1][4];
}
yeatMonthDay = ''+jsonObject['transition']['carriers'][i][0]+month+day;
result.push([yeatMonthDay, Infected, jsonObject['transition']['cases'][i][3], discharge, deceased, serious, infected_Person_Difference, patient_Difference, discharge_Difference, deceased_Difference, severely_ill_Difference]);

}

//CSV出力
var input = result;
csv.stringify(input, function(err, output){
    var output = papaparse.unparse(input);
    fs.writeFileSync('input.csv', output);
});

