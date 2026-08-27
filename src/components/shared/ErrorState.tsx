import * as React from "react";
import { CircleAlert, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Erreur de chargement",
  message = "Une erreur inattendue est survenue lors de la récupération des données du serveur.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="p-4 my-4 max-w-2xl mx-auto">
      <Alert variant="destructive" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl">
        <div className="flex items-start gap-3">
          <CircleAlert className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <AlertTitle className="text-sm font-bold">{title}</AlertTitle>
            <AlertDescription className="text-xs mt-1 text-destructive/90">
              {message}
            </AlertDescription>
          </div>
        </div>

        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="shrink-0 gap-1.5 text-xs border-destructive/30 hover:bg-destructive/10"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Réessayer</span>
          </Button>
        )}
      </Alert>
    </div>
  );
}
