export interface Exercise {
  name: string;
  video_id: string;
  muscles_worked: string[];
  steps: string[];
  common_mistakes: string[];
  safety_tips: string[];
}

export interface EquipmentEntry {
  name: string;
  category: string;
  primary_muscles: string[];
  common_exercises: Exercise[];
}

export const EXERCISE_DB: Record<string, EquipmentEntry> = {
  dumbbell: { name: "Dumbbell", category: "free_weight",
    primary_muscles: ["Biceps", "Triceps", "Shoulders", "Chest", "Back"],
    common_exercises: [
      { name:"Dumbbell Bicep Curl", video_id:"20ibpB635Rw", muscles_worked:["Biceps Brachii","Brachialis","Forearm Flexors"],
        steps:["Stand upright holding a dumbbell in each hand, palms facing forward.","Keep elbows close to your torso, upper arms stationary.","Curl the weights up while contracting your biceps.","Continue until dumbbells are at shoulder level.","Slowly lower back to the starting position."],
        common_mistakes:["Swinging weights with momentum","Moving elbows forward"], safety_tips:["Use controlled motion, not momentum","Don't arch your back"] },
      { name:"Dumbbell Shoulder Press", video_id:"xtsbSAgNBpI", muscles_worked:["Anterior Deltoid","Lateral Deltoid","Triceps"],
        steps:["Sit on a bench with back support, dumbbells at shoulder height.","Palms face forward, elbows bent at 90 degrees.","Press dumbbells upward until arms are extended.","Pause at the top, then lower back to shoulder height."],
        common_mistakes:["Flaring elbows too wide","Leaning back excessively"], safety_tips:["Keep your core braced","Don't lock elbows at the top"] },
      { name:"Dumbbell Chest Press", video_id:"z6A4W5Dib28", muscles_worked:["Pectoralis Major","Anterior Deltoid","Triceps"],
        steps:["Lie on a flat bench with a dumbbell in each hand at chest level.","Press the dumbbells upward until arms are extended.","Lower slowly until elbows are below the bench line."],
        common_mistakes:["Bouncing dumbbells off the chest","Uneven pressing"], safety_tips:["Use a spotter for heavy weights","Control the descent"] },
      { name:"Dumbbell Row", video_id:"OL8yGrkXyiQ", muscles_worked:["Latissimus Dorsi","Rhomboids","Trapezius","Biceps"],
        steps:["Place one knee and hand on a bench for support.","Hold a dumbbell in the other hand, arm extended.","Pull the dumbbell toward your hip, squeezing your back.","Lower with control."],
        common_mistakes:["Rotating the torso","Using too much arm"], safety_tips:["Keep your back flat","Don't jerk the weight"] }] },
  barbell: { name:"Barbell", category:"free_weight",
    primary_muscles:["Chest","Back","Legs (Quadriceps, Hamstrings, Glutes)","Shoulders"],
    common_exercises:[
      { name:"Barbell Bench Press", video_id:"0cXAp6WhSj4", muscles_worked:["Pectoralis Major","Anterior Deltoid","Triceps Brachii"],
        steps:["Lie flat, feet planted, grip bar slightly wider than shoulder-width.","Unrack and hold directly above shoulders.","Lower to mid-chest with elbows at ~75 degrees.","Press back up explosively.","Lock out elbows without overextending."],
        common_mistakes:["Bouncing bar off chest","Uneven grip"], safety_tips:["Always use a spotter","Keep wrists straight"] },
      { name:"Barbell Squat", video_id:"iZTxa8NJH2g", muscles_worked:["Quadriceps","Hamstrings","Gluteus Maximus","Erector Spinae"],
        steps:["Position bar on upper back, grip evenly.","Unrack, step back feet shoulder-width, toes slightly out.","Brace core, push hips back, bend knees to lower.","Descend until thighs parallel or deeper.","Drive through heels to stand up."],
        common_mistakes:["Knees caving inward","Rounding lower back"], safety_tips:["Use a squat rack with safety bars","Keep chest up"] },
      { name:"Barbell Deadlift", video_id:"8np3vKDBJfc", muscles_worked:["Erector Spinae","Glutes","Hamstrings","Traps","Forearms"],
        steps:["Stand feet hip-width, bar over mid-foot.","Hinge at hips, grip bar just outside shins.","Flatten back, brace core, chest up.","Drive through heels, keep bar close to body.","Stand tall, then control bar back down."],
        common_mistakes:["Rounding lower back","Jerking bar off floor"], safety_tips:["Use mixed grip for heavy weight","Form first — never ego lift"] }] },
  kettlebell: { name:"Kettlebell", category:"free_weight",
    primary_muscles:["Glutes","Hamstrings","Core","Shoulders","Back"],
    common_exercises:[
      { name:"Kettlebell Swing", video_id:"gAJMf7Nv4N0", muscles_worked:["Glutes","Hamstrings","Erector Spinae","Core","Deltoids"],
        steps:["Stand with feet wider than shoulder-width, kettlebell on floor.","Hinge at hips, back flat, grip handle with both hands.","Hike kettlebell between legs like a football snap.","Explosively drive hips forward to swing bell to chest height.","Let bell drop back, hinging for the next rep."],
        common_mistakes:["Squatting instead of hip-hinging","Using arms to lift"], safety_tips:["Power comes from hips, not shoulders","Keep wrists straight"] }] },
  "resistance band": { name:"Resistance Band", category:"free_weight",
    primary_muscles:["Shoulders","Arms","Back","Glutes","Core"],
    common_exercises:[
      { name:"Band Rows", video_id:"LSkyinhmA8k", muscles_worked:["Rhomboids","Latissimus Dorsi","Biceps"],
        steps:["Anchor band at chest height or step on it.","Grip band, pull toward torso, squeeze shoulder blades.","Slowly release with control."],
        common_mistakes:["Using momentum","Not fully extending"], safety_tips:["Check band for tears before use","Don't overstretch beyond 3x resting length"] }] },
  bench: { name:"Weight Bench", category:"free_weight",
    primary_muscles:["Chest","Shoulders","Core","Back"],
    common_exercises:[
      { name:"Bench Press", video_id:"0cXAp6WhSj4", muscles_worked:["Pectoralis Major","Anterior Deltoid","Triceps"],
        steps:["Lie back on bench, feet flat on floor.","Grip weight(s) at chest level.","Press up until arms extended.","Lower with control to chest level."],
        common_mistakes:["Wrong bench angle for target muscle","Bouncing"], safety_tips:["Use a spotter for heavy loads","Adjust bench angle for incline/decline"] },
      { name:"Dumbbell Row", video_id:"OL8yGrkXyiQ", muscles_worked:["Latissimus Dorsi","Rhomboids","Trapezius","Biceps"],
        steps:["Place one knee and hand on bench.","Hold dumbbell, arm extended.","Pull toward hip, squeezing back.","Lower with control."],
        common_mistakes:["Rotating torso","Using too much arm"], safety_tips:["Keep back flat","Don't jerk the weight"] }] },
  "cable machine": { name:"Cable Machine", category:"cable",
    primary_muscles:["Chest","Back","Shoulders","Arms","Core"],
    common_exercises:[
      { name:"Cable Chest Fly", video_id:"I-Ue34qLxc4", muscles_worked:["Pectoralis Major","Anterior Deltoid"],
        steps:["Set pulleys to chest height, grab handles.","Stand centered between pulleys, step forward slightly.","With slight bend in elbows, bring hands together.","Slowly open arms back."],
        common_mistakes:["Too much weight compromising form","Bending elbows too much"], safety_tips:["Start light to feel the movement","Control the eccentric phase"] },
      { name:"Cable Tricep Pushdown", video_id:"1FjkhpZsaxc", muscles_worked:["Triceps Brachii"],
        steps:["Attach bar/rope to high pulley.","Grip at shoulder width, elbows pinned to sides.","Push bar down until arms extended.","Slowly return to 90 degrees."],
        common_mistakes:["Elbows flaring outward","Using body momentum"], safety_tips:["Keep torso still","Don't let weight stack touch between reps"] }] },
  "smith machine": { name:"Smith Machine", category:"machine",
    primary_muscles:["Chest","Shoulders","Legs (Quadriceps, Glutes)"],
    common_exercises:[
      { name:"Smith Machine Squat", video_id:"iKCJCydYYrE", muscles_worked:["Quadriceps","Glutes","Hamstrings"],
        steps:["Position bar on traps, grip wide.","Unrack by rotating bar, step forward.","Squat keeping torso upright, knees tracking toes.","Drive through heels to stand.","Rerack by rotating bar back."],
        common_mistakes:["Bar too low on back (neck pressure)","Knees past toes excessively"], safety_tips:["Check safety stops","Control is still on you despite guided track"] }] },
  "leg press machine": { name:"Leg Press Machine", category:"machine",
    primary_muscles:["Quadriceps","Hamstrings","Glutes","Calves"],
    common_exercises:[
      { name:"Leg Press", video_id:"nDh_BlnLCGc", muscles_worked:["Quadriceps","Gluteus Maximus","Hamstrings","Gastrocnemius"],
        steps:["Sit with back and head flat against pad.","Place feet shoulder-width on platform, toes slightly out.","Grip side handles, release safety levers.","Lower platform until knees at ~90 degrees.","Drive through heels to push back up without locking knees."],
        common_mistakes:["Going too deep (butt lifting off seat)","Locking knees at top"], safety_tips:["Never fully lock knees","Keep butt planted on seat"] }] },
  "weight machine": { name:"Weight Machine / Multi-Gym", category:"machine",
    primary_muscles:["Chest","Back","Shoulders","Arms","Legs (full body)"],
    common_exercises:[
      { name:"Lat Pulldown", video_id:"OEXosPwzFdc", muscles_worked:["Latissimus Dorsi","Biceps Brachii","Rhomboids"],
        steps:["Sit facing machine, adjust thigh pad.","Grip bar wider than shoulder-width, palms away.","Pull bar down to upper chest, squeezing shoulder blades.","Slowly return to starting position."],
        common_mistakes:["Using momentum to swing","Pulling bar behind neck"], safety_tips:["Keep chest up and back straight","Don't lean back excessively"] },
      { name:"Seated Cable Row", video_id:"LSkyinhmA8k", muscles_worked:["Rhomboids","Latissimus Dorsi","Biceps","Rear Deltoids"],
        steps:["Sit on bench, feet on platform, knees slightly bent.","Grip handle with arms extended.","Pull toward torso, squeezing shoulder blades.","Slowly extend arms back."],
        common_mistakes:["Rounding lower back","Using arm strength instead of back"], safety_tips:["Keep back straight","Control the eccentric phase"] },
      { name:"Chest Press Machine", video_id:"0cXAp6WhSj4", muscles_worked:["Pectoralis Major","Anterior Deltoid","Triceps"],
        steps:["Adjust seat so handles at mid-chest level.","Grip handles and press forward until arms extended.","Slowly return."],
        common_mistakes:["Too much weight compromising form","Not full range of motion"], safety_tips:["Keep back flat against pad","Exhale on press, inhale on return"] }] },
  "rowing machine": { name:"Rowing Machine", category:"cardio",
    primary_muscles:["Back (Lats, Rhomboids)","Legs (Quadriceps, Hamstrings)","Core","Arms"],
    common_exercises:[
      { name:"Indoor Rowing", video_id:"OL8yGrkXyiQ", muscles_worked:["Latissimus Dorsi","Rhomboids","Quadriceps","Hamstrings","Core","Biceps"],
        steps:["Sit on seat, strap feet in, grip handle.","Start with knees bent, arms extended (catch position).","Drive through legs first, lean back, pull handle to lower ribs.","Extend arms first, lean forward, bend knees to slide back.","Repeat: legs → body → arms, arms → body → legs."],
        common_mistakes:["Bending arms too early","Rounding lower back"], safety_tips:["60% legs, 20% core, 20% arms","Keep straight back, engage core"] }] },
  "pull up bar": { name:"Pull-Up Bar", category:"bodyweight",
    primary_muscles:["Back (Lats)","Biceps","Shoulders","Core"],
    common_exercises:[
      { name:"Pull-Up", video_id:"OEXosPwzFdc", muscles_worked:["Latissimus Dorsi","Biceps Brachii","Rhomboids","Traps"],
        steps:["Grip bar palms away, slightly wider than shoulder-width.","Hang with arms extended, engage core.","Pull up until chin clears bar.","Lower with control to full hang."],
        common_mistakes:["Excessive kipping","Not going to full extension"], safety_tips:["Control the negative phase","Use a spotter band if needed"] },
      { name:"Chin-Up", video_id:"Ln3gAdHr8MM", muscles_worked:["Biceps Brachii","Latissimus Dorsi","Brachoradialis"],
        steps:["Grip bar palms toward you, shoulder-width.","Hang fully, pull up until chin clears bar.","Lower with control to full extension."],
        common_mistakes:["Using momentum","Partial reps"], safety_tips:["Breathe out on the way up","Keep legs still"] }] },
  "yoga mat": { name:"Yoga Mat / Exercise Mat", category:"bodyweight",
    primary_muscles:["Core","Legs","Glutes","Arms (full body)"],
    common_exercises:[
      { name:"Plank", video_id:"pvIjsG5Svck", muscles_worked:["Rectus Abdominis","Transverse Abdominis","Shoulders","Glutes"],
        steps:["Start on hands and knees, hands under shoulders.","Step feet back into straight line head to heels.","Engage core, glutes, keep back flat.","Hold position, breathe steadily."],
        common_mistakes:["Hips sagging or piking up","Holding breath"], safety_tips:["Look at floor, not forward","Start with 20-30 second holds"] },
      { name:"Push-Up", video_id:"I9fsqKE5XHo", muscles_worked:["Pectoralis Major","Triceps","Deltoids","Core"],
        steps:["Start in plank, hands wider than shoulders.","Lower body until chest nearly touches floor.","Keep elbows at ~45 degrees from body.","Push back up."],
        common_mistakes:["Flaring elbows to 90 degrees","Hips dropping"], safety_tips:["Keep body in straight line","Knee push-ups are valid progressions"] }] },
  treadmill: { name:"Treadmill", category:"cardio",
    primary_muscles:["Legs (Quadriceps, Hamstrings, Calves)","Glutes","Core stabilizers"],
    common_exercises:[
      { name:"Treadmill Walking/Running", video_id:"zeS4qu6bXy4", muscles_worked:["Quadriceps","Hamstrings","Gastrocnemius","Soleus","Glutes"],
        steps:["Step onto sides first, start belt at slow speed.","Begin walking to warm up, gradually increase speed.","Maintain upright posture, look forward.","Swing arms naturally, land mid-foot.","Cool down gradually before stepping off."],
        common_mistakes:["Holding handrails (reduced calorie burn)","Looking down at feet"], safety_tips:["Attach safety clip to clothing","Start slow, increase gradually"] }] },
  "exercise bike": { name:"Exercise Bike", category:"cardio",
    primary_muscles:["Quadriceps","Hamstrings","Calves","Glutes","Core"],
    common_exercises:[
      { name:"Stationary Cycling", video_id:"dieOsJlsvpM", muscles_worked:["Quadriceps","Hamstrings","Gastrocnemius","Soleus","Glutes"],
        steps:["Adjust seat so leg nearly extended at bottom of pedal stroke.","Position handlebars at comfortable reach.","Start pedaling at low resistance to warm up.","Maintain 70-90 RPM for steady-state cardio.","Stand occasionally for glute activation."],
        common_mistakes:["Seat too low (knee strain)","Resistance too high (knees grind)"], safety_tips:["Proper seat height prevents knee injury","Stay hydrated"] }] },
  elliptical: { name:"Elliptical Machine", category:"cardio",
    primary_muscles:["Quadriceps","Hamstrings","Glutes","Core","Arms"],
    common_exercises:[
      { name:"Elliptical Training", video_id:"EesEvYohy5o", muscles_worked:["Quadriceps","Hamstrings","Glutes","Upper body"],
        steps:["Step onto machine, grip handles.","Start pedaling smooth forward motion.","Increase resistance gradually.","Reverse motion for different muscle fibers.","Maintain upright posture, don't lean on console."],
        common_mistakes:["Leaning heavily on console","Staying at low resistance"], safety_tips:["Start with no resistance to warm up","Keep natural stride"] }] },
  "chest press machine": { name:"Chest Press Machine", category:"machine",
    primary_muscles:["Chest (Pectoralis Major)","Shoulders (Anterior Deltoid)","Triceps"],
    common_exercises:[
      { name:"Seated Chest Press", video_id:"0cXAp6WhSj4", muscles_worked:["Pectoralis Major","Anterior Deltoid","Triceps Brachii"],
        steps:["Adjust seat so handles are at mid-chest level.","Grip handles, keep back flat against pad.","Press forward until arms are extended but not locked.","Slowly return to starting position with control.","Breathe out on the press, in on the return."],
        common_mistakes:["Using shoulders too much instead of chest","Not going through full range of motion","Letting elbows flare out"], safety_tips:["Keep shoulder blades retracted and pinched","Don't bounce the weight","Start with lighter weight to learn the movement pattern"] }] },
  "leg extension machine": { name:"Leg Extension Machine", category:"machine",
    primary_muscles:["Quadriceps"],
    common_exercises:[
      { name:"Leg Extension", video_id:"nDh_BlnLCGc", muscles_worked:["Rectus Femoris","Vastus Lateralis","Vastus Medialis","Vastus Intermedius"],
        steps:["Sit with back against pad, adjust roller pad just above ankles.","Grip side handles for stability.","Extend legs until straight but not locked.","Pause at top squeezing quads.","Lower with control."],
        common_mistakes:["Kicking up too fast using momentum","Locking knees at top"], safety_tips:["Don't let the weight drop on the negative","Control the full range of motion"] }] },
  "leg curl machine": { name:"Leg Curl Machine", category:"machine",
    primary_muscles:["Hamstrings","Glutes","Calves"],
    common_exercises:[
      { name:"Seated Leg Curl", video_id:"nDh_BlnLCGc", muscles_worked:["Biceps Femoris","Semitendinosus","Semimembranosus","Gastrocnemius"],
        steps:["Sit with pad resting behind lower calves, above heels.","Keep thighs pressed against seat pad.","Curl legs by pulling heels toward glutes.","Pause at peak contraction.","Slowly lower back to start."],
        common_mistakes:["Using upper body momentum","Not curling full range"], safety_tips:["Don't let hips lift off seat","Control the eccentric (lowering) phase"] }] },
  "shoulder press machine": { name:"Shoulder Press Machine", category:"machine",
    primary_muscles:["Shoulders (Deltoids)","Triceps","Upper Chest"],
    common_exercises:[
      { name:"Seated Shoulder Press", video_id:"xtsbSAgNBpI", muscles_worked:["Anterior Deltoid","Lateral Deltoid","Triceps Brachii"],
        steps:["Adjust seat so handles are at shoulder height.","Grip handles, keep back flat against pad.","Press upward until arms are extended overhead.","Lower with control to shoulder height."],
        common_mistakes:["Leaning back too much","Not going to full extension"], safety_tips:["Keep core braced","Don't lock elbows at the top"] }] },
  "lat pulldown machine": { name:"Lat Pulldown Machine", category:"machine",
    primary_muscles:["Back (Latissimus Dorsi)","Biceps","Shoulders"],
    common_exercises:[
      { name:"Lat Pulldown", video_id:"OEXosPwzFdc", muscles_worked:["Latissimus Dorsi","Biceps Brachii","Rhomboids"],
        steps:["Sit facing machine, adjust thigh pad to secure legs.","Grip bar wider than shoulder-width, palms away.","Pull bar down to upper chest, squeezing shoulder blades.","Slowly return to start without letting weight stack touch."],
        common_mistakes:["Using momentum to swing","Pulling bar behind neck"], safety_tips:["Keep chest up and back straight","Don't lean back excessively"] }] }
};
