const LS_USERS = "hstu_users";
const LS_SESSION = "hstu_session";
const LS_ENROLL = "hstu_enroll_state";
const LS_PAYMENTS = "hstu_payments";

const $ = (id) => document.getElementById(id);

function moneyBDT(n) {
  const x = Math.round(Number(n) || 0);
  return `BDT ${x.toLocaleString("en-US")}`;
}
function to2(n){ return (Math.round((Number(n)||0)*100)/100).toFixed(2); }
function uid(prefix="TXN"){ return `${prefix}-${Date.now()}-${Math.floor(Math.random()*9000+1000)}`; }
function genOTP(){ return String(Math.floor(100000 + Math.random()*900000)); }

function loadUsers(){ return JSON.parse(localStorage.getItem(LS_USERS) || "[]"); }
function saveUsers(users){ localStorage.setItem(LS_USERS, JSON.stringify(users)); }
function setSession(userId){ localStorage.setItem(LS_SESSION, JSON.stringify({ userId })); }
function getSession(){ return JSON.parse(localStorage.getItem(LS_SESSION) || "null"); }
function clearSession(){ localStorage.removeItem(LS_SESSION); }
function loadEnrollState(){ return JSON.parse(localStorage.getItem(LS_ENROLL) || "null"); }
function saveEnrollState(state){ localStorage.setItem(LS_ENROLL, JSON.stringify(state)); }
function loadPayments(){ return JSON.parse(localStorage.getItem(LS_PAYMENTS) || "{}"); }
function savePayments(obj){ localStorage.setItem(LS_PAYMENTS, JSON.stringify(obj)); }

