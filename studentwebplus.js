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
