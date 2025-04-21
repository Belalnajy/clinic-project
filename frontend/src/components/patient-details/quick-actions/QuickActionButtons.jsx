import { Button } from '../../ui/button';
import { FileText, Microscope, Pill } from 'lucide-react';

function getQuickActionIcon(icon) {
  switch (icon) {
    case 'FileText':
      return <FileText size={20} />;
    case 'Pill':
      return <Pill size={20} />;
    case 'Microscope':
      return <Microscope size={20} />;
    default:
      return null;
  }
}

const QuickActionButtons = ({ actions }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action) => (
          <Button
            key={action.id}
            variant="outline"
            className="flex items-center justify-center space-x-2 py-6"
            onClick={action.action}
          >
            {getQuickActionIcon(action.icon)}
            <span>{action.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionButtons;
