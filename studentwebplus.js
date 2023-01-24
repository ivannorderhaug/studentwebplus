console.log("studentwebplus.js loaded successfully");

/*
    GradeCalculator class
    This class is used to calculate the average grade for the selected checkboxes.
*/
class GradeCalculator {
    constructor() {
        this.totalEcts = 0;
        this.totalEctsForCalculation = 0;
        this.selectedGradeCount = 0;
        this.sumGrades = 0;
        this.nonLetterGrades = ["Bestått","Passed","Greidd"];
        this.pattern = /^[A-E]|Bestått|Passed|Greidd$/;
        this.arrGrades = [];
        this.arrEcts = [];
    }

    //get and set methods
    get totalEcts() {
        return this._totaltEcts;
    }

    set totalEcts(value) {
        this._totaltEcts = value;
    }

    get totalEctsForCalculation() {
        return this._totaltEctsForCalculation;
    }

    set totalEctsForCalculation(value) {
        this._totaltEctsForCalculation = value;
    }

    get sumGrades() {
        return this._sumGrades;
    }

    set sumGrades(value) {
        this._sumGrades = value;
    }

    get nonLetterGrades() {
        return this._nonLetterGrades;
    }

    set nonLetterGrades(value) {
        this._nonLetterGrades = value;
    }

    get selectedGradeCount() {
        return this._selectedGradeCount;
    }

    set selectedGradeCount(value) {
        this._selectedGradeCount = value;
    }

    calculateAverage() {
        let averageGrade = this.sumGrades / this.totalEctsForCalculation;
        return averageGrade;
    }

    addGrade(grade, ects) {
        this.totalEcts += ects;
        if (!this.nonLetterGrades.includes(grade)) {
            let gradeValue = this.letterToNumber(grade);
            this.sumGrades += (gradeValue * ects);
            this.totalEctsForCalculation += ects;
        }
        this.selectedGradeCount++;
    }

    removeGrade(grade, ects) {
        this.totalEcts -= ects;
        if (!this.nonLetterGrades.includes(grade)) {
            let gradeValue = this.letterToNumber(grade);
            this.sumGrades -= (gradeValue * ects);
            this.totalEctsForCalculation -= ects;
        }
        this.selectedGradeCount--;
    }
    
    // Converts a letter grade to a number
    letterToNumber(grade){
        return grade.charCodeAt(0) <= 69 ? 5 - (grade.charCodeAt(0) - 65) : 0;
    }

    // Converts a number to a letter grade
    numberToLetter(grade){
        return grade >= 4.5 ? 'A' : grade >= 3.5 ? 'B' : grade >= 2.5 ? 'C' : grade >= 1.5 ? 'D' : 'E';
    }
}
const calc = new GradeCalculator();
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

let lastRow = document.querySelector("tr:last-of-type");

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

// Add event listener for the button
button.addEventListener("click", function(event) {
    event.preventDefault();

    totaltEcts = totaltEctsForCalculation = sumGrades = checkboxCount = 0;

    if (button.innerHTML === "Velg alle") {
        for (let i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = true;
            updateGrade(i);
        }
        button.innerHTML = "Fjern alle";
    }
    else {
        for (let i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = false;
        }
        button.innerHTML = "Velg alle";
    }

    GetGrade();
});

// Add event listener for the checkboxes
// When a checkbox is checked or unchecked, calculate the average
for (let i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener('change', function() {updateGrade(i)});
}

function updateGrade(i){
    let checkbox = checkboxes[i];

    if (checkbox.checked) {
        AddSingleGrade(studyPoints[i], checkbox.value);
    } else{
        RemoveSingleGrade(studyPoints[i], checkbox.value);
    }        
    GetGrade();
}

let totaltEcts = 0;
let totaltEctsForCalculation = 0;
let sumGrades = 0;
let checkboxCount = 0;

function AddSingleGrade(ects, grade){
    totaltEcts += ects;
    if (!["Bestått","Passed","Greidd"].includes(grade)) {
        totaltEctsForCalculation += ects;
        sumGrades += letterToNumber(grade) * ects;
    }
    checkboxCount++;
}

function RemoveSingleGrade(ects, grade){
    totaltEcts -= ects;
    if (!["Bestått","Passed","Greidd"].includes(grade)) {
        totaltEctsForCalculation -= ects;
        sumGrades -= letterToNumber(grade) * ects;
    }    
    checkboxCount--;
}

function GetGrade(){
    if (sumGrades == 0 && totaltEctsForCalculation > 0) {
        p.textContent = "Du har bestått alle emnene du har valgt, men de har ikke bokstavkarakter. Derfor kan vi ikke regne ut snittet ditt.";
        return;
    }

    const avg = sumGrades / totaltEctsForCalculation;
    const letterGrade = numberToLetter(avg)

    if(isNaN(avg)){
        p.innerHTML = checkboxCount === 0 ? 
        "Start med å velge emner du vil regne snittet ditt ut fra eller klikk på knappen for å velge alle emner.":
        "Du må velge minst ett emne som har bokstavkarakter for å kunne regne ut snittet ditt.";
    } else {
        p.textContent = "Ditt snitt er " + avg.toFixed(1) + ", noe som tilsvarer en " + letterGrade + ". (" + totaltEcts + " studiepoeng)";
        console.log("Ditt snitt uten avrunding er " + avg.toFixed(2));
    }
}

// Converts a letter grade to a number
function letterToNumber(grade){
    return grade.charCodeAt(0) <= 69 ? 5 - (grade.charCodeAt(0) - 65) : 0;
}

// Converts a number to a letter grade
function numberToLetter(grade){
    return grade >= 4.5 ? 'A' : grade >= 3.5 ? 'B' : grade >= 2.5 ? 'C' : grade >= 1.5 ? 'D' : 'E';
}