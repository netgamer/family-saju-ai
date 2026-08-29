import fs from 'node:fs';
import path from 'node:path';

const appPath = path.resolve('src/App.tsx');
let source = fs.readFileSync(appPath, 'utf8');

// Production correction for the lightweight reference calculator.
const start = source.indexOf('function calcPillars(');
const end = source.indexOf('\nfunction relationText', start);
if (start >= 0 && end > start) {
  const replacement = `function calcPillars(date:string,time:string):Pillars{\n  const d=new Date(\`${'${date}'}T\${'${time||\'12:00\''}:00\`);\n  const y=d.getFullYear(),m=d.getMonth()+1,day=d.getDate(),hour=d.getHours();\n  const yearIndex=((y-4)%60+60)%60;\n  const year=\`${'${stems[yearIndex%10]}'}${'${branches[yearIndex%12]}'}\`;\n  const termDays=[6,4,6,5,6,6,7,7,8,8,7,7];\n  const branchByMonth=[1,2,3,4,5,6,7,8,9,10,11,0];\n  const threshold=termDays[m-1];\n  const monthBranch=(branchByMonth[m-1]-(day<threshold?1:0)+12)%12;\n  const monthStem=((yearIndex%10)%5*2+monthBranch)%10;\n  const month=\`${'${stems[monthStem]}'}${'${branches[monthBranch]}'}\`;\n  const days=Math.floor(Date.UTC(y,m-1,day)/86400000);\n  const dayIndex=((days+49)%60+60)%60;\n  const dayP=\`${'${stems[dayIndex%10]}'}${'${branches[dayIndex%12]}'}\`;\n  const hourBranch=Math.floor(((hour+1)%24)/2);\n  const timeP=\`${'${stems[(dayIndex%10*2+hourBranch)%10]}'}${'${branches[hourBranch]}'}\`;\n  const elements={목:0,화:0,토:0,금:0,수:0} as Record<string,number>;\n  [year,month,dayP,timeP].forEach(p=>[...p].forEach(c=>elements[elementOf(c)]++));\n  return{year,month,day:dayP,time:timeP,elements};\n}`;
  source = source.slice(0,start) + replacement + source.slice(end);
  fs.writeFileSync(appPath, source);
}
