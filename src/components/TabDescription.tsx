
import React from 'react';

interface TabDescriptionProps {
  description: string;
  className?: string;
}

const TabDescription = ({ description, className }: TabDescriptionProps) => {
  return (
    <p className={`text-muted-foreground mb-6 ${className}`}>
      {description}
    </p>
  );
};

export default TabDescription;
