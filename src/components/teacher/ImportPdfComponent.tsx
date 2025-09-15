import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { ROUTES } from '../../constants';
import { Upload, FileText, Sparkles } from 'lucide-react';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

export function ImportPdfComponent() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      setUploadedFile({
        name: pdfFile.name,
        size: pdfFile.size,
        type: pdfFile.type
      });
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file && file.type === 'application/pdf') {
        setUploadedFile({
          name: file.name,
          size: file.size,
          type: file.type
        });
      }
    }
  }, []);

  const handleGenerateCourse = async () => {
    if (!uploadedFile) return;
    
    setIsProcessing(true);
    
    // Simulation du traitement
    setTimeout(() => {
      setIsProcessing(false);
      navigate(ROUTES.TEACHER_COURSE_EDITOR);
    }, 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Importer un PDF
          </h1>
          <p className="text-lg text-muted-foreground">
            Téléchargez votre PDF et laissez l'IA créer un cours interactif adapté
          </p>
        </div>

        {/* Zone d'upload */}
        <div className="max-w-4xl mx-auto">
          {!uploadedFile ? (
            <Card 
              className={`border-2 border-dashed transition-colors ${
                isDragOver 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <CardContent className="p-12 text-center">
                <div className="space-y-6">
                  {/* Icône d'upload */}
                  <div className="flex justify-center">
                    <div className="p-4 bg-muted rounded-full">
                      <Upload className="h-12 w-12 text-muted-foreground" />
                    </div>
                  </div>

                  {/* Texte principal */}
                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold text-foreground">
                      Glissez votre PDF ici
                    </h3>
                    <p className="text-muted-foreground">
                      Ou cliquez pour sélectionner un fichier PDF
                    </p>
                  </div>

                  {/* Bouton de sélection */}
                  <div className="pt-4">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="pdf-upload"
                    />
                    <Button 
                      asChild
                      className="bg-primary hover:bg-primary/90"
                    >
                      <label htmlFor="pdf-upload" className="cursor-pointer">
                        <FileText className="h-4 w-4 mr-2" />
                        Sélectionner un PDF
                      </label>
                    </Button>
                  </div>

                  {/* Informations supplémentaires */}
                  <div className="pt-4 text-sm text-muted-foreground">
                    <p>Formats supportés : PDF (max. 50 MB)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Fichier sélectionné */
            <Card className="border-primary">
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Informations du fichier */}
                  <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                    <div className="p-2 bg-primary/10 rounded">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{uploadedFile.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(uploadedFile.size)}
                      </p>
                    </div>
                  </div>

                  {/* Bouton de génération */}
                  <div className="text-center">
                    <Button 
                      onClick={handleGenerateCourse}
                      disabled={isProcessing}
                      size="lg"
                      className="bg-primary hover:bg-primary/90 min-w-[200px]"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Traitement en cours...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Générer cours
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Message d'information */}
                  <div className="text-center text-sm text-muted-foreground">
                    <p>
                      L'IA va analyser votre PDF et créer un cours interactif avec des quiz automatiques
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Informations sur le processus */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Comment ça fonctionne ?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-3">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium text-foreground mb-2">1. Import</h4>
                  <p className="text-sm text-muted-foreground">
                    Uploadez votre document PDF
                  </p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-3">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium text-foreground mb-2">2. Analyse IA</h4>
                  <p className="text-sm text-muted-foreground">
                    Extraction automatique du contenu
                  </p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-3">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium text-foreground mb-2">3. Génération</h4>
                  <p className="text-sm text-muted-foreground">
                    Création du cours interactif
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
