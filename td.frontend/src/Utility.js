import * as XLSX from 'xlsx';
const loggedUserName = localStorage.getItem("userName");

export const formattedIST = (value) => {
  const date = value ?  new Date(value) : new Date();  
  const istDate = new Date(date.getTime() + (5.5 * 60 * 60 * 1000)); // UTC + 5:30  
  const formattedIST = istDate.toISOString().slice(0, 19).replace("T", " ");
  return formattedIST;
}

export const parseExcelDate = (value) => {
      if (typeof value === "number") {
        const date = XLSX.SSF.parse_date_code(value);
        if (!date) return "";
        const iso = formattedIST(Date.UTC(date.y, date.m - 1, date.d)) //new Date(Date.UTC(date.y, date.m - 1, date.d)).toISOString().slice(0, 19).replace("T", " ");
        return iso
      }
      if (value instanceof Date) {
        return formattedIST(value) //value.toISOString().slice(0, 19).replace("T", " ")
      }
      return null;
};

export const getDaysOpen = (row) => {
  if (row.ird_frd) {
    const today = new Date();
    const irdFrdData = new Date(row.ird_frd);
    const numberOfDaysCaseOpen = Math.floor((today - irdFrdData) / (1000 * 60 * 60 * 24));
    return numberOfDaysCaseOpen;
  }
  return null;
};

export const jsonDataFromFile = async(file) =>{
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'buffer' });
  const worksheet = workbook.Sheets["Open Cases"] || workbook.Sheets["Current Status"];
  let jsonData = XLSX.utils.sheet_to_json(worksheet, {defval: "" });
  return jsonData
}

export const createdNameDate = (item) => {
  item.createdOn = formattedIST();
  item.createdBy = loggedUserName
  return item;
}

export const modifiedNameDate = (item) => {
  item.modifiedOn = formattedIST();
  item.modifiedBy = loggedUserName;
  return item;
}

export const userInitials = (name) => {
  if(name){
    let bits = name.split(' ');
    let initails = bits.reduce((acc, val) => {
      return acc + (val[0] || "");
    }, '').replace(/\W/g,'').toUpperCase();
    return initails;
  }else{
    return '';
  }
}

export const exportToCSV = (data, filename) => {
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Cases");
  XLSX.writeFile(wb, filename);
}