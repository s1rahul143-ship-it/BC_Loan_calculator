
// =====================
// EMPLOYEES
// =====================
let names = [
"Abhijeet Fulari",
"Vaibhav Wagh",
"Bapu Tawale",
"Shivaji Raut",
"Ganesh Raut",
"Babasaheb Jare",
"Ganesh Dhadage",
"Suraj Dhadage",
"Pramod Barde",
"Rahul Shinde"
];

// =====================
// DATA STORAGE
// =====================
let months = [];
let sheet2 = {};

// =====================
// CREATE SHEET1
// =====================
function loadTable(){

    let t = document.getElementById("table");

    t.innerHTML = `
    <tr>
        <th>Name</th>
        <th>Monthly</th>
        <th>Loan1</th>
        <th>Start1</th>
        <th>End1</th>
        <th>Loan2</th>
        <th>Start2</th>
        <th>End2</th>
        <th>Loan EMI</th>
        <th>Total EMI</th>
    </tr>`;

    names.forEach((name,i)=>{

        t.innerHTML += `
        <tr>
            <td>${name}</td>
            <td>500</td>
            <td><input id="c${i}"></td>
            <td><input type="date" id="d${i}"></td>
            <td id="e${i}"></td>
            <td><input id="f${i}"></td>
            <td><input type="date" id="g${i}"></td>
            <td id="h${i}"></td>
            <td id="i${i}"></td>
            <td id="j${i}"></td>
        </tr>`;
    });
}

// =====================
// CALCULATE SHEET1
// =====================
function calculate(){

    for(let i=0;i<10;i++){

        let c = Number(document.getElementById("c"+i).value || 0);
        let f = Number(document.getElementById("f"+i).value || 0);

        let d = document.getElementById("d"+i).value;
        let g = document.getElementById("g"+i).value;

        // End date = +10 months
        if(d){
            let dt = new Date(d);
            dt.setMonth(dt.getMonth()+10);
            document.getElementById("e"+i).innerText =
                dt.toISOString().slice(0,10);
        }

        if(g){
            let dt = new Date(g);
            dt.setMonth(dt.getMonth()+10);
            document.getElementById("h"+i).innerText =
                dt.toISOString().slice(0,10);
        }

        let loanEMI = (c*0.112) + (f*0.112);
        let total = 500 + loanEMI;

        document.getElementById("i"+i).innerText =
            loanEMI.toFixed(0);

        document.getElementById("j"+i).innerText =
            total.toFixed(0);
    }

    updateSummary();
    saveData();
}

// =====================
// RUN MONTH (Sheet2 logic)
// =====================
function runMonth(){

    let month = document.getElementById("f15").value;

    if(!month){
        let d = new Date();
        month = d.toISOString().slice(0,7);
    }

    let col = [];

    for(let i=0;i<10;i++){

        let c = Number(document.getElementById("c"+i).value || 0);
        let f = Number(document.getElementById("f"+i).value || 0);

        let total = 500 + (c*0.112 + f*0.112);

        col.push(total);
    }

    // overwrite if exists
    sheet2[month] = col;

    if(!months.includes(month)){
        months.push(month);
    }

    renderSheet2();
    updateSummary();
    saveData();
}

// =====================
// SHEET2 RENDER
// =====================
function renderSheet2(){

    let t = document.getElementById("sheet2");

    t.innerHTML = "";

    let header = "<tr><th>Name</th>";

    months.forEach(m=>{
        header += `<th>${m}</th>`;
    });

    header += "</tr>";
    t.innerHTML += header;

    for(let i=0;i<10;i++){

        let row = `<tr><td>${names[i]}</td>`;

        months.forEach(m=>{
            row += `<td>${sheet2[m]?.[i] || 0}</td>`;
        });

        row += "</tr>";

        t.innerHTML += row;
    }
}

// =====================
// SUMMARY (TOTAL FROM SHEET2)
// =====================
function updateSummary(){

    let totalLoan = 0;

    for(let i=0;i<10;i++){
        let c = Number(document.getElementById("c"+i).value || 0);
        let f = Number(document.getElementById("f"+i).value || 0);
        totalLoan += (c + f);
    }

    let totalJama = 0;

    Object.keys(sheet2).forEach(m=>{
        sheet2[m].forEach(v=>{
            totalJama += Number(v || 0);
        });
    });

    let charges = Number(document.getElementById("charges").value || 0);

    document.getElementById("t1").innerText = totalJama;
    document.getElementById("t2").innerText = totalLoan;
    document.getElementById("t4").innerText = totalJama - totalLoan - charges;
}

// =====================
// SAVE DATA (LOCAL STORAGE)
// =====================
function saveData(){

    let sheet1 = [];

    for(let i=0;i<10;i++){
        sheet1.push({
            c: document.getElementById("c"+i).value,
            d: document.getElementById("d"+i).value,
            f: document.getElementById("f"+i).value,
            g: document.getElementById("g"+i).value
        });
    }

    localStorage.setItem("sheet1", JSON.stringify(sheet1));
    localStorage.setItem("sheet2", JSON.stringify(sheet2));
    localStorage.setItem("months", JSON.stringify(months));
}

// =====================
// LOAD DATA (RESTORE)
// =====================
function loadData(){

    let s1 = localStorage.getItem("sheet1");
    let s2 = localStorage.getItem("sheet2");
    let m = localStorage.getItem("months");

    if(s2) sheet2 = JSON.parse(s2);
    if(m) months = JSON.parse(m);

    if(s1){
        let sheet1 = JSON.parse(s1);

        sheet1.forEach((r,i)=>{
            document.getElementById("c"+i).value = r.c;
            document.getElementById("d"+i).value = r.d;
            document.getElementById("f"+i).value = r.f;
            document.getElementById("g"+i).value = r.g;
        });
    }
}

// =====================
// START APP
// =====================
window.onload = function(){
    loadTable();
    loadData();
    renderSheet2();
    updateSummary();
}