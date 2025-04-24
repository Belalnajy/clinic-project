import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft } from 'lucide-react';

const MedicationForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    default_dosage: '',
    description: '',
    is_active: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement API call to save medication
    console.log('Form data:', formData);
    navigate('/medications');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/medications')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Medications
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Edit Medication' : 'Add New Medication'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="default_dosage">Default Dosage</Label>
          <Input
            id="default_dosage"
            name="default_dosage"
            value={formData.default_dosage}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
          />
          <Label htmlFor="is_active">Active</Label>
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => navigate('/medications')}>
            Cancel
          </Button>
          <Button type="submit">{isEditing ? 'Update' : 'Create'} Medication</Button>
        </div>
      </form>
    </div>
  );
};

export default MedicationForm;
