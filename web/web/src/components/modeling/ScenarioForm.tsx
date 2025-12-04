'use client';

import { usePlansStore } from '@/lib/store';
import { EnrollmentType } from '@/types';
import { getEnrollmentLabel } from '@/lib/utils';

const enrollmentTypes: EnrollmentType[] = ['single', 'couple', 'employeeChild', 'family'];

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
        <label className="text-sm font-medium text-slate-700">{label}</label>
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
        className="w-full"
      />
      {helpText && (
        <p className="text-xs text-slate-500">{helpText}</p>
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
        <span className="text-sm font-medium text-slate-700">{label}</span>
        {helpText && (
          <p className="text-xs text-slate-500 mt-0.5">{helpText}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-slate-200'
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
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          className={`w-full rounded-lg border border-slate-300 py-2 ${
            prefix ? 'pl-7' : 'pl-3'
          } pr-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
        />
      </div>
      {helpText && (
        <p className="text-xs text-slate-500">{helpText}</p>
      )}
    </div>
  );
}

export default function ScenarioForm() {
  const { scenario, setScenario, resetScenario } = usePlansStore();

  return (
    <div className="card-professional overflow-hidden">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-semibold text-slate-900">Your Scenario</h3>
        <button
          onClick={resetScenario}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Reset
        </button>
      </div>

      <div className="p-5 space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700">
            Coverage Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {enrollmentTypes.map((type) => (
              <button
                key={type}
                onClick={() => setScenario({ enrollmentType: type })}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                  scenario.enrollmentType === type
                    ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {getEnrollmentLabel(type)}
              </button>
            ))}
          </div>
        </div>

        <ToggleField
          label="Income over $200k?"
          checked={scenario.incomeOver200k}
          onChange={(v) => setScenario({ incomeOver200k: v })}
          helpText="Affects Value Plan premiums"
        />

        <div className="space-y-4">
          <p className="section-header">Expected Medical Usage</p>

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
            label="Imaging (X-ray, MRI)"
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

        <div className="space-y-4">
          <p className="section-header">Prescription Usage</p>

          <SliderField
            label="Tier 1 (Generic) Meds"
            value={scenario.tier1RxCount}
            onChange={(v) => setScenario({ tier1RxCount: v })}
            min={0}
            max={10}
            unit=" ongoing"
            helpText="Number of ongoing prescriptions"
          />

          <SliderField
            label="Tier 2 (Preferred) Meds"
            value={scenario.tier2RxCount}
            onChange={(v) => setScenario({ tier2RxCount: v })}
            min={0}
            max={5}
            unit=" ongoing"
          />

          <SliderField
            label="Tier 3 (Non-Preferred) Meds"
            value={scenario.tier3RxCount}
            onChange={(v) => setScenario({ tier3RxCount: v })}
            min={0}
            max={5}
            unit=" ongoing"
          />
        </div>

        <div className="space-y-4">
          <p className="section-header">Tax Savings</p>

          <NumberInput
            label="HSA Contribution (Annual)"
            value={scenario.hsaContribution}
            onChange={(v) => setScenario({ hsaContribution: v })}
            prefix="$"
            max={8550}
            helpText="2025 max: $4,300 (single) / $8,550 (family)"
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
