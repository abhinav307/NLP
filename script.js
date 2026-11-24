/**
 * Basic NLP Study Platform - Dynamic Conversion Pipeline & NLTK Simulator
 */

// Presets showing clear conversions
const PIPELINE_PRESETS = {
  repeat: "Cats like fish. Dogs like fish. Cats and dogs both love fish!",
  nlp: "Corpus is a whole paragraph. Each document inside is a single sentence. Sentences break into word tokens. All unique words build our vocabulary.",
  simple: "Natural language processing is amazing. Computers learn from words and sentences!"
};

// NLP Pipeline Parser
function processNLPPipeline(text) {
  if (!text || text.trim() === "") {
    return {
      corpus: "",
      documents: [],
      words: [],
      vocabulary: []
    };
  }

  const cleanText = text.trim();

  // Stage 1: Corpus (Paragraph)
  const corpus = cleanText;

  // Stage 2: Document (Sentences)
  const docMatches = cleanText.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g) || [];
  const documents = docMatches.map(d => d.trim()).filter(d => d.length > 0);

  // Stage 3: Word (Tokens)
  const tokenMatches = cleanText.match(/\b[A-Za-z0-9'-]+\b|[.,!?;:()]/g) || [];
  const words = tokenMatches;

  // Stage 4: Vocabulary (Unique Words deduplicated)
  const freqMap = new Map();
  words.forEach(tok => {
    // Standardize to lowercase for vocabulary set
    const key = tok.toLowerCase();
    freqMap.set(key, (freqMap.get(key) || 0) + 1);
  });

  const vocabulary = Array.from(freqMap.entries())
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => a.word.localeCompare(b.word));

  return {
    corpus,
    documents,
    words,
    vocabulary
  };
}

// Render the 4-Stage Conversion Pipeline
function updateConversionPipeline() {
  const inputEl = document.getElementById('pipeline-input');
  if (!inputEl) return;

  const text = inputEl.value;
  const data = processNLPPipeline(text);

  // --- STAGE 1: CORPUS (Paragraph) ---
  const corpusEl = document.getElementById('pipeline-corpus-output');
  const corpusCountEl = document.getElementById('pipeline-corpus-count');
  if (corpusEl) {
    if (data.corpus) {
      corpusEl.innerHTML = `
        <div class="corpus-paragraph-box">
          "${data.corpus}"
        </div>
      `;
      if (corpusCountEl) corpusCountEl.textContent = `1 Paragraph (${data.corpus.length} chars)`;
    } else {
      corpusEl.innerHTML = `<span style="color:#6b7280; font-style:italic;">Enter text above to see the Corpus paragraph</span>`;
      if (corpusCountEl) corpusCountEl.textContent = `0`;
    }
  }

  // --- STAGE 2: DOCUMENT (Sentence) ---
  const docEl = document.getElementById('pipeline-doc-output');
  const docCountEl = document.getElementById('pipeline-doc-count');
  if (docEl) {
    if (data.documents.length > 0) {
      docEl.innerHTML = `
        <div class="doc-list">
          ${data.documents.map((s, idx) => `
            <div class="doc-item">
              <span class="doc-tag">Document ${idx + 1}</span>
              <span>"${s}"</span>
            </div>
          `).join('')}
        </div>
      `;
      if (docCountEl) docCountEl.textContent = `${data.documents.length} Document${data.documents.length === 1 ? '' : 's'} (Sentences)`;
    } else {
      docEl.innerHTML = `<span style="color:#6b7280; font-style:italic;">No sentences detected</span>`;
      if (docCountEl) docCountEl.textContent = `0`;
    }
  }

  // --- STAGE 3: WORD (Token) -> COUNTED AS TOKENS ---
  const wordEl = document.getElementById('pipeline-word-output');
  const wordCountEl = document.getElementById('pipeline-word-count');
  if (wordEl) {
    if (data.words.length > 0) {
      wordEl.innerHTML = `
        <div class="token-list">
          ${data.words.map((w, idx) => `
            <span class="token-chip" title="Token #${idx}">
              <span class="token-index">#${idx}</span>
              <span>${w}</span>
            </span>
          `).join('')}
        </div>
      `;
      if (wordCountEl) {
        wordCountEl.textContent = `Total: ${data.words.length} Tokens`;
        wordCountEl.style.color = "var(--color-word)";
      }
    } else {
      wordEl.innerHTML = `<span style="color:#6b7280; font-style:italic;">No tokens generated</span>`;
      if (wordCountEl) wordCountEl.textContent = `0 Tokens`;
    }
  }

  // --- STAGE 4: VOCABULARY (Unique Word) -> COUNTED AS VOCABULARY ---
  const vocabEl = document.getElementById('pipeline-vocab-output');
  const vocabCountEl = document.getElementById('pipeline-vocab-count');
  if (vocabEl) {
    if (data.vocabulary.length > 0) {
      vocabEl.innerHTML = `
        <div class="vocab-tag-cloud">
          ${data.vocabulary.map(v => `
            <span class="vocab-pill" title="Appears ${v.count} time(s)">
              <span>${v.word}</span>
              <span class="freq">${v.count}x</span>
            </span>
          `).join('')}
        </div>
      `;
      if (vocabCountEl) {
        vocabCountEl.textContent = `Total: ${data.vocabulary.length} Unique Words`;
        vocabCountEl.style.color = "var(--color-vocab)";
      }
    } else {
      vocabEl.innerHTML = `<span style="color:#6b7280; font-style:italic;">No unique vocabulary yet</span>`;
      if (vocabCountEl) vocabCountEl.textContent = `0 Unique Words`;
    }
  }
}

