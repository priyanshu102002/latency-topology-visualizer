import jsPDF from "jspdf";
import { GeoNode, LatencyLink } from "@/types";

interface ChartDataPoint {
  time: string;
  latency: number;
}

interface ExportData {
  selectedNode: GeoNode;
  primaryLink: LatencyLink;
  connectedLinks: LatencyLink[];
  chartData: ChartDataPoint[];
  avgLatency: number;
  currentLinkLatency: number;
}

export const exportLatencyReportToPDF = (data: ExportData): void => {
  const { selectedNode, primaryLink, connectedLinks, chartData, avgLatency, currentLinkLatency } = data;

  if (!selectedNode || !primaryLink) return;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPos = 20;
  const margin = 20;
  const lineHeight = 7;
  const sectionSpacing = 10;

  // Header
  doc.setFillColor(59, 130, 246); // blue-500
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Latency Report', margin, 25);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, 35);

  yPos = 50;
  doc.setTextColor(0, 0, 0);

  // Node Information Section
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Node Information', margin, yPos);
  yPos += lineHeight + 2;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const nodeInfo = [
    [`Name:`, selectedNode.name],
    [`ID:`, selectedNode.id],
    [`Provider:`, selectedNode.provider],
    [`Region:`, selectedNode.regionCode],
    [`Status:`, selectedNode.status],
    [`Location:`, `${selectedNode.lat.toFixed(2)}, ${selectedNode.lng.toFixed(2)}`],
    [`Client Latency:`, selectedNode.clientLatency ? `${selectedNode.clientLatency}ms` : 'N/A'],
  ];

  nodeInfo.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(value, margin + 40, yPos);
    yPos += lineHeight;
  });

  yPos += sectionSpacing;

  // Primary Connection Stats
  if (yPos > pageHeight - 40) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Connection Statistics', margin, yPos);
  yPos += lineHeight + 2;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setFont('helvetica', 'bold');
  doc.text('Current Latency:', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(`${currentLinkLatency}ms`, margin + 50, yPos);
  yPos += lineHeight;

  doc.setFont('helvetica', 'bold');
  doc.text('Average Latency:', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(`${avgLatency}ms`, margin + 50, yPos);
  yPos += lineHeight;

  doc.setFont('helvetica', 'bold');
  doc.text('Status:', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(primaryLink.status, margin + 50, yPos);
  yPos += sectionSpacing + lineHeight;

  // Latency History Table
  if (yPos > pageHeight - 60) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Latency History', margin, yPos);
  yPos += lineHeight + 2;

  // Table header
  doc.setFillColor(241, 245, 249); // slate-100
  doc.rect(margin, yPos - 5, pageWidth - 2 * margin, lineHeight + 2, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Time', margin + 2, yPos);
  doc.text('Latency (ms)', margin + 80, yPos);
  yPos += lineHeight + 2;

  // Table rows
  doc.setFont('helvetica', 'normal');
  chartData.forEach((d) => {
    if (yPos > pageHeight - 20) {
      doc.addPage();
      yPos = 20;
      // Redraw header
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, yPos - 5, pageWidth - 2 * margin, lineHeight + 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.text('Time', margin + 2, yPos);
      doc.text('Latency (ms)', margin + 80, yPos);
      yPos += lineHeight + 2;
      doc.setFont('helvetica', 'normal');
    }
    doc.text(d.time, margin + 2, yPos);
    doc.text(`${d.latency}`, margin + 80, yPos);
    yPos += lineHeight;
  });

  yPos += sectionSpacing;

  // Active Connections Table
  if (yPos > pageHeight - 60) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Active Connections', margin, yPos);
  yPos += lineHeight + 2;

  // Table header
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, yPos - 5, pageWidth - 2 * margin, lineHeight + 2, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Target Node', margin + 2, yPos);
  doc.text('Latency (ms)', margin + 80, yPos);
  doc.text('Status', margin + 130, yPos);
  yPos += lineHeight + 2;

  // Table rows
  doc.setFont('helvetica', 'normal');
  connectedLinks.forEach((link) => {
    if (yPos > pageHeight - 20) {
      doc.addPage();
      yPos = 20;
      // Redraw header
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, yPos - 5, pageWidth - 2 * margin, lineHeight + 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.text('Target Node', margin + 2, yPos);
      doc.text('Latency (ms)', margin + 80, yPos);
      doc.text('Status', margin + 130, yPos);
      yPos += lineHeight + 2;
      doc.setFont('helvetica', 'normal');
    }
    const target = link.source === selectedNode.id ? link.target : link.source;
    doc.text(target, margin + 2, yPos);
    doc.text(`${Math.round(link.latencyMs)}`, margin + 80, yPos);
    doc.text(link.status, margin + 130, yPos);
    yPos += lineHeight;
  });

  // Footer
  const totalPages = (doc as any).internal.pages.length - 1; // Subtract 1 because pages array includes a blank page
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Save PDF
  doc.save(`latency-report-${selectedNode.id}-${Date.now()}.pdf`);
};

