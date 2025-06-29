import React from 'react'
import { Button } from './ui/button'
import { Sparkles } from 'lucide-react'

interface FederatedButtonProps {
  onClick?: () => void
  children?: React.ReactNode
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const FederatedButton: React.FC<FederatedButtonProps> = ({ 
  onClick, 
  children = 'Federated Component', 
  variant = 'default',
  size = 'default'
}) => {
  const handleClick = () => {
    console.log('Federated Button clicked!')
    if (onClick) {
      onClick()
    }
  }

  return (
    <Button 
      onClick={handleClick} 
      variant={variant} 
      size={size}
      className="gap-2"
    >
      <Sparkles className="h-4 w-4" />
      {children}
    </Button>
  )
}

export default FederatedButton
