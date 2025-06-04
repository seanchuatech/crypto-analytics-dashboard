'use client';

import { PDFDocument } from '../PDFDocument';
import { pdf } from '@react-pdf/renderer';

interface Props {
  data: { date: string; price: number }[];
  filename: string;
}

export default function PDFExportButton({ data, filename }: Props) {
  const handleDownload = async () => {
    const blob = await pdf(<PDFDocument data={data} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Download PDF
    </button>
  );
}
