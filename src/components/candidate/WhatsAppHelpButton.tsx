import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MessageCircle } from "lucide-react";
import { WhatsAppHelpButtonProps } from '@/types/candidate';
import { useLocalStorage } from "@/hooks/useLocalStorage";

const WhatsAppHelpButton: React.FC<WhatsAppHelpButtonProps> = ({ phone = "917034366037" }) => {
  const [candidateName] = useLocalStorage("candidateName", "Candidate");
  const [applicationId] = useLocalStorage("applicationId", "");
  
  const { url, ariaLabel } = useMemo(() => {
    const base = `https://wa.me/${phone}`;
    const text = `Hello HR, I'm ${candidateName}${applicationId ? ` (Application ID: ${applicationId})` : ""}. I'm facing an issue on the AI Interview page. Could you please help?`;
    const url = `${base}?text=${encodeURIComponent(text)}`;
    const ariaLabel = `Contact HR on WhatsApp`;
    return { url, ariaLabel };
  }, [phone, candidateName, applicationId]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button asChild className="rounded-full bg-bambinos-blue hover:bg-bambinos-blue/90 text-white shadow-lg px-4 py-2">
            <a href={url} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel}>
              <span className="sr-only">{ariaLabel}</span>
              <MessageCircle className="mr-2" />
              <span className="hidden sm:inline">WhatsApp HR</span>
            </a>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          Having trouble? Message our HR team on WhatsApp.
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default WhatsAppHelpButton;
