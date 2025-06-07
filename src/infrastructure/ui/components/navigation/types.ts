import { ReactNode } from 'react';

export interface NavProps {
  setCurrentList?: (listName: string) => void;
}

export interface NavLinkProps {
  to: string;
  icon: ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
  className?: string;
}

export interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export interface SearchResult {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
}
