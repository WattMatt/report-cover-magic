import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const AuthLoadingSkeleton = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {/* Icon placeholder */}
          <div className="flex justify-center mb-4">
            <Skeleton className="h-14 w-14 rounded-full" />
          </div>
          {/* Title */}
          <Skeleton className="h-7 w-48 mx-auto mb-2" />
          {/* Description */}
          <Skeleton className="h-4 w-64 mx-auto" />
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tabs */}
          <Skeleton className="h-10 w-full rounded-md" />
          
          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 py-2">
            <Skeleton className="h-px flex-1" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-px flex-1" />
          </div>

          {/* Email field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Remember me */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-sm" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Submit button */}
          <Skeleton className="h-10 w-full rounded-md" />
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthLoadingSkeleton;