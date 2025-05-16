import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Image } from "@/components/ui/image";

interface RecommendationCardProps {
  item: any;
  type: "meal" | "exercise";
  onClick: () => void;
}

export function RecommendationCard({
  item,
  type,
  onClick,
}: RecommendationCardProps) {
  return (
    <Card className="overflow-hidden py-0" onClick={onClick}>
      <div className="flex">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.title}
          width={100}
          height={100}
          className="h-24 w-24 object-cover"
        />
        <div className="flex-1">
          <CardHeader className="p-3 pb-0">
            <CardTitle className="text-base">{item.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-1">
            {type === "meal" ? (
              <div className="flex gap-2 text-xs">
                <Badge variant="outline" className="bg-[#d1d1d1]/20">
                  {item.calories} cal
                </Badge>
                <Badge variant="outline" className="bg-[#d1d1d1]/20">
                  {item.protein}g protein
                </Badge>
              </div>
            ) : (
              <div className="flex gap-2 text-xs">
                <Badge variant="outline" className="bg-[#d1d1d1]/20">
                  {item.duration}
                </Badge>
                <Badge variant="outline" className="bg-[#d1d1d1]/20">
                  {item.difficulty}
                </Badge>
              </div>
            )}
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
