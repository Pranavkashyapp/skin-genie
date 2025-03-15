import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProgressTracker from "@/components/ProgressTracker";
import WebcamCapture from "@/components/WebcamCapture";
import AnalysisSteps from "@/components/AnalysisSteps";
import ConditionCard from "@/components/ConditionCard";
import TreatmentRecommendation from "@/components/TreatmentRecommendation";
import { useAppStore } from "@/store/useAppStore";
import { highlightConditionRegions, generateSimulatedRegions, getImageDimensions } from "@/lib/imageUtils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function Home() {
  const { toast } = useToast();
  const {
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    capturedImage,
    setCapturedImage,
    isAnalyzing,
    analysisComplete,
    analysisProgress,
    analysisSteps,
    analysisResult,
    startAnalysis,
    resetAnalysis
  } = useAppStore();

  const [analyzedImage, setAnalyzedImage] = useState<string | null>(null);

  // Handle the capture from the webcam component
  const handleCapture = useCallback((imageSrc: string) => {
    setCapturedImage(imageSrc);
    toast({
      title: "Image captured!",
      description: "You can now proceed to analysis.",
    });
  }, [setCapturedImage, toast]);

  // Proceed to analysis step
  const handleProceedToAnalysis = useCallback(() => {
    if (!capturedImage) {
      toast({
        title: "No image captured",
        description: "Please capture an image before proceeding.",
        variant: "destructive"
      });
      return;
    }
    nextStep();
    startAnalysis();
  }, [capturedImage, nextStep, startAnalysis, toast]);

  // Proceed to results step
  const handleViewResults = useCallback(() => {
    nextStep();
  }, [nextStep]);

  // Go back to capture step
  const handleBackToCapture = useCallback(() => {
    setCurrentStep(1);
    resetAnalysis();
  }, [setCurrentStep, resetAnalysis]);

  // Go back to analysis step
  const handleBackToAnalysis = useCallback(() => {
    setCurrentStep(2);
  }, [setCurrentStep]);

  // Save results (would typically download a PDF or similar)
  const handleSaveResults = useCallback(() => {
    toast({
      title: "Results saved!",
      description: "Your analysis results have been saved.",
    });
  }, [toast]);

  // Generate analyzed image with highlighted regions when analysis is complete
  useEffect(() => {
    const processImage = async () => {
      if (analysisComplete && capturedImage && analysisResult) {
        try {
          // Get image dimensions to generate realistic regions
          const dimensions = await getImageDimensions(capturedImage);
          
          // Generate highlight regions based on detected conditions
          // In a real app, these coordinates would come from the backend
          const regions = generateSimulatedRegions(
            dimensions.width,
            dimensions.height,
            analysisResult.detectedConditions.length
          );
          
          // Create highlighted image
          const highlightedImage = await highlightConditionRegions(capturedImage, regions);
          setAnalyzedImage(highlightedImage);
        } catch (error) {
          console.error("Error processing analyzed image:", error);
          setAnalyzedImage(capturedImage); // Fallback to original
        }
      }
    };
    
    processImage();
  }, [analysisComplete, capturedImage, analysisResult]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Facial Skin Analysis</h2>
            <p className="mt-2 text-lg text-gray-600">Detect skin conditions and get personalized treatment recommendations</p>
          </div>
          
          <ProgressTracker currentStep={currentStep} />
          
          <div className="max-w-3xl mx-auto">
            {/* Step 1: Capture Image */}
            {currentStep === 1 && (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Capture Your Image</h3>
                  <p className="text-gray-600 mb-6">Position your face within the frame and ensure good lighting for accurate results.</p>
                  
                  <WebcamCapture onCapture={handleCapture} />
                  
                  <div className="mt-8 border-t pt-6">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <p>Your privacy is important to us. Images are processed locally and not stored on our servers.</p>
                      </div>
                      <Button 
                        onClick={handleProceedToAnalysis}
                        className="inline-flex items-center"
                        disabled={!capturedImage}
                      >
                        Continue
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 2: Analyzing Image */}
            {currentStep === 2 && (
              <div className="bg-white shadow rounded-lg overflow-hidden fadeIn">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Analyzing Your Skin</h3>
                  
                  <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-6">
                    <div className="w-full md:w-1/3">
                      <div className="bg-gray-100 rounded-lg overflow-hidden">
                        {capturedImage && (
                          <img
                            src={capturedImage}
                            alt="Captured facial image"
                            className="w-full h-auto"
                          />
                        )}
                      </div>
                    </div>
                    
                    <div className="w-full md:w-2/3">
                      {isAnalyzing && (
                        <div className="mb-6">
                          <div className="flex items-center mb-2">
                            <div className="animate-spin mr-3 h-5 w-5 text-primary">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            </div>
                            <span className="font-medium">Processing your image...</span>
                          </div>
                          <Progress value={analysisProgress} className="h-2.5" />
                          
                          <AnalysisSteps steps={analysisSteps} />
                        </div>
                      )}
                      
                      <div className="mt-4 text-gray-600">
                        <p className="mb-2">Our analysis includes:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Detection of common skin conditions</li>
                          <li>Identification of skin type and characteristics</li>
                          <li>Personalized treatment recommendations</li>
                          <li>Educational information about potential conditions</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 border-t pt-6 flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={handleBackToCapture}
                    >
                      Back
                    </Button>
                    
                    {!isAnalyzing && analysisComplete && (
                      <Button 
                        onClick={handleViewResults}
                        className="inline-flex items-center"
                      >
                        View Results
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3: Results and Recommendations */}
            {currentStep === 3 && analysisResult && (
              <div className="bg-white shadow rounded-lg overflow-hidden fadeIn">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Skin Analysis Results</h3>
                  
                  {/* Analysis Summary */}
                  <div className="flex flex-col md:flex-row md:space-x-6 mb-8">
                    <div className="md:w-1/3 mb-4 md:mb-0">
                      <div className="bg-gray-100 rounded-lg overflow-hidden relative">
                        {analyzedImage && (
                          <img
                            src={analyzedImage}
                            alt="Analyzed facial image"
                            className="w-full h-auto"
                          />
                        )}
                      </div>
                    </div>
                    
                    <div className="md:w-2/3">
                      <div className="bg-gray-50 p-5 rounded-lg">
                        <h4 className="font-semibold text-lg mb-3">Primary Findings</h4>
                        
                        {analysisResult.detectedConditions.map((condition, index) => (
                          <ConditionCard
                            key={condition.id}
                            name={condition.name}
                            location={condition.locations}
                            description={condition.description}
                            confidence={condition.confidence}
                            isPrimary={index === 0}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Treatment Recommendations */}
                  <div className="mt-8">
                    <h4 className="font-semibold text-lg mb-4">Recommended Treatments</h4>
                    
                    <div className="bg-gray-50 rounded-lg p-5">
                      {analysisResult.recommendedTreatments.map((treatment, index) => (
                        <TreatmentRecommendation
                          key={treatment.id}
                          name={treatment.name}
                          description={treatment.description}
                          recommendationLevel={treatment.recommendationLevel}
                          tags={treatment.tags}
                          icon={index % 3 === 0 ? "flask" : index % 3 === 1 ? "book" : "drops"}
                        />
                      ))}
                    </div>
                    
                    <Alert className="mt-6 bg-blue-50 border border-blue-200">
                      <Info className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-sm text-blue-700">
                        These recommendations are for informational purposes only and should not replace professional medical advice. Consider consulting a dermatologist for persistent skin conditions.
                      </AlertDescription>
                    </Alert>
                  </div>
                  
                  <div className="mt-8 border-t pt-6 flex justify-between">
                    <Button 
                      variant="outline"
                      onClick={handleBackToAnalysis}
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={handleSaveResults}
                      className="inline-flex items-center"
                    >
                      Save Results
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                        <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
