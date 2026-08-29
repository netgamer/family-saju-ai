import fs from 'node:fs';
import path from 'node:path';

const appPath = path.resolve('src/App.tsx');
let source = fs.readFileSync(appPath, 'utf8');

// Keep the UI source readable while applying a deterministic production fix.
// The previous calculator used calendar months as lunar/solar-term months and
// therefore produced misleading 월주 values. This replacement uses the common
// 절기 boundaries (입춘/경칩/청명/입하/망종/소서/입추/백로/한로/입동/대설/소한)
// as a lightweight reference calculation. It deliberately remains labelled
// 참고용 in the UI rather than pretending to be a professional 만세력 engine.
const start = source.indexOf('function calcPillars(');
const end = source.indexOf('\nfunction relationText', start);
if (start >= 0 && end > start) {
  const replacement = `function calcPillars(date:string,time:string):Pillars{\n  const d=new Date(\`${'${date}'}T${'${time||\'12:00\''}:00\`);\n  const y=d.getFullYear(),m=d.getMonth()+1,day=d.getDate(),hour=d.getHours();\n  const sexagenary=((y-4)%60+60)%60;\n  const year=\`${'${stems[sexagenary%10]}'}${'${branches[sexagenary%12]}'}\`;\n  const solarTerms=[[2,4],[3,6],[4,5],[5,6],[6,6],[7,7],[8,7],[9,8],[10,8],[11,7],[12,7],[1,6]];\n  const termIndex=(m===1&&day<solarTerms[11][1])?11:((m-1)+((day>=solarTerms[m-1][1])?0:-1)+12)%12;\n  const monthBranch=termIndex===11?1:(termIndex+2)%12;\n  const monthStem=(((y-4)%10+10)%10*2+monthBranch)%10;\n  const month=\`${'${stems[monthStem]}'}${'${branches[monthBranch]}'}\`;\n  const days=Math.floor(Date.UTC(y,m-1,day)/86400000);\n  const di=((days+49)%60+60)%60;\n  const dayP=\`${'${stems[di%10]}'}${'${branches[di%12]}'}\`;\n  const hourBranch=Math.floor(((hour+1)%24)/2);\n  const timeP=\`${'${stems[(di%10*2+hourBranch)%10]}'}${'${branches[hourBranch]}'}\`;\n  const elements={목:0,화:0,토:0,금:0,수:0} as Record<string,number>;\n  [year,month,dayP,timeP].forEach(p=>[...p].forEach(c=>elements[elementOf(c)]++));\n  return{year,month,day:dayP,time:timeP,elements};\n}`;
  source = source.slice(0,start) + replacement + source.slice(end);
  fs.writeFileSync(appPath, source);
}
`;
