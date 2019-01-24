var obj;

export function Upload() {
    //Reference the FileUpload element.
    var fileUpload = document.getElementById("fileUpload");

    //Validate whether File is valid Excel file.
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();

            //For Browsers other than IE.
            if (reader.readAsBinaryString) {
                reader.onload = function (e) {
                    obj = ProcessExcel(e.target.result);
                };
                reader.readAsBinaryString(fileUpload.files[0]);
            } else {
                //For IE Browser.
                reader.onload = function (e) {
                    var data = "";
                    var bytes = new Uint8Array(e.target.result);
                    for (var i = 0; i < bytes.byteLength; i++) {
                        data += String.fromCharCode(bytes[i]);
                    }
                    var obj = ProcessExcel(data);
                };
                reader.readAsArrayBuffer(fileUpload.files[0]);
            }
        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
        return false;
    }
    return obj;
};
function ProcessExcel(data) {
    //Read the Excel File data.
    var workbook = XLSX.read(data, {
        type: 'binary'
    });

    //Fetch the name of First Sheet.
    var firstSheet = workbook.SheetNames[0];

    //Read all rows from First Sheet into an JSON array.
    var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);
    // console.log(excelRows);
    let isvalid = isValidTemplate(excelRows);
    if (excelRows.length != 0 && isvalid) {
        var obj = {
            surveyName: excelRows[0].surveyName,
            topics: [
            ]
        };
        let topicNo = -1;
        let questionNo = -1;
        for (let i = 0; i < excelRows.length; i++) {
            if (excelRows[i].topic) {
                questionNo = 0;
                topicNo++;
                obj.topics.push({ topic: excelRows[i].topic, questions: [{ question: excelRows[i].question, questionType: excelRows[i].questionType, options: [{ option: excelRows[i].option }] }] });
            }
            else if (excelRows[i].question) {
                if (excelRows[i].option) {
                    questionNo++;
                    obj.topics[topicNo].questions.push({ question: excelRows[i].question, questionType: excelRows[i].questionType, options: [{ option: excelRows[i].option }] });
                }
                else {
                    questionNo++;
                    obj.topics[topicNo].questions.push({ question: excelRows[i].question, questionType: excelRows[i].questionType, options: [] });
                }
            }
            else if (excelRows[i].option) {
                obj.topics[topicNo].questions[questionNo].options.push({ option: excelRows[i].option });
            }
        }
    }


    // console.log(obj);
    return obj;
};
function isValidTemplate(excelRows) {
    const Validkeys = ["surveyName", "topic", "question", "questionType", "option"];
    console.log(excelRows);
    if (typeof excelRows == "undefined" || typeof excelRows == null || excelRows.length == 0) {
        return false;
    }
    else {
        let count = 0;
        for (let i = 0; i < Validkeys.length; i++) {
            // if (Validkeys[i] == Object.keys(excelRows[0])[i]) count++;
            Object.keys(excelRows[0]).find(element => {
                element == Validkeys[i];
                count++;
            })
        }
        console.log(count/5);
        return (count/5 == Validkeys.length) ? true : false;
    }

}

