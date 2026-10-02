let notes = [
    { id: 1, text: "Buy milk and bread", category: "personal" },
    { id: 2, text: "Finish the Day 3 assignment", category: "study" },
    { id: 3, text: "Email the project report to Grace", category: "work" },
    { id: 4, text: "Revise JavaScript arrays", category: "study" },
    { id: 5, text: "Call mum", category: "personal" },
];

// 1. Search notes
function searchNotes(word) {
    return notes.filter(note =>
        note.text.toLowerCase().includes(word.toLowerCase())
    );
}

console.log(searchNotes("javascript")); // Expected: [{ id: 4, text: "Revise JavaScript arrays", category: "study" }]
console.log(searchNotes("python")); // Expected: []


// 2. Find the longest note
function longestNote() {
    if (notes.length === 0) {
        return null;
    }

    let longest = notes[0];

    for (let i = 1; i < notes.length; i++) {
        if (notes[i].text.length > longest.text.length) {
            longest = notes[i];
        }
    }

    return longest;
}

console.log(longestNote()); // Expected: { id: 2, text: "Finish the Day 3 assignment", category: "study" }

let originalNotes = notes;
notes = [];
console.log(longestNote()); // Expected: null
notes = originalNotes;


// 3. Count notes by category
function countByCategory() {
    let counts = {};

    for (let note of notes) {
        if (counts[note.category]) {
            counts[note.category]++;
        } else {
            counts[note.category] = 1;
        }
    }

    return counts;
}

console.log(countByCategory()); // Expected: { personal: 2, study: 2, work: 1 }

notes = [];
console.log(countByCategory()); // Expected: {}
notes = originalNotes;


// 4. Get summary
function getSummary() {
    let counts = countByCategory();
    let total = notes.length;

    let noteWord = total === 1 ? "note" : "notes";

    return `${total} ${noteWord}: ${counts.personal || 0} personal, ${counts.work || 0} work, ${counts.study || 0} study.`;
}

console.log(getSummary()); // Expected: "5 notes: 2 personal, 1 work, 2 study."

notes = [originalNotes[0]];
console.log(getSummary()); // Expected: "1 note: 1 personal, 0 work, 0 study."
notes = originalNotes;


// 5. Check for duplicate notes
function isDuplicate(text) {
    let normalizedText = text.trim().toLowerCase();

    return notes.some(note =>
        note.text.trim().toLowerCase() === normalizedText
    );
}

console.log(isDuplicate("  BUY MILK AND BREAD  ")); // Expected: true
console.log(isDuplicate("Buy eggs")); // Expected: false


// 6. Add a new note
function addNote(text, category) {
    if (text.length < 1 || text.length > 200) {
        console.log("Note must be between 1 and 200 characters.");
        return false;
    }

    if (isDuplicate(text)) {
        console.log("Note is a duplicate.");
        return false;
    }

    if (!["personal", "work", "study"].includes(category)) {
        console.log("Invalid category.");
        return false;
    }

    let newId = notes.length > 0
        ? Math.max(...notes.map(note => note.id)) + 1
        : 1;

    notes.push({
        id: newId,
        text: text,
        category: category
    });

    return true;
}

console.log(addNote("Read TypeScript documentation", "study")); // Expected: true
console.log(addNote("Buy milk and bread", "personal")); // Expected: false, logs duplicate reason