'use client';

import { STEP_NAMES, TOTAL_STEPS } from '../types';

interface BusinessStepperProps {
  currentStep: number;
  maxReachableStep: number;
  completionPercentage?: number;
  onStepClick?: (step: number) => void;
}

export function BusinessStepper({
  currentStep,
  maxReachableStep,
  completionPercentage = 0,
  onStepClick,
}: BusinessStepperProps) {
  const progress = completionPercentage > 0 ? completionPercentage : (currentStep / TOTAL_STEPS) * 100;

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <small className="text-muted">Profile completion</small>
        <small className="fw-semibold">{Math.round(progress)}%</small>
      </div>
      <div className="progress mb-3" style={{ height: '8px' }}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${progress}%` }}
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <div className="d-flex justify-content-between">
        {STEP_NAMES.map((stepName, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isClickable = stepNumber <= maxReachableStep && onStepClick;

          return (
            <div
              key={stepNumber}
              className="d-flex flex-column align-items-center"
              style={{ flex: 1, cursor: isClickable ? 'pointer' : 'default' }}
              onClick={() => isClickable && onStepClick(stepNumber)}
              role={isClickable ? 'button' : undefined}
              tabIndex={isClickable ? 0 : undefined}
              onKeyDown={(e) => {
                if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onStepClick(stepNumber);
                }
              }}
            >
              <div
                className={`rounded-circle d-flex align-items-center justify-content-center mb-2 ${
                  isActive
                    ? 'bg-primary text-white'
                    : isCompleted
                    ? 'bg-success text-white'
                    : stepNumber <= maxReachableStep
                    ? 'bg-light border text-primary'
                    : 'bg-secondary text-white'
                }`}
                style={{ width: '32px', height: '32px', fontSize: '14px', fontWeight: 'bold' }}
              >
                {isCompleted ? '✓' : stepNumber}
              </div>
              <span
                className={`small text-center ${isActive ? 'text-primary fw-bold' : 'text-muted'}`}
                style={{ fontSize: '10px', maxWidth: '72px', lineHeight: 1.2 }}
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
