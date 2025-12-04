import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { HealthPlan, CostBreakdown, UserScenario } from '@/types';
import { formatCurrency, getEnrollmentLabel } from './utils';

export function exportComparisonToPDF(
  plans: HealthPlan[],
  breakdowns: CostBreakdown[],
  scenario: UserScenario,
  lowestCostId?: string
): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Title
  doc.setFontSize(20);
  doc.setTextColor(31, 41, 55);
  doc.text('Health Plan Comparison Report', pageWidth / 2, 20, { align: 'center' });

  // Date
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 28, {
    align: 'center',
  });

  // Scenario Summary
  doc.setFontSize(14);
  doc.setTextColor(31, 41, 55);
  doc.text('Your Scenario', 14, 40);

  doc.setFontSize(10);
  doc.setTextColor(75, 85, 99);
  const scenarioText = [
    `Enrollment: ${getEnrollmentLabel(scenario.enrollmentType)}`,
    `PCP Visits: ${scenario.pcpVisits}/year | Specialist: ${scenario.specialistVisits}/year`,
    `Labs: ${scenario.labTests} | Imaging: ${scenario.imagingTests} | ER: ${scenario.erVisits}`,
    `Generic Rx: ${scenario.genericRxCount} | Brand Rx: ${scenario.brandRxCount}`,
    scenario.hasSpecialtyDrug
      ? `Specialty Drug: ${formatCurrency(scenario.specialtyDrugMonthlyCost)}/month`
      : '',
    scenario.hsaContribution > 0
      ? `HSA Contribution: ${formatCurrency(scenario.hsaContribution)}`
      : '',
  ].filter(Boolean);

  scenarioText.forEach((text, index) => {
    doc.text(text, 14, 48 + index * 5);
  });

  // Plans Comparison Table
  const tableStartY = 48 + scenarioText.length * 5 + 10;

  const getBreakdown = (planId: string) =>
    breakdowns.find((b) => b.planId === planId);

  // Prepare table data
  const tableHead = [['Feature', ...plans.map((p) => p.name)]];
  const tableBody = [
    ['Year', ...plans.map((p) => String(p.year))],
    ['Carrier', ...plans.map((p) => p.carrier)],
    ['Network', ...plans.map((p) => p.network)],
    [
      'Weekly Premium (Single)',
      ...plans.map((p) => formatCurrency(p.premiums.single)),
    ],
    [
      'Deductible',
      ...plans.map(
        (p) =>
          `${formatCurrency(p.deductible.single)} / ${formatCurrency(
            p.deductible.family
          )}`
      ),
    ],
    [
      'OOP Max',
      ...plans.map(
        (p) =>
          `${formatCurrency(p.oopMax.single)} / ${formatCurrency(p.oopMax.family)}`
      ),
    ],
    ['Coinsurance', ...plans.map((p) => `${p.coinsurance}%`)],
    ['PCP Copay', ...plans.map((p) => formatCurrency(p.copays.pcp))],
    ['Specialist Copay', ...plans.map((p) => formatCurrency(p.copays.specialist))],
    ['ER Copay', ...plans.map((p) => formatCurrency(p.copays.er))],
    ['HSA Eligible', ...plans.map((p) => (p.hsaEligible ? 'Yes' : 'No'))],
    [
      'HRA Amount',
      ...plans.map((p) =>
        p.hraAmount
          ? `${formatCurrency(p.hraAmount.single)} / ${formatCurrency(
              p.hraAmount.family
            )}`
          : 'N/A'
      ),
    ],
    ['--- Estimated Costs ---', ...plans.map(() => '')],
    [
      'Annual Premium',
      ...plans.map((p) => {
        const b = getBreakdown(p.id);
        return b ? formatCurrency(b.annualPremium) : '-';
      }),
    ],
    [
      'Medical Costs',
      ...plans.map((p) => {
        const b = getBreakdown(p.id);
        return b ? formatCurrency(b.totalMedicalCosts) : '-';
      }),
    ],
    [
      'Rx Costs',
      ...plans.map((p) => {
        const b = getBreakdown(p.id);
        return b ? formatCurrency(b.totalRxCosts) : '-';
      }),
    ],
    [
      'Tax Savings',
      ...plans.map((p) => {
        const b = getBreakdown(p.id);
        return b && b.totalTaxSavings > 0
          ? `-${formatCurrency(b.totalTaxSavings)}`
          : '-';
      }),
    ],
    [
      'NET ANNUAL COST',
      ...plans.map((p) => {
        const b = getBreakdown(p.id);
        return b ? formatCurrency(b.netAnnualCost) : '-';
      }),
    ],
  ];

  autoTable(doc, {
    head: tableHead,
    body: tableBody,
    startY: tableStartY,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40 },
    },
    didParseCell: (data) => {
      // Highlight lowest cost plan column
      if (lowestCostId && data.section === 'body') {
        const planIndex = plans.findIndex((p) => p.id === lowestCostId);
        if (planIndex !== -1 && data.column.index === planIndex + 1) {
          data.cell.styles.fillColor = [220, 252, 231];
        }
      }
      // Highlight the NET ANNUAL COST row
      if (data.row.index === tableBody.length - 1) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [243, 244, 246];
      }
    },
  });

  // Add recommendation
  if (lowestCostId) {
    const lowestPlan = plans.find((p) => p.id === lowestCostId);
    const lowestBreakdown = getBreakdown(lowestCostId);

    if (lowestPlan && lowestBreakdown) {
      // @ts-expect-error autoTable adds lastAutoTable to doc
      const finalY = doc.lastAutoTable.finalY + 10;

      doc.setFillColor(220, 252, 231);
      doc.roundedRect(14, finalY, pageWidth - 28, 25, 3, 3, 'F');

      doc.setFontSize(12);
      doc.setTextColor(22, 101, 52);
      doc.text('Recommended Plan', 20, finalY + 8);

      doc.setFontSize(10);
      doc.text(
        `Based on your scenario, ${lowestPlan.name} offers the lowest total cost at ${formatCurrency(
          lowestBreakdown.netAnnualCost
        )}/year.`,
        20,
        finalY + 16
      );
    }
  }

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.text(
    'This is an estimate based on your inputs. Actual costs may vary.',
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );

  // Save the PDF
  doc.save('health-plan-comparison.pdf');
}