/* ===== Curriculum Data (as previously provided) ===== */
const DATA = {
  perCreditDefault: 120,
  termTotals: {
    "L1S1": 19.00, "L1S2": 19.25, "L2S1": 21.50, "L2S2": 20.00,
    "L3S1": 18.50, "L3S2": 18.50, "L4S1": 18.75, "L4S2": 19.25
  },
  terms: [
    { key:"L1S1", label:"Level 1 - Semester I", courses:[
      {code:"CSE 101", title:"Fundamentals of Computer and Computing", credit:2.00},
      {code:"CSE 102", title:"Fundamentals of Computer and Computing Sessional", credit:0.75},
      {code:"CSE 103", title:"Discrete Mathematics", credit:3.00},
      {code:"MAT 101", title:"Mathematics I (Calculus and Co-ordinate Geometry)", credit:3.00},
      {code:"PHY 103", title:"Physics (Electricity, Magnetism, Optics, Waves and Oscillations)", credit:3.00},
      {code:"PHY 104", title:"Physics Sessional", credit:1.50},
      {code:"MEE 101", title:"Basic Mechanical Engineering", credit:3.00},
      {code:"ENG 101", title:"Communicative English", credit:2.00},
      {code:"ENG 102", title:"Communicative English Sessional", credit:0.75},
    ]},
    { key:"L1S2", label:"Level 1 - Semester II", courses:[
      {code:"CSE 151", title:"Structured Programming Language", credit:3.00},
      {code:"CSE 152", title:"Structured Programming Language Sessional", credit:1.50},
      {code:"CSE 153", title:"Digital Logic Design", credit:3.00},
      {code:"CSE 154", title:"Digital Logic Design Sessional", credit:1.50},
      {code:"EEE 155", title:"Introduction to Electrical Engineering", credit:3.00},
      {code:"EEE 156", title:"Introduction to Electrical Engineering Sessional", credit:0.75},
      {code:"CIE 114", title:"Engineering Drawing and Auto CAD Sessional", credit:1.50},
      {code:"MAT 105", title:"Mathematics II (Matrix, ODE/PDE, Series Solutions)", credit:3.00},
      {code:"SOC 103", title:"Society and Technology", credit:2.00},
    ]},
    { key:"L2S1", label:"Level 2 - Semester I", courses:[
      {code:"CSE 201", title:"Object Oriented Programming", credit:3.00},
      {code:"CSE 202", title:"OOP (C++) Sessional", credit:1.50},
      {code:"CSE 203", title:"Data Structures", credit:3.00},
      {code:"CSE 204", title:"Data Structures Sessional", credit:1.50},
      {code:"CSE 205", title:"Numerical Methods", credit:2.00},
      {code:"CSE 206", title:"Numerical Methods Sessional", credit:0.75},
      {code:"EEE 209", title:"Electronic Devices and Circuits", credit:3.00},
      {code:"EEE 210", title:"Electronic Devices and Circuits Sessional", credit:0.75},
      {code:"MAT 201", title:"Mathematics III (Vector, Complex, Fourier, Laplace)", credit:3.00},
      {code:"STT 227", title:"Statistics (Intro to Statistics and Probability)", credit:3.00},
    ]},
    { key:"L2S2", label:"Level 2 - Semester II", courses:[
      {code:"CSE 254", title:"Object Oriented Programming (Java) Sessional", credit:1.50},
      {code:"CSE 255", title:"Algorithms Analysis and Design", credit:3.00},
      {code:"CSE 256", title:"Algorithms Analysis and Design Sessional", credit:1.50},
      {code:"CSE 257", title:"Theory of Computation and Concrete Mathematics", credit:3.00},
      {code:"CSE 258", title:"TOC & Concrete Math Sessional", credit:0.75},
      {code:"CSE 259", title:"Computer Architecture and Organization", credit:3.00},
      {code:"ECE 259", title:"Digital Electronics and Pulse Techniques", credit:3.00},
      {code:"ECE 260", title:"Digital Electronics & Pulse Techniques Sessional", credit:0.75},
      {code:"ACT 205", title:"Financial and Managerial Accounting", credit:2.00},
      {code:"CSE 252", title:"Application Development Sessional", credit:1.50},
    ]},
    { key:"L3S1", label:"Level 3 - Semester I", courses:[
      {code:"CSE 303", title:"Database", credit:3.00},
      {code:"CSE 304", title:"Database Sessional", credit:1.50},
      {code:"CSE 305", title:"Software Engineering", credit:3.00},
      {code:"CSE 307", title:"Microprocessor and Interfacing", credit:3.00},
      {code:"CSE 308", title:"Microprocessor and Interfacing Sessional", credit:1.50},
      {code:"ECE 311", title:"Data Communication", credit:3.00},
      {code:"ECN 305", title:"Economics", credit:2.00},
      {code:"CSE 302", title:"Software Development Sessional", credit:1.50},
    ]},
    { key:"L3S2", label:"Level 3 - Semester II", courses:[
      {code:"CSE 353", title:"Operating System", credit:3.00},
      {code:"CSE 354", title:"Operating System Sessional", credit:0.75},
      {code:"CSE 355", title:"Web Engineering", credit:2.00},
      {code:"CSE 356", title:"Web Engineering Sessional", credit:0.75},
      {code:"CSE 357", title:"Computer Networks", credit:3.00},
      {code:"CSE 358", title:"Computer Networks Sessional", credit:0.75},
      {code:"CSE 359", title:"Compiler Design", credit:3.00},
      {code:"CSE 360", title:"Compiler Design Sessional", credit:0.75},
      {code:"CSE 361", title:"Mathematical Analysis for Computer Science", credit:3.00},
      {code:"CSE 352", title:"Web & Mobile Application Development Sessional", credit:1.50},
    ]},
    { key:"L4S1", label:"Level 4 - Semester I", courses:[
      {code:"CSE 403", title:"Artificial Intelligence", credit:3.00},
      {code:"CSE 404", title:"Artificial Intelligence Sessional", credit:0.75},
      {code:"CSE 405", title:"Computer Graphics and Image Processing", credit:3.00},
      {code:"CSE 406", title:"CG & IP Sessional", credit:1.50},
      {code:"CSE 408", title:"Technical Writing & Presentation Skill (Sessional)", credit:1.50},
      {code:"CSE 402", title:"Project and Thesis Sessional", credit:1.50},
      {code:"OPT1_THEORY", title:"Option I (Selected)", credit:3.00, group:"OPT1"},
      {code:"OPT1_LAB", title:"Option I Sessional (Selected)", credit:0.75, group:"OPT1"},
      {code:"OPT2_THEORY", title:"Option II (Selected)", credit:3.00, group:"OPT2"},
      {code:"OPT2_LAB", title:"Option II Sessional (Selected)", credit:0.75, group:"OPT2"},
    ]},
    { key:"L4S2", label:"Level 4 - Semester II", courses:[
      {code:"CSE 453", title:"Multimedia System and Animation Techniques", credit:3.00},
      {code:"CSE 454", title:"Multimedia System & Animation Sessional", credit:0.75},
      {code:"CSE 455", title:"Computer Ethics and Cyber Law", credit:2.00},
      {code:"MGT 405", title:"Industrial Management", credit:3.00},
      {code:"CSE 452", title:"Project and Thesis Sessional", credit:3.00},
      {code:"OPT3_THEORY", title:"Option III (Selected)", credit:3.00, group:"OPT3"},
      {code:"OPT3_LAB", title:"Option III Sessional (Selected)", credit:0.75, group:"OPT3"},
      {code:"OPT4_THEORY", title:"Option IV (Selected)", credit:3.00, group:"OPT4"},
      {code:"OPT4_LAB", title:"Option IV Sessional (Selected)", credit:0.75, group:"OPT4"},
    ]},
  ],
  options: {
    OPT1: [
      { theory:{code:"CSE 409", title:"Advanced Database Management System", credit:3.00}, lab:{code:"CSE 410", title:"Advanced DBMS Sessional", credit:0.75} },
      { theory:{code:"CSE 411", title:"Advanced Algorithm Design", credit:3.00}, lab:{code:"CSE 412", title:"Advanced Algorithm Design Sessional", credit:0.75} },
      { theory:{code:"CSE 413", title:"Management Information System", credit:3.00}, lab:{code:"CSE 414", title:"MIS Sessional", credit:0.75} },
      { theory:{code:"CSE 415", title:"Mobile and Wireless Communication", credit:3.00}, lab:{code:"CSE 416", title:"Mobile & Wireless Communication Sessional", credit:0.75} },
      { theory:{code:"CSE 417", title:"Communication Engineering", credit:3.00}, lab:{code:"CSE 418", title:"Communication Engineering Sessional", credit:0.75} },
    ],
    OPT2: [
      { theory:{code:"CSE 419", title:"System Analysis and Design", credit:3.00}, lab:{code:"CSE 420", title:"System Analysis & Design Sessional", credit:0.75} },
      { theory:{code:"CSE 421", title:"Software Testing and Quality Assurance", credit:3.00}, lab:{code:"CSE 422", title:"STQA Sessional", credit:0.75} },
      { theory:{code:"CSE 423", title:"Graph Theory", credit:3.00}, lab:{code:"CSE 424", title:"Graph Theory Sessional", credit:0.75} },
      { theory:{code:"CSE 425", title:"Cryptography and Network Security", credit:3.00}, lab:{code:"CSE 426", title:"Crypto & Network Security Sessional", credit:0.75} },
      { theory:{code:"CSE 427", title:"Simulation and Modelling", credit:3.00}, lab:{code:"CSE 428", title:"Simulation & Modelling Sessional", credit:0.75} },
    ],
    OPT3: [
      { theory:{code:"CSE 459", title:"Data Mining and Warehousing", credit:3.00}, lab:{code:"CSE 460", title:"Data Mining & Warehousing Sessional", credit:0.75} },
      { theory:{code:"CSE 461", title:"Cloud Computing", credit:3.00}, lab:{code:"CSE 462", title:"Cloud Computing Sessional", credit:0.75} },
      { theory:{code:"CSE 463", title:"VLSI Design", credit:3.00}, lab:{code:"CSE 464", title:"VLSI Design Sessional", credit:0.75} },
      { theory:{code:"CSE 465", title:"Digital System Design", credit:3.00}, lab:{code:"CSE 466", title:"Digital System Design Sessional", credit:0.75} },
      { theory:{code:"CSE 467", title:"Parallel and Distributed System", credit:3.00}, lab:{code:"CSE 468", title:"Parallel & Distributed System Sessional", credit:0.75} },
    ],
    OPT4: [
      { theory:{code:"CSE 469", title:"Machine Learning and Pattern Recognition", credit:3.00}, lab:{code:"CSE 470", title:"ML & Pattern Recognition Sessional", credit:0.75} },
      { theory:{code:"CSE 471", title:"Natural Language Processing", credit:3.00}, lab:{code:"CSE 472", title:"NLP Sessional", credit:0.75} },
      { theory:{code:"CSE 473", title:"Human and Computer Interaction", credit:3.00}, lab:{code:"CSE 474", title:"HCI Sessional", credit:0.75} },
      { theory:{code:"CSE 475", title:"Robotics", credit:3.00}, lab:{code:"CSE 476", title:"Robotics Sessional", credit:0.75} },
      { theory:{code:"CSE 477", title:"Bioinformatics", credit:3.00}, lab:{code:"CSE 478", title:"Bioinformatics Sessional", credit:0.75} },
    ]
  }
};

