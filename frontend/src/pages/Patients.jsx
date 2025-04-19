import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getAllPatients } from "../data/data";
import PatientModal from "../components/modals/PatientModal";

import { Plus, Search, Eye, Edit, Trash, User } from "lucide-react";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const allPatients = getAllPatients();
    setPatients(allPatients);
    setFilteredPatients(allPatients);
  }, []);

  useEffect(
    () => {
      if (searchTerm.trim() === "") {
        setFilteredPatients(patients);
      } else {
        const filtered = patients.filter(
          patient =>
            `${patient.fullName}`
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.phone.includes(searchTerm)
        );
        setFilteredPatients(filtered);
      }
    },
    [searchTerm, patients]
  );

  const handleSearch = e => {
    setSearchTerm(e.target.value);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleNewPatient = patientData => {
    toast({
      title: "Success",
      description: `Patient ${patientData.fullName} has been added.`
    });

    setPatients(getAllPatients());
    closeModal();
  };

  const getAge = dateOfBirth => {
    return new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Patients
        </h1>
        <p className="text-slate-500 mt-1">
          Manage patient records and information
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                <Search size={18} />
              </div>
              <Input
                type="search"
                placeholder="Search by name, ID, or phone number..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
            <Button
              onClick={openModal}
              className="bg-primary hover:bg-primary/90 transition-colors">
              <Plus size={18} className="mr-2" />
              Add Patient
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="h-12 px-6 text-left align-middle font-medium text-slate-500">
                    Patient
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-slate-500">
                    ID
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-slate-500">
                    Gender
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-slate-500">
                    Age
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-slate-500">
                    Contact
                  </th>
                  <th className="h-12 px-4 text-center align-middle font-medium text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredPatients.length > 0
                  ? filteredPatients.map(patient =>
                      <tr
                        key={patient.id}
                        className="transition-colors hover:bg-slate-50">
                        <td className="p-4 pl-6 align-middle">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border border-slate-200">
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {patient.fullName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-slate-900">
                                {patient.fullName}
                              </div>
                              <div className="text-xs text-slate-500">
                                {patient.email || "No email"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <Badge variant="outline" className="font-mono">
                            {patient.id}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle">
                          {patient.gender}
                        </td>
                        <td className="p-4 align-middle">
                          {getAge(patient.dateOfBirth)}
                        </td>
                        <td className="p-4 align-middle font-medium">
                          {patient.phone}
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex justify-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-slate-600 hover:text-primary hover:bg-primary/10"
                              aria-label="View Patient">
                              <Eye size={18} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                              aria-label="Edit Patient">
                              <Edit size={18} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-slate-600 hover:text-red-600 hover:bg-red-50"
                              aria-label="Delete Patient">
                              <Trash size={18} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  : <tr>
                      <td
                        colSpan="6"
                        className="p-6 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center py-6">
                          <User size={36} className="text-slate-300 mb-2" />
                          <p className="text-slate-500 mb-1">
                            {searchTerm
                              ? "No patients match your search"
                              : "No patients found"}
                          </p>
                          {!searchTerm &&
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={openModal}
                              className="mt-2">
                              <Plus size={16} className="mr-2" />
                              Add your first patient
                            </Button>}
                        </div>
                      </td>
                    </tr>}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <PatientModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleNewPatient}
      />
    </div>
  );
};

export default Patients;
