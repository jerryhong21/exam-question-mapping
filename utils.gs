// Function to insert an image from a google drive via its URL
// Exmaple use:
// GetURL(TRANSFORMLINk(A2))
function TRANSFORMLINK(originalLink) {
	var fileId = originalLink.match(/id=([^&]+)/)[1];

	// Construct the new link format
	var newLink = "https://drive.google.com/uc?export=view&id=" + fileId;

	return newLink;
}

function GetURL(input) {
	var myFormula = SpreadsheetApp.getActiveRange().getFormula();
	console.log(myFormula);
	var myAddress = myFormula.replace("=GetURL(", "").replace(")", "");
	var myRange = SpreadsheetApp.getActiveSheet().getRange(myAddress);
	return myRange.getRichTextValue().getLinkUrl();
}
