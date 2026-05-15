import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className = '', children, ...props }) => {
  return (
    <div className={`card ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({ className = '', children, ...props }) => {
  return (
    <div className={`card-header bg-white ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<CardTitleProps> = ({ className = '', children, ...props }) => {
  return (
    <h5 className={`card-title mb-1 ${className}`} {...props}>
      {children}
    </h5>
  );
};

export const CardDescription: React.FC<CardDescriptionProps> = ({ className = '', children, ...props }) => {
  return (
    <p className={`card-text text-muted small mb-0 ${className}`} {...props}>
      {children}
    </p>
  );
};

export const CardContent: React.FC<CardContentProps> = ({ className = '', children, ...props }) => {
  return (
    <div className={`card-body ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<CardFooterProps> = ({ className = '', children, ...props }) => {
  return (
    <div className={`card-footer bg-white border-top ${className}`} {...props}>
      {children}
    </div>
  );
};