let CURRENT_USER = null;
let STATE = null;
let PAY = { tab:"card", mbBrand:"bKash", otp:null, otpFor:null };

/* ===== Seed user for first-time login ===== */
function ensureSeedUser(){
  const users = loadUsers();
  if (users.length) return;
  saveUsers([{ userId:"student", password:"1234", name:"Student", dept:"CSE" }]);
}

function getUserById(userId){ return loadUsers().find(u => u.userId === userId); }
function isL4(termKey){ return termKey === "L4S1" || termKey === "L4S2"; }
function getDefaultEnrollState(){
  return { enrollType:"REGULAR", termKey:"L1S1", perCreditFee:DATA.perCreditDefault, optAIndex:0, optBIndex:0, selectedCourseCodes:[] };
}

function computeTermCourses(termKey, optAIndex, optBIndex){
  const term = DATA.terms.find(t => t.key === termKey);
  if (!term) return [];
  let base = term.courses.map(c => ({...c}));
  if (!isL4(termKey)) return base;

  if (termKey === "L4S1") {
    const p1 = DATA.options.OPT1[optAIndex] || DATA.options.OPT1[0];
    const p2 = DATA.options.OPT2[optBIndex] || DATA.options.OPT2[0];
    base = base.map(c => {
      if (c.code === "OPT1_THEORY") return {...p1.theory, group:"OPT1"};
      if (c.code === "OPT1_LAB") return {...p1.lab, group:"OPT1"};
      if (c.code === "OPT2_THEORY") return {...p2.theory, group:"OPT2"};
      if (c.code === "OPT2_LAB") return {...p2.lab, group:"OPT2"};
      return c;
    });
  } else {
    const p3 = DATA.options.OPT3[optAIndex] || DATA.options.OPT3[0];
    const p4 = DATA.options.OPT4[optBIndex] || DATA.options.OPT4[0];
    base = base.map(c => {
      if (c.code === "OPT3_THEORY") return {...p3.theory, group:"OPT3"};
      if (c.code === "OPT3_LAB") return {...p3.lab, group:"OPT3"};
      if (c.code === "OPT4_THEORY") return {...p4.theory, group:"OPT4"};
      if (c.code === "OPT4_LAB") return {...p4.lab, group:"OPT4"};
      return c;
    });
  }
  return base;
}