// Load Preset Text
function loadPipelinePreset(key) {
  const inputEl = document.getElementById('pipeline-input');
  if (inputEl && PIPELINE_PRESETS[key]) {
    inputEl.value = PIPELINE_PRESETS[key];
    updateConversionPipeline();
  }
}

// Click to Go Smooth Jump with Visual Flash
function scrollToSubtopic(elementId) {
  const target = document.getElementById(elementId);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.style.transition = 'box-shadow 0.4s ease, border-color 0.4s ease';
    target.style.boxShadow = '0 0 25px rgba(56, 189, 248, 0.45)';
    target.style.borderColor = 'rgba(56, 189, 248, 0.8)';
    setTimeout(() => {
      target.style.boxShadow = '';
      target.style.borderColor = '';
    }, 1500);
  }
}

// =========================================================
// NLTK CLIENT-SIDE LIVE SIMULATOR
// =========================================================
const NLTK_STOPWORDS = new Set([
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're",
  "you've", "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves', 'he',
  'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 'herself', 'it',
  "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves',
  'what', 'which', 'who', 'whom', 'this', 'that', "that'll", 'these', 'those',
  'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
  'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if',
  'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with',
  'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after',
  'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off',
  'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when',
  'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most',
  'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so',
  'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now'
]);

let currentNltkFunction = 'word_tokenize';

function switchNltkDemo(funcName) {
  currentNltkFunction = funcName;
  const buttons = document.querySelectorAll('.nltk-tab-btn');
  buttons.forEach(b => b.classList.remove('active'));
  
  // Highlight active button
  const activeBtn = Array.from(buttons).find(b => b.getAttribute('onclick').includes(funcName));
  if (activeBtn) activeBtn.classList.add('active');

  const label = document.getElementById('nltk-demo-label');
  const inputEl = document.getElementById('nltk-demo-input');

  if (funcName === 'word_tokenize') {
    if (label) label.textContent = 'Test text for nltk.word_tokenize(text):';
    if (inputEl) inputEl.value = "Natural Language Processing with NLTK is fast, flexible, and powerful. Let's tokenize this sentence!";
  } else if (funcName === 'sent_tokenize') {
    if (label) label.textContent = 'Test text for nltk.sent_tokenize(text):';
    if (inputEl) inputEl.value = "NLTK is an open-source library for Python. It provides easy interfaces to over 50 corpora. Are you ready to master NLP? Let's go!";
  } else if (funcName === 'stopwords') {
    if (label) label.textContent = 'Test text for nltk.corpus.stopwords.words("english"):';
    if (inputEl) inputEl.value = "This is a great study website for learning NLP and mastering AI with Python.";
  } else if (funcName === 'stemmer') {
    if (label) label.textContent = 'Test text for nltk.stem.PorterStemmer():';
    if (inputEl) inputEl.value = "The programmer is studying algorithms, running experiments, and writing better programs.";
  } else if (funcName === 'freqdist') {
    if (label) label.textContent = 'Test text for nltk.probability.FreqDist(tokens):';
    if (inputEl) inputEl.value = "AI and NLP. NLP helps machines learn. Computers and AI learn from NLP tokens!";
  }

  runNltkSimulator();
}

// Simple rule-based Porter stemmer simulation for browser demo
function simulateStem(word) {
  let w = word.toLowerCase();
  if (w.length < 4) return w;
  if (w.endsWith('sses')) return w.slice(0, -2);
  if (w.endsWith('ies')) return w.slice(0, -2);
  if (w.endsWith('ing') && w.length > 5) return w.slice(0, -3);
  if (w.endsWith('ed') && w.length > 4) return w.slice(0, -2);
  if (w.endsWith('ational')) return w.slice(0, -5) + 'e';
  if (w.endsWith('izer')) return w.slice(0, -1);
  if (w.endsWith('tion')) return w.slice(0, -3);
  if (w.endsWith('ly')) return w.slice(0, -2);
  if (w.endsWith('s') && !w.endsWith('ss')) return w.slice(0, -1);
  return w;
}

