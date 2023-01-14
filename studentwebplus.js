console.log("studentwebplus.js loaded successfully");

let grades = []
let table = document.querySelector(".table-standard.reflow.ui-panel-content");
let resultatRows = table.querySelectorAll("tr.resultatTop, tr.none");

// Loop through all the rows in the table and find the grades in the 6th column (index 5) and add them to the grades array. 
// Each row that has a valid grade will also get a checkbox appended to it.
function findGrades(){
    grades = []
    for (let i = 0; i < resultatRows.length; i++) {
        let resultatColumns = resultatRows[i].querySelectorAll("td.col6Resultat");
        for (let j = 0; j < resultatColumns.length; j++) {
            let grade = resultatColumns[j].querySelector(".infoLinje span").textContent.trim();
            let pattern = /^[A-E]|Bestått|Passed|Greidd$/;
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
                checkboxLabel.style.marginLeft = "15px";
                checkboxLabel.style.fontSize = "14px";
                checkboxLabel.style.fontWeight = "bold";
                //move both the checkbox and the label to the left
                checkboxLabel.style.position = "relative";
                checkboxLabel.style.left = "-10px"; //move the label to the left
                
                // Append the checkbox to the label
                checkboxLabel.appendChild(checkbox);

                // Append the label to the td element
                resultatColumns[j].appendChild(checkboxLabel);

                let infoLinje = resultatColumns[j].querySelector(".infoLinje");
                infoLinje.appendChild(checkboxLabel);    
            }
        }
    }
}

findGrades();

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


// Create a new button element
let p = document.createElement("p");
p.innerHTML = "Start med å velge emner du vil regne snittet ditt ut fra eller klikk på knappen for å velge alle emner.";
p.style.color = "black";
p.style.fontSize = "14px";
p.style.marginLeft = "25px";
p.style.position = "relative";



// Append the button to the last td element
lastTd.appendChild(button);
lastRow.appendChild(p);

let checkboxCount = 0;
let hasLetterGrade = false; // flag to keep track of whether a checkbox with a letter grade is selected

// Add event listener for the button
button.addEventListener("click", function(event) {
    event.preventDefault();
    let allChecked = true;
    for (let i = 0; i < checkboxes.length; i++) {
        if (!checkboxes[i].checked) {
            allChecked = false;
            break;
        }
    }
    if (allChecked) {
        for (let i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = false;
            if (checkboxes[i].value !== "Bestått" && checkboxes[i].value !== "Passed" && checkboxes[i].value !== "Greidd") {
                hasLetterGrade = false;
            }
        }
        button.innerHTML = "Velg alle";
    } else {
        for (let i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = true;
            if (checkboxes[i].value !== "Bestått" && checkboxes[i].value !== "Passed" && checkboxes[i].value !== "Greidd") {
                hasLetterGrade = true;
            }
        }
        button.innerHTML = "Fjern alle";
    }
    checkboxCount = 0;
    // If there is at least one checkbox selected and at least one checkbox with a letter grade selected, calculate the average
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            checkboxCount++;
            if (checkboxes[i].value !== "Bestått" && checkboxes[i].value !== "Passed" && checkboxes[i].value !== "Greidd") {
                hasLetterGrade = true;
            }
        }
    }
    if (checkboxCount > 0 && hasLetterGrade) {
        calculate();
    } else {
        if (checkboxCount === 0){
            p.innerHTML = "Start med å velge emner du vil regne snittet ditt ut fra eller klikk på knappen for å velge alle emner.";
        } else {
            p.innerHTML = "Du må velge minst ett emne som har bokstavkarakter for å kunne regne ut snittet ditt.";
        }
    }
});

// Add event listener for the checkboxes
// When a checkbox is checked or unchecked, calculate the average
for (let i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener('change', function() {
        checkboxCount = 0;
        hasLetterGrade = false;
        for (let j = 0; j < checkboxes.length; j++) {
            if (checkboxes[j].checked) {
                checkboxCount++;
                if (checkboxes[i].value !== "Bestått" && checkboxes[i].value !== "Passed" && checkboxes[i].value !== "Greidd") {
                    hasLetterGrade = true;
                }
            }
        }
        if (checkboxCount > 0 && hasLetterGrade) {
            calculate();
        } else {
            if (checkboxCount === 0){
                p.innerHTML = "Start med å velge emner du vil regne snittet ditt ut fra eller klikk på knappen for å velge alle emner.";
            } else {
                p.innerHTML = "Du må velge minst ett emne som har bokstavkarakter for å kunne regne ut snittet ditt.";
            }
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
            if (checkboxes[i].value !== "Bestått" && checkboxes[i].value !== "Passed" && checkboxes[i].value !== "Greidd") {
                let numberGrade = checkboxes[i].value.charCodeAt(0) <= 69 ? 5 - (checkboxes[i].value.charCodeAt(0) - 65) : 0;
                totaltEctsForCalculation += ects;
                sumGrades += numberGrade * ects;
            }
        }
    }

    if (sumGrades == 0 && totaltEctsForCalculation > 0) {
        p.textContent = "Du har bestått alle emnene du har valgt, men de har ikke bokstavkarakter. Derfor kan vi ikke regne ut snittet ditt.";
        return;
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

    p.textContent = "Ditt snitt er " + snitt.toFixed(1) + ", noe som tilsvarer en " + letterGrade + ". (" + totaltEcts + " studiepoeng)";
}