function computeCreditsSelected(state, termCourses){
  if (state.enrollType === "REGULAR") return Number(DATA.termTotals[state.termKey] || 0);
  const set = new Set(state.selectedCourseCodes || []);
  return termCourses.reduce((s,c)=> s + (set.has(c.code) ? Number(c.credit||0) : 0), 0);
}
function computeFee(state, credits){
  return Number(state.perCreditFee||0) * Number(credits||0);
}

function renderTermOptions(){
  const sel = $("termSelect");
  sel.innerHTML = "";
  DATA.terms.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t.key;
    opt.textContent = t.label;
    sel.appendChild(opt);
  });
}

function courseCard(course, actionLabel, onAction, disabled=false){
  const div = document.createElement("div");
  div.className = "item";
  div.innerHTML = `
    <div class="left">
      <div class="code">${course.code}</div>
      <div class="name">${course.title}</div>
      <div class="meta">Credit: ${to2(course.credit)}</div>
    </div>
    <div class="right">
      <div class="badge">${to2(course.credit)} cr</div>
      <div style="height:8px"></div>
      <button class="btn ${actionLabel==='Add'?'primary':''}" ${disabled ? "disabled" : ""} style="padding:8px 12px;border-radius:12px">
        ${actionLabel}
      </button>
    </div>
  `;
  div.querySelector("button").onclick = () => { if(!disabled) onAction(); };
  return div;
}

function fillElectiveDropdown(selectId, optionArr, selectedIndex){
  const sel = $(selectId);
  sel.innerHTML = "";
  optionArr.forEach((pair, idx) => {
    const opt = document.createElement("option");
    opt.value = String(idx);
    opt.textContent = `${pair.theory.code}: ${pair.theory.title} (+ ${pair.lab.code})`;
    if (idx === selectedIndex) opt.selected = true;
    sel.appendChild(opt);
  });
}

function renderElectiveSelectors(state){
  const box = $("electivesBox");
  if (!isL4(state.termKey)) { box.classList.add("hidden"); return; }
  box.classList.remove("hidden");

  if (state.termKey === "L4S1") {
    $("optALabel").textContent = "Option I (choose one pair)";
    $("optBLabel").textContent = "Option II (choose one pair)";
    fillElectiveDropdown("optASelect", DATA.options.OPT1, state.optAIndex);
    fillElectiveDropdown("optBSelect", DATA.options.OPT2, state.optBIndex);
  } else {
    $("optALabel").textContent = "Option III (choose one pair)";
    $("optBLabel").textContent = "Option IV (choose one pair)";
    fillElectiveDropdown("optASelect", DATA.options.OPT3, state.optAIndex);
    fillElectiveDropdown("optBSelect", DATA.options.OPT4, state.optBIndex);
  }
}

