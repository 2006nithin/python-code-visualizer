const codeEl=document.getElementById("code"),inputsEl=document.getElementById("inputs"),lineNos=document.getElementById("lineNos"),visualContent=document.getElementById("visualContent"),outputEl=document.getElementById("output");
let execution={events:[],output:"",error:null},stepIndex=0,activeTab="flow";
const scenarioData={
"Shopping Bills & Discounts":{desc:"Calculate the final price after applying a discount on a shopping bill.",code:`bill = 2500
discount = 10
final_price = bill - (bill * discount / 100)
print("Final price:", final_price)`,input:""},
"Student Marks & Grade":{desc:"Calculate the average marks and decide a student grade.",code:`marks = [82, 76, 91, 88, 79]
avg = sum(marks) / len(marks)
if avg >= 80:
    grade = "A"
else:
    grade = "B"
print("Average:", avg)
print("Grade:", grade)`,input:""},
"Bank Transaction":{desc:"Update a bank balance after a deposit and withdrawal.",code:`balance = 10000
deposit = 2500
withdraw = 1800
balance = balance + deposit - withdraw
print("Balance:", balance)`,input:""},
"ATM Operations":{desc:"Check whether an ATM withdrawal can be completed.",code:`balance = 5000
withdraw = 2000
if withdraw <= balance:
    balance -= withdraw
    print("Cash dispensed")
else:
    print("Insufficient balance")
print("Balance:", balance)`,input:""},
"Salary Calculation":{desc:"Calculate salary after adding an allowance.",code:`basic = 30000
allowance = 5000
salary = basic + allowance
print("Salary:", salary)`,input:""},
"Temperature Conversion":{desc:"Convert Celsius temperature to Fahrenheit.",code:`celsius = 30
fahrenheit = (celsius * 9/5) + 32
print("Fahrenheit:", fahrenheit)`,input:""},
"Business Calculation":{desc:"Calculate total revenue from units sold and price per unit.",code:`units = 120
price = 75
revenue = units * price
print("Revenue:", revenue)`,input:""}
};
const quiz=[{q:"What will be the output?",code:`x = 10
y = 5
print(x + y)`,opts:["15","50","5","Error"],answer:0,why:"The + operator adds 10 and 5, so the output is 15."},{q:"What is the final value of total?",code:`total = 0
for i in range(1, 4):
    total += i`,opts:["3","6","4","0"],answer:1,why:"The loop adds 1 + 2 + 3, giving 6."},{q:"Which value is printed?",code:`x = 8
if x > 5:
    print("High")`,opts:["8","Low","High","Error"],answer:2,why:"8 is greater than 5, so the if block runs."}];
