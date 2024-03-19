import excel from 'exceljs';
import { DateTZ } from './date';

const createExcelFile = () => {
  const workbook = new excel.Workbook();
  return workbook;
};

const writeDataToSheet = async (worksheet: any, ideas: any[]) => {
  // Write headers to the worksheet
  worksheet.addRow([
    'ID',
    'AuthorId',
    'Title',
    'Description',
    'Anonymous?',
    'SemesterId',
    'Created At',
    'Updated At'
  ]);

  // Write data for each idea
  for (const idea of ideas) {
    worksheet.addRow([
      idea.id,
      idea.authorId,
      idea.title,
      idea.description,
      idea.isAnonymous,
      idea.semesterId,
      DateTZ(idea.createdAt),
      DateTZ(idea.updatedAt)
    ]);
  }
};

const formatWorkSheet = async (worksheet: any) => {
  // Format the entire sheet
  worksheet.eachRow({ includeEmpty: true }, (row: any) => {
    row.eachCell((cell: any) => {
      if (cell.value !== null) {
        // Apply text wrapping to each cell
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

        if (cell.value instanceof Date) {
          const dateFormat = 'm/d/yyyy\\ h:mm:ss \\ AM/PM';
          cell.numFmt = dateFormat;
        }

        // Apply borders to all cells
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      }
    });
  });

  // Adjust column widths based on content length
  worksheet.columns.forEach((column: any) => {
    let minLength = 15;
    let maxLength = 100;
    let maxWidth = minLength;

    column.eachCell({ includeEmpty: true }, (cell: any) => {
      const length = cell.value ? cell.value.toString().length : 0;
      maxWidth = Math.min(Math.max(maxWidth, length), maxLength);
    });

    column.width = maxWidth + 2;
  });
};

export { writeDataToSheet, createExcelFile, formatWorkSheet };
