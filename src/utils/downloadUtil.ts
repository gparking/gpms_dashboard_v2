import { saveAs } from 'file-saver';
// import * as FileSaver from 'file-saver'
//
// const EXCEL_TYPE =
//   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
// const JSON_TYPE = 'data:text/json;charset=UTF-8'
// const CSV_TYPE = 'text/csv;charset=utf-8'
// const EXCEL_EXTENSION = '.xlsx'
// const JSON_EXTENSION = '.json'
// const CSV_EXTENSION = '.csv'
//
// export default class DownloadService {
//   csvChar: string = ';';
//
//   public saveTableDataAsCSV(tableData: any, columnInfo: any, fileName: string) {
//     const csvData = [];
//     const header = columnInfo
//       .map((column: { translation: any; }) => column.translation)
//       .join(this.csvChar);
//     csvData.push(header);
//     for (const row of tableData) {
//       const newRow = columnInfo.map((column: { dataPath: string; type: string; }) => {
//         let cellData = row[column.dataPath];
//         if (Array.isArray(cellData)) {
//           cellData = cellData.join('", "');
//         } else if (column.type === 'NumRange') {
//           cellData =
//             (row[column.dataPath + '.min'] ?? '') +
//             ' bis ' +
//             (row[column.dataPath + '.max'] ?? '');
//         } else if (column.type === 'DateRange') {
//           cellData =
//             (row[column.dataPath + '.from'] ?? '') +
//             ' bis ' +
//             (row[column.dataPath + '.to'] ?? '');
//         }
//         return '"' + (cellData ?? '').toString().replace(/"/g, "''") + '"';
//       });
//       csvData.push(newRow.join(this.csvChar));
//     }
//     const BOM = '\uFEFF';
//     const csv = BOM + csvData.join('\r\n');
//     const blob = new Blob([csv], { type: CSV_TYPE });
//     FileSaver.saveAs(
//       blob,
//       fileName + '_export_' + new Date().toLocaleString() + CSV_EXTENSION
//     );
//   }
//
//   public saveAsExcelFile(buffer: any, fileName: string): void {
//     const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
//     FileSaver.saveAs(
//       data,
//       fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
//     );
//   }
//
//   public exportJSONFile(json: any, fileName: string) {
//     const data: Blob = new Blob([JSON.stringify(json, null, 2)], {
//       type: JSON_TYPE,
//     });
//     FileSaver.saveAs(
//       data,
//       fileName + '_export_' + new Date().getTime() + JSON_EXTENSION
//     );
//   }
// }

export async function generateCsv(data: any, headers: any, fileName: string) {
  const replacer = (_key: any, value: null) => (value === null ? '' : value);
  const header = Object.keys(data[0]);
  const csv = data.map((row: { [x: string]: any }) =>
    header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(',')
  );
  csv.unshift(headers);
  var BOM = '\uFEFF';
  const csvArray = BOM + csv.join('\r\n');
  var blob = new Blob([csvArray], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `${fileName}.csv`);
}
