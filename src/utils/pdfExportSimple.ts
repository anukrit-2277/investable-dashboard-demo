import jsPDF from 'jspdf';
import { Company } from '@/types';

interface ExportReportOptions {
  companies: Company[];
  searchTerm?: string;
}

export const exportReportSimple = async (options: ExportReportOptions) => {
  const { companies, searchTerm } = options;
  
  try {
    console.log('Starting main PDF export with', companies.length, 'companies');
    // Create PDF document
    const pdf = new jsPDF();
    
    // Add title
    pdf.setFontSize(20);
    pdf.text('Investable Dashboard Report', 20, 20);
    
    // Add date
    pdf.setFontSize(12);
    const date = new Date().toLocaleDateString();
    pdf.text(`Generated on: ${date}`, 20, 35);
    
    // Add search filter if applicable
    if (searchTerm) {
      pdf.text(`Filter: "${searchTerm}"`, 20, 45);
    }
    
    // Add summary
    pdf.setFontSize(14);
    pdf.text('Summary', 20, 60);
    pdf.setFontSize(10);
    pdf.text(`Total Companies: ${companies.length}`, 20, 75);
    
    const avgScore = companies.reduce((sum, company) => sum + company.macroScore, 0) / companies.length;
    pdf.text(`Average Score: ${avgScore.toFixed(1)}`, 20, 85);
    
    // Add company list
    pdf.setFontSize(14);
    pdf.text('Companies', 20, 105);
    pdf.setFontSize(10);
    
    let yPosition = 120;
    companies.forEach((company, index) => {
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.text(`${index + 1}. ${company.name}`, 20, yPosition);
      pdf.text(`Score: ${company.macroScore.toFixed(1)}`, 120, yPosition);
      yPosition += 10;
    });
    
    // Save the PDF
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `investable-report-${timestamp}.pdf`;
    console.log('Saving main PDF as:', filename);
    pdf.save(filename);
    
    console.log('Main PDF export completed successfully');
    return filename;
  } catch (error) {
    console.error('Simple PDF generation error:', error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const exportCompanyReportSimple = async (company: Company) => {
  try {
    console.log('Starting company PDF export for:', company.name);
    const pdf = new jsPDF();
    
    // Add title
    pdf.setFontSize(18);
    pdf.text('Company Analysis Report', 20, 20);
    
    // Add company name
    pdf.setFontSize(14);
    pdf.text(company.name, 20, 40);
    
    // Add details
    pdf.setFontSize(12);
    pdf.text(`Overall Score: ${company.macroScore.toFixed(1)}`, 20, 60);
    pdf.text(`Last Updated: ${new Date(company.lastUpdated).toLocaleDateString()}`, 20, 75);
    
    // Add pillar scores
    pdf.text('Pillar Analysis:', 20, 95);
    pdf.setFontSize(10);
    
    // Calculate average scores for each pillar
    const peopleAvg = Object.values(company.people).reduce((sum, cat) => sum + cat.score, 0) / Object.keys(company.people).length;
    const processAvg = Object.values(company.process).reduce((sum, cat) => sum + cat.score, 0) / Object.keys(company.process).length;
    const techAvg = Object.values(company.technology).reduce((sum, cat) => sum + cat.score, 0) / Object.keys(company.technology).length;
    
    pdf.text(`People: ${peopleAvg.toFixed(1)}`, 30, 110);
    pdf.text(`Process: ${processAvg.toFixed(1)}`, 30, 120);
    pdf.text(`Technology: ${techAvg.toFixed(1)}`, 30, 130);
    
    // Save the PDF
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${company.name.toLowerCase().replace(/\s+/g, '-')}-report-${timestamp}.pdf`;
    console.log('Saving PDF as:', filename);
    pdf.save(filename);
    
    console.log('Company PDF export completed successfully');
    return filename;
  } catch (error) {
    console.error('Simple company PDF generation error:', error);
    throw new Error(`Failed to generate company PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}; 