import { create } from "zustand";
import { AnalysisResult } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface AppState {
  // Step management
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  
  // Webcam and image capture
  capturedImage: string | null;
  setCapturedImage: (image: string | null) => void;
  
  // Analysis state
  isAnalyzing: boolean;
  analysisComplete: boolean;
  analysisProgress: number;
  analysisSteps: {
    id: string;
    label: string;
    status: "completed" | "in-progress" | "pending";
  }[];
  analysisResult: AnalysisResult | null;
  
  // Analysis actions
  startAnalysis: () => Promise<void>;
  resetAnalysis: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Step management
  currentStep: 1,
  setCurrentStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  prevStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),
  
  // Webcam and image capture
  capturedImage: null,
  setCapturedImage: (image) => set({ capturedImage: image }),
  
  // Analysis state
  isAnalyzing: false,
  analysisComplete: false,
  analysisProgress: 0,
  analysisSteps: [
    { id: "detect-face", label: "Detecting facial features", status: "pending" },
    { id: "analyze-texture", label: "Analyzing skin texture", status: "pending" },
    { id: "identify-conditions", label: "Identifying possible conditions", status: "pending" },
    { id: "generate-recommendations", label: "Generating recommendations", status: "pending" }
  ],
  analysisResult: null,
  
  // Analysis actions
  startAnalysis: async () => {
    const { capturedImage } = get();
    if (!capturedImage) return;
    
    set({ 
      isAnalyzing: true,
      analysisComplete: false,
      analysisProgress: 0,
      analysisSteps: get().analysisSteps.map(step => ({ ...step, status: "pending" })),
      analysisResult: null
    });
    
    // Simulate step progression
    const updateStep = (stepId: string, progressIncrement: number) => {
      set(state => ({
        analysisProgress: state.analysisProgress + progressIncrement,
        analysisSteps: state.analysisSteps.map(step => 
          step.id === stepId 
            ? { ...step, status: "in-progress" } 
            : step.id === "detect-face" || step.id === "analyze-texture" 
              ? { ...step, status: "completed" }
              : step
        )
      }));
    };
    
    const completeStep = (stepId: string, progressIncrement: number) => {
      set(state => ({
        analysisProgress: state.analysisProgress + progressIncrement,
        analysisSteps: state.analysisSteps.map(step => 
          step.id === stepId || step.id === "detect-face" || step.id === "analyze-texture" || step.id === "identify-conditions"
            ? { ...step, status: "completed" } 
            : step.id === "generate-recommendations"
              ? { ...step, status: "in-progress" }
              : step
        )
      }));
    };
    
    // Simulate the first two steps
    updateStep("detect-face", 20);
    await new Promise(resolve => setTimeout(resolve, 1000));
    updateStep("analyze-texture", 20);
    await new Promise(resolve => setTimeout(resolve, 1000));
    updateStep("identify-conditions", 20);
    
    try {
      // Send the image to the backend for analysis
      const response = await apiRequest('POST', '/api/analyze', {
        imageData: capturedImage
      });
      
      const result = await response.json();
      completeStep("identify-conditions", 20);
      
      // Complete final step after a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set({
        analysisProgress: 100,
        analysisComplete: true,
        isAnalyzing: false,
        analysisResult: result,
        analysisSteps: get().analysisSteps.map(step => ({ ...step, status: "completed" }))
      });
    } catch (error) {
      console.error("Analysis error:", error);
      set({
        isAnalyzing: false,
        analysisProgress: 0
      });
    }
  },
  
  resetAnalysis: () => set({
    analysisComplete: false,
    analysisProgress: 0,
    analysisResult: null,
    analysisSteps: get().analysisSteps.map(step => ({ ...step, status: "pending" }))
  })
}));
