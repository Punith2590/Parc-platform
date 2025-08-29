
import React, { useState } from 'react';
import { Material, MaterialType, Assessment, AssessmentType, AssessmentQuestion } from '../../types';
import { useData } from '../../context/DataContext';
import { generateTest, generateAssignment } from '../../services/geminiService';
import Modal from '../shared/Modal';
import Spinner from '../shared/Spinner';
import { GenerateIcon } from '../icons/Icons';

interface MaterialViewerProps {
    materials: Material[];
}

const MaterialViewer: React.FC<MaterialViewerProps> = ({ materials }) => {
    const { addAssessment, assignAssessmentToCourse } = useData();
    const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(materials[0] || null);
    const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedContent, setGeneratedContent] = useState<any>(null);
    const [generationType, setGenerationType] = useState<AssessmentType | null>(null);
    const [assessmentMaterial, setAssessmentMaterial] = useState<Material | null>(null);

    if (materials.length === 0) {
        return <p className="text-center text-slate-500 dark:text-slate-400">No materials assigned to this schedule.</p>;
    }

    const handleGenerate = async (material: Material, type: AssessmentType) => {
        setAssessmentMaterial(material);
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
            setGeneratedContent({ error: `Failed to generate ${type}. Please check API key and content.` });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAssign = () => {
        if (!generatedContent || !assessmentMaterial || !generationType) return;

        const newAssessment: Omit<Assessment, 'id'> = {
            materialId: assessmentMaterial.id,
            course: assessmentMaterial.course,
            title: generationType === AssessmentType.ASSIGNMENT ? generatedContent.title : `${assessmentMaterial.title} Test`,
            type: generationType,
            questions: generatedContent.questions,
        };

        const newId = addAssessment(newAssessment);
        assignAssessmentToCourse(newId, assessmentMaterial.course);
        alert(`Successfully assigned ${generationType.toLowerCase()} to students in ${assessmentMaterial.course}.`);
        setIsGenerationModalOpen(false);
    };


    const renderContent = () => {
        if (!selectedMaterial) return null;

        switch (selectedMaterial.type) {
            case MaterialType.VIDEO:
                return (
                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                        <video controls src={selectedMaterial.content} className="w-full h-full">
                            Your browser does not support the video tag.
                        </video>
                    </div>
                );
            case MaterialType.PDF:
            case MaterialType.DOC:
            case MaterialType.PPT:
                 return (
                     <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border dark:border-slate-700 max-h-96 overflow-y-auto">
                        <h3 className="font-bold text-lg mb-4">{selectedMaterial.title}</h3>
                        <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{selectedMaterial.content}</p>
                     </div>
                 )
            default:
                return <p>Unsupported material type.</p>;
        }
    };

    return (
        <>
            <div className="flex flex-col md:flex-row gap-6 max-h-[70vh]">
                <div className="w-full md:w-2/5 lg:w-1/3">
                    <h3 className="font-semibold mb-3 text-slate-900 dark:text-white">Materials List</h3>
                    <ul className="space-y-2">
                        {materials.map(material => (
                            <li key={material.id} className="flex items-center justify-between gap-1">
                               <button onClick={() => setSelectedMaterial(material)} className={`flex-grow text-left px-3 py-2 rounded-md text-sm transition-colors ${selectedMaterial?.id === material.id ? 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                                    {material.title}
                               </button>
                               <button 
                                    onClick={() => handleGenerate(material, AssessmentType.TEST)} 
                                    disabled={material.type === MaterialType.VIDEO}
                                    className="flex-shrink-0 p-2 rounded-md text-sky-600 hover:bg-sky-100 dark:text-sky-400 dark:hover:bg-slate-700 disabled:text-slate-400 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                                    title="Generate Test"
                                >
                                   <GenerateIcon className="w-5 h-5" />
                               </button>
                               <button 
                                    onClick={() => handleGenerate(material, AssessmentType.ASSIGNMENT)} 
                                    disabled={material.type === MaterialType.VIDEO}
                                    className="flex-shrink-0 p-2 rounded-md text-amber-600 hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-slate-700 disabled:text-slate-400 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                                    title="Generate Assignment"
                                >
                                   <GenerateIcon className="w-5 h-5" />
                               </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="w-full md:w-3/5 lg:w-2/3 flex-1">
                    {renderContent()}
                </div>
            </div>

            <Modal isOpen={isGenerationModalOpen} onClose={() => setIsGenerationModalOpen(false)} title={`Generated ${generationType?.toLowerCase()} for "${assessmentMaterial?.title}"`}>
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
                                                        <li key={opt} className={opt === q.correctAnswer ? 'text-green-600 dark:text-green-400 font-medium' : ''}>{opt}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                 <div className="mt-6 flex justify-end">
                                    <button onClick={handleAssign} className="px-4 py-2 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors shadow-sm">
                                        Assign to Students in "{assessmentMaterial?.course}"
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </Modal>
        </>
    );
}

export default MaterialViewer;