import { EXERCISE_DB, type EquipmentEntry, type Exercise } from "./exercises";
import * as fs from "fs/promises";

const OLLAMA_CLOUD_KEY = process.env.OLLAMA_API_KEY || "";
const CLOUD_VISION_MODEL = "gemma3:12b";

const EXERCISE_VIDEOS: Record<string, string> = {};
for (const eq of Object.values(EXERCISE_DB)) {
  for (const ex of eq.common_exercises) {
    EXERCISE_VIDEOS[ex.name] = ex.video_id;
  }
}

function enrichExercisesWithVideos(exercises: Exercise[]): Exercise[] {
  if (!exercises.length) return exercises;
  const KEY_MOVES: Record<string, string> = {
    pull:"Pull-Up", row:"Dumbbell Row", curl:"Dumbbell Bicep Curl", press:"Dumbbell Shoulder Press",
    fly:"Cable Chest Fly", swing:"Kettlebell Swing", squat:"Barbell Squat", deadlift:"Barbell Deadlift",
    plank:"Plank", push:"Push-Up", chin:"Chin-Up", cycle:"Stationary Cycling", bike:"Stationary Cycling",
    treadmill:"Treadmill Walking/Running", elliptical:"Elliptical Training", "leg press":"Leg Press",
    tricep:"Cable Tricep Pushdown", bicep:"Dumbbell Bicep Curl", band:"Band Rows", "chest fly":"Cable Chest Fly",
    "cable row":"Band Rows", "lat pulldown":"Pull-Up", "shoulder press":"Dumbbell Shoulder Press",
    "bicep curl":"Dumbbell Bicep Curl", "tricep pushdown":"Cable Tricep Pushdown",
    "lateral raise":"Dumbbell Shoulder Press", "leg extension":"Leg Press", "leg curl":"Leg Press",
    "bent over row":"Dumbbell Row", "seated row":"Band Rows", "chest press":"Bench Press",
    "indoor row":"Indoor Rowing", rowing:"Indoor Rowing"
  };
  for (const ex of exercises) {
    if (ex.video_id) continue;
    const n = ex.name.trim();
    const nl = n.toLowerCase();
    if (n in EXERCISE_VIDEOS) { ex.video_id = EXERCISE_VIDEOS[n]; continue; }
    let matched = false;
    for (const [phrase, target] of Object.entries(KEY_MOVES).sort((a, b) => b[0].split(" ").length - a[0].split(" ").length)) {
      if (nl.includes(phrase) && target in EXERCISE_VIDEOS) { ex.video_id = EXERCISE_VIDEOS[target]; matched = true; break; }
    }
    if (matched) continue;
    for (const [kn, vid] of Object.entries(EXERCISE_VIDEOS)) {
      if (nl.includes(kn.toLowerCase()) || kn.toLowerCase().includes(nl)) { ex.video_id = vid; break; }
    }
  }
  return exercises;
}