function renderLists(state){
  const termCourses = computeTermCourses(state.termKey, state.optAIndex, state.optBIndex);

  if (state.enrollType === "REGULAR") state.selectedCourseCodes = termCourses.map(c => c.code);

  const selectedSet = new Set(state.selectedCourseCodes || []);
  $("availableList").innerHTML = "";
  $("selectedList").innerHTML = "";

  termCourses.forEach(c => {
    const isSelected = selectedSet.has(c.code);
    const locked = (state.enrollType === "REGULAR");
    $("availableList").appendChild(
      courseCard(
        c,
        isSelected ? "Added" : "Add",
        () => { state.selectedCourseCodes.push(c.code); syncAndRender(state); },
        locked || isSelected
      )
    );
  });

  termCourses.filter(c => selectedSet.has(c.code)).forEach(c => {
    const locked = (state.enrollType === "REGULAR");
    $("selectedList").appendChild(
      courseCard(
        c, "Remove",
        () => { state.selectedCourseCodes = state.selectedCourseCodes.filter(x=>x!==c.code); syncAndRender(state); },
        locked
      )
    );
  });

  const credits = computeCreditsSelected(state, termCourses);
  const fee = computeFee(state, credits);

  $("creditText").textContent = to2(credits);
  $("feeText").textContent = moneyBDT(fee);
  $("modeText").textContent = state.enrollType;

  $("btnClear").disabled = (state.enrollType === "REGULAR");
  $("btnClear").textContent = (state.enrollType === "REGULAR") ? "Locked" : "Clear";

  $("btnPayNow").disabled = (state.enrollType === "REPEAT" && credits <= 0);
}

function renderPreviewSlip(state){
  const termCourses = computeTermCourses(state.termKey, state.optAIndex, state.optBIndex);
  const selectedSet = new Set(state.selectedCourseCodes || []);
  const per = Number(state.perCreditFee || 0);

  const rows = (state.enrollType === "REGULAR")
    ? termCourses
    : termCourses.filter(c => selectedSet.has(c.code));

  const credits = (state.enrollType === "REGULAR")
    ? Number(DATA.termTotals[state.termKey] || 0)
    : rows.reduce((a,c)=> a + Number(c.credit||0), 0);

  const totalFee = credits * per;

  $("slip").innerHTML = `
    <div class="slip-title">
      <div>
        <div style="font-weight:1000;font-size:16px">Enrollment Slip</div>
        <div class="muted" style="font-size:12px">${DATA.terms.find(t=>t.key===state.termKey)?.label || state.termKey} • ${state.enrollType}</div>
      </div>
      <div class="muted" style="font-size:12px;text-align:right">
        <div>Per Credit: ${moneyBDT(per)}</div>
        <div>Total: <b>${moneyBDT(totalFee)}</b></div>
      </div>
    </div>
    <table>
      <thead><tr><th>Course</th><th>Title</th><th class="right">Credit</th></tr></thead>
      <tbody>
        ${
          rows.length
          ? rows.map(c=>`<tr><td><b>${c.code}</b></td><td>${c.title}</td><td class="right">${to2(c.credit)}</td></tr>`).join("")
          : `<tr><td colspan="3" class="muted">No course selected.</td></tr>`
        }
      </tbody>
      <tfoot>
        <tr><td colspan="2" class="right"><b>Total Credits</b></td><td class="right"><b>${to2(credits)}</b></td></tr>
        <tr><td colspan="2" class="right"><b>Total Fee</b></td><td class="right"><b>${moneyBDT(totalFee)}</b></td></tr>
      </tfoot>
    </table>
  `;
}

