import { cn } from '../../utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card = ({ children, className, hover }: CardProps) => (
  <div className={cn(
    'bg-white rounded-2xl border border-gray-100 shadow-sm',
    hover && 'hover:shadow-lg hover:border-violet-200 transition-all duration-300',
    className
  )}>
    {children}
  </div>
);

export const CardHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('px-6 py-4 border-b border-gray-100', className)}>{children}</div>
);

export const CardBody = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('px-6 py-4', className)}>{children}</div>
);

export const CardFooter = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('px-6 py-4 border-t border-gray-100', className)}>{children}</div>
);

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
  trend?: string;
}

export const StatCard = ({ title, value, icon, gradient, trend }: StatCardProps) => (
  <Card className="overflow-hidden">
    <CardBody className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && <p className="text-xs text-gray-400 mt-1">{trend}</p>}
        </div>
        <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl bg-gradient-to-br', gradient)}>
          {icon}
        </div>
      </div>
    </CardBody>
  </Card>
);
