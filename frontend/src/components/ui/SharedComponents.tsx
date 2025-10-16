import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionProps {
  id?: string;
  className?: string;
  variant?: 'light' | 'dark' | 'gradient';
  children: React.ReactNode;
}

export function Section({ id, className = '', variant = 'light', children }: SectionProps) {
  const variantClasses = {
    light: 'bg-white',
    dark: 'bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white',
    gradient: 'bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50'
  };

  return (
    <section id={id} className={`py-16 md:py-24 ${variantClasses[variant]} ${className}`}>
      {children}
    </section>
  );
}

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`container mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  centered?: boolean;
}

export function SectionHeader({ title, subtitle, description, centered = true }: SectionHeaderProps) {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
      {subtitle && (
        <p className="text-purple-600 font-semibold text-sm uppercase tracking-wider mb-2">
          {subtitle}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  variant?: 'default' | 'bordered' | 'shadow';
  onClick?: () => void;
}

export function Card({ children, className = '', hover = true, variant = 'default', onClick }: CardProps) {
  const variantClasses = {
    default: 'bg-white rounded-xl shadow-lg',
    bordered: 'bg-white rounded-xl border-2 border-gray-100',
    shadow: 'bg-white rounded-xl shadow-2xl'
  };

  return (
    <div 
      className={`${variantClasses[variant]} ${hover ? 'hover:shadow-2xl hover:-translate-y-1' : ''} transition-all duration-300 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface IconBoxProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  color?: 'purple' | 'blue' | 'indigo' | 'pink' | 'green';
}

export function IconBox({ icon: Icon, title, description, color = 'purple' }: IconBoxProps) {
  const colorClasses = {
    purple: 'bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white',
    blue: 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
    indigo: 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white',
    pink: 'bg-pink-100 text-pink-600 group-hover:bg-pink-600 group-hover:text-white',
    green: 'bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white'
  };

  return (
    <div className="group">
      <div className="flex items-start space-x-4">
        <div className={`flex-shrink-0 w-14 h-14 rounded-lg flex items-center justify-center transition-all duration-300 ${colorClasses[color]}`}>
          <Icon size={28} />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
            {title}
          </h3>
          {description && (
            <p className="text-gray-600">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'md', className = '' }: BadgeProps) {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  );
}

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  onClick?: () => void;
  href?: string;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon, 
  onClick, 
  href,
  className = '',
  disabled = false,
  type = 'button'
}: ButtonProps) {
  const variantClasses = {
    primary: 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-xl',
    secondary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl',
    outline: 'border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white',
    ghost: 'text-purple-600 hover:bg-purple-50'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const baseClasses = `inline-flex items-center space-x-2 rounded-lg font-medium transition-all duration-300 ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`;

  if (href) {
    return (
      <a href={href} className={baseClasses}>
        {Icon && <Icon size={20} />}
        <span>{children}</span>
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={baseClasses}>
      {Icon && <Icon size={20} />}
      <span>{children}</span>
    </button>
  );
}

interface StatsCardProps {
  value: string | number;
  label: string;
  icon: LucideIcon;
  color?: 'purple' | 'blue' | 'indigo' | 'pink';
}

export function StatsCard({ value, label, icon: Icon, color = 'purple' }: StatsCardProps) {
  const colorClasses = {
    purple: 'from-purple-500 to-purple-600',
    blue: 'from-blue-500 to-blue-600',
    indigo: 'from-indigo-500 to-indigo-600',
    pink: 'from-pink-500 to-pink-600'
  };

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-4">
        <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white shadow-lg`}>
          <Icon size={28} />
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-gray-600">{label}</p>
        </div>
      </div>
    </Card>
  );
}