function renderFinalSlip(p){
  const dt = new Date(p.paidAt).toLocaleString();
  $("finalSlip").innerHTML = `
    <div class="slip-title">
      <div>
        <div style="font-weight:1000;font-size:16px">Payment Slip</div>
        <div class="muted" style="font-size:12px">${p.termLabel} • ${p.enrollType} • Method: <b>${p.method}</b></div>
      </div>
      <div class="muted" style="font-size:12px;text-align:right">
        <div><b>${p.paymentId}</b></div>
        <div>${dt}</div>
      </div>
    </div>
    <table>
      <thead><tr><th>Course</th><th>Title</th><th class="right">Credit</th></tr></thead>
      <tbody>
        ${
          p.courses?.length
          ? p.courses.map(c=>`<tr><td><b>${c.code}</b></td><td>${c.title}</td><td class="right">${to2(c.credit)}</td></tr>`).join("")
          : `<tr><td colspan="3" class="muted">No courses</td></tr>`
        }
      </tbody>
      <tfoot>
        <tr><td colspan="2" class="right"><b>Total Credits</b></td><td class="right"><b>${to2(p.credits)}</b></td></tr>
        <tr><td colspan="2" class="right"><b>Base Fee</b></td><td class="right"><b>${moneyBDT(p.baseFee)}</b></td></tr>
        <tr><td colspan="2" class="right"><b>Gateway Fee</b></td><td class="right"><b>${moneyBDT(p.gatewayFee)}</b></td></tr>
        <tr><td colspan="2" class="right"><b>Total Paid</b></td><td class="right"><b>${moneyBDT(p.totalPaid)}</b></td></tr>
      </tfoot>
    </table>
    <div class="muted" style="margin-top:10px;font-size:12px">
      Student: <b>${p.name}</b> (${p.userId}) • Department: ${p.dept}
    </div>
  `;
}

function updatePaySummary(){
  const termCourses = computeTermCourses(STATE.termKey, STATE.optAIndex, STATE.optBIndex);
  const credits = computeCreditsSelected(STATE, termCourses);
  const baseFee = computeFee(STATE, credits);

  const gatewayFee = (PAY.tab === "card") ? Math.round(baseFee * 0.015) : 0;
  const totalPayable = baseFee + gatewayFee;

  $("payMeta").textContent = `${CURRENT_USER.userId} • ${DATA.terms.find(t=>t.key===STATE.termKey)?.label || STATE.termKey} • ${STATE.enrollType}`;
  $("payAmountText").textContent = moneyBDT(baseFee);
  $("payTermText").textContent = `Credits: ${to2(credits)} • Per credit: ${moneyBDT(STATE.perCreditFee)}`;
  $("payCreditsText").textContent = to2(credits);
  $("payPerCreditText").textContent = moneyBDT(STATE.perCreditFee);
  $("payGatewayFee").textContent = moneyBDT(gatewayFee);
  $("payTotalText").textContent = moneyBDT(totalPayable);
}

function openPayModal(){
  updatePaySummary();
  $("payModal").classList.remove("hidden");
  $("payStatus").classList.add("hidden");
  $("successOverlay").classList.add("hidden");
}
function closePayModal(){ $("payModal").classList.add("hidden"); }

function setPayTab(tabName){
  PAY.tab = tabName;
  document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
  document.querySelector(`.tab[data-tab="${tabName}"]`)?.classList.add("active");
  $("tab-card").classList.toggle("hidden", tabName !== "card");
  $("tab-mbank").classList.toggle("hidden", tabName !== "mbank");
  updatePaySummary();
}

function setMBBrand(brand){
  PAY.mbBrand = brand;
  document.querySelectorAll(".brandBtn").forEach(b => b.classList.remove("active"));
  document.querySelector(`.brandBtn[data-brand="${brand}"]`)?.classList.add("active");
}

function showPayStatus(msg){
  const s = $("payStatus");
  s.textContent = msg;
  s.classList.remove("hidden");
}

function validatePayment(){
  const termCourses = computeTermCourses(STATE.termKey, STATE.optAIndex, STATE.optBIndex);
  const credits = computeCreditsSelected(STATE, termCourses);
  if (credits <= 0) return { ok:false, msg:"Please select at least one course." };

  if (PAY.tab === "card") {
    const cn = $("cardNumber").value.trim();
    const ex = $("cardExp").value.trim();
    const cv = $("cardCvv").value.trim();
    const nm = $("cardName").value.trim();
    if (!cn || cn.replace(/\s/g,"").length < 12) return { ok:false, msg:"Please enter a valid card number." };
    if (!ex || ex.length < 4) return { ok:false, msg:"Please enter a valid expiry date." };
    if (!cv || cv.length < 3) return { ok:false, msg:"Please enter a valid CVV." };
    if (!nm) return { ok:false, msg:"Please enter the name on the card." };
    return { ok:true, method:"CARD" };
  }

  const mb = $("mbNumber").value.trim();
  const otp = $("mbOtp").value.trim();
  const pin = $("mbPin").value.trim();

  if (!mb || mb.length !== 11) return { ok:false, msg:"Please enter a valid 11-digit mobile number." };
  if (!PAY.otp || PAY.otpFor !== mb) return { ok:false, msg:"OTP is not available. Please re-enter the mobile number." };
  if (otp !== PAY.otp) return { ok:false, msg:"Invalid OTP. Please try again." };
  if (!pin || pin.length < 4) return { ok:false, msg:"Invalid PIN. Please try again." };

  return { ok:true, method: PAY.mbBrand };
}

