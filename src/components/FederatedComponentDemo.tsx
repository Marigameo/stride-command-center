import React, { Suspense, lazy } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { AlertCircle } from 'lucide-react';

// Lazy load the federated component
const FederatedButton = lazy(() => import('microFrontend/FederatedButton'));

const FederatedComponentDemo: React.FC = () => {
  const [showFederated, setShowFederated] = React.useState(false);

  const handleToggleFederated = () => {
    setShowFederated(!showFederated);
  };

  const handleFederatedClick = () => {
    console.log('Federated component clicked from main app!');
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🚀</span>
          Module Federation Demo
        </CardTitle>
        <CardDescription>
          This demonstrates consuming a federated component from a micro-frontend
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Button onClick={handleToggleFederated} variant="outline">
            {showFederated ? 'Hide' : 'Show'} Federated Component
          </Button>
          <span className="text-sm text-muted-foreground">
            Toggle to load the component from micro-frontend
          </span>
        </div>

        {showFederated && (
          <div className="border rounded-lg p-4 bg-muted/50">
            <h3 className="font-semibold mb-2">Federated Component:</h3>
            <Suspense 
              fallback={
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  Loading federated component...
                </div>
              }
            >
              <ErrorBoundary>
                <div className="flex gap-2 flex-wrap">
                  <FederatedButton onClick={handleFederatedClick}>
                    Click Me!
                  </FederatedButton>
                  <FederatedButton 
                    variant="outline" 
                    onClick={handleFederatedClick}
                  >
                    Outline Style
                  </FederatedButton>
                  <FederatedButton 
                    variant="secondary" 
                    size="lg"
                    onClick={handleFederatedClick}
                  >
                    Large Secondary
                  </FederatedButton>
                </div>
              </ErrorBoundary>
            </Suspense>
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• The federated component is loaded from http://localhost:3001</p>
          <p>• It's a separate React app with its own build process</p>
          <p>• Components are shared at runtime using Vite Module Federation</p>
        </div>
      </CardContent>
    </Card>
  );
};

// Error boundary for federated components
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Federated component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center gap-2 p-4 border border-destructive/50 rounded-lg bg-destructive/10">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <div className="text-sm">
            <p className="font-medium text-destructive">Failed to load federated component</p>
            <p className="text-muted-foreground">
              Make sure the micro-frontend is running on http://localhost:3001
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default FederatedComponentDemo;
