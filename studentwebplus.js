console.log("studentwebplus.js loaded successfully");

let grades = []
let table = document.querySelector(".table-standard.reflow.ui-panel-content");
let resultatRows = table.querySelectorAll("tr.resultatTop, tr.none");

// Loop through all the rows in the table and find the grades in the 6th column (index 5) and add them to the grades array. 
// Each row that has a valid grade will also get a checkbox appended to it.
for (let i = 0; i < resultatRows.length; i++) {
    let resultatColumns = resultatRows[i].querySelectorAll("td.col6Resultat");
    for (let j = 0; j < resultatColumns.length; j++) {
        let grade = resultatColumns[j].querySelector(".infoLinje span").textContent.trim();
        let pattern = /^[A-E]|Bestått$/;
        let isValidGrade = pattern.test(grade);
        if (isValidGrade) {
            grades.push(grade);

        // Create a new checkbox element
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "grade-checkbox";
        checkbox.value = grade;
        checkbox.style.verticalAlign = "middle";
        checkbox.style.position = "relative";

        // Create a new label element
        let checkboxLabel = document.createElement("label");
        checkboxLabel.appendChild(document.createTextNode("Velg"));
        checkboxLabel.style.color = "black";
        checkboxLabel.style.verticalAlign = "middle";
        checkboxLabel.style.marginTop = "10px";
        checkboxLabel.style.marginLeft = "25px";
        checkboxLabel.style.fontSize = "14px";
        checkboxLabel.style.fontWeight = "bold";
        //move both the checkbox and the label to the left
        checkboxLabel.style.position = "relative";
        checkboxLabel.style.left = "-20px";
        
        // Append the checkbox to the label
        checkboxLabel.appendChild(checkbox);

        // Append the label to the td element
        resultatColumns[j].appendChild(checkboxLabel);

        let infoLinje = resultatColumns[j].querySelector(".infoLinje");
        infoLinje.appendChild(checkboxLabel);    
        }
    }
}

let checkboxes = document.querySelectorAll('.grade-checkbox');
let studyPoints = document.querySelectorAll('.col7Studiepoeng span');

let lastRow = document.querySelector("tr:last-of-type");
let lastTd = lastRow.querySelector("td:last-of-type");

// Create a new button element
let button = document.createElement("button");
button.innerHTML = "Velg alle";
button.style.verticalAlign = "middle";
button.style.cursor = "pointer";
button.className = "ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only small grey";
button.style.color = "black";


// Create a new button element
let p = document.createElement("p");
p.innerHTML = "Du må velge minst ett emne for å kunne regne ut snittet ditt.";
p.style.color = "black";
p.style.fontSize = "14px";
p.style.marginLeft = "25px";
p.style.position = "relative";



// Append the button to the last td element
lastTd.appendChild(button);
lastRow.appendChild(p);

let checkboxCount = 0;
// Add event listener for the button
button.addEventListener("click", function(event) {
    event.preventDefault();
    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = !checkboxes[i].checked;
        checkboxCount = checkboxes[i].checked ? checkboxCount + 1 : checkboxCount - 1;
    }

    if (checkboxCount == checkboxes.length) {
        console.log(calculate());
    } else {
        p.innerHTML = "Du må velge minst ett emne for å kunne regne ut snittet ditt.";
    }
});

for (let i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener('change', function() {
        if (this.checked) {
            checkboxCount++;
        } else {
            checkboxCount--;
        }
        if (checkboxCount >= 1) {
            console.log(calculate());
        } else {
            p.innerHTML = "Du må velge minst ett emne for å kunne regne ut snittet ditt.";
        }
    });
}

function calculate(){
    let totaltEcts = 0;
    let totaltEctsForCalculation = 0;
    let sumGrades = 0;

    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            let ects = Number(studyPoints[i].textContent.replace(",", "."));
            totaltEcts += ects;
            if (checkboxes[i].value != "Bestått") {
                let numberGrade = checkboxes[i].value.charCodeAt(0) <= 69 ? 5 - (checkboxes[i].value.charCodeAt(0) - 65) : 0;
                totaltEctsForCalculation += ects;
                sumGrades += numberGrade * ects;
            }
        }
    }

    let snitt = (sumGrades / totaltEctsForCalculation);
    let letterGrade = "";

    if (snitt >= 4.5) {
        letterGrade = "A";
    } else if (snitt >= 3.5 && snitt < 4.5) {
        letterGrade = "B";
    } else if (snitt >= 2.5 && snitt < 3.5) {
        letterGrade = "C";
    } else if (snitt >= 1.5 && snitt < 2.5) {
        letterGrade = "D";
    } else if (result < 1.5) {
        letterGrade = "E";
    }

    p.innerHTML = "Ditt snitt er " + snitt.toFixed(1) + ", noe som tilsvarer en " + letterGrade + ". (" + totaltEcts + " studiepoeng)";
}