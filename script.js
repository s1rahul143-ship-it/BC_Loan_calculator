const ADMIN_PASSWORD = "12345";
let isAuthenticated = false;

function checkPassword() {
    if (isAuthenticated) return true;

    const pass = prompt("Enter Password");

    if (pass === ADMIN_PASSWORD) {
        isAuthenticated = true;
        return true;
    }

    alert("Wrong Password");
    return false;
}
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

let months = [];
let sheet2 = {};

// ---------------- TABLE ----------------
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

// ---------------- CALCULATE ----------------
function calculate(){
if (!checkPassword())return;
   
    for(let i=0;i<10;i++){

        let c = Number(document.getElementById("c"+i).value || 0);
        let f = Number(document.getElementById("f"+i).value || 0);

        let d = document.getElementById("d"+i).value;
        let g = document.getElementById("g"+i).value;

        document.getElementById("e"+i).innerText = "";
        document.getElementById("h"+i).innerText = "";

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

        let loanEMI = (c * 0.112) + (f * 0.112);
        let total = 500 + loanEMI;

        document.getElementById("i"+i).innerText =
            loanEMI.toFixed(0);

        document.getElementById("j"+i).innerText =
            total.toFixed(0);
    }

    updateSummary();
    saveData();
}

// ---------------- MONTH ----------------
function runMonth(){
if (!checkPassword())return;
    let month = document.getElementById("f15").value;

    if(!month){
        let d = new Date();
        month = d.toISOString().slice(0,7);
    }

    let col = [];

    for(let i=0;i<10;i++){

        let c = Number(document.getElementById("c"+i).value || 0);
        let f = Number(document.getElementById("f"+i).value || 0);

        let total = 500 + (c * 0.112 + f * 0.112);

        col.push(total);
    }

    sheet2[month] = col;

    if(!months.includes(month)){
        months.push(month);
    }

    renderSheet2();
    updateSummary();
    saveData();
}

// ---------------- RENDER ----------------
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

// ---------------- SUMMARY ----------------
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

    let charges =
        Number(document.getElementById("charges").value || 0);

    document.getElementById("t1").innerText = totalJama;
    document.getElementById("t2").innerText = totalLoan;
    document.getElementById("t4").innerText =
        totalJama - totalLoan - charges;
}

// ---------------- FIREBASE SAVE ----------------
function saveData(){
    let members = [];

    for(let i=0;i<10;i++){

        members.push({
            loan1: document.getElementById("c"+i).value,
            start1: document.getElementById("d"+i).value,
            loan2: document.getElementById("f"+i).value,
            start2: document.getElementById("g"+i).value
        });

    }

    db.ref("loanApp").set({
        members: members,
        sheet2: sheet2,
        months: months,
        charges: document.getElementById("charges").value
    });
}

// ---------------- FIREBASE LOAD ----------------
function loadData(){

    db.ref("loanApp").on("value",(snap)=>{

        let data = snap.val();

        if(!data) return;

        sheet2 = data.sheet2 || {};
        months = data.months || [];

        if(data.charges !== undefined){
            document.getElementById("charges").value =
                data.charges;
        }

        if(data.members){

            data.members.forEach((m,i)=>{

                document.getElementById("c"+i).value =
                    m.loan1 || "";

                document.getElementById("d"+i).value =
                    m.start1 || "";

                document.getElementById("f"+i).value =
                    m.loan2 || "";

                document.getElementById("g"+i).value =
                    m.start2 || "";

            });

        }

     //   calculate();
        renderSheet2();
        updateSummary();

    });

}

// ---------------- START ----------------
window.onload = function(){

    loadTable();
    loadData();

    document.getElementById("charges")
        .addEventListener("change", saveData);

};
