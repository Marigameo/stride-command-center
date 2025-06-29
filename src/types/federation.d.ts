declare module 'microFrontend/FederatedButton' {
  import React from 'react';
  
  interface FederatedButtonProps {
    onClick?: () => void;
    children?: React.ReactNode;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
  }
  
  const FederatedButton: React.FC<FederatedButtonProps>;
  export default FederatedButton;
}
