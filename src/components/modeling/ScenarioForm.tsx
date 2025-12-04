'use client';

import { usePlansStore } from '@/lib/store';
import { EnrollmentType } from '@/types';
import { formatCurrency, getEnrollmentLabel } from '@/lib/utils';

const enrollmentTypes: EnrollmentType[] = ['single', 'employeeSpouse', 'employeeChildren', 'family'];

interface SliderFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  helpText?: string;
}

function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = '',
  helpText,
}: SliderFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-semibold text-blue-600">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      {helpText && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  );
}

interface ToggleFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  helpText?: string;
}

function ToggleField({ label, checked, onChange, helpText }: ToggleFieldProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {helpText && (
          <p className="text-xs text-gray-500 mt-0.5">{helpText}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  prefix?: string;
  helpText?: string;
}

function NumberInput({
  label,
  value,
  onChange,
  min = 0,
  max,
  prefix = '',
  helpText,
}: NumberInputProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          className={`w-full rounded-lg border border-gray-300 py-2 ${
            prefix ? 'pl-7' : 'pl-3'
          } pr-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
        />
      </div>
      {helpText && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  );
}

export default function ScenarioForm() {
  const { scenario, setScenario, resetScenario } = usePlansStore();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-semibold text-gray-900">Your Scenario</h3>
        <button
          onClick={resetScenario}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Reset
        </button>
      </div>

      <div className="p-5 space-y-6">
        {/* Enrollment Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Enrollment Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {enrollmentTypes.map((type) => (
              <button
                key={type}
                onClick={() => setScenario({ enrollmentType: type })}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                  scenario.enrollmentType === type
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {getEnrollmentLabel(type)}
              </button>
            ))}
          </div>
        </div>

        {/* Medical Usage */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Expected Medical Usage
          </h4>

          <SliderField
            label="PCP Visits"
            value={scenario.pcpVisits}
            onChange={(v) => setScenario({ pcpVisits: v })}
            min={0}
            max={24}
            unit="/year"
            helpText="Typical: 2-4 visits/year"
          />

          <SliderField
            label="Specialist Visits"
            value={scenario.specialistVisits}
            onChange={(v) => setScenario({ specialistVisits: v })}
            min={0}
            max={24}
            unit="/year"
          />

          <SliderField
            label="Lab Tests"
            value={scenario.labTests}
            onChange={(v) => setScenario({ labTests: v })}
            min={0}
            max={20}
            unit="/year"
          />

          <SliderField
            label="Imaging (X-ray, MRI, etc.)"
            value={scenario.imagingTests}
            onChange={(v) => setScenario({ imagingTests: v })}
            min={0}
            max={10}
            unit="/year"
          />

          <SliderField
            label="ER Visits"
            value={scenario.erVisits}
            onChange={(v) => setScenario({ erVisits: v })}
            min={0}
            max={5}
            unit="/year"
          />

          <SliderField
            label="Urgent Care Visits"
            value={scenario.urgentCareVisits}
            onChange={(v) => setScenario({ urgentCareVisits: v })}
            min={0}
            max={10}
            unit="/year"
          />
        </div>

        {/* Prescription Usage */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Prescription Usage
          </h4>

          <SliderField
            label="Generic Medications"
            value={scenario.genericRxCount}
            onChange={(v) => setScenario({ genericRxCount: v })}
            min={0}
            max={10}
            unit=" ongoing"
            helpText="Number of ongoing generic prescriptions"
          />

          <SliderField
            label="Brand Medications"
            value={scenario.brandRxCount}
            onChange={(v) => setScenario({ brandRxCount: v })}
            min={0}
            max={5}
            unit=" ongoing"
          />

          <ToggleField
            label="Taking Specialty Medication?"
            checked={scenario.hasSpecialtyDrug}
            onChange={(v) => setScenario({ hasSpecialtyDrug: v })}
            helpText="High-cost medications like biologics"
          />

          {scenario.hasSpecialtyDrug && (
            <div className="pl-4 border-l-2 border-blue-200 space-y-4">
              <NumberInput
                label="Monthly Drug Cost"
                value={scenario.specialtyDrugMonthlyCost}
                onChange={(v) => setScenario({ specialtyDrugMonthlyCost: v })}
                prefix="$"
                helpText="e.g., Rinvoq ~$7,000/month"
              />

              <ToggleField
                label="Using manufacturer copay card?"
                checked={scenario.usesManufacturerCopayCard}
                onChange={(v) => setScenario({ usesManufacturerCopayCard: v })}
              />

              {scenario.usesManufacturerCopayCard && (
                <div className="space-y-3 pl-4 border-l-2 border-green-200">
                  <ToggleField
                    label="Card counts toward deductible?"
                    checked={scenario.manufacturerCardCountsToDeductible}
                    onChange={(v) => setScenario({ manufacturerCardCountsToDeductible: v })}
                    helpText="Some plans have accumulator programs"
                  />

                  <ToggleField
                    label="Card counts toward OOP max?"
                    checked={scenario.manufacturerCardCountsToOopMax}
                    onChange={(v) => setScenario({ manufacturerCardCountsToOopMax: v })}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tax-Advantaged Accounts */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            Tax-Advantaged Accounts
          </h4>

          <NumberInput
            label="HSA Contribution (Annual)"
            value={scenario.hsaContribution}
            onChange={(v) => setScenario({ hsaContribution: v })}
            prefix="$"
            max={8300}
            helpText="2024 max: $4,150 (single) / $8,300 (family)"
          />

          <NumberInput
            label="Medical FSA Contribution"
            value={scenario.fsaMedicalContribution}
            onChange={(v) => setScenario({ fsaMedicalContribution: v })}
            prefix="$"
            max={3200}
            helpText="2024 max: $3,200"
          />

          <NumberInput
            label="Dependent Care FSA"
            value={scenario.fsaDependentCareContribution}
            onChange={(v) => setScenario({ fsaDependentCareContribution: v })}
            prefix="$"
            max={5000}
            helpText="Max: $5,000/year"
          />

          <SliderField
            label="Marginal Tax Rate"
            value={scenario.marginalTaxRate}
            onChange={(v) => setScenario({ marginalTaxRate: v })}
            min={10}
            max={45}
            step={1}
            unit="%"
            helpText="Federal + State combined"
          />
        </div>
      </div>
    </div>
  );
}
