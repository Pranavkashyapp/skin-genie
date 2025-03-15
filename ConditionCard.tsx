import { Card } from "@/components/ui/card";

interface ConditionCardProps {
  name: string;
  location: string;
  description: string;
  confidence: number;
  isPrimary?: boolean;
}

export default function ConditionCard({
  name,
  location,
  description,
  confidence,
  isPrimary = false
}: ConditionCardProps) {
  return (
    <Card className={`p-4 mb-4 border-l-4 ${
      isPrimary ? 'border-amber-500' : 'border-emerald-400'
    }`}>
      <div className="flex justify-between items-start">
        <div>
          <h5 className="font-medium text-gray-900">{name}</h5>
          <p className="text-sm text-gray-600 mt-1">Detected on {location}</p>
        </div>
        <span className={`${
          isPrimary ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
        } text-xs font-medium px-2.5 py-0.5 rounded-full`}>
          {confidence}% confidence
        </span>
      </div>
      <div className="mt-3 text-sm">
        <p>{description}</p>
      </div>
    </Card>
  );
}
