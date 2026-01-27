import { useRef, ChangeEvent } from "react";
import { Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AttachFileButtonProps {
  onFileSelect?: (file: File) => void;
  disabled?: boolean;
}

export const AttachFileButton = ({ onFileSelect, disabled }: AttachFileButtonProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <>
      <input 
        type="file" 
        ref={inputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        disabled={disabled}
      />
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleClick}
            disabled={disabled}
            type="button"
          >
            <Paperclip className="h-5 w-5 text-muted-foreground" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Attach file</TooltipContent>
      </Tooltip>
    </>
  );
};