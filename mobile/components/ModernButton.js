import React from 'react';
import { Button } from 'native-base';

export const ModernButton = ({ title, onPress, variant = 'solid', colorScheme = 'primary', ...props }) => {
  return (
    <Button
      onPress={onPress}
      variant={variant}
      colorScheme={colorScheme}
      {...props}
    >
      {title}
    </Button>
  );
};
