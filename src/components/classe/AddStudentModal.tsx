import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Search, UserPlus, Users, AlertCircle } from 'lucide-react';
import { classeService } from '../../services/classeService';
import type { AvailableStudent } from '../../types/classe';
import { toast } from 'sonner';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
  className: string;
  currentStudents: number;
  maxStudents: number;
  onStudentAdded: () => void;
}

export default function AddStudentModal({
  isOpen,
  onClose,
  classId,
  className,
  currentStudents,
  maxStudents,
  onStudentAdded,
}: AddStudentModalProps) {
  const [availableStudents, setAvailableStudents] = useState<AvailableStudent[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<AvailableStudent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [addingStudent, setAddingStudent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isClassFull = currentStudents >= maxStudents;

  useEffect(() => {
    if (isOpen) {
      loadAvailableStudents();
    }
  }, [isOpen, classId]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStudents(availableStudents);
    } else {
      const filtered = availableStudents.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.matricule?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.niveau?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, availableStudents]);

  const loadAvailableStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await classeService.getAvailableStudents(classId);
      if (response.success && response.data) {
        setAvailableStudents(response.data);
      } else {
        setError('Erreur lors du chargement des étudiants disponibles');
      }
    } catch (err) {
      setError('Erreur lors du chargement des étudiants disponibles');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (studentId: string) => {
    if (isClassFull) {
      toast.error('La classe est pleine');
      return;
    }

    try {
      setAddingStudent(studentId);
      const response = await classeService.enrollStudent(classId, studentId);
      
      if (response.success) {
        toast.success('Étudiant ajouté avec succès');
        onStudentAdded();
        onClose();
      } else {
        toast.error('Erreur lors de l\'ajout de l\'étudiant');
      }
    } catch (err) {
      toast.error('Erreur lors de l\'ajout de l\'étudiant');
      console.error('Erreur:', err);
    } finally {
      setAddingStudent(null);
    }
  };

  const handleClose = () => {
    setSearchTerm('');
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Ajouter des étudiants à "{className}"
          </DialogTitle>
          <DialogDescription>
            Sélectionnez les étudiants à ajouter à cette classe.
            {isClassFull && (
              <div className="flex items-center gap-2 mt-2 text-amber-600">
                <AlertCircle className="h-4 w-4" />
                <span>La classe est pleine ({currentStudents}/{maxStudents})</span>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher par nom, email, matricule ou niveau..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Statistiques */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{filteredStudents.length} étudiant(s) disponible(s)</span>
            </div>
            <div className="flex items-center gap-1">
              <span>Classe: {currentStudents}/{maxStudents}</span>
            </div>
          </div>

          {/* Liste des étudiants */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-8 text-red-600">
                <AlertCircle className="h-5 w-5 mr-2" />
                {error}
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-gray-500">
                <div className="text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun étudiant disponible</p>
                  {searchTerm && (
                    <p className="text-sm mt-2">Essayez un autre terme de recherche</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid gap-3">
                {filteredStudents.map((student) => (
                  <Card key={student._id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-medium text-sm">
                                {student.name.charAt(0)}{student.lastname.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">
                                {student.name} {student.lastname}
                              </h3>
                              <p className="text-sm text-gray-600">{student.email}</p>
                              <div className="flex items-center gap-2 mt-1">
                                {student.matricule && (
                                  <Badge variant="outline" className="text-xs">
                                    {student.matricule}
                                  </Badge>
                                )}
                                {student.niveau && (
                                  <Badge variant="secondary" className="text-xs">
                                    {student.niveau}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleAddStudent(student._id)}
                          disabled={isClassFull || addingStudent === student._id}
                          size="sm"
                          className="ml-4"
                        >
                          {addingStudent === student._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <UserPlus className="h-4 w-4 mr-1" />
                          )}
                          {isClassFull ? 'Classe pleine' : 'Ajouter'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
