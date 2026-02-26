'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface Medicine {
    name: string
    dose: string
    frequency: string
    duration: string
    instructions: string
}

const commonMedicines = [
    'Tab Paracetamol 500mg', 'Tab Paracetamol 650mg', 'Tab Amoxicillin 500mg',
    'Tab Azithromycin 500mg', 'Tab Metformin 500mg', 'Tab Amlodipine 5mg',
    'Tab Atenolol 50mg', 'Tab Pantoprazole 40mg', 'Tab Cetirizine 10mg',
    'Tab Ibuprofen 400mg', 'Syp Amoxicillin', 'Tab Diclofenac 50mg',
    'Tab Atorvastatin 10mg', 'Tab Aspirin 75mg', 'Tab Cefixime 200mg',
]

const frequencies = ['OD (Once daily)', 'BD (Twice daily)', 'TDS (Thrice daily)', 'QID (Four times)', 'SOS (When needed)', 'HS (At bedtime)']
const durations = ['1 day', '3 days', '5 days', '7 days', '10 days', '14 days', '1 month', '3 months', 'Ongoing']

function PrescriptionPageContent() {
    const searchParams = useSearchParams()
    const [mode, setMode] = useState<'voice' | 'manual'>('manual')
    const [isRecording, setIsRecording] = useState(false)
    const [transcript, setTranscript] = useState('')
    const [aiProcessing, setAiProcessing] = useState(false)
    const [medicines, setMedicines] = useState<Medicine[]>([
        { name: '', dose: '', frequency: '', duration: '', instructions: '' }
    ])
    const [diagnosis, setDiagnosis] = useState('')
    const [symptoms, setSymptoms] = useState('')
    const [advice, setAdvice] = useState('')
    const [followUpDate, setFollowUpDate] = useState('')
    const [labTests, setLabTests] = useState('')
    const [patientSearch, setPatientSearch] = useState('')
    const [selectedPatient, setSelectedPatient] = useState<any>(null)
    const [medSuggestions, setMedSuggestions] = useState<string[]>([])
    const [activeMedIdx, setActiveMedIdx] = useState<number | null>(null)
    const [saved, setSaved] = useState(false)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)

    const mockPatients = [
        { id: '1', name: 'Rahul Verma', phone: '9876543210', age: 32 },
        { id: '2', name: 'Priya Shah', phone: '9876543211', age: 28 },
        { id: '3', name: 'Amit Kumar', phone: '9876543212', age: 45 },
    ]

    const filteredPatients = mockPatients.filter(p =>
        patientSearch && (
            p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
            p.phone.includes(patientSearch)
        )
    )

    const handleVoiceRx = async () => {
        if (isRecording) {
            setIsRecording(false)
            setAiProcessing(true)
            // Simulate AI processing of voice
            await new Promise(r => setTimeout(r, 2000))
            // Mock AI parsed medicines
            setMedicines([
                { name: 'Tab Paracetamol 500mg', dose: '500mg', frequency: 'TDS (Thrice daily)', duration: '5 days', instructions: 'After food' },
                { name: 'Tab Amoxicillin 500mg', dose: '500mg', frequency: 'BD (Twice daily)', duration: '7 days', instructions: 'After food' },
                { name: 'Tab Cetirizine 10mg', dose: '10mg', frequency: 'OD (Once daily)', duration: '5 days', instructions: 'At night' },
            ])
            setDiagnosis('Upper Respiratory Tract Infection (URTI)')
            setSymptoms('Fever, Cough, Cold')
            setAdvice('Rest. Drink hot fluids. Avoid cold drinks. Come back if fever persists after 3 days.')
            setFollowUpDate(new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0])
            setTranscript('Patient presenting with fever 101°F, cough dry, runny nose, sore throat since 2 days. Prescribed paracetamol, amoxicillin, cetirizine...')
            setAiProcessing(false)
        } else {
            setIsRecording(true)
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                const recorder = new MediaRecorder(stream)
                mediaRecorderRef.current = recorder
                recorder.start()
                // Simulate transcript
                setTimeout(() => setTranscript('Patient with fever, cough, cold...'), 2000)
            } catch {
                setIsRecording(false)
                alert('Microphone access denied. Please allow mic access.')
            }
        }
    }

    const addMedicine = () => {
        setMedicines(prev => [...prev, { name: '', dose: '', frequency: '', duration: '', instructions: '' }])
    }

    const removeMedicine = (idx: number) => {
        setMedicines(prev => prev.filter((_, i) => i !== idx))
    }

    const updateMedicine = (idx: number, field: keyof Medicine, value: string) => {
        setMedicines(prev => prev.map((m, i) => i === idx ? { ...m, [field]: value } : m))
        if (field === 'name') {
            const sug = commonMedicines.filter(m => m.toLowerCase().includes(value.toLowerCase()) && value.length > 1)
            setMedSuggestions(sug.slice(0, 5))
            setActiveMedIdx(idx)
        }
    }

    const handleSave = async () => {
        setSaved(true)
        await new Promise(r => setTimeout(r, 1000))
        setSaved(false)
        // Would normally redirect or show success
    }

    return (
        <div className="p-4 sm:p-6 pb-24 lg:pb-6 max-w-4xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                        💊 VoiceRx Prescription
                    </h1>
                    <p className="text-sm text-slate-400">Speak or type your prescription</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setMode('voice')}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${mode === 'voice' ? 'bg-teal-600 text-white' : 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400'}`}>
                        🎤 Voice Rx
                    </button>
                    <button onClick={() => setMode('manual')}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${mode === 'manual' ? 'bg-teal-600 text-white' : 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400'}`}>
                        ✏️ Manual
                    </button>
                </div>
            </div>

            {/* Patient Selection */}
            <div className="bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5 p-5 mb-4">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">👤 Patient</h3>
                {selectedPatient ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20">
                        <div>
                            <div className="font-semibold text-sm text-teal-800 dark:text-teal-300">{selectedPatient.name}</div>
                            <div className="text-xs text-teal-600 dark:text-teal-400">{selectedPatient.age}y · {selectedPatient.phone}</div>
                        </div>
                        <button onClick={() => setSelectedPatient(null)} className="text-slate-400 hover:text-slate-600">✕</button>
                    </div>
                ) : (
                    <div className="relative">
                        <input type="text" placeholder="Search patient by name or phone..." value={patientSearch}
                            onChange={e => setPatientSearch(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-teal-500" />
                        {filteredPatients.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#0a1410] border border-slate-200 dark:border-white/10 rounded-xl shadow-lg z-10 overflow-hidden">
                                {filteredPatients.map(p => (
                                    <button key={p.id} onClick={() => { setSelectedPatient(p); setPatientSearch('') }}
                                        className="w-full text-left px-4 py-3 hover:bg-teal-50 dark:hover:bg-teal-500/10 border-b last:border-b-0 border-slate-100 dark:border-white/5">
                                        <div className="text-sm font-medium text-slate-800 dark:text-white">{p.name}</div>
                                        <div className="text-xs text-slate-400">{p.age}y · {p.phone}</div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Voice Mode */}
            {mode === 'voice' && (
                <div className="bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5 p-5 mb-4">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">🎤 AI Voice Recognition</h3>

                    {aiProcessing ? (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-3 animate-spin-slow">🤖</div>
                            <div className="font-semibold text-slate-700 dark:text-slate-300 mb-1">AI is processing your prescription...</div>
                            <div className="text-sm text-slate-400">Parsing medicines, dosage, and advice</div>
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={handleVoiceRx}
                                className={`w-full py-8 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center gap-4 ${isRecording
                                        ? 'border-red-400 bg-red-50 dark:bg-red-500/10'
                                        : 'border-teal-300 dark:border-teal-500/30 bg-teal-50 dark:bg-teal-500/5 hover:bg-teal-100 dark:hover:bg-teal-500/10'
                                    }`}
                            >
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-teal-500'
                                    }`}>
                                    🎤
                                </div>
                                <div>
                                    <div className={`font-bold text-lg ${isRecording ? 'text-red-600 dark:text-red-400' : 'text-teal-700 dark:text-teal-400'}`}>
                                        {isRecording ? 'Recording... Click to Stop' : 'Click to Start Recording'}
                                    </div>
                                    <div className="text-sm text-slate-400 mt-1">
                                        Speak naturally in Hindi or English
                                    </div>
                                </div>
                                {isRecording && (
                                    <div className="flex gap-1 items-center h-8">
                                        {Array(20).fill(0).map((_, i) => (
                                            <div key={i} className="w-1.5 bg-red-400 rounded-full animate-pulse"
                                                style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.05}s` }} />
                                        ))}
                                    </div>
                                )}
                            </button>

                            {transcript && (
                                <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                                    <div className="text-xs font-medium text-slate-400 mb-1">Transcript:</div>
                                    <div className="text-sm text-slate-700 dark:text-slate-300 italic">"{transcript}"</div>
                                </div>
                            )}

                            <div className="mt-4 grid grid-cols-2 gap-2">
                                {[
                                    'Tab Paracetamol 500mg TDS for 5 days, after food',
                                    'Syrup Cough formula 5ml BD',
                                    'Amoxicillin 500mg BD for 7 days',
                                    'Cetirizine 10mg HS for 5 days',
                                ].map((t, i) => (
                                    <button key={i} onClick={() => setTranscript(t)}
                                        className="text-left text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:bg-teal-50 dark:hover:bg-teal-500/10 hover:text-teal-600 dark:hover:text-teal-400 transition-all">
                                        "{t}"
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Diagnosis & Symptoms */}
            <div className="bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5 p-5 mb-4">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">🔍 Clinical Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Diagnosis</label>
                        <input type="text" value={diagnosis} onChange={e => setDiagnosis(e.target.value)}
                            placeholder="e.g. URTI, Hypertension"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-teal-500" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Symptoms</label>
                        <input type="text" value={symptoms} onChange={e => setSymptoms(e.target.value)}
                            placeholder="Fever, Cough, Cold..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-teal-500" />
                    </div>
                </div>
            </div>

            {/* Medicines */}
            <div className="bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5 p-5 mb-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">💊 Medicines</h3>
                    <button onClick={addMedicine}
                        className="text-xs px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 font-medium hover:bg-teal-100 dark:hover:bg-teal-500/20">
                        + Add Medicine
                    </button>
                </div>

                <div className="space-y-3">
                    {medicines.map((med, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                            <div className="flex items-start gap-2 mb-3">
                                <div className="flex-1 relative">
                                    <input type="text" placeholder="Medicine name..." value={med.name}
                                        onChange={e => updateMedicine(idx, 'name', e.target.value)}
                                        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-teal-500" />
                                    {activeMedIdx === idx && medSuggestions.length > 0 && med.name && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#0a1410] border border-slate-200 dark:border-white/10 rounded-lg shadow-lg z-10">
                                            {medSuggestions.map(sug => (
                                                <button key={sug} onClick={() => {
                                                    updateMedicine(idx, 'name', sug)
                                                    setMedSuggestions([])
                                                }}
                                                    className="w-full text-left px-3 py-2 text-sm hover:bg-teal-50 dark:hover:bg-teal-500/10 text-slate-700 dark:text-slate-300">
                                                    {sug}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button onClick={() => removeMedicine(idx)}
                                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-all">
                                    ✕
                                </button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                <select value={med.frequency} onChange={e => updateMedicine(idx, 'frequency', e.target.value)}
                                    className="px-2 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1a15] text-slate-700 dark:text-slate-300 text-xs focus:outline-none focus:border-teal-500">
                                    <option value="">Frequency</option>
                                    {frequencies.map(f => <option key={f} value={f}>{f}</option>)}
                                </select>
                                <select value={med.duration} onChange={e => updateMedicine(idx, 'duration', e.target.value)}
                                    className="px-2 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1a15] text-slate-700 dark:text-slate-300 text-xs focus:outline-none focus:border-teal-500">
                                    <option value="">Duration</option>
                                    {durations.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                                <input type="text" placeholder="Instructions..." value={med.instructions}
                                    onChange={e => updateMedicine(idx, 'instructions', e.target.value)}
                                    className="px-2 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 text-xs focus:outline-none focus:border-teal-500 col-span-2 sm:col-span-1" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lab Tests, Advice, Follow-up */}
            <div className="bg-white dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5 p-5 mb-4">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">📋 Additional Details</h3>
                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Lab Tests</label>
                        <input type="text" value={labTests} onChange={e => setLabTests(e.target.value)}
                            placeholder="CBC, Lipid Profile, HbA1c... (comma separated)"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-teal-500" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Advice to Patient</label>
                        <textarea value={advice} onChange={e => setAdvice(e.target.value)}
                            placeholder="Rest. Drink plenty of fluids. Avoid spicy food..."
                            rows={2}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-teal-500 resize-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Follow-up Date</label>
                        <input type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0d1a15] text-slate-800 dark:text-white text-sm focus:outline-none focus:border-teal-500" />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={handleSave}
                    className="flex-1 btn-primary py-3 rounded-xl text-sm font-semibold">
                    {saved ? '✓ Saved!' : '💾 Save Prescription'}
                </button>
                <button className="sm:flex-none px-5 py-3 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                    📄 Generate PDF
                </button>
                <button className="sm:flex-none px-5 py-3 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 text-sm font-medium hover:bg-green-100 dark:hover:bg-green-500/20 transition-all">
                    📱 Send via WhatsApp
                </button>
            </div>
        </div>
    )
}

export default function PrescriptionPage() {
    return (
        <Suspense fallback={<div className="p-6 text-slate-400">Loading...</div>}>
            <PrescriptionPageContent />
        </Suspense>
    )
}
