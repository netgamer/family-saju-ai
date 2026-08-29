import fs from 'node:fs';
import path from 'node:path';

const appPath = path.resolve('src/App.tsx');
let source = fs.readFileSync(appPath, 'utf8');

// Production correction for the lightweight reference calculator.
const start = source.indexOf('function calcPillars(');
const end = source.indexOf('\nfunction relationText', start);
if (start >= 0 && end > start) {
  const replacement = [
    "function calcPillars(date:string,time:string):Pillars{",
    "  const d=new Date(date+'T'+(time||'12:00')+':00');",
    "  const y=d.getFullYear(),m=d.getMonth()+1,day=d.getDate(),hour=d.getHours();",
    "  const yearIndex=((y-4)%60+60)%60;",
    "  const year=stems[yearIndex%10]+branches[yearIndex%12];",
    "  const termDays=[6,4,6,5,6,6,7,7,8,8,7,7];",
    "  const branchByMonth=[1,2,3,4,5,6,7,8,9,10,11,0];",
    "  const monthBranch=(branchByMonth[m-1]-(day<termDays[m-1]?1:0)+12)%12;",
    "  const monthStem=((yearIndex%10)%5*2+monthBranch)%10;",
    "  const month=stems[monthStem]+branches[monthBranch];",
    "  const days=Math.floor(Date.UTC(y,m-1,day)/86400000);",
    "  const dayIndex=((days+49)%60+60)%60;",
    "  const dayP=stems[dayIndex%10]+branches[dayIndex%12];",
    "  const hourBranch=Math.floor(((hour+1)%24)/2);",
    "  const timeP=stems[(dayIndex%10*2+hourBranch)%10]+branches[hourBranch];",
    "  const elements={목:0,화:0,토:0,금:0,수:0} as Record<string,number>;",
    "  [year,month,dayP,timeP].forEach(p=>[...p].forEach(c=>elements[elementOf(c)]++));",
    "  return{year,month,day:dayP,time:timeP,elements};",
    "}"
  ].join('\n');
  source = source.slice(0,start) + replacement + source.slice(end);
  fs.writeFileSync(appPath, source);
}