export function exportPlanDetailToPDF(
  plan: HealthPlan,
  breakdown?: CostBreakdown
): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Title
  doc.setFontSize(20);
  doc.setTextColor(31, 41, 55);
  doc.text(plan.name, pageWidth / 2, 20, { align: 'center' });

  // Subtitle
  doc.setFontSize(12);
  doc.setTextColor(107, 114, 128);
  doc.text(`${plan.carrier} • ${plan.network}`, pageWidth / 2, 28, {
    align: 'center',
  });

  // Plan Details Table
  const detailsData = [
    ['Year', String(plan.year)],
    ['Deductible (Single)', formatCurrency(plan.deductible.single)],
    ['Deductible (Family)', formatCurrency(plan.deductible.family)],
    ['OOP Max (Single)', formatCurrency(plan.oopMax.single)],
    ['OOP Max (Family)', formatCurrency(plan.oopMax.family)],
    ['Coinsurance', `${plan.coinsurance}%`],
    ['PCP Copay', formatCurrency(plan.copays.pcp)],
    ['Specialist Copay', formatCurrency(plan.copays.specialist)],
    ['Urgent Care Copay', formatCurrency(plan.copays.urgentCare)],
    ['ER Copay', formatCurrency(plan.copays.er)],
    ['Imaging Copay', formatCurrency(plan.copays.imaging)],
    ['Labs Copay', formatCurrency(plan.copays.labs)],
    ['Generic Rx', formatCurrency(plan.rxTiers.generic)],
    ['Preferred Rx', formatCurrency(plan.rxTiers.preferred)],
    ['Specialty Rx', formatCurrency(plan.rxTiers.specialty)],
    ['HSA Eligible', plan.hsaEligible ? 'Yes' : 'No'],
    [
      'HRA Amount',
      plan.hraAmount
        ? `${formatCurrency(plan.hraAmount.single)} / ${formatCurrency(
            plan.hraAmount.family
          )}`
        : 'N/A',
    ],
  ];

  autoTable(doc, {
    body: detailsData,
    startY: 40,
    styles: {
      fontSize: 10,
      cellPadding: 4,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: 60 },
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
  });

  // If breakdown provided, add estimated costs
  if (breakdown) {
    // @ts-expect-error autoTable adds lastAutoTable to doc
    const startY = doc.lastAutoTable.finalY + 15;

    doc.setFontSize(14);
    doc.setTextColor(31, 41, 55);
    doc.text('Estimated Annual Costs', 14, startY);

    const costData = [
      ['Annual Premium', formatCurrency(breakdown.annualPremium)],
      ['Medical Costs', formatCurrency(breakdown.totalMedicalCosts)],
      ['Prescription Costs', formatCurrency(breakdown.totalRxCosts)],
      ['Tax Savings', `-${formatCurrency(breakdown.totalTaxSavings)}`],
      ['HRA Credit', `-${formatCurrency(breakdown.hraCredit)}`],
      ['Net Annual Cost', formatCurrency(breakdown.netAnnualCost)],
    ];

    autoTable(doc, {
      body: costData,
      startY: startY + 5,
      styles: {
        fontSize: 10,
        cellPadding: 4,
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60 },
        1: { cellWidth: 60 },
      },
      didParseCell: (data) => {
        if (data.row.index === costData.length - 1) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [219, 234, 254];
        }
      },
    });
  }

  doc.save(`${plan.name.replace(/\s+/g, '-').toLowerCase()}-details.pdf`);
}