function makeConfetti(){
  const box = $("confetti");
  box.innerHTML = "";
  const n = 26;
  for (let i=0;i<n;i++){
    const p = document.createElement("i");
    p.style.left = Math.floor(Math.random()*100) + "%";
    p.style.animationDelay = (Math.random()*0.25) + "s";
    const hue = Math.floor(Math.random()*360);
    p.style.background = `hsl(${hue} 90% 60%)`;
    p.style.width = (8 + Math.random()*6) + "px";
    p.style.height = (10 + Math.random()*10) + "px";
    box.appendChild(p);
  }
}
function showSuccessOverlay(payment){
  $("successMeta").textContent = `${payment.method} • ${moneyBDT(payment.totalPaid)} • ${payment.paymentId}`;
  makeConfetti();
  $("successOverlay").classList.remove("hidden");
}

function finalizePayment(method){
  const termCourses = computeTermCourses(STATE.termKey, STATE.optAIndex, STATE.optBIndex);
  const credits = computeCreditsSelected(STATE, termCourses);
  const baseFee = computeFee(STATE, credits);
  const gatewayFee = (method === "CARD") ? Math.round(baseFee * 0.015) : 0;
  const totalPayable = baseFee + gatewayFee;

  const selectedSet = new Set(STATE.selectedCourseCodes || []);
  const rows = (STATE.enrollType === "REGULAR")
    ? termCourses
    : termCourses.filter(c => selectedSet.has(c.code));

  const payment = {
    paymentId: uid("PAY"),
    userId: CURRENT_USER.userId,
    name: CURRENT_USER.name,
    dept: CURRENT_USER.dept,
    termKey: STATE.termKey,
    termLabel: DATA.terms.find(t=>t.key===STATE.termKey)?.label || STATE.termKey,
    enrollType: STATE.enrollType,
    perCreditFee: Number(STATE.perCreditFee || 0),
    credits: Number(credits),
    baseFee: Number(baseFee),
    gatewayFee: Number(gatewayFee),
    totalPaid: Number(totalPayable),
    method,
    paidAt: new Date().toISOString(),
    courses: rows
  };

  const payments = loadPayments();
  payments[CURRENT_USER.userId] = payment;
  savePayments(payments);

  renderFinalSlip(payment);
  return payment;
}

function syncAndRender(state){
  state.optAIndex = Number(state.optAIndex || 0);
  state.optBIndex = Number(state.optBIndex || 0);
  state.perCreditFee = Number(state.perCreditFee || 0);

  if (!isL4(state.termKey)) { state.optAIndex = 0; state.optBIndex = 0; }

  const termCourses = computeTermCourses(state.termKey, state.optAIndex, state.optBIndex);

  if (state.enrollType === "REGULAR") {
    state.selectedCourseCodes = termCourses.map(c => c.code);
  } else {
    const availableSet = new Set(termCourses.map(c=>c.code));
    state.selectedCourseCodes = (state.selectedCourseCodes || []).filter(c => availableSet.has(c));
  }

  saveEnrollState(state);
  renderElectiveSelectors(state);
  renderLists(state);
}

function showApp(user){
  CURRENT_USER = user;

  $("authCard").classList.add("hidden");
  $("app").classList.remove("hidden");
  $("btnLogout").classList.remove("hidden");

  renderTermOptions();
  STATE = loadEnrollState() || getDefaultEnrollState();

  $("enrollType").value = STATE.enrollType;
  $("termSelect").value = STATE.termKey;
  $("perCreditFee").value = STATE.perCreditFee;

  const payments = loadPayments();
  if (payments[user.userId]) renderFinalSlip(payments[user.userId]);

  syncAndRender(STATE);

  $("enrollType").onchange = (e) => {
    STATE.enrollType = e.target.value;
    if (STATE.enrollType === "REPEAT") STATE.selectedCourseCodes = [];
    syncAndRender(STATE);
  };

  $("termSelect").onchange = (e) => {
    STATE.termKey = e.target.value;
    if (STATE.enrollType === "REPEAT") STATE.selectedCourseCodes = [];
    syncAndRender(STATE);
  };

  $("perCreditFee").oninput = (e) => {
    STATE.perCreditFee = Number(e.target.value || 0);
    syncAndRender(STATE);
  };

  $("optASelect").onchange = (e) => {
    STATE.optAIndex = Number(e.target.value||0);
    if (STATE.enrollType==="REPEAT") STATE.selectedCourseCodes=[];
    syncAndRender(STATE);
  };

  $("optBSelect").onchange = (e) => {
    STATE.optBIndex = Number(e.target.value||0);
    if (STATE.enrollType==="REPEAT") STATE.selectedCourseCodes=[];
    syncAndRender(STATE);
  };

  $("btnClear").onclick = () => {
    if (STATE.enrollType==="REGULAR") return;
    STATE.selectedCourseCodes=[];
    syncAndRender(STATE);
  };

  $("btnSlip").onclick = () => renderPreviewSlip(STATE);

  $("btnPayNow").onclick = () => {
    renderPreviewSlip(STATE);
    openPayModal();
  };

  $("btnPrintFinal").onclick = () => window.print();
}

