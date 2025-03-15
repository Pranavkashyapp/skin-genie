import { Card } from "@/components/ui/card";
import { Flask, BookOpen, Droplets } from "lucide-react";

interface TreatmentRecommendationProps {
  name: string;
  description: string;
  recommendationLevel: string;
  tags: string[];
  icon?: "flask" | "book" | "drops";
}

export default function TreatmentRecommendation({
  name,
  description,
  recommendationLevel,
  tags,
  icon = "flask"
}: TreatmentRecommendationProps) {
  // Map recommendation level to display value
  const recommendationDisplay = 
    recommendationLevel === "high" ? "High recommendation" :
    recommendationLevel === "medium" ? "Medium recommendation" :
    "Low recommendation";
  
  // Select icon based on prop
  const IconComponent = 
    icon === "flask" ? Flask :
    icon === "book" ? BookOpen :
    Droplets;
  
  return (
    <Card className="p-4 mb-4">
      <div className="flex items-start">
        <div className="mr-4 flex-shrink-0">
          <div className="bg-primary-100 text-primary p-2 rounded-md">
            <IconComponent className="h-6 w-6" />
          </div>
        </div>
        <div className="flex-1">
          <h5 className="font-medium text-gray-900">{name}</h5>
          <p className="text-sm text-gray-600 mt-1">
            <span className="text-primary">{recommendationDisplay}</span>
          </p>
          <div className="mt-2 text-sm">
            <p>{description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
