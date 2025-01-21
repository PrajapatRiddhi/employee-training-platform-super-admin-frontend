import * as XLSX from "xlsx";
import csvtojson from "csvtojson";
// import './CsvConvert.scss'
async function convertCSVToJson(csvData: any) {
  const json = await csvtojson().fromString(csvData);
  return json;
}
export const CsvToJson = async (files: any) => {
    console.log('files :>> ', files);
  return new Promise((resolve, reject) => {
    try {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const data = event?.target?.result ?? "";
          if (data) {
            switch (file.type) {
              case "text/csv":
                await convertCSVToJson(data).then((response) => {
                  resolve(response);
                });

                break;
              case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                await convertExcelToJson(data).then((response) => {
                  resolve(response);
                });

                break;
              default:
                console.log("Invalid file format");
                break;
            }
          }
        };
        reader.readAsBinaryString(file);
      }
    } catch (error) {
      reject(error);
    }
  });
};
async function convertExcelToJson(excelData: any) {
  const workbook = XLSX.read(excelData, { type: "binary" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const json = XLSX.utils.sheet_to_json(sheet);
  return json;
}

export const CsvValidation = async (
    rawData: any[],
    excelHeader: string[],
    moduleName: string
  ) => {
    return new Promise((resolve, reject) => {
      let errors: string[] = [];
      let success: any[] = [];
      let errorRecord: any[] = [];
  
      if (!Array.isArray(rawData)) {
        return reject(new Error("Invalid data format. Expected an array."));
      }
  
      // Loop through each row of data
      for (let i = 0; i < rawData.length; i++) {
        let isValid = true;
        let obj: any = {};
        let errorLogged = false; // Flag to prevent multiple errors for the same row
  
        // Check for missing header values in each row
        for (let index = 0; index < excelHeader.length; index++) {
          const element = excelHeader[index];
          if (!rawData[i].hasOwnProperty(element)) {
            if (!errorLogged) {
              const errorMsg = `#${i + 2} Invalid or missing value for key ${element}`;
              errors.push(errorMsg);
              errorRecord.push(rawData[i]);
              errorLogged = true; // Mark that an error has already been logged for this row
            }
            isValid = false;
          }
        }
  
        // Perform module-specific validation
        switch (moduleName) {
          case "user":
            validateUser(rawData[i], i, errors, errorRecord, success, errorLogged);
            break;
  
          default:
            break;
        }
      }
  
      // Return result with errors, success, and error records
      resolve({
        errors,
        success,
        errorRecord,
      });
    });
  };
  
  // Validation for "user" module
  const validateUser = (
    rowData: any,
    rowIndex: number,
    errors: string[],
    errorRecord: any[],
    success: any[],
    errorLogged: boolean
  ) => {
    let obj: any = { ...rowData };
    let isValid = true;
  
    // Check if "Email" exists and if it's valid
    if (!errorLogged && (!rowData.hasOwnProperty("Email") || !validateEmail(rowData.Email))) {
      const errorMsg = `#${rowIndex + 2} Invalid or missing Email.`;
      errors.push(errorMsg);
      errorRecord.push(rowData);
      isValid = false;
    }
  
    if (isValid) success.push(obj);
  };
  
  // Helper function to validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  