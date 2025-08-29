import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Material, MaterialType, Assessment, AssessmentType, AssessmentQuestion } from '../../types';
import Modal from '../shared/Modal';
import { BookOpenIcon, GenerateIcon, EyeIcon } from '../icons/Icons';
import { generateTest, generateAssignment } from '../../services/geminiService';
import Spinner from '../shared/Spinner';

const MaterialManager: React.FC = () => {
  const { materials, addMaterial, addAssessment, assignAssessmentToCourse } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [generationType, setGenerationType] = useState<AssessmentType | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [materialToView, setMaterialToView] = useState<Material | null>(null);

  const [newMaterial, setNewMaterial] = useState<Omit<Material, 'id'>>({
    title: '',
    course: '',
    type: MaterialType.DOC,
    content: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewMaterial(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMaterial(newMaterial);
    setNewMaterial({ title: '', course: '', type: MaterialType.DOC, content: '' });
    setIsModalOpen(false);
  };

  const handleViewMaterial = (material: Material) => {
    setMaterialToView(material);
    setIsViewModalOpen(true);
  };
  
  const renderMaterialContent = (material: Material) => {
    switch (material.type) {
        case MaterialType.VIDEO:
            return (
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <video controls src={material.content} className="w-full h-full">
                        Your browser does not support the video tag.
                    </video>
                </div>
            );
        case MaterialType.PDF:
        case MaterialType.DOC:
        case MaterialType.PPT:
             return (
                 <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border dark:border-slate-700 max-h-96 overflow-y-auto">
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{material.content}</p>
                 </div>
             )
        default:
            return <p>Unsupported material type.</p>;
    }
  };
  
  const handleGenerate = async (material: Material, type: AssessmentType) => {
      setSelectedMaterial(material);
      setGenerationType(type);
      setIsGenerationModalOpen(true);
      setIsGenerating(true);
      setGeneratedContent(null);
      try {
          if (type === AssessmentType.TEST) {
              const questions = await generateTest(material.content);
              setGeneratedContent({ questions });
          } else {
              const assignment = await generateAssignment(material.content);
              setGeneratedContent(assignment);
          }
      } catch (error) {
          console.error(`Failed to generate ${type}`, error);
          setGeneratedContent({error: `Failed to generate ${type}. Please check the API key and content.`});
      } finally {
          setIsGenerating(false);
      }
  };

  const handleAssign = () => {
    if (!generatedContent || !selectedMaterial || !generationType) return;

    const newAssessment: Omit<Assessment, 'id'> = {
        materialId: selectedMaterial.id,
        course: selectedMaterial.course,
        title: generationType === AssessmentType.ASSIGNMENT ? generatedContent.title : `${selectedMaterial.title} Test`,
        type: generationType,
        questions: generatedContent.questions,
    };

    const newId = addAssessment(newAssessment);
    assignAssessmentToCourse(newId, selectedMaterial.course);
    alert(`Successfully assigned ${generationType.toLowerCase()} to students in ${selectedMaterial.course}.`);
    setIsGenerationModalOpen(false);
  };
  
  const formInputClasses = "mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white";
  const formLabelClasses = "block text-sm font-medium text-slate-700 dark:text-slate-200";

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Material Management</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Upload and manage training content.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors shadow-sm">
          Add Material
        </button>
      </div>

      <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {materials.map(material => (
          <div key={material.id} className="bg-white dark:bg-slate-800/50 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between transition-shadow hover:shadow-md">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-100 dark:bg-violet-500/10 rounded-full">
                  <BookOpenIcon className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                </div>
                <span className="text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-2 py-1 rounded-full">{material.type}</span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{material.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{material.course}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{material.content}</p>
            </div>
            <div className="mt-4 flex items-center gap-2">
                 <button onClick={() => handleViewMaterial(material)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-center text-violet-700 bg-violet-100 rounded-lg hover:bg-violet-200 dark:bg-violet-500/20 dark:text-violet-300 dark:hover:bg-violet-500/30">
                    <EyeIcon className="w-4 h-4" />
                    View
                </button>
                 <button onClick={() => handleGenerate(material, AssessmentType.TEST)} disabled={material.type === MaterialType.VIDEO} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-center text-white bg-sky-600 rounded-lg hover:bg-sky-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed">
                     <GenerateIcon className="w-4 h-4" />
                     Test
                 </button>
                 <button onClick={() => handleGenerate(material, AssessmentType.ASSIGNMENT)} disabled={material.type === MaterialType.VIDEO} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-center text-white bg-amber-600 rounded-lg hover:bg-amber-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed">
                     <GenerateIcon className="w-4 h-4" />
                     Assignment
                 </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Material">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className={formLabelClasses}>Title</label>
              <input type="text" name="title" id="title" value={newMaterial.title} onChange={handleInputChange} required className={formInputClasses} />
            </div>
            <div>
              <label htmlFor="course" className={formLabelClasses}>Course</label>
              <input type="text" name="course" id="course" value={newMaterial.course} onChange={handleInputChange} required className={formInputClasses} />
            </div>
            <div>
              <label htmlFor="type" className={formLabelClasses}>Type</label>
              <select name="type" id="type" value={newMaterial.type} onChange={handleInputChange} className={formInputClasses}>
                {Object.values(MaterialType).map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="content" className={formLabelClasses}>Content / URL</label>
              <textarea name="content" id="content" rows={4} value={newMaterial.content} onChange={handleInputChange} required className={formInputClasses} />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-600">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-violet-600 border border-transparent rounded-md shadow-sm hover:bg-violet-700">Add Material</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isGenerationModalOpen} onClose={() => setIsGenerationModalOpen(false)} title={`Generated ${generationType?.toLowerCase()} for "${selectedMaterial?.title}"`}>
        {isGenerating && <div className="flex flex-col items-center justify-center h-48"><Spinner /><p className="mt-4">Generating...</p></div>}
        {generatedContent && !isGenerating && (
            <div>
                {generatedContent.error ? <p className="text-red-500">{generatedContent.error}</p> : (
                    <>
                        <div className="space-y-4 max-h-96 overflow-y-auto p-1">
                            {generatedContent.title && <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{generatedContent.title}</h3>}
                            {generatedContent.questions.map((q: AssessmentQuestion, index: number) => (
                                <div key={index} className="p-4 border rounded-md dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                    <p className="font-semibold">{index + 1}. {q.question}</p>
                                    {q.options && (
                                        <ul className="mt-2 space-y-1 list-disc list-inside">
                                            {q.options.map((opt: string) => (
                                                <li key={opt} className={opt === q.correctAnswer ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-slate-600 dark:text-slate-300'}>{opt}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button onClick={handleAssign} className="px-4 py-2 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors shadow-sm">
                                Assign to Students in "{selectedMaterial?.course}"
                            </button>
                        </div>
                    </>
                )}
            </div>
        )}
      </Modal>

      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title={materialToView?.title || 'View Material'} size="lg">
        {materialToView && renderMaterialContent(materialToView)}
      </Modal>
    </div>
  );
};

export default MaterialManager;