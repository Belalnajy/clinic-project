import DoctorCard from '@/components/doctors/DoctorCard';
import AddDoctorModal from '@/components/doctors/AddDoctorModal';
import useDoctors from '@/hooks/useDoctors';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const DoctorsPage = () => {
  const { doctors, addDoctor, setQuery, isLoading } = useDoctors();

  return (
    <div className="mx-4 pe-4 md:pe-6 py-4 md:py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Doctors</h1>
        <p className="text-muted-foreground">Manage clinic doctors and specialists</p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Search by name, specialization, or email..."
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
            <AddDoctorModal onAdd={addDoctor} />
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-[200px] w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No doctors found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doc) => (
                <DoctorCard key={doc.id} doctor={doc} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorsPage;
