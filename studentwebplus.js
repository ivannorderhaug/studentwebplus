class Degree {
    constructor(name, startYear, endYear) {
        this.name = name;
        this.startYear = startYear;
        this.endYear = endYear;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get startYear() {
        return this._startYear;
    }

    set startYear(value) {
        this._startYear = value;
    }

    get endYear() {
        return this._endYear;
    }

    set endYear(value) {
        this._endYear = value;
    }

}

class GradeCalculator {
    constructor() {
        this.totalEctsForCalculation = 0;
        this.totalEcts = 0;
        this.sumGrades = 0;
        this.nonLetterGrades = ["Bestått","Passed","Greidd"];
        this.pattern = /^[A-E]|Bestått|Passed|Greidd$/;
    }

    get totalEcts() {
        return this._totalEcts;
    }

    set totalEcts(value) {
        this._totalEcts = value;
    }

    get totalEctsForCalculation() {
        return this._totaltEctsForCalculation;
    }

    set totalEctsForCalculation(value) {
        this._totaltEctsForCalculation = value;
    }

    get nonLetterGrades() {
        return this._nonLetterGrades;
    }

    set nonLetterGrades(value) {
        this._nonLetterGrades = value;
    }

    calculateAverage() {
        return this._totalEctsForCalculation === 0 ? 0 : this.sumGrades / this.totalEctsForCalculation;
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
    
    letterToNumber(grade){
        return 5 - (grade.charCodeAt(0) - 65);
    }

    numberToLetter(grade){
        return grade < 1.5 ? 'E' : String.fromCharCode(65 + (5- Math.round(grade)));
    }
}

let degrees = JSON.parse(localStorage.getItem("degrees")) || [];

function createCustomMenu() {
    let customMenu = document.createElement("div");
    customMenu.id = "custom-menu";
    customMenu.style.display = "none"; 
    customMenu.style.position = "fixed"; 
    customMenu.style.top = "50%"; 
    customMenu.style.left = "50%"; 
    customMenu.style.transform = "translate(-50%, -50%)"; 
    customMenu.style.backgroundColor = "white"; 
    customMenu.style.border = "1px solid black";
    customMenu.style.boxShadow = "2px 2px 4px rgba(0,0,0,0.2)";

    customMenu.style.width = "600px";
    customMenu.style.height = "320px";

    let header = document.createElement("div");
    header.style.backgroundColor = "black";
    header.style.color = "white";
    header.style.padding = "10px";
    header.style.textAlign = "center";
    header.textContent = "Karakterkalkulator";

    let exitButton = document.createElement("button");
    exitButton.textContent = "X";
    exitButton.style.float = "right";
    exitButton.style.backgroundColor = "transparent";
    exitButton.style.border = "none";
    exitButton.style.color = "white";
    exitButton.style.cursor = "pointer";
    exitButton.style.marginTop = "-10px";
    exitButton.style.marginRight = "-20px";
    exitButton.addEventListener("click", function() {
        customMenu.style.display = "none";
    }
    );

    header.appendChild(exitButton);

    let body = document.createElement("div");
    body.style.padding = "10px";
    body.style.textAlign = "center";

    let left = document.createElement("div");
    left.id = "custom-menu-left";
    left.style.float = "left";
    left.style.width = "40%";
    left.style.height = "100%";
    left.style.borderRight = "1px solid black";

    let right = document.createElement("div");
    right.id = "custom-menu-right";
    right.style.float = "right";
    right.style.width = "60%";
    right.style.height = "100%";

    let form = document.createElement("form");
    form.id = "custom-menu-form";
    form.style.textAlign = "left";

    let degreeNameLabel = document.createElement("label");
    degreeNameLabel.textContent = "Studie: ";

    let degreeNameInput = document.createElement("input");
    degreeNameInput.type = "text";
    degreeNameInput.style.width = "90%";

    let startYearLabel = document.createElement("label");
    startYearLabel.textContent = "Start: ";
    
    let startYear = document.createElement("input");
    startYear.type = "number";
    startYear.min = "1950";
    startYear.max = new Date().getFullYear();
    startYear.style.width = "90%"

    let endYearLabel = document.createElement("label");
    endYearLabel.textContent = "Slutt/Forventet Slutt: ";

    let endyear = document.createElement("input");
    endyear.type = "number";
    endyear.min = "1950";
    endyear.max = new Date().getFullYear();
    endyear.style.width = "90%"

    let addButton = document.createElement("button");
    addButton.textContent = "Legg til";
    addButton.className = "ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only small grey";

    addButton.addEventListener("click", function(event) {
        event.preventDefault();

        let degreeName = degreeNameInput.value;
        let start = startYear.value;
        let end = endyear.value;

        if (degreeName.trim() === "") {
            alert("Gradsnavn mangler");
            return;
        }

        if (start.trim() === "") {
            alert("Start år mangler.");
            return;
        }

        if (end.trim() === "") {
            alert("Slutt år mangler.");
            return;
        }

        if (parseInt(start) > parseInt(end)) {
            alert("Start år kan ikke være større enn slutt år.");
            return;
        } else if (parseInt(start) == parseInt(end)) {
            alert("Start år og slutt år kan ikke være like")
            return;
        }

        let degree = new Degree(degreeName, start, end);
        degrees.push(degree); 

        localStorage.setItem('degrees', JSON.stringify(degrees));
        
        form.reset();

        populateTable();
    });

    form.appendChild(degreeNameLabel);
    form.appendChild(degreeNameInput);
    form.appendChild(startYearLabel);
    form.appendChild(startYear);
    form.appendChild(endYearLabel);
    form.appendChild(endyear);
    form.appendChild(addButton);

    let table = document.createElement("table");
    table.style.marginTop = "-6px";

    let thead = document.createElement("thead");
    let headerRow = document.createElement("tr");
    let degreeNameHeader = document.createElement("th");
    degreeNameHeader.textContent = "Studie";
    degreeNameHeader.style.minWidth = "100px"; 
    let gradeAverageHeader = document.createElement("th");
    gradeAverageHeader.textContent = "Snitt";
    gradeAverageHeader.style.minWidth = "50px"; 
    let pointsHeader = document.createElement("th");
    pointsHeader.textContent = "Studiepoeng";
    pointsHeader.style.minWidth = "50px"; 
    let removeHeader = document.createElement("th");
    removeHeader.textContent = "";
    removeHeader.style.minWidth = "50px"; 

    headerRow.appendChild(degreeNameHeader);
    headerRow.appendChild(gradeAverageHeader);
    headerRow.appendChild(pointsHeader);
    headerRow.appendChild(removeHeader);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    let tbody = document.createElement("tbody");
    tbody.id = "custom-menu-table-body";

    table.appendChild(tbody);
    right.appendChild(table);
    left.appendChild(form);
    body.appendChild(left);
    body.appendChild(right);
    customMenu.appendChild(header);
    customMenu.appendChild(body);
    document.body.appendChild(customMenu);

    return customMenu;
}

function injectMenu() {
    let mainMenu = document.getElementById("menuBarRight");
    if (mainMenu) {
        let div = document.createElement("div");
        div.className = "dropdown";
        let a = document.createElement("a");
        a.className = "dropdown-link";
        a.textContent = "Studentweb+";
        a.style.cursor = "pointer";
        div.appendChild(a);
    
        a.addEventListener("click", function() {
            let customMenu = document.getElementById("custom-menu");
            customMenu.style.display = customMenu.style.display === "none" ? "block" : "none";
        });

        mainMenu.appendChild(div);
    }
}

function populateTable() {
    let tbody = document.getElementById("custom-menu-table-body");
    tbody.innerHTML = "";

    degrees.forEach((degree, index) => {
        let row = document.createElement("tr");
        let degreeNameCell = document.createElement("td");
        degreeNameCell.textContent = degree._name;
        let gradeAverageCell = document.createElement("td");

        let results = extractGrades(degree._startYear, degree._endYear);
        gradeAverageCell.textContent = results.avg.toFixed(1);

        let pointsCell = document.createElement("td");
        pointsCell.textContent = results.points;

        let removeCell = document.createElement("td");
        let a = document.createElement("a");
        a.textContent = "X";
        a.addEventListener("click", function () {
            degrees.splice(index, 1);
            localStorage.setItem("degrees", JSON.stringify(degrees));
            populateTable();
        });
        removeCell.appendChild(a);

        row.appendChild(degreeNameCell);
        row.appendChild(gradeAverageCell);
        row.appendChild(pointsCell);
        row.appendChild(removeCell);
        tbody.appendChild(row);
    });
}

function extractGrades(start, end){
    const calc = new GradeCalculator();

    let table = document.querySelector(".table-standard.reflow.ui-panel-content");
    if (table) {

        let list = [];

        for (const row of table.querySelectorAll("tr.resultatTop, tr.none")) {
            
            let semesterColumn = row.querySelector("td.col1Semester");
            let semesterText = semesterColumn.querySelector(".uuHidden").textContent.trim();

            let resultColumn = row.querySelector("td.col6Resultat");
            let grade = resultColumn.querySelector(".infoLinje span").textContent.trim();

            let pointColumn = row.querySelector("td.col7Studiepoeng");

            let isValidGrade = calc.pattern.test(grade);

            if (isValidGrade && pointColumn.hasChildNodes()) {
                let points = pointColumn.querySelector("span").textContent;
                let parsedPoints = Number(points.replace(",", "."));
                list.push({semesterText, grade, parsedPoints});
            }
        }

        list.reverse();

        list.forEach((item) => {
            const { semesterText, grade, parsedPoints } = item;
            const year = parseInt(semesterText.match(/\d+/)[0]);

            if (
                (semesterText.includes(start.toString()) && (semesterText.includes("HØST"))) ||
                (year > start && year < end) ||
                (semesterText.includes(end.toString()) && (semesterText.includes("VÅR") || semesterText.includes("SOMMER")))
            ) {
                calc.addGrade(grade, parsedPoints);
            }
        });

        if (calc.sumGrades == 0 && calc.totalEctsForCalculation > 0) {
            return "Bestått";
        }

        const avg = calc.calculateAverage();
        const letterGrade = calc.numberToLetter(avg)
        const points = calc.totalEcts;

        return {avg, letterGrade, points};
    }
}

createCustomMenu();
injectMenu();
populateTable();
