'use client';

import { usePlansStore } from '@/lib/store';
import { EnrollmentType, IncomeTier } from '@/types';
import { formatCurrency, getEnrollmentLabel, getIncomeTierLabel } from '@/lib/utils';
import {
  UserIcon,
  UserGroupIcon,
  UsersIcon,
  HomeIcon,
  CurrencyDollarIcon,
  BeakerIcon,
  HeartIcon,
  BuildingOffice2Icon,
} from '@heroicons/react/24/outline';

const enrollmentTypes: EnrollmentType[] = ['single', 'couple', 'employeeChild', 'family'];
const incomeTiers: IncomeTier[] = ['standard', 'high'];

const enrollmentIcons: Record<EnrollmentType, React.ElementType> = {
  single: UserIcon,
  couple: UserGroupIcon,
  employeeChild: UsersIcon,
  family: HomeIcon,
};

interface SliderFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  helpText?: string;
  color?: 'blue' | 'emerald' | 'violet' | 'amber';
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
  color = 'blue',
}: SliderFieldProps) {
  const colorClasses = {
    blue: 'accent-blue-600 text-blue-600',
    emerald: 'accent-emerald-600 text-emerald-600',
    violet: 'accent-violet-600 text-violet-600',
    amber: 'accent-amber-600 text-amber-600',
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <span className={`text-sm font-bold ${colorClasses[color].split(' ')[1]}`}>
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
        className={`w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer ${colorClasses[color].split(' ')[0]}`}
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
    <div className="flex items-center justify-between py-1">
      <div>
        <span className="text-sm font-medium text-slate-700">{label}</span>
        {helpText && (
          <p className="text-xs text-slate-500 mt-0.5">{helpText}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
          checked ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-slate-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
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
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          className={`w-full rounded-lg border border-slate-300 py-2.5 ${
            prefix ? 'pl-7' : 'pl-3'
          } pr-3 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all bg-white`}
        />
      </div>
      {helpText && (
        <p className="text-xs text-slate-500">{helpText}</p>
      )}
    </div>
  );
}

interface SectionProps {
  title: string;
  icon: React.ElementType;
  iconColor: string;
  children: React.ReactNode;
}

function Section({ title, icon: Icon, iconColor, children }: SectionProps) {
  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-slate-900 flex items-center gap-2">
        <div className={`w-8 h-8 rounded-lg ${iconColor} flex items-center justify-center`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        {title}
      </h4>
      <div className="space-y-4 pl-10">
        {children}
      </div>
    </div>
  );
}

export default function ScenarioForm() {
  const { scenario, setScenario, resetScenario } = usePlansStore();

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-slate-800 to-slate-700 flex justify-between items-center">
        <h3 className="font-bold text-white text-lg">Your Scenario</h3>
        <button
          onClick={resetScenario}
          className="text-sm text-slate-300 hover:text-white transition-colors px-3 py-1 rounded-lg hover:bg-white/10"
        >
          Reset
        </button>
      </div>

      <div className="p-5 space-y-8">
        {/* Enrollment Type */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-900">
            Coverage Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {enrollmentTypes.map((type) => {
              const Icon = enrollmentIcons[type];
              return (
                <button
                  key={type}
                  onClick={() => setScenario({ enrollmentType: type })}
                  className={`flex items-center gap-2 px-3 py-3 text-sm rounded-xl border-2 transition-all ${
                    scenario.enrollmentType === type
                      ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${scenario.enrollmentType === type ? 'text-amber-600' : 'text-slate-400'}`} />
                  <span className="font-medium">{getEnrollmentLabel(type)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Income Tier */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-900">
            Household Income
            <span className="font-normal text-slate-500 ml-1">(affects Value plan premiums)</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {incomeTiers.map((tier) => (
              <button
                key={tier}
                onClick={() => setScenario({ incomeTier: tier })}
                className={`flex items-center justify-center gap-2 px-3 py-3 text-sm rounded-xl border-2 transition-all ${
                  scenario.incomeTier === tier
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <CurrencyDollarIcon className={`h-5 w-5 ${scenario.incomeTier === tier ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span className="font-medium">{getIncomeTierLabel(tier)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Medical Usage */}
        <Section title="Medical Usage" icon={HeartIcon} iconColor="bg-rose-500">
          <SliderField
            label="PCP Visits"
            value={scenario.pcpVisits}
            onChange={(v) => setScenario({ pcpVisits: v })}
            min={0}
            max={24}
            unit="/year"
            helpText="Typical: 2-4 visits/year"
            color="blue"
          />

          <SliderField
            label="Specialist Visits"
            value={scenario.specialistVisits}
            onChange={(v) => setScenario({ specialistVisits: v })}
            min={0}
            max={24}
            unit="/year"
            color="blue"
          />

          <SliderField
            label="Lab Tests"
            value={scenario.labTests}
            onChange={(v) => setScenario({ labTests: v })}
            min={0}
            max={20}
            unit="/year"
            color="blue"
          />

          <SliderField
            label="Imaging (X-ray, MRI, etc.)"
            value={scenario.imagingTests}
            onChange={(v) => setScenario({ imagingTests: v })}
            min={0}
            max={10}
            unit="/year"
            color="blue"
          />

          <SliderField
            label="ER Visits"
            value={scenario.erVisits}
            onChange={(v) => setScenario({ erVisits: v })}
            min={0}
            max={5}
            unit="/year"
            color="amber"
          />

          <SliderField
            label="Urgent Care Visits"
            value={scenario.urgentCareVisits}
            onChange={(v) => setScenario({ urgentCareVisits: v })}
            min={0}
            max={10}
            unit="/year"
            color="amber"
          />
        </Section>

        {/* Prescription Usage */}
        <Section title="Prescriptions" icon={BeakerIcon} iconColor="bg-emerald-500">
          <SliderField
            label="Generic Medications"
            value={scenario.genericRxCount}
            onChange={(v) => setScenario({ genericRxCount: v })}
            min={0}
            max={10}
            unit=" ongoing"
            helpText="Number of ongoing generic prescriptions"
            color="emerald"
          />

          <SliderField
            label="Brand Medications"
            value={scenario.brandRxCount}
            onChange={(v) => setScenario({ brandRxCount: v })}
            min={0}
            max={5}
            unit=" ongoing"
            color="emerald"
          />

          <ToggleField
            label="Taking Specialty Medication?"
            checked={scenario.hasSpecialtyDrug}
            onChange={(v) => setScenario({ hasSpecialtyDrug: v })}
            helpText="High-cost medications like biologics"
          />

          {scenario.hasSpecialtyDrug && (
            <div className="pl-4 border-l-2 border-emerald-200 space-y-4 bg-emerald-50/50 rounded-r-lg py-3 pr-3">
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
                <div className="space-y-3 pl-4 border-l-2 border-blue-200">
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
        </Section>

        {/* Tax-Advantaged Accounts */}
        <Section title="Tax Accounts" icon={BuildingOffice2Icon} iconColor="bg-violet-500">
          <NumberInput
            label="HSA Contribution (Annual)"
            value={scenario.hsaContribution}
            onChange={(v) => setScenario({ hsaContribution: v })}
            prefix="$"
            max={8550}
            helpText="2025 max: $4,300 (single) / $8,550 (family)"
          />

          <NumberInput
            label="Medical FSA Contribution"
            value={scenario.fsaMedicalContribution}
            onChange={(v) => setScenario({ fsaMedicalContribution: v })}
            prefix="$"
            max={3300}
            helpText="2025 max: $3,300"
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
            max={50}
            step={1}
            unit="%"
            helpText="Federal + State + FICA combined"
            color="violet"
          />
        </Section>
      </div>
    </div>
  );
}
