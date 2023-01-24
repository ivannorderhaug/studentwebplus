console.log("studentwebplus.js loaded successfully");

// It will add checkboxes to each row that has a valid grade and a button that can be used to select all the checkboxes.
// It will also calculate the average grade for the selected checkboxes.
// The script will also add a button that can be used to select all the checkboxes.
let table = document.querySelector(".table-standard.reflow.ui-panel-content");
let resultRows = table.querySelectorAll("tr.resultatTop, tr.none");

studyPoints = [];

// Loop through all the rows in the table and find the grades in the 6th column (index 5) and add them to the grades array. 
// Each row that has a valid grade will also get a checkbox appended to it.
function findGrades(){
    for (let i = 0; i < resultRows.length; i++) {
        let resultColumn = resultRows[i].querySelector("td.col6Resultat");
        let pointColumn = resultRows[i].querySelector("td.col7Studiepoeng")
        let grade = resultColumn.querySelector(".infoLinje span").textContent.trim();
        let pattern = /^[A-E]|Bestått|Passed|Greidd$/;
        let isValidGrade = pattern.test(grade);
        if (isValidGrade && pointColumn.hasChildNodes()) {
                let points = pointColumn.querySelector("span").textContent;
                let parsedPoints = Number(points.replace(",", "."));
                studyPoints.push(parsedPoints);
                resultColumn.appendChild(createCheckbox(grade));
                resultColumn.appendChild(createEditButton());
            }
        }
}

function createCheckbox(grade) {
    // Create a new checkbox element
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "grade-checkbox";
    checkbox.value = grade;
    checkbox.style.verticalAlign = "middle";
    checkbox.style.position = "relative";
    checkbox.style.left = "5px";
    return checkbox;
}

function createEditButton() {
    // Create a new button element
    let editButton = document.createElement("button");
    editButton.innerHTML = "Endre";
    editButton.className = "edit-button ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only small grey";
    editButton.style.position = "relative";
    editButton.style.left = "8px";
    editButton.style.top = "-25px";
    editButton.style.fontSize = "12px";
    editButton.style.scale = "0.75";
    editButton.style.marginLeft = "59px";

    editButton.addEventListener("click", function(event) {
        event.preventDefault();
        
        let span = this.parentNode.querySelector(".infoLinje span");
        let checkbox = this.parentNode.querySelector(".grade-checkbox");
        
        let newGrade = prompt("Skriv inn ny karakter (A-F eller bestått/greidd/passed):");
        if (newGrade !== null) {
            if (newGrade.length == 0) newGrade = newGrade.toUpperCase();
            else {
                newGrade = newGrade.charAt(0).toUpperCase() + newGrade.slice(1).toLowerCase();
            }

            let pattern = /^[A-E]|Bestått|Passed|Greidd$/;
            let isValidGrade = pattern.test(newGrade);

            if (isValidGrade) {
                span.textContent = newGrade;
                checkbox.value = newGrade;
                if (checkbox.checked) calculate();
                
            } else {
                alert("Ugyldig karakter. Prøv igjen.");
            }
        }

    });

    return editButton;
}

findGrades();

let checkboxes = document.querySelectorAll('.grade-checkbox');
//let studyPoints = document.querySelectorAll('.col7Studiepoeng span');


let lastRow = document.querySelector("tr:last-of-type");
let lastTd = lastRow.querySelector("td:last-of-type");

// Create a new button element
let button = document.createElement("button");
button.innerHTML = "Velg alle";
button.style.verticalAlign = "middle";
button.style.cursor = "pointer";
button.className = "ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only small grey";

let td = document.createElement("td");
td.style.border = "medium none";


// Create a new button element
let p = document.createElement("p");
p.innerHTML = "Start med å velge emner du vil regne snittet ditt ut fra eller klikk på knappen for å velge alle emner.";
p.style.color = "black";
p.style.fontSize = "14px";
p.style.marginLeft = "25px";
p.style.position = "relative";

// Append the button to the last td element
td.appendChild(button);
lastRow.appendChild(td);
lastRow.appendChild(p);

let checkboxCount = 0;
let hasLetterGrade = false; // flag to keep track of whether a checkbox with a letter grade is selected

// Add event listener for the button
button.addEventListener("click", function(event) {
    event.preventDefault();
    let hasLetterGrade = false;
    // If the button text is "Velg alle", check all checkboxes and change the button text to "Fjern alle"
    if (button.innerHTML === "Velg alle") {
        for (let i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = true;
            if (checkboxes[i].value !== "Bestått" && checkboxes[i].value !== "Passed" && checkboxes[i].value !== "Greidd") {
                hasLetterGrade = true;
            }
        }
        button.innerHTML = "Fjern alle";
        if (hasLetterGrade) calculate();
    } 
    // If the button text is "Fjern alle", uncheck all checkboxes and change the button text to "Velg alle"
    else {
        for (let i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = false;
        }
        button.innerHTML = "Velg alle";
        p.innerHTML = "Start med å velge emner du vil regne snittet ditt ut fra eller klikk på knappen for å velge alle emner.";
    }
});

// Add event listener for the checkboxes
// When a checkbox is checked or unchecked, calculate the average
for (let i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener('change', function() {
        checkboxCount = 0;
        hasLetterGrade = false;
        // If there is at least one checkbox selected and at least one checkbox with a letter grade selected, calculate the average
        for (let j = 0; j < checkboxes.length; j++) {
            if (checkboxes[j].checked) {
                checkboxCount++;
                if (checkboxes[j].value !== "Bestått" && checkboxes[j].value !== "Passed" && checkboxes[j].value !== "Greidd") {
                    hasLetterGrade = true;
                }
            }
        }

        if (checkboxCount == 0 ) {
            button.innerHTML = "Velg alle";
        } else if (checkboxCount == checkboxes.length) {
            button.innerHTML = "Fjern alle";
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
    let totalEcts = 0;
    let totalEctsForCalculation = 0;
    let sumGrades = 0;

    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            let ects = studyPoints[i];
            totalEcts += ects;
            if (checkboxes[i].value !== "Bestått" && checkboxes[i].value !== "Passed" && checkboxes[i].value !== "Greidd") {
                let numberGrade = checkboxes[i].value.charCodeAt(0) <= 69 ? 5 - (checkboxes[i].value.charCodeAt(0) - 65) : 0;
                totalEctsForCalculation += ects;
                sumGrades += numberGrade * ects;
            }
        }
    }

    if (sumGrades == 0 && totalEctsForCalculation > 0) {
        p.textContent = "Du har bestått alle emnene du har valgt, men de har ikke bokstavkarakter. Derfor kan vi ikke regne ut snittet ditt.";
        return;
    }

    let average = (sumGrades / totalEctsForCalculation);

    let letterGrade = "";

    if (average >= 4.5) {
        letterGrade = "A";
    } else if (average >= 3.5 && average < 4.5) {
        letterGrade = "B";
    } else if (average >= 2.5 && average < 3.5) {
        letterGrade = "C";
    } else if (average >= 1.5 && average < 2.5) {
        letterGrade = "D";
    } else if (result < 1.5) {
        letterGrade = "E";
    }

    p.textContent = "Ditt snitt er " + average.toFixed(1) + ", noe som tilsvarer en " + letterGrade + ". (" + totalEcts + " studiepoeng)";
    console.log("Ditt snitt utenavrunding er " + average.toFixed(2));
}