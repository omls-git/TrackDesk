import * as XLSX from 'xlsx';

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
      return "";
};

export const jsonDataFromFile = async(file) =>{
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'buffer' });
  const worksheet = workbook.Sheets["Open Cases"];
  let jsonData = XLSX.utils.sheet_to_json(worksheet, {defval: "" });
  return jsonData
}

