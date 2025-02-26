import Link from 'next/link';
import PdfUploader from '@/app/summary/page';

const DashboardSummary = () => {
  return (
    <div>
      <h1>Dashboard Summary</h1>
      <PdfUploader />  {/* Use the full PdfUploader component here */}
    </div>
  );
};

export default DashboardSummary;
