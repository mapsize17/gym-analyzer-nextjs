"use client";

import { useState, useRef, useCallback } from "react";

interface Exercise {
  name: string;
  video_id?: string;
  muscles_worked?: string[];
  steps?: string[];
  common_mistakes?: string[];
  safety_tips?: string[];
}

interface AnalysisResult {
  equipment_name?: string;
  category?: string;
  difficulty?: string;
  primary_muscles?: string[];
  exercises?: Exercise[];
  safety_warnings?: string[];
}

interface EquipmentResult {
  key: string;
  name: string;
  category: string;
  analysis: AnalysisResult;
}

interface AnalyzeResponse {
  vision_description?: string;
  matched_equipment?: string[];
  results?: EquipmentResult[];
  analysis?: AnalysisResult;
  equipment_count?: number;
}

export default function GymAnalyzerPage() {
  const [imageData, setImageData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(1);
  const [results, setResults] = useState<EquipmentResult[] | null>(null);
  const [visionDesc, setVisionDesc] = useState<string>("");
  const [equipmentCount, setEquipmentCount] = useState(0);
  const [error, setError] = useState<string>("");
  const [mode, setMode] = useState<"upload" | "camera">("upload");
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const resetAll = useCallback(() => {
    setImageData(null);
    setResults(null);
    setVisionDesc("");
    setEquipmentCount(0);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      setCameraStream(stream);
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      alert("Could not access camera. Please upload an image instead.");
      setMode("upload");
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
      setCameraStream(null);
    }
  }, [cameraStream]);

  const switchCamera = useCallback(() => {
    setFacingMode(p => p === "environment" ? "user" : "environment");
    stopCamera();
    setTimeout(startCamera, 100);
  }, [startCamera, stopCamera]);

  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const v = videoRef.current;
    canvasRef.current.width = v.videoWidth || 1280;
    canvasRef.current.height = v.videoHeight || 720;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(v, 0, 0, canvasRef.current.width, canvasRef.current.height);
    const data = canvasRef.current.toDataURL("image/jpeg", 0.9);
    setImageData(data);
    setResults(null);
    setError("");
    stopCamera();
    setMode("upload");
  }, [stopCamera]);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      setImageData(evt.target?.result as string);
      setResults(null);
      setError("");
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = evt => {
        setImageData(evt.target?.result as string);
        setResults(null);
        setError("");
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const analyze = useCallback(async () => {
    if (!imageData) return;
    setLoading(true);
    setLoadingStep(1);
    setError("");
    setResults(null);

    try {
      // Step 1-2: Prepare
      setLoadingStep(2);
      await new Promise(r => setTimeout(r, 300));

      const resp = await fetch(imageData);
      const blob = await resp.blob();
      const fd = new FormData();
      fd.append("image", blob, "equipment.jpg");

      // Step 3: Sending to AI
      setLoadingStep(3);
      await new Promise(r => setTimeout(r, 400));

      const result = await fetch("/api/analyze", { method: "POST", body: fd });
      const data: AnalyzeResponse = await result.json();

      // Step 4: Building results
      setLoadingStep(4);
      await new Promise(r => setTimeout(r, 300));

      if (data.results?.length) {
        setResults(data.results);
        setVisionDesc(data.vision_description || "");
        setEquipmentCount(data.equipment_count || data.results.length);
      } else if (data.analysis) {
        setResults([{
          key: "detected",
          name: data.analysis.equipment_name || "Detected Equipment",
          category: data.analysis.category || "unknown",
          analysis: data.analysis,
        }]);
        setEquipmentCount(1);
      } else {
        setError("Could not identify equipment from the photo. Try a clearer shot with the equipment well-lit and centered.");
      }
    } catch (err: any) {
      setError(`Analysis failed: ${err.message}`);
    } finally {
      setLoading(false);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, [imageData]);

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#1a1d2e] to-[#242840] px-5 py-6 text-center border-b border-white/5">
        <h1 className="text-2xl font-bold tracking-tight">🏋️ <span className="text-[#4fc3f7]">Gym</span>Analyzer</h1>
        <p className="text-sm text-[#9aa0b0] mt-1">Snap a photo — get instant exercise instructions &amp; demo videos</p>
      </header>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[9999] bg-[rgba(15,17,23,0.92)] backdrop-blur-sm flex flex-col items-center justify-center gap-5 animate-[fadeIn_.25s_ease]">
          <div className="w-14 h-14 border-4 border-[rgba(79,195,247,0.15)] border-t-[#4fc3f7] rounded-full animate-spin" />
          <div className="text-base font-semibold">🔍 Analyzing your image...</div>
          <div className="text-sm text-[#9aa0b0] -mt-2 max-w-[300px] text-center">
            Cloud AI is identifying every piece of equipment
          </div>
          <div className="flex flex-col gap-1.5 mt-0.5">
            {["Sending image to AI vision model", "Identifying equipment in photo", "Fetching exercise instructions & videos", "Building your results..."].map((text, i) => (
              <span key={i} className={`text-xs text-[#9aa0b0] transition-all duration-300 flex items-center gap-2 ${loadingStep === i + 1 ? "opacity-100 text-white" : loadingStep > i + 1 ? "opacity-60" : "opacity-40"}`}>
                {loadingStep > i + 1 ? "✅" : loadingStep === i + 1 ? "🔍" : "○"} {text}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Container */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">

        {/* Toggle */}
        <div className="flex gap-2 my-5">
          <button onClick={() => { setMode("upload"); stopCamera(); }}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium border transition-all ${mode === "upload" ? "bg-[#4fc3f7] text-black border-[#4fc3f7]" : "bg-[#1a1d2e] text-[#e8eaed] border-white/10 hover:bg-[#242840]"}`}>
            📁 Upload Photo
          </button>
          <button onClick={() => { setMode("camera"); resetAll(); setTimeout(startCamera, 100); }}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium border transition-all ${mode === "camera" ? "bg-[#4fc3f7] text-black border-[#4fc3f7]" : "bg-[#1a1d2e] text-[#e8eaed] border-white/10 hover:bg-[#242840]"}`}>
            📸 Use Camera
          </button>
        </div>

        {/* Upload Zone */}
        {mode === "upload" && (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            className={`bg-[#1a1d2e] border-2 border-dashed ${imageData ? "border-[#242840] border-solid" : "border-[rgba(79,195,247,0.3)]"} rounded-xl text-center cursor-pointer transition-all overflow-hidden relative ${imageData ? "p-2" : "py-16 px-5"}`}
          >
            {!imageData ? (
              <>
                <div className="text-5xl mb-3 opacity-60">📷</div>
                <div className="text-base text-[#9aa0b0]">Tap to take or upload a photo</div>
                <div className="text-xs text-[#9aa0b0] mt-1 opacity-60">of any gym equipment</div>
              </>
            ) : (
              <>
                <img ref={previewRef} src={imageData} alt="Preview" className="w-full max-h-[400px] object-contain rounded-xl" />
                <button onClick={(e) => { e.stopPropagation(); resetAll(); }}
                  className="absolute top-4 right-4 w-9 h-9 bg-black/60 backdrop-blur-md text-white rounded-full flex items-center justify-center text-lg cursor-pointer hover:bg-black/80 transition">
                  ✕
                </button>
              </>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
          </div>
        )}

        {/* Camera */}
        {mode === "camera" && (
          <div className="bg-[#1a1d2e] rounded-xl overflow-hidden mb-4">
            <video ref={videoRef} autoPlay playsInline className="w-full max-h-[500px] object-contain bg-black" />
            <div className="flex gap-2 p-3 justify-center bg-[#242840]">
              <button onClick={switchCamera} className="py-2.5 px-6 rounded-xl text-sm font-semibold bg-[#1a1d2e] text-[#e8eaed] border border-white/10 cursor-pointer transition hover:bg-[#242840]">🔄 Flip</button>
              <button onClick={captureFrame} className="py-2.5 px-6 rounded-xl text-sm font-semibold bg-[#4fc3f7] text-black cursor-pointer transition hover:opacity-85">📸 Capture</button>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />

        {/* Analyze Button */}
        <div className="mb-5">
          <button onClick={analyze} disabled={!imageData || loading}
            className={`w-full max-w-[500px] block mx-auto py-4 px-6 rounded-xl text-base font-bold transition-all ${
              !imageData || loading
                ? "bg-[#1a1d2e] text-[#9aa0b0] opacity-40 cursor-not-allowed shadow-none"
                : "bg-gradient-to-r from-[#4fc3f7] to-[#29b6f6] text-black cursor-pointer shadow-[0_4px_20px_rgba(79,195,247,0.25)] hover:shadow-[0_6px_28px_rgba(79,195,247,0.35)] hover:-translate-y-px"
            }`}>
            🔍 Analyze Equipment
          </button>
        </div>

        {/* Empty State */}
        {!imageData && !results && !error && (
          <div className="text-center text-[#9aa0b0] py-16 leading-relaxed">
            <div className="text-4xl mb-3">🤔</div>
            <p>Take or upload a photo of gym equipment — dumbbells, barbells,<br/>machines, benches, or anything in the gym.</p>
            <p className="text-xs mt-3 opacity-50">The AI will identify it and show you how to use it properly with demo videos.</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="max-w-[600px] mx-auto bg-[rgba(239,83,80,0.08)] border border-[rgba(239,83,80,0.2)] rounded-xl p-4 text-center text-[#ef5350] text-sm mb-4">
            ⚠️ {error}
          </div>
        )}

        {/* Results */}
        {results && (
          <div ref={resultsRef}>
            {visionDesc && (
              <div className="text-xs text-[#9aa0b0] bg-[#242840] rounded-xl p-3 mb-4 leading-relaxed">
                <strong className="text-[#e8eaed]">AI sees:</strong> {visionDesc}
              </div>
            )}
            {equipmentCount > 1 && (
              <div className="inline-block bg-gradient-to-r from-[rgba(79,195,247,0.2)] to-[rgba(79,195,247,0.05)] border border-[rgba(79,195,247,0.3)] text-[#4fc3f7] text-sm font-semibold px-3.5 py-1.5 rounded-full mb-4">
                🔍 {equipmentCount} equipment detected
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {results.map((item, idx) => (
                <EquipmentCard key={item.key + idx} item={item} />
              ))}
            </div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}

// ─── Equipment Card Component ───

function EquipmentCard({ item }: { item: EquipmentResult }) {
  const an = item.analysis || {};
  const exercises = an.exercises || [];
  const difficulty = an.difficulty || "";
  const safetyWarnings = an.safety_warnings || [];

  const badgeColors: Record<string, string> = {
    free_weight: "bg-[#e3f2fd] text-[#1565c0]",
    machine: "bg-[#f3e5f5] text-[#7b1fa2]",
    cardio: "bg-[#e8f5e9] text-[#2e7d32]",
    cable: "bg-[#fff3e0] text-[#e65100]",
    bodyweight: "bg-[#fce4ec] text-[#c62828]",
  };

  return (
    <div className="bg-[#1a1d2e] rounded-xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      <div className="text-xl font-bold mb-1">
        {item.name}
        <span className={`inline-block text-[0.65rem] font-semibold px-2.5 py-0.5 rounded-full align-middle ml-2 uppercase tracking-wider ${badgeColors[item.category] || "bg-[#eceff1] text-[#546e7a]"}`}>
          {item.category.replace("_", " ")}
        </span>
      </div>
      {difficulty && <div className="text-xs text-[#9aa0b0] mb-2.5">{difficulty}</div>}

      {an.primary_muscles?.length ? (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {an.primary_muscles.map((m, i) => (
            <span key={i} className="text-xs bg-[rgba(102,187,106,0.12)] text-[#66bb6a] border border-[rgba(102,187,106,0.2)] px-2.5 py-1 rounded-full">💪 {m}</span>
          ))}
        </div>
      ) : null}

      {exercises.length ? (
        <>
          <hr className="border-none border-t border-white/5 my-3" />
          <div className="text-xs text-[#9aa0b0] font-semibold mb-2.5">🏋️ EXERCISES ({exercises.length})</div>
          {exercises.map((ex, i) => (
            <ExerciseCard key={i} exercise={ex} />
          ))}
        </>
      ) : null}

      {safetyWarnings.length ? (
        <div className="bg-[rgba(255,167,38,0.06)] border border-[rgba(255,167,38,0.2)] rounded-xl p-3.5 mt-3">
          <h4 className="text-sm text-[#ffa726] mb-1.5">⚠️ Safety Warnings</h4>
          <ul className="text-xs text-[#9aa0b0] space-y-0.5">
            {safetyWarnings.map((w, i) => (
              <li key={i} className="pl-5 relative before:content-['⚠'] before:absolute before:left-0">{w}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

// ─── Exercise Card Component ───

function ExerciseCard({ exercise }: { exercise: Exercise }) {
  return (
    <div className="bg-[#242840] rounded-xl p-4 mb-3 border-l-3 border-l-[#4fc3f7] last:mb-0">
      <h3 className="text-base text-[#4fc3f7] mb-2.5 font-medium">{exercise.name}</h3>

      {exercise.video_id && (
        <div className="relative w-full pb-[56.25%] mb-3 rounded-lg overflow-hidden bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${exercise.video_id}?rel=0&modestbranding=1`}
            title={exercise.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="absolute top-0 left-0 w-full h-full border-0"
          />
        </div>
      )}

      {exercise.muscles_worked?.length ? (
        <>
          <div className="text-[0.7rem] text-[#9aa0b0] uppercase tracking-wider opacity-60 mt-2 mb-1">Muscles Targeted</div>
          <div className="flex flex-wrap gap-1 mb-2">
            {exercise.muscles_worked.map((m, i) => (
              <span key={i} className="text-xs bg-[rgba(102,187,106,0.12)] text-[#66bb6a] border border-[rgba(102,187,106,0.2)] px-2 py-0.5 rounded-full">💪 {m}</span>
            ))}
          </div>
        </>
      ) : null}

      {exercise.steps?.length ? (
        <>
          <div className="text-[0.7rem] text-[#9aa0b0] uppercase tracking-wider opacity-60 mt-2 mb-1">How To Do It</div>
            <ol className="list-none m-0 p-0" style={{counterReset: "step-counter"}}>
              {exercise.steps.map((s, i) => (
                <li key={i} className="text-xs text-[#9aa0b0] leading-relaxed pl-8 py-1 relative before:content-[counter(step-counter)] before:counter-increment:step-counter before:absolute before:left-0 before:top-[3px] before:w-[22px] before:h-[22px] before:rounded-full before:bg-[#4fc3f7] before:text-black before:text-[0.7rem] before:font-bold before:flex before:items-center before:justify-center">{s}</li>
              ))}
          </ol>
        </>
      ) : null}

      {exercise.common_mistakes?.length ? (
        <>
          <div className="text-[0.7rem] text-[#9aa0b0] uppercase tracking-wider opacity-60 mt-2 mb-1">❌ Common Mistakes</div>
          <div className="flex flex-wrap gap-1 mb-1">
            {exercise.common_mistakes.map((m, i) => (
              <span key={i} className="text-xs bg-[rgba(239,83,80,0.1)] text-[#ef5350] border border-[rgba(239,83,80,0.2)] px-2 py-0.5 rounded-full">{m}</span>
            ))}
          </div>
        </>
      ) : null}

      {exercise.safety_tips?.length ? (
        <>
          <div className="text-[0.7rem] text-[#9aa0b0] uppercase tracking-wider opacity-60 mt-2 mb-1">✅ Safety Tips</div>
          <div className="flex flex-wrap gap-1">
            {exercise.safety_tips.map((t, i) => (
              <span key={i} className="text-xs bg-[rgba(255,167,38,0.1)] text-[#ffa726] border border-[rgba(255,167,38,0.2)] px-2 py-0.5 rounded-full">{t}</span>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
