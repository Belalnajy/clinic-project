import { Skeleton } from '@/components/ui/skeleton';
import LoadingSpinner from './LoadingSpinner';

const LoadingState = ({
  type = 'spinner',
  fullPage = false,
  className = '',
  message = 'Loading...',
}) => {
  if (type === 'spinner') {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-4 ${
          fullPage ? 'min-h-[60vh]' : ''
        } ${className}`}
      >
        <LoadingSpinner size={fullPage ? 'xl' : 'default'} />
        <p className="text-muted-foreground">{message}</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[80%]" />
      </div>
    </div>
  );
};

export default LoadingState;
