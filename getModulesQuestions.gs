// This script searches all the spreadsheets for mapped questions, for each module, generates a list of relevant questions to that module, in order of ascending question number.
// This script by default runs in the sheet named "Filtered (Master)", but this can be changed

const modules = [
	{ name: "Module 5" },
	{ name: "Module 6" },
	{ name: "Module 7" },
	{ name: "Module 8" },
];

// The column of which question index is displayed in each sheet where questions are mapped
const questionIndexCol = "B";
const sheetName = "Filtered (Master)";

function getModuleQuestions() {
	var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
	var sheet = spreadsheet.getSheetByName(sheetName);
	var mappedExamSheet = spreadsheet.getSheetByName("Exams Mapped (Update)");
	var examsMapped = removeEmptyCellValuesFromArray(
		mappedExamSheet.getRange("A2:A").getValues()
	);
	// console.log(examsMapped);
	// var examsMapped = removeEmptyCells(examsDirty);

	for (const currentModule of modules) {
		var questionsByModule = [];

		for (const currentYearExamObj of examsMapped) {
			const currentYearExam = currentYearExamObj[0];
			const currentYearSheet =
				spreadsheet.getSheetByName(currentYearExam);
			var textFinder = currentYearSheet.createTextFinder(
				currentModule.name
			);
			var occurrences = textFinder.findAll();
			if (occurrences.length > 0) {
				for (const cell of occurrences) {
					const row = currentYearSheet
						.getRange(cell.getA1Notation())
						.getRow();
					const questionIndex = currentYearSheet
						.getRange(`${questionIndexCol}${row}`)
						.getValues();

					questionsByModule.push(questionIndex);
				}
			}
		}
		console.log(questionsByModule);
		console.log(sortArrayByNumberAfterDot(questionsByModule));
		// questionsByModule = sortArrayByNumberAfterDot(questionsByModule);
		// console.log(questionsByModule);
		// console.log(currentModule.name);
		const startingCell = sheet
			.getRange(getCellReferenceOfValue(currentModule.name))
			.offset(1, 0);
		for (var i = 0; i < questionsByModule.length; i++) {
			startingCell.offset(i, 0).setValue(questionsByModule[i]);
		}
	}
}

function getCellReferenceOfValue(searchValue) {
	var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
	var textFinder = sheet.createTextFinder(searchValue);
	var firstOccurrence = textFinder.findNext();
	var cellReference = firstOccurrence.getA1Notation();

	return cellReference;
}

function removeEmptyCells(arr) {
	return arr.filter((mod) => mod !== " ");
}

function removeEmptyCellValuesFromArray(inputArray) {
	var filteredArray = inputArray.filter(function (row) {
		return row.some(function (cellValue) {
			return cellValue !== "" && cellValue !== null;
		});
	});

	return filteredArray;
}

function sortArrayByNumberAfterDot(arr) {
	arr.sort(function (a, b) {
		// Extract the numeric part after the dot (.) and convert to numbers
		var numA = parseFloat(a[0].toString().match(/(\d+\.\d+)/)[0])
			.toString()
			.split(".");
		numA = numA[1];
		var numB = parseFloat(b[0].toString().match(/(\d+\.\d+)/)[0])
			.toString()
			.split(".");
		numB = numB[1];
		// console.log(numA,numB);
		// Compare the extracted numbers for sorting
		return numA - numB;
	});

	return arr;
}
