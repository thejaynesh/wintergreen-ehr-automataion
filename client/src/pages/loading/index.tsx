import { Spinner } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

const LoadingPage = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 10;
        if (newProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return newProgress;
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-primary-600 mx-auto mb-6"></div>
        <h2 className="text-2xl font-semibold text-neutral-800 mb-2">Processing Your Request</h2>
        <p className="text-neutral-600 mb-4">Please wait while we fetch the data...</p>
        <div className="w-64 mx-auto mb-4">
          <Progress value={progress} className="h-2" />
        </div>
        <p className="text-sm text-neutral-500">{progress}% Complete</p>
      </div>
    </div>
  );
};

export default LoadingPage;
