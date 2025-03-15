import { CheckCircle } from "lucide-react";

export type AnalysisStep = {
  id: string;
  label: string;
  status: "completed" | "in-progress" | "pending";
};

interface AnalysisStepsProps {
  steps: AnalysisStep[];
}

export default function AnalysisSteps({ steps }: AnalysisStepsProps) {
  return (
    <div className="mt-4 bg-gray-50 p-4 rounded-md">
      {steps.map((step) => (
        <div key={step.id} className="analysis-step mb-2 last:mb-0">
          <div className="flex items-center">
            {step.status === "completed" && (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            )}
            {step.status === "in-progress" && (
              <div className="h-5 w-5 flex items-center justify-center mr-2">
                <div className="h-4 w-4 bg-primary rounded-full animate-pulse"></div>
              </div>
            )}
            {step.status === "pending" && (
              <div className="h-5 w-5 mr-2">
                <div className="h-2 w-2 bg-gray-300 rounded-full mx-auto"></div>
              </div>
            )}
            <span 
              className={`text-sm ${
                step.status === "pending" ? "text-gray-400" : "text-gray-700"
              }`}
            >
              {step.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
