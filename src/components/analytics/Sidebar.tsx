import { 
  BarChart3, 
  Users, 
  Heart, 
  Shield, 
  FileText, 
  DollarSign, 
  Map,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Section = 'overview' | 'population' | 'health' | 'incidents' | 'documents' | 'financial' | 'geographical';

interface SidebarProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}

const menuItems = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'population', label: 'Population', icon: Users },
  { id: 'health', label: 'Health & Social', icon: Heart },
  { id: 'incidents', label: 'Cases & Incidents', icon: Shield },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'financial', label: 'Financial', icon: DollarSign },
  { id: 'geographical', label: 'Geographical', icon: Map },
];

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <div className="w-64 bg-card border-r border-border h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Barangay</h1>
            <p className="text-sm text-muted-foreground">Insights</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id as Section)}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}