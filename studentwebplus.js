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
        return 5 - (grade.charCodeAt(0) - 65);
    }

    // Converts a number to a letter grade
    numberToLetter(grade){
        return grade < 1.5 ? 'E' : String.fromCharCode(65 + (5- Math.round(grade)));
    }
}

const calc = new GradeCalculator();
/*
    init will be called when the page is loaded.
    It will find all the valid grades and add a checkbox and an edit button to each row. 
    If a grade is valid, it's corresponding ects will be added to the studyPoints array.
    The grade itself will be stored as the value of the checkbox.
 */
function init(){
    let table = document.querySelector(".table-standard.reflow.ui-panel-content");
    let resultRows = table.querySelectorAll("tr.resultatTop, tr.none");

    for (let i = 0; i < resultRows.length; i++) {
        let resultColumn = resultRows[i].querySelector("td.col6Resultat");
        let pointColumn = resultRows[i].querySelector("td.col7Studiepoeng");
        let grade = resultColumn.querySelector(".infoLinje span").textContent.trim();
        let isValidGrade = calc.pattern.test(grade);

        if (isValidGrade && pointColumn.hasChildNodes()) {
                let points = pointColumn.querySelector("span").textContent;
                let parsedPoints = Number(points.replace(",", "."));
                calc.arrEcts.push(parsedPoints);
                calc.arrGrades.push(grade);
                resultColumn.appendChild(createCheckbox());
                resultColumn.appendChild(createEditButton());
            }
        }

    let lastRow = document.querySelector("tr:last-of-type");
    let button = document.createElement("button");
    button.innerHTML = "Velg alle";
    button.style.verticalAlign = "middle";
    button.style.cursor = "pointer";
    button.className = "ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only small grey";
    button.id = "select-all-button";

    button.addEventListener("click", function(event) {
        event.preventDefault();
        if (button.innerHTML === "Velg alle") {
            for (let i = 0; i < checkboxes.length; i++) {
                if (!checkboxes[i].checked) {
                    checkboxes[i].checked = true;
                    updateGrade(checkboxes[i], i);
                }
            }

            button.innerHTML = "Fjern alle";
        }
        else {
            for (let i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked) {
                    checkboxes[i].checked = false;
                    updateGrade(checkboxes[i], i);
                }
            }
            button.innerHTML = "Velg alle";
        }
    });
    
    let td = document.createElement("td");
    td.style.border = "medium none";
    
    let p = document.createElement("p");
    p.innerHTML = "Start med å velge emner du vil regne snittet ditt ut fra eller klikk på knappen for å velge alle emner.";
    p.style.color = "black";
    p.style.fontSize = "14px";
    p.style.marginLeft = "25px";
    p.style.position = "relative";
    p.id = "info-text";
    
    td.appendChild(button);
    lastRow.appendChild(td);
    lastRow.appendChild(p);
}
/*
    createCheckbox will create a new checkbox element.
    The value of the checkbox will be set to the grade that is passed as a parameter.
    @return the checkbox element.
*/
function createCheckbox() {
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "grade-checkbox";
    checkbox.style.verticalAlign = "middle";
    checkbox.style.position = "relative";
    checkbox.style.left = "5px";
    return checkbox;
}
/*
    createEditButton will create a new button element.
    @return the button element.
*/
function createEditButton() {
    let editButton = document.createElement("button");
    editButton.innerHTML = "Endre";
    editButton.className = "edit-button ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only small grey";
    editButton.style.position = "relative";
    editButton.style.left = "8px";
    editButton.style.top = "-25px";
    editButton.style.fontSize = "12px";
    editButton.style.scale = "0.75";
    editButton.style.marginLeft = "59px";

    // Add an event listener to the button that will prompt the user to enter a new grade.
    // If the grade is valid, the grade in the table will be updated and the average grade will be recalculated.
    editButton.addEventListener("click", function(event) {
        event.preventDefault();
        
        let span = this.parentNode.querySelector(".infoLinje span");
        let checkbox = this.parentNode.querySelector(".grade-checkbox");
        let newGrade = prompt("Skriv inn ny karakter (A-F eller bestått/greidd/passed):");
        if (newGrade !== null) {
            if (newGrade.length == 0) {
                newGrade = newGrade.toUpperCase();
            }
            else {
                newGrade = newGrade.charAt(0).toUpperCase() + newGrade.slice(1).toLowerCase();
            }

            let isValidGrade = calc.pattern.test(newGrade);

            if (isValidGrade) {
                span.textContent = newGrade;
                //get index of checkbox
                let index = Array.prototype.indexOf.call(checkboxes, checkbox);
                //if the checkbox is checked, then update the grade in the calculation object
                if (checkbox.checked) {
                    calc.removeGrade(calc.arrGrades[index], calc.arrEcts[index]);
                    calc.addGrade(newGrade, calc.arrEcts[index]);
                }
                //update the grade in the calculation object
                calc.arrGrades[index] = newGrade;

                // update the average grade only if the checkbox is checked
                if (checkbox.checked) getGrade();
            } else {
                alert("Ugyldig karakter. Prøv igjen.");
            }
        }
    });
    return editButton;
}

init();
console.log("Grades have been retrieved from the table and checkboxes have been added to the table.");

let checkboxes = document.querySelectorAll('.grade-checkbox');
let p = document.getElementById("info-text");
let selectAllButton = document.getElementById("select-all-button");

// Add event listener for the checkboxes
// When a checkbox is checked or unchecked, calculate the average
for (let i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener('change', function() {
        updateGrade(this, i);
    });
}

// Updates the grade in the calculation object
function updateGrade(checkbox, index) {
    if (checkbox.checked) {
        calc.addGrade(calc.arrGrades[index], calc.arrEcts[index]);
    } else {
        calc.removeGrade(calc.arrGrades[index], calc.arrEcts[index]);
    }
    getGrade();

    // handle little edge case where if the user checks all the boxes manually, the select all button did not update to "select all"
    if (calc.selectedGradeCount === checkboxes.length) {
        selectAllButton.innerHTML = "Fjern alle";
    }
    else { 
        selectAllButton.innerHTML = "Velg alle";
    }
}

function getGrade(){
    if (calc.sumGrades == 0 && calc.totalEctsForCalculation > 0) {
        p.innerHTML = "Du har bestått alle emnene du har valgt, men de har ikke bokstavkarakter. Derfor kan vi ikke regne ut snittet ditt.";
        return;
    }

    const avg = calc.calculateAverage();
    const letterGrade = calc.numberToLetter(avg)

    if(isNaN(avg)){
        p.innerHTML = calc.selectedGradeCount === 0 ? 
        "Start med å velge emner du vil regne snittet ditt ut fra eller klikk på knappen for å velge alle emner.":
        "Du må velge minst ett emne som har bokstavkarakter for å kunne regne ut snittet ditt.";
    } else {
        p.innerHTML = "Ditt snitt er " + avg.toFixed(2) + ", noe som tilsvarer en " + letterGrade + ". (" + calc.totalEcts + " studiepoeng)";
        console.log("Ditt snitt uten avrunding er " + avg.toFixed(2));
    }
}