let quizIndex=0;
function refreshLines(){lineNos.textContent=Array.from({length:codeEl.value.split("\n").length},(_,i)=>i+1).join("\n")}refreshLines();codeEl.oninput=refreshLines;
async function execute(code=codeEl.value,inputs=inputsEl.value.split(/\r?\n/).filter(Boolean)){outputEl.textContent="Running...";const r=await fetch("/api/execute",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code,inputs})});execution=await r.json();stepIndex=0;render()}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function render(){refreshLines();if(activeTab==="flow")renderFlow();if(activeTab==="variables")renderVariables();if(activeTab==="stack")renderStack();if(activeTab==="output")renderOutput();outputEl.textContent=(execution.output||"")+(execution.error?`\n${execution.error}`:"")||"No output."}
function renderFlow(){if(!execution.events.length){visualContent.innerHTML='<div class="empty">Run the program to see each executed line.</div>';return}visualContent.innerHTML=execution.events.map((e,i)=>`<div class="flow-row ${i===stepIndex?"current":""}"><span class="badge">${i+1}</span><b>Line ${e.line}</b><span>${esc(codeEl.value.split("\n")[e.line-1]||"")}</span><span>${i===stepIndex?'<span style="color:#168cf1">Current Line</span>':'<span class="check">✓</span>'}</span></div>`).join("")}
function renderVariables(){const e=execution.events[stepIndex];if(!e){visualContent.innerHTML='<div class="empty">Run the program first.</div>';return}const en=Object.entries(e.variables||{});visualContent.innerHTML=`<h3>Variables at step ${stepIndex+1}</h3>`+(en.length?en.map(([k,v])=>`<div class="flow-row"><b>${esc(k)}</b><span>${esc(v)}</span></div>`).join(""):"<p>No user variables yet.</p>")}
function renderStack(){const e=execution.events[stepIndex];if(!e){visualContent.innerHTML='<div class="empty">Run the program first.</div>';return}visualContent.innerHTML="<h3>Call Stack</h3>"+(e.call_stack||[]).map((x,i)=>`<div class="flow-row"><span class="badge">${i+1}</span><b>${esc(x)}</b></div>`).join("")}
function renderOutput(){visualContent.innerHTML=`<h3>Program Output</h3><pre class="quiz-code">${esc(execution.output||"No output.")}</pre>${execution.error?`<p style="color:#d33">${esc(execution.error)}</p>`:""}`}
document.getElementById("runBtn").onclick=()=>execute();
document.getElementById("stepBtn").onclick=async()=>{if(!execution.events.length)await execute();else{stepIndex=Math.min(stepIndex+1,execution.events.length-1);render()}};
document.getElementById("resetBtn").onclick=()=>{execution={events:[],output:"",error:null};stepIndex=0;render()};
document.getElementById("clearBtn").onclick=()=>{codeEl.value="";execution={events:[],output:"",error:null};render()};
document.getElementById("clearOutput").onclick=()=>outputEl.textContent="";
document.querySelectorAll(".tab").forEach(t=>t.onclick=()=>{activeTab=t.dataset.tab;document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));t.classList.add("active");render()});
document.querySelectorAll(".nav-item").forEach(b=>b.onclick=()=>{document.querySelectorAll(".nav-item").forEach(x=>x.classList.remove("active"));b.classList.add("active");const m={editor:"editor",scenarios:"scenarioCard",quiz:"quizCard",whatif:"whatifCard",compare:"compareCard"};if(m[b.dataset.section])document.getElementById(m[b.dataset.section]).scrollIntoView({behavior:"smooth"});else window.scrollTo({top:0,behavior:"smooth"})});
const ss=document.getElementById("scenarioSelect");Object.keys(scenarioData).forEach(x=>ss.add(new Option(x,x)));function updateScenario(){document.getElementById("scenarioDesc").textContent=scenarioData[ss.value].desc}updateScenario();ss.onchange=updateScenario;
document.getElementById("loadScenario").onclick=()=>{const s=scenarioData[ss.value];codeEl.value=s.code;inputsEl.value=s.input;refreshLines();window.scrollTo({top:120,behavior:"smooth"})};
function loadQuiz(){const q=quiz[quizIndex%quiz.length];document.getElementById("quizQuestion").innerHTML=`<div style="font-size:12px;color:#55708f;margin-bottom:7px">${q.q} <b style="float:right">${quizIndex%quiz.length+1} / ${quiz.length}</b></div><pre class="quiz-code">${esc(q.code)}</pre>`+q.opts.map((o,i)=>`<label class="quiz-option"><input type="radio" name="q" value="${i}">${esc(o)}</label>`).join("")+`<div id="quizFeedback" style="font-size:11px;margin-top:7px"></div>`}loadQuiz();
document.getElementById("quizSubmit").onclick=()=>{const q=quiz[quizIndex%quiz.length],s=document.querySelector('input[name="q"]:checked'),f=document.getElementById("quizFeedback");if(!s){f.textContent="Select an answer first.";return}f.innerHTML=+s.value===q.answer?`<b style="color:#0aab91">Correct!</b> ${q.why}`:`<b style="color:#d44">Try again.</b> Correct answer: ${q.opts[q.answer]}. ${q.why}`;quizIndex++;setTimeout(loadQuiz,1300)};
const wi=document.getElementById("whatifCode");wi.value=codeEl.value;codeEl.addEventListener("input",()=>wi.value=codeEl.value);
document.getElementById("whatifRun").onclick=async()=>{const r=await fetch("/api/execute",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:wi.value,inputs:[document.getElementById("whatifInput").value]})});const d=await r.json();document.getElementById("whatifOutput").textContent=(d.output||"")+(d.error?`\n${d.error}`:"")};
let approach="a";const ca=`# Using loop
n = 5
total = 0
for i in range(1, n + 1):
    total += i
print(total)`,cb=`# Using formula
n = 5
total = n * (n + 1) // 2
print(total)`;function showCompare(){document.getElementById("compareCode").textContent=approach==="a"?ca:cb}showCompare();
document.querySelectorAll(".approach").forEach(b=>b.onclick=()=>{approach=b.dataset.approach;document.querySelectorAll(".approach").forEach(x=>x.classList.remove("active"));b.classList.add("active");showCompare()});
document.getElementById("compareRun").onclick=async()=>{document.getElementById("compareResult").innerHTML="<b>Result:</b> both approaches calculate 15. Approach 1 demonstrates a loop; Approach 2 demonstrates a formula."};
document.getElementById("themeBtn").onclick=()=>document.documentElement.classList.toggle("dark");