function runNltkSimulator() {
  const inputEl = document.getElementById('nltk-demo-input');
  const outputEl = document.getElementById('nltk-demo-output');
  const statEl = document.getElementById('nltk-sim-stat');
  if (!inputEl || !outputEl) return;

  const rawText = inputEl.value.trim();
  if (!rawText) {
    outputEl.textContent = '>>> (No input provided)';
    if (statEl) statEl.textContent = '';
    return;
  }

  if (currentNltkFunction === 'word_tokenize') {
    const tokens = rawText.match(/\b[A-Za-z0-9'-]+\b|[.,!?;:()]/g) || [];
    const formatted = JSON.stringify(tokens, null, 2);
    outputEl.innerHTML = `<span style="color:#38bdf8;">>>> from nltk.tokenize import word_tokenize</span>\n<span style="color:#34d399;">>>> word_tokenize(text)</span>\n${formatted}`;
    if (statEl) statEl.textContent = `Result: ${tokens.length} Tokens extracted`;
  } 
  else if (currentNltkFunction === 'sent_tokenize') {
    const sents = rawText.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g) || [];
    const cleanSents = sents.map(s => s.trim()).filter(s => s.length > 0);
    const formatted = JSON.stringify(cleanSents, null, 2);
    outputEl.innerHTML = `<span style="color:#38bdf8;">>>> from nltk.tokenize import sent_tokenize</span>\n<span style="color:#c084fc;">>>> sent_tokenize(text)</span>\n${formatted}`;
    if (statEl) statEl.textContent = `Result: ${cleanSents.length} Sentences (Documents)`;
  } 
  else if (currentNltkFunction === 'stopwords') {
    const tokens = rawText.match(/\b[A-Za-z0-9'-]+\b/g) || [];
    const filtered = tokens.filter(t => !NLTK_STOPWORDS.has(t.toLowerCase()));
    const removed = tokens.filter(t => NLTK_STOPWORDS.has(t.toLowerCase()));
    
    outputEl.innerHTML = `<span style="color:#38bdf8;">>>> from nltk.corpus import stopwords</span>
<span style="color:#fbbf24;">>>> stop_words = set(stopwords.words('english'))</span>
<span style="color:#34d399;">>>> [w for w in tokens if w.lower() not in stop_words]</span>

<span style="color:#6b7280;"># Original Tokens (${tokens.length}):</span>
${JSON.stringify(tokens)}

<span style="color:#34d399;"># Filtered Tokens (${filtered.length}):</span>
${JSON.stringify(filtered)}

<span style="color:#ef4444;"># Eliminated Stopwords (${removed.length}):</span>
${JSON.stringify(removed)}`;
    if (statEl) statEl.textContent = `Filtered ${removed.length} stopwords (${filtered.length} informative tokens kept)`;
  } 
  else if (currentNltkFunction === 'stemmer') {
    const tokens = rawText.match(/\b[A-Za-z0-9'-]+\b/g) || [];
    const stemmedPairs = tokens.map(t => [t, simulateStem(t)]);
    
    let pairsStr = stemmedPairs.map(([orig, stem]) => `  ${orig.padEnd(14)} -> ${stem}`).join('\n');
    outputEl.innerHTML = `<span style="color:#38bdf8;">>>> from nltk.stem import PorterStemmer</span>
<span style="color:#34d399;">>>> ps = PorterStemmer()</span>
<span style="color:#c084fc;">>>> [(w, ps.stem(w)) for w in tokens]</span>

${pairsStr}`;
    if (statEl) statEl.textContent = `Stemmed ${tokens.length} words to their morphological roots`;
  } 
  else if (currentNltkFunction === 'freqdist') {
    const tokens = (rawText.match(/\b[A-Za-z0-9'-]+\b/g) || []).map(t => t.toLowerCase());
    const freq = new Map();
    tokens.forEach(t => freq.set(t, (freq.get(t) || 0) + 1));
    const sorted = Array.from(freq.entries()).sort((a, b) => b[1] - a[1]);
    const top5 = sorted.slice(0, 5);

    outputEl.innerHTML = `<span style="color:#38bdf8;">>>> from nltk.probability import FreqDist</span>
<span style="color:#34d399;">>>> fdist = FreqDist(tokens)</span>
<span style="color:#fbbf24;">>>> print(fdist)</span>
&lt;FreqDist with ${freq.size} samples and ${tokens.length} outcomes&gt;

<span style="color:#34d399;">>>> fdist.most_common(5)</span>
${JSON.stringify(top5)}

<span style="color:#6b7280;"># Full Frequency Dictionary:</span>
${JSON.stringify(Object.fromEntries(sorted), null, 2)}`;
    if (statEl) statEl.textContent = `FreqDist: ${tokens.length} Total Tokens | ${freq.size} Unique Vocabulary Size`;
  }
}

// Standalone Page Helpers
function initCorpusDemo() {
  const btnAdd = document.getElementById('btn-add-doc');
  const inputSentence = document.getElementById('sentence-input');
  const displayBox = document.getElementById('corpus-display-list');
  const statsBox = document.getElementById('corpus-stats');
  if (!btnAdd || !inputSentence || !displayBox) return;

  let sentences = [
    "Machine learning models process text.",
    "Sentences are grouped to create a full corpus paragraph."
  ];

  function render() {
    displayBox.innerHTML = sentences.map((s, i) => `
      <div class="doc-item">
        <span class="doc-tag" style="background: var(--color-corpus); color: #020617;">Doc ${i + 1}</span>
        <span>${s}</span>
      </div>
    `).join('');

    const full = sentences.join(' ');
    statsBox.innerHTML = `
      <div class="corpus-paragraph-box" style="margin-top: 1rem;">
        "${full}"
      </div>
      <p style="margin-top: 0.5rem; font-size: 0.85rem; color: #94a3b8;">
        ✅ Current Corpus: <strong>1 Paragraph</strong> composed of <strong>${sentences.length} Documents</strong>.
      </p>
    `;
  }

  btnAdd.addEventListener('click', () => {
    const val = inputSentence.value.trim();
    if (val) {
      sentences.push(val);
      inputSentence.value = '';
      render();
    }
  });

  render();
}

function initDocumentDemo() {
  const inputEl = document.getElementById('doc-raw-input');
  const outputEl = document.getElementById('doc-split-output');
  if (!inputEl || !outputEl) return;

  function render() {
    const text = inputEl.value.trim();
    const sentences = text.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g) || [];
    outputEl.innerHTML = `
      <div style="margin-bottom: 0.5rem; font-weight: 700; color: var(--color-document);">
        Corpus converted into ${sentences.length} Document(s):
      </div>
      <div class="doc-list">
        ${sentences.map((s, i) => `
          <div class="doc-item">
            <span class="doc-tag">Sentence ${i + 1}</span>
            <span>"${s.trim()}"</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  inputEl.addEventListener('input', render);
  render();
}

function initVocabDemo() {
  const inputEl = document.getElementById('vocab-input');
  const wordsRow = document.getElementById('vocab-all-words');
  const uniqueRow = document.getElementById('vocab-unique-words');
  const statsLabel = document.getElementById('vocab-stats-label');
  if (!inputEl || !wordsRow || !uniqueRow) return;

  function render() {
    const text = inputEl.value.trim();
    const tokens = text.match(/\b[A-Za-z0-9'-]+\b/g) || [];

    wordsRow.innerHTML = tokens.map(t => `<span class="token-chip">${t}</span>`).join('') || '<span style="color:#6b7280">No words</span>';

    const freq = new Map();
    tokens.forEach(t => {
      const lower = t.toLowerCase();
      freq.set(lower, (freq.get(lower) || 0) + 1);
    });

    const uniqueList = Array.from(freq.entries());
    uniqueRow.innerHTML = uniqueList.map(([w, c]) => `
      <span class="vocab-pill">${w} <span class="freq">${c}x</span></span>
    `).join('') || '<span style="color:#6b7280">No unique words</span>';

    if (statsLabel) {
      statsLabel.textContent = `Count: ${tokens.length} Total Tokens ➔ ${uniqueList.length} Unique Vocabulary Words`;
    }
  }

  inputEl.addEventListener('input', render);
  render();
}

function initWordDemo() {
  const inputEl = document.getElementById('word-raw-input');
  const outputEl = document.getElementById('word-tokens-output');
  if (!inputEl || !outputEl) return;

  function render() {
    const text = inputEl.value.trim();
    const tokens = text.match(/\b[A-Za-z0-9'-]+\b|[^\s\w]/g) || [];
    outputEl.innerHTML = `
      <div style="margin-bottom: 0.5rem; color: var(--color-word); font-weight: 700;">
        Counted: ${tokens.length} Tokens
      </div>
      <div class="token-list">
        ${tokens.map((t, i) => `
          <span class="token-chip">
            <span class="token-index">#${i}</span>
            <span>${t}</span>
          </span>
        `).join('')}
      </div>
    `;
  }

  inputEl.addEventListener('input', render);
  render();
}

// Global Initialization
document.addEventListener('DOMContentLoaded', () => {
  const pipelineInput = document.getElementById('pipeline-input');
  if (pipelineInput) {
    pipelineInput.addEventListener('input', updateConversionPipeline);
    loadPipelinePreset('repeat');
  }

  // Initialize NLTK Simulator if present
  if (document.getElementById('nltk-demo-input')) {
    runNltkSimulator();
  }

  initCorpusDemo();
  initDocumentDemo();
  initVocabDemo();
  initWordDemo();
});
