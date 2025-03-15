type ProgressTrackerProps = {
    currentStep: number;
  };
  
  export default function ProgressTracker({ currentStep }: ProgressTrackerProps) {
    return (
      <div className="max-w-3xl mx-auto mb-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div 
              className={`${
                currentStep >= 1 ? 'bg-primary' : 'bg-gray-300'
              } text-white rounded-full h-6 w-6 flex items-center justify-center text-sm font-medium`}
            >
              1
            </div>
            <div 
              className={`ml-2 text-sm font-medium ${
                currentStep >= 1 ? 'text-gray-900' : 'text-gray-400'
              }`}
            >
              Capture
            </div>
          </div>
          <div className="flex-grow mx-4">
            <div className="h-1 bg-gray-200 rounded">
              <div 
                className="bg-primary h-1 rounded transition-all duration-500 ease-in-out" 
                style={{ width: currentStep === 1 ? '33%' : currentStep === 2 ? '66%' : '100%' }}
              ></div>
            </div>
          </div>
          <div className="flex items-center">
            <div 
              className={`${
                currentStep >= 2 ? 'bg-primary' : 'bg-gray-300'
              } text-white rounded-full h-6 w-6 flex items-center justify-center text-sm font-medium`}
            >
              2
            </div>
            <div 
              className={`ml-2 text-sm font-medium ${
                currentStep >= 2 ? 'text-gray-900' : 'text-gray-400'
              }`}
            >
              Analyze
            </div>
          </div>
          <div className="flex-grow mx-4">
            <div className="h-1 bg-gray-200 rounded">
              <div 
                className="bg-primary h-1 rounded transition-all duration-500 ease-in-out" 
                style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }}
              ></div>
            </div>
          </div>
          <div className="flex items-center">
            <div 
              className={`${
                currentStep >= 3 ? 'bg-primary' : 'bg-gray-300'
              } text-white rounded-full h-6 w-6 flex items-center justify-center text-sm font-medium`}
            >
              3
            </div>
            <div 
              className={`ml-2 text-sm font-medium ${
                currentStep >= 3 ? 'text-gray-900' : 'text-gray-400'
              }`}
            >
              Results
            </div>
          </div>
        </div>
      </div>
    );
  }
  