function login(userId, password){
  const u = loadUsers().find(x => x.userId===userId && x.password===password);
  if (!u) return alert("Sign in failed. Please check your Student ID and Password.");
  setSession(u.userId);
  showApp(u);
}

function registerUser(userId, password, name, dept){
  if (!userId || !password) return alert("Student ID and Password are required.");
  const users = loadUsers();
  if (users.some(u => u.userId===userId)) return alert("This Student ID already exists.");
  users.push({ userId, password, name: name||"Student", dept: dept||"CSE" });
  saveUsers(users);
  alert("Account created successfully. You can sign in now.");
}

function resetAll(){
  localStorage.removeItem(LS_USERS);
  localStorage.removeItem(LS_SESSION);
  localStorage.removeItem(LS_ENROLL);
  localStorage.removeItem(LS_PAYMENTS);
  ensureSeedUser();
  location.reload();
}

function bindPaymentEvents(){
  $("btnClosePay").onclick = closePayModal;

  document.querySelectorAll(".tab").forEach(btn => btn.onclick = () => setPayTab(btn.dataset.tab));
  document.querySelectorAll(".brandBtn").forEach(btn => btn.onclick = () => setMBBrand(btn.dataset.brand));

  $("cardNumber").addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g,"").slice(0,16);
    v = v.replace(/(\d{4})(?=\d)/g, "$1 ");
    e.target.value = v;
  });
  $("cardExp").addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g,"").slice(0,4);
    if (v.length >= 3) v = v.slice(0,2) + "/" + v.slice(2);
    e.target.value = v;
  });

  $("mbNumber").addEventListener("input", (e) => {
    const v = e.target.value.replace(/\D/g,"").slice(0,11);
    e.target.value = v;

    if (v.length === 11) {
      PAY.otp = genOTP();
      PAY.otpFor = v;
      $("mbOtp").value = PAY.otp;
      $("otpHint").textContent = `OTP generated. (OTP: ${PAY.otp})`;
    } else {
      PAY.otp = null;
      PAY.otpFor = null;
      $("mbOtp").value = "";
      $("otpHint").textContent = "Enter mobile number to receive an OTP.";
    }
  });

  $("btnPayCard").onclick = () => {
    PAY.tab = "card";
    updatePaySummary();
    const v = validatePayment();
    if (!v.ok) return showPayStatus(v.msg);

    showPayStatus("Processing payment...");
    setTimeout(() => {
      const payment = finalizePayment("CARD");
      showSuccessOverlay(payment);
      setTimeout(() => closePayModal(), 1400);
    }, 900);
  };

  $("btnPayMB").onclick = () => {
    PAY.tab = "mbank";
    updatePaySummary();
    const v = validatePayment();
    if (!v.ok) return showPayStatus(v.msg);

    showPayStatus("Processing payment...");
    setTimeout(() => {
      const payment = finalizePayment(PAY.mbBrand);
      showSuccessOverlay(payment);
      setTimeout(() => closePayModal(), 1400);
    }, 900);
  };
}

(function init(){
  ensureSeedUser();
  bindPaymentEvents();

  $("btnLogin").onclick = () => login($("loginUser").value.trim(), $("loginPass").value.trim());

  $("btnRegister").onclick = () => registerUser(
    $("regUser").value.trim(),
    $("regPass").value.trim(),
    $("regName").value.trim(),
    $("regDept").value.trim()
  );

  $("btnLogout").onclick = () => {
    clearSession();
    $("authCard").classList.remove("hidden");
    $("app").classList.add("hidden");
    $("btnLogout").classList.add("hidden");
  };

  $("btnReset").onclick = resetAll;

  const session = getSession();
  if (session?.userId) {
    const u = getUserById(session.userId);
    if (u) showApp(u);
  }
})();
