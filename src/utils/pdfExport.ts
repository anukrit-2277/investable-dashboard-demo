import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Company } from '@/types';

interface ExportReportOptions {
  companies: Company[];
  searchTerm?: string;
  includeCharts?: boolean;
}

export const exportReport = async (options: ExportReportOptions) => {
  const { companies, searchTerm, includeCharts = false } = options;
  
  try {
    // Create PDF document
    const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  let yPosition = margin;
  
  // Add header
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(59, 130, 246); // Blue color
  pdf.text('Investable Dashboard Report', margin, yPosition);
  
  yPosition += 15;
  
  // Add subtitle
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(100, 100, 100);
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  pdf.text(`Generated on ${date}`, margin, yPosition);
  
  yPosition += 10;
  
  // Add search filter info if applicable
  if (searchTerm) {
    pdf.setFontSize(10);
    pdf.setTextColor(80, 80, 80);
    pdf.text(`Filter: "${searchTerm}"`, margin, yPosition);
    yPosition += 8;
  }
  
  // Add summary statistics
  yPosition += 10;
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text('Summary Statistics', margin, yPosition);
  
  yPosition += 8;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Total Companies: ${companies.length}`, margin, yPosition);
  
  yPosition += 6;
  const avgScore = companies.reduce((sum, company) => sum + company.macroScore, 0) / companies.length;
  pdf.text(`Average Score: ${avgScore.toFixed(1)}`, margin, yPosition);
  
  yPosition += 6;
  const highScoreCompanies = companies.filter(c => c.macroScore >= 80).length;
  pdf.text(`High Score Companies (≥80): ${highScoreCompanies}`, margin, yPosition);
  
  yPosition += 6;
  const mediumScoreCompanies = companies.filter(c => c.macroScore >= 60 && c.macroScore < 80).length;
  pdf.text(`Medium Score Companies (60-79): ${mediumScoreCompanies}`, margin, yPosition);
  
  yPosition += 6;
  const lowScoreCompanies = companies.filter(c => c.macroScore < 60).length;
  pdf.text(`Low Score Companies (<60): ${lowScoreCompanies}`, margin, yPosition);
  
  // Add company details
  yPosition += 15;
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Company Analysis', margin, yPosition);
  
  yPosition += 10;
  
  // Company table header
  const tableHeaders = ['Company', 'Score', 'People', 'Process', 'Technology', 'Last Updated'];
  const columnWidths = [50, 20, 25, 25, 25, 35];
  
  // Draw table header
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  let xPos = margin;
  tableHeaders.forEach((header, index) => {
    pdf.rect(xPos, yPosition - 5, columnWidths[index], 8, 'F');
    pdf.text(header, xPos + 2, yPosition);
    xPos += columnWidths[index];
  });
  
  yPosition += 8;
  
  // Add company data
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  
  companies.forEach((company, index) => {
    // Check if we need a new page
    if (yPosition > pageHeight - 40) {
      pdf.addPage();
      yPosition = margin;
    }
    
    // Company name (truncated if too long)
    const companyName = company.name.length > 20 ? company.name.substring(0, 17) + '...' : company.name;
    pdf.text(companyName, margin + 2, yPosition);
    
    // Score
    const scoreText = company.macroScore.toFixed(0);
    pdf.text(scoreText, margin + 52, yPosition);
    
    // Pillar scores
    pdf.text(company.pillars.people.toFixed(0), margin + 72, yPosition);
    pdf.text(company.pillars.process.toFixed(0), margin + 97, yPosition);
    pdf.text(company.pillars.technology.toFixed(0), margin + 122, yPosition);
    
    // Last updated
    const lastUpdated = new Date(company.lastUpdated).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    pdf.text(lastUpdated, margin + 147, yPosition);
    
    yPosition += 6;
  });
  
  // Add footer
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 30, pageHeight - 10);
    pdf.text('Investable Dashboard Demo', margin, pageHeight - 10);
  }
  
  // Generate filename
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `investable-report-${timestamp}.pdf`;
  
    // Save the PDF
    pdf.save(filename);
    
    return filename;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Function to export a single company report
export const exportCompanyReport = async (company: Company) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  
  let yPosition = margin;
  
  // Header
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(59, 130, 246);
  pdf.text('Company Analysis Report', margin, yPosition);
  
  yPosition += 15;
  
  // Company name
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text(company.name, margin, yPosition);
  
  yPosition += 10;
  
  // Company details
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Overall Score: ${company.macroScore.toFixed(1)}`, margin, yPosition);
  yPosition += 8;
  pdf.text(`Last Updated: ${new Date(company.lastUpdated).toLocaleDateString()}`, margin, yPosition);
  
  yPosition += 15;
  
  // Pillar scores
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Pillar Analysis', margin, yPosition);
  
  yPosition += 10;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`People: ${company.pillars.people.toFixed(1)}`, margin, yPosition);
  yPosition += 8;
  pdf.text(`Process: ${company.pillars.process.toFixed(1)}`, margin, yPosition);
  yPosition += 8;
  pdf.text(`Technology: ${company.pillars.technology.toFixed(1)}`, margin, yPosition);
  
    // Generate filename
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${company.name.toLowerCase().replace(/\s+/g, '-')}-report-${timestamp}.pdf`;
    
    // Save the PDF
    pdf.save(filename);
    
    return filename;
  } catch (error) {
    console.error('Company PDF generation error:', error);
    throw new Error(`Failed to generate company PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}; 