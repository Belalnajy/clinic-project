import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const FilterDialog = ({
  filterOpen,
  setFilterOpen,
  filterCriteria,
  setFilterCriteria,
  applyFilters,
  resetFilters
}) => {
  return (
    <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filter Medical Records</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm text-slate-600">Patient Name</label>
            <Input
              value={filterCriteria.patientName}
              onChange={e =>
                setFilterCriteria({
                  ...filterCriteria,
                  patientName: e.target.value
                })}
              placeholder="Enter patient name"
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">Date</label>
            <Input
              type="date"
              value={filterCriteria.date}
              onChange={e =>
                setFilterCriteria({ ...filterCriteria, date: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">Type</label>
            <Input
              value={filterCriteria.type}
              onChange={e =>
                setFilterCriteria({ ...filterCriteria, type: e.target.value })}
              placeholder="e.g., Consultation"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            className="hover:bg-slate-50  hover:cursor-pointer"
            variant="outline"
            onClick={resetFilters}>
            Reset
          </Button>
          <Button
            variant="secondary"
            className="hover:bg-slate-400  hover:cursor-pointer"
            onClick={applyFilters}>
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilterDialog;