async function callCloudVision(imagePath: string, prompt: string): Promise<string> {
  if (!OLLAMA_CLOUD_KEY) return "";
  try {
    const buffer = await fs.readFile(imagePath);
    const b64 = buffer.toString("base64");
    const resp = await fetch("https://ollama.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OLLAMA_CLOUD_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: CLOUD_VISION_MODEL,
        max_tokens: 300,
        messages: [{
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${b64}` } }
          ]
        }]
      }),
      signal: AbortSignal.timeout(60_000),
    });
    if (resp.ok) {
      const data = await resp.json();
      return data.choices?.[0]?.message?.content || "";
    }
  } catch {}
  return "";
}

function findEquipmentKeywords(description: string): string[] {
  const keywords: Record<string, string[]> = {
    dumbbell: ["dumbbell","dumbbells","dumbell","dumbbell set","free weight"],
    barbell: ["barbell","bar bell","olympic bar","ez bar","barbell setup","barbell rack"],
    kettlebell: ["kettlebell","kettle bell","kettle bells"],
    "resistance band": ["resistance band","exercise band","resistance tube"],
    bench: ["bench","weight bench","flat bench","adjustable bench","bench press bench"],
    "cable machine": ["cable","cable machine","pulley","crossover","cable crossover","weight stack"],
    "smith machine": ["smith machine","smith"],
    "leg press machine": ["leg press","leg-press"],
    "weight machine": ["weight machine","multi-gym","multi gym","home gym","weight stack machine","selectorized","plate loaded","squat rack","functional trainer","power rack"],
    "rowing machine": ["rowing machine","rower","ergometer","erg","indoor rower","rowing erg"],
    "pull up bar": ["pull up bar","pull-up bar","chin up bar","chin-up bar","pullup bar"],
    "yoga mat": ["yoga mat","exercise mat","fitness mat","yoga"],
    "exercise bike": ["bike","stationary bike","exercise bike","stationary cycle","spin bike","cycle"],
    treadmill: ["treadmill","tread mill","running machine","walking machine"],
    elliptical: ["elliptical","cross trainer","elliptical trainer"],
  };
  const dl = description.toLowerCase();
  const matched: Record<string, number> = {};
  for (const [equip, words] of Object.entries(keywords)) {
    for (const w of words) {
      if (dl.includes(w)) { matched[equip] = (matched[equip] || 0) + 1; break; }
    }
  }
  return Object.keys(matched).sort((a, b) => (matched[b] - matched[a]) || a.localeCompare(b));
}

function buildEquipmentResult(key: string, entry: EquipmentEntry) {
  const exercises = entry.common_exercises.map(ex => ({ ...ex }));
  enrichExercisesWithVideos(exercises);
  return {
    key,
    name: entry.name,
    category: entry.category,
    analysis: {
      equipment_name: entry.name,
      category: entry.category,
      difficulty: "Beginner to Intermediate",
      primary_muscles: entry.primary_muscles,
      exercises,
      safety_warnings: [
        "Always warm up before using this equipment",
        "Start with light weight to practice form",
        "Consult a trainer if unsure about technique"
      ]
    }
  };
}

export interface AnalysisResult {
  vision_description: string;
  matched_equipment: string[];
  results: ReturnType<typeof buildEquipmentResult>[];
  equipment_count: number;
}

export async function analyzeImage(imagePath: string): Promise<AnalysisResult> {
  const prompts = [
    "List EVERY piece of gym equipment you can see in this image. Name each one. Be specific and thorough. Look for: dumbbells, barbells, benches, machines, cables, kettlebells, bands, bikes, treadmills, pull-up bars, rowing machines, mats, weight stacks.",
    "What gym equipment is visible? Identify all equipment items one by one.",
    "Describe this scene. What fitness equipment do you see? List all machines, weights, benches, and accessories."
  ];

  const descriptions: string[] = [];
  for (const prompt of prompts) {
    const desc = await callCloudVision(imagePath, prompt);
    if (desc && desc.length > 10) descriptions.push(desc);
  }

  const fullDescription = descriptions.length ? descriptions.join(" ") : "Gym scene with various fitness equipment";

  const allMatched = new Set<string>();
  for (const desc of descriptions) {
    for (const k of findEquipmentKeywords(desc)) allMatched.add(k);
  }
  const matchedKeys = allMatched.size ? [...allMatched].sort() : findEquipmentKeywords(fullDescription);

  const results: ReturnType<typeof buildEquipmentResult>[] = [];
  const processed = new Set<string>();
  for (const key of matchedKeys) {
    if (!(key in EXERCISE_DB) || processed.has(key)) continue;
    processed.add(key);
    results.push(buildEquipmentResult(key, EXERCISE_DB[key]));
  }

  if (results.length <= 2 && descriptions.length <= 2) {
    const retryPrompt = "Look again carefully. Besides what you already mentioned, what OTHER gym equipment can you see? Look for: weight bench, barbells, dumbbells, cable machine, kettlebells, pull-up bar, treadmill, exercise bike, mats, bands, rowing machine, smith machine, leg press, multi-gym.";
    const retry = await callCloudVision(imagePath, retryPrompt);
    if (retry && retry.length > 10) {
      for (const key of findEquipmentKeywords(retry)) {
        if (key in EXERCISE_DB && !processed.has(key)) {
          processed.add(key);
          results.push(buildEquipmentResult(key, EXERCISE_DB[key]));
          descriptions.push(retry);
        }
      }
    }
  }

  return {
    vision_description: fullDescription.slice(0, 600),
    matched_equipment: [...processed],
    results,
    equipment_count: results.length,
  };
}
