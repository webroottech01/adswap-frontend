'use client';

import { STEP_NAMES, TOTAL_STEPS } from '../types';

interface BusinessStepperProps {
  currentStep: number;
}

/**
 * Stepper Component
 * Visual progress indicator for multi-step form
 */
export function BusinessStepper({ currentStep }: BusinessStepperProps) {
  const progress = (currentStep / TOTAL_STEPS) * 100;

  return (
    <div className="mb-4">
      {/* Progress Bar */}
      <div className="progress mb-3" style={{ height: '8px' }}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${progress}%` }}
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={TOTAL_STEPS}
        />
      </div>

      {/* Step Indicators */}
      <div className="d-flex justify-content-between">
        {STEP_NAMES.map((stepName, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={stepNumber} className="d-flex flex-column align-items-center" style={{ flex: 1 }}>
              <div
                className={`rounded-circle d-flex align-items-center justify-content-center mb-2 ${
                  isActive
                    ? 'bg-primary text-white'
                    : isCompleted
                    ? 'bg-success text-white'
                    : 'bg-secondary text-white'
                }`}
                style={{ width: '32px', height: '32px', fontSize: '14px', fontWeight: 'bold' }}
              >
                {isCompleted ? '✓' : stepNumber}
              </div>
              <span
                className={`small text-center ${isActive ? 'text-primary fw-bold' : 'text-muted'}`}
                style={{ fontSize: '11px', maxWidth: '80px' }}
              >
                {stepName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}









