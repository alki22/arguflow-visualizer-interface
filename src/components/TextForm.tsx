
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface TextFormProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  className?: string;
}

const TextForm = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  maxLength = 5000,
  className,
}: TextFormProps) => {
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    
    // Simple validation
    if (text.length > maxLength) {
      setError(`Text is too long (maximum ${maxLength} characters)`);
      return;
    }
    
    // Check for potentially malicious content
    const scriptPattern = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    if (scriptPattern.test(text)) {
      setError("HTML/Script tags are not allowed");
      return;
    }
    
    setError(null);
    onChange(text);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <Textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="min-h-32 resize-none"
      />
      {error && (
        <p className="text-xs text-destructive animate-fade-in">{error}</p>
      )}
    </div>
  );
};

export default TextForm;
