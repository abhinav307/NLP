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

// =========================================================
// NLTK VISUAL IMPORT TREE DATA & INSPECTOR LOGIC
// =========================================================
const NLTK_TREE_DATA = {
  'word_tokenize': {
    name: 'word_tokenize',
    module: 'nltk.tokenize',
    type: 'Function',
    importStmt: 'from nltk.tokenize import word_tokenize',
    what: 'Splits sentences into individual discrete word and punctuation tokens. It handles contractions (e.g. "don\'t" -> "do", "n\'t") and isolates punctuation.',
    how: `from nltk.tokenize import word_tokenize

text = "Natural Language Processing with NLTK is fun!"
tokens = word_tokenize(text)
print(tokens)
# Output: ['Natural', 'Language', 'Processing', 'with', 'NLTK', 'is', 'fun', '!']`,
    simFunc: 'word_tokenize'
  },
  'sent_tokenize': {
    name: 'sent_tokenize',
    module: 'nltk.tokenize',
    type: 'Function',
    importStmt: 'from nltk.tokenize import sent_tokenize',
    what: 'Breaks down a full paragraph (Corpus) into separate sentences (Documents) using Punkt boundary detection.',
    how: `from nltk.tokenize import sent_tokenize

corpus = "NLP is amazing. It powers AI chatbots! Are you ready?"
docs = sent_tokenize(corpus)
print(docs)
# Output: ['NLP is amazing.', 'It powers AI chatbots!', 'Are you ready?']`,
    simFunc: 'sent_tokenize'
  },
  'RegexpTokenizer': {
    name: 'RegexpTokenizer',
    module: 'nltk.tokenize',
    type: 'Class',
    importStmt: 'from nltk.tokenize import RegexpTokenizer',
    what: 'A customizable tokenizer using regular expressions. Often used with r\'\\w+\' to strip all punctuation and symbols during token extraction.',
    how: `from nltk.tokenize import RegexpTokenizer

tokenizer = RegexpTokenizer(r'\\w+')
words = tokenizer.tokenize("Deep learning, ML, & AI: revolutionize 2026!")
print(words)
# Output: ['Deep', 'learning', 'ML', 'AI', 'revolutionize', '2026']`,
    simFunc: 'word_tokenize'
  },
  'wordpunct_tokenize': {
    name: 'wordpunct_tokenize',
    module: 'nltk.tokenize',
    type: 'Function',
    importStmt: 'from nltk.tokenize import wordpunct_tokenize',
    what: 'Splits text into alphabetic and non-alphabetic tokens by scanning sequences of word characters and non-whitespace symbols.',
    how: `from nltk.tokenize import wordpunct_tokenize

tokens = wordpunct_tokenize("User's email: info@test.com")
print(tokens)
# Output: ['User', \"'\", 's', 'email', ':', 'info', '@', 'test', '.', 'com']`,
    simFunc: 'word_tokenize'
  },
  'stopwords': {
    name: 'stopwords',
    module: 'nltk.corpus',
    type: 'Corpus Reader',
    importStmt: 'from nltk.corpus import stopwords',
    what: 'Provides standardized lists of non-informative filler words (e.g. "the", "is", "at", "which") across 20+ languages to filter noise before training models.',
    how: `from nltk.corpus import stopwords

stop_words = set(stopwords.words('english'))
tokens = ['this', 'is', 'a', 'great', 'nlp', 'model']
filtered = [w for w in tokens if w.lower() not in stop_words]
print(filtered)
# Output: ['great', 'nlp', 'model']`,
    simFunc: 'stopwords'
  },
  'gutenberg': {
    name: 'gutenberg',
    module: 'nltk.corpus',
    type: 'Corpus Reader',
    importStmt: 'from nltk.corpus import gutenberg',
    what: 'Provides direct access to thousands of classic public domain literature books and texts for linguistic testing and corpus research.',
    how: `from nltk.corpus import gutenberg

# List all available book files
print(gutenberg.fileids()[:2]) # ['austen-emma.txt', 'austen-persuasion.txt']

# Get token list
words = gutenberg.words('austen-emma.txt')
print("Total words:", len(words)) # 192,427 words`,
    simFunc: 'freqdist'
  },
  'wordnet': {
    name: 'wordnet',
    module: 'nltk.corpus',
    type: 'Lexical Database',
    importStmt: 'from nltk.corpus import wordnet',
    what: 'A lexical database of English nouns, verbs, adjectives, and adverbs organized into sets of cognitive synonyms (synsets) with definitions and relationships.',
    how: `from nltk.corpus import wordnet

syns = wordnet.synsets('computer')
print(syns[0].definition())
# Output: 'a machine for performing calculations automatically'`,
    simFunc: null
  },
  'PorterStemmer': {
    name: 'PorterStemmer',
    module: 'nltk.stem',
    type: 'Class',
    importStmt: 'from nltk.stem import PorterStemmer',
    what: 'Heuristic algorithm that chops off common suffixes (e.g. -ing, -es, -ed) to reduce words to their base stem form.',
    how: `from nltk.stem import PorterStemmer

ps = PorterStemmer()
print(ps.stem('running'))   # 'run'
print(ps.stem('studies'))   # 'studi'
print(ps.stem('processes')) # 'process'`,
    simFunc: 'stemmer'
  },
  'SnowballStemmer': {
    name: 'SnowballStemmer',
    module: 'nltk.stem',
    type: 'Class',
    importStmt: 'from nltk.stem import SnowballStemmer',
    what: 'An improved, more aggressive multi-language stemmer (also known as Porter2) supporting English, Spanish, French, German, etc.',
    how: `from nltk.stem import SnowballStemmer

stemmer = SnowballStemmer('english')
print(stemmer.stem('generously')) # 'generous'
print(stemmer.stem('studying'))   # 'studi'`,
    simFunc: 'stemmer'
  },
  'WordNetLemmatizer': {
    name: 'WordNetLemmatizer',
    module: 'nltk.stem',
    type: 'Class',
    importStmt: 'from nltk.stem import WordNetLemmatizer',
    what: 'Dictionary-backed lemmatizer that uses WordNet to find legitimate dictionary base forms (lemmas) based on Part-of-Speech.',
    how: `from nltk.stem import WordNetLemmatizer

lem = WordNetLemmatizer()
print(lem.lemmatize('better', pos='a'))  # 'good' (adjective)
print(lem.lemmatize('ran', pos='v'))     # 'run' (verb)
print(lem.lemmatize('corpora', pos='n')) # 'corpus' (noun)`,
    simFunc: 'stemmer'
  },
  'FreqDist': {
    name: 'FreqDist',
    module: 'nltk.probability',
    type: 'Class',
    importStmt: 'from nltk.probability import FreqDist',
    what: 'Frequency distribution counter that tallies tokens, discovers the vocabulary set, and identifies the most frequent keywords in a corpus.',
    how: `from nltk.probability import FreqDist

tokens = ['ai', 'nlp', 'nlp', 'ai', 'ai', 'machine']
fdist = FreqDist(tokens)

print(fdist.N())              # 6 total tokens
print(fdist.B())              # 3 unique vocabulary words
print(fdist.most_common(2))   # [('ai', 3), ('nlp', 2)]`,
    simFunc: 'freqdist'
  },
  'pos_tag': {
    name: 'pos_tag',
    module: 'nltk.tag',
    type: 'Function',
    importStmt: 'from nltk.tag import pos_tag',
    what: 'Labels each token with its grammatical part of speech (e.g. NNP for proper noun, VBZ for present verb, JJ for adjective) using the Penn Treebank tagset.',
    how: `from nltk.tag import pos_tag

tokens = ['Sundar', 'leads', 'Google', 'in', 'California']
tags = pos_tag(tokens)
print(tags)
# Output: [('Sundar', 'NNP'), ('leads', 'VBZ'), ('Google', 'NNP'), ('in', 'IN'), ('California', 'NNP')]`,
    simFunc: null
  },
  'ne_chunk': {
    name: 'ne_chunk',
    module: 'nltk.chunk',
    type: 'Function',
    importStmt: 'from nltk.chunk import ne_chunk',
    what: 'Extracts Named Entities (People, Organizations, Geographic Locations) from POS-tagged text into a parsed entity syntax tree.',
    how: `from nltk.chunk import ne_chunk
from nltk.tag import pos_tag

tags = pos_tag(['Sundar', 'Pichai', 'leads', 'Google'])
tree = ne_chunk(tags)
print(tree)
# Output: (S (PERSON Sundar/NNP Pichai/NNP) leads/VBZ (ORGANIZATION Google/NNP))`,
    simFunc: null
  },
  'SentimentIntensityAnalyzer': {
    name: 'SentimentIntensityAnalyzer',
    module: 'nltk.sentiment.vader',
    type: 'Class',
    importStmt: 'from nltk.sentiment.vader import SentimentIntensityAnalyzer',
    what: 'VADER (Valence Aware Dictionary and sEntiment Reasoner) rule-based sentiment model providing positive, negative, neutral, and normalized compound polarity scores.',
    how: `from nltk.sentiment.vader import SentimentIntensityAnalyzer

sia = SentimentIntensityAnalyzer()
score = sia.polarity_scores("NLTK makes NLP super fun and powerful!")
print(score)
# Output: {'neg': 0.0, 'neu': 0.385, 'pos': 0.615, 'compound': 0.7712}`,
    simFunc: null
  }
};

function inspectTreeNode(key) {
  const item = NLTK_TREE_DATA[key];
  if (!item) return;

  // Highlight active leaf button
  const buttons = document.querySelectorAll('.tree-leaf-btn');
  buttons.forEach(b => b.classList.remove('active'));
  const activeBtn = document.querySelector(`.tree-leaf-btn[data-key="${key}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  const nameEl = document.getElementById('inspector-title');
  const importEl = document.getElementById('inspector-import');
  const whatEl = document.getElementById('inspector-what');
  const howEl = document.getElementById('inspector-how');
  const simBtn = document.getElementById('inspector-sim-btn');

  if (nameEl) nameEl.innerHTML = `<span>${item.name}</span> <span class="leaf-type-badge">${item.type}</span>`;
  if (importEl) importEl.textContent = item.importStmt;
  if (whatEl) whatEl.textContent = item.what;
  if (howEl) howEl.textContent = item.how;

  if (simBtn) {
    if (item.simFunc) {
      simBtn.style.display = 'inline-flex';
      simBtn.onclick = () => {
        scrollToSubtopic('nltk-live-runner');
        switchNltkDemo(item.simFunc);
      };
    } else {
      simBtn.style.display = 'none';
    }
  }
}

// =========================================================
// APPLE-INSPIRED NLTK VISUAL STUDIO LOGIC
// =========================================================
let currentAppleMode = 'token';

const APPLE_PRESETS = {
  token: "Natural Language Processing with NLTK is fascinating! Computers learn to understand human languages easily.",
  stopwords: "This is a great study website for learning NLP and mastering AI with Python.",
  stem: "The programmer is studying algorithms, running experiments, and writing better programs.",
  lemma: "The best corpora show that running wolves and studying better algorithms help science.",
  freq: "NLP helps computers learn. Natural language processing and NLP help humans. AI and NLP are great!"
};

const APPLE_SNIPPETS = {
  token: `from nltk.tokenize import sent_tokenize, word_tokenize

sentences = sent_tokenize(text)
words = [word_tokenize(s) for s in sentences]`,
  stopwords: `from nltk.corpus import stopwords

stop_words = set(stopwords.words('english'))
keywords = [w for w in tokens if w.lower() not in stop_words and w.isalnum()]`,
  stem: `from nltk.stem import PorterStemmer

ps = PorterStemmer()
stemmed_words = [ps.stem(w) for w in tokens]`,
  lemma: `from nltk.stem import WordNetLemmatizer

lemmatizer = WordNetLemmatizer()
# Lemmatize with part-of-speech context
lemma = lemmatizer.lemmatize("better", pos="a")  # Output: 'good'`,
  freq: `from nltk.probability import FreqDist

fdist = FreqDist(tokens)
top_keywords = fdist.most_common(5)`
};

const APPLE_MODE_INFO = {
  token: {
    title: "✂️ Visual Tokenizer",
    badge: "Paragraph ➔ Sentences ➔ Words",
    badgeColor: "var(--color-corpus)",
    label: "Input text to break into sentences and tokens:"
  },
  stopwords: {
    title: "🛑 Stopwords Filter",
    badge: "Noise Elimination",
    badgeColor: "#fb7185",
    label: "Input text to see filler words get filtered out:"
  },
  stem: {
    title: "🌱 Suffix Slicer (Stemming)",
    badge: "Heuristic Suffix Stripping",
    badgeColor: "var(--color-word)",
    label: "Input words to slice off suffixes into root stems:"
  },
  lemma: {
    title: "📚 Smart Roots (Lemmatization)",
    badge: "Dictionary-Backed Roots",
    badgeColor: "var(--color-document)",
    label: "Input inflected words to resolve to true dictionary lemmas:"
  },
  freq: {
    title: "📊 Keyword Frequency (FreqDist)",
    badge: "Vocabulary Frequency",
    badgeColor: "var(--color-vocab)",
    label: "Input text to discover top keywords and ranking bars:"
  }
};

const LEMMA_DICTIONARY = {
  'better': { lemma: 'good', pos: 'Adjective' },
  'best': { lemma: 'good', pos: 'Adjective' },
  'worse': { lemma: 'bad', pos: 'Adjective' },
  'worst': { lemma: 'bad', pos: 'Adjective' },
  'corpora': { lemma: 'corpus', pos: 'Noun' },
  'wolves': { lemma: 'wolf', pos: 'Noun' },
  'running': { lemma: 'run', pos: 'Verb' },
  'ran': { lemma: 'run', pos: 'Verb' },
  'runs': { lemma: 'run', pos: 'Verb' },
  'studies': { lemma: 'study', pos: 'Verb / Noun' },
  'studying': { lemma: 'study', pos: 'Verb' },
  'crying': { lemma: 'cry', pos: 'Verb' },
  'cries': { lemma: 'cry', pos: 'Verb' },
  'algorithms': { lemma: 'algorithm', pos: 'Noun' },
  'computers': { lemma: 'computer', pos: 'Noun' },
  'languages': { lemma: 'language', pos: 'Noun' }
};

function switchAppleMode(mode) {
  currentAppleMode = mode;

  // Update Segmented Control Buttons
  const buttons = document.querySelectorAll('.apple-segment-pill');
  buttons.forEach(btn => {
    btn.classList.remove('active', 'pill-token', 'pill-stopwords', 'pill-stem', 'pill-lemma', 'pill-freq');
    if (btn.getAttribute('data-mode') === mode) {
      btn.classList.add('active', `pill-${mode}`);
    }
  });

  // Synchronize Left Sidebar Mode Items
  const sideItems = document.querySelectorAll('.sidebar-mode-item');
  sideItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-mode') === mode) {
      item.classList.add('active');
    }
  });

  const info = APPLE_MODE_INFO[mode];
  const titleEl = document.getElementById('apple-studio-title');
  const badgeEl = document.getElementById('apple-studio-badge');
  const labelEl = document.getElementById('apple-studio-label');
  const textareaEl = document.getElementById('apple-studio-input');
  const snippetEl = document.getElementById('apple-code-snippet');

  if (titleEl) titleEl.textContent = info.title;
  if (badgeEl) {
    badgeEl.textContent = info.badge;
    badgeEl.style.color = info.badgeColor;
  }
  if (labelEl) labelEl.textContent = info.label;
  if (textareaEl && APPLE_PRESETS[mode]) {
    textareaEl.value = APPLE_PRESETS[mode];
  }
  if (snippetEl && APPLE_SNIPPETS[mode]) {
    snippetEl.textContent = APPLE_SNIPPETS[mode];
  }

  updateAppleVisualStage();
}

function updateAppleVisualStage() {
  const textareaEl = document.getElementById('apple-studio-input');
  const canvasEl = document.getElementById('apple-canvas-content');
  if (!textareaEl || !canvasEl) return;

  const text = textareaEl.value.trim();
  if (!text) {
    canvasEl.innerHTML = '<span style="color:#6b7280; font-style:italic;">Type some text above to see visual transformation.</span>';
    return;
  }

  if (currentAppleMode === 'token') {
    renderAppleTokenization(text, canvasEl);
  } else if (currentAppleMode === 'stopwords') {
    renderAppleStopwords(text, canvasEl);
  } else if (currentAppleMode === 'stem') {
    renderAppleStemming(text, canvasEl);
  } else if (currentAppleMode === 'lemma') {
    renderAppleLemmatization(text, canvasEl);
  } else if (currentAppleMode === 'freq') {
    renderAppleFreqDist(text, canvasEl);
  }
}

// 1. Render Visual Tokenization
function renderAppleTokenization(text, container) {
  const docMatches = text.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g) || [];
  const sents = docMatches.map(s => s.trim()).filter(s => s.length > 0);

  if (sents.length === 0) {
    container.innerHTML = '<span style="color:#6b7280;">No sentences detected.</span>';
    return;
  }

  let html = `<div class="apple-doc-flow">`;
  sents.forEach((sent, sIdx) => {
    const tokens = sent.match(/\b[A-Za-z0-9'-]+\b|[.,!?;:()]/g) || [];
    html += `
      <div class="apple-doc-item">
        <div class="doc-sentence-header">
          <span>📄 Document ${sIdx + 1} (${tokens.length} tokens):</span>
          <span style="font-weight: normal; color: #cbd5e1; font-style: italic;">"${sent}"</span>
        </div>
        <div class="token-list">
          ${tokens.map((tok, tIdx) => `
            <span class="token-chip" style="font-size:0.85rem; padding:0.3rem 0.65rem;">
              <span class="token-index">#${tIdx}</span>
              <span>${tok}</span>
            </span>
          `).join('')}
        </div>
      </div>
    `;
  });
  html += `</div>`;
  container.innerHTML = html;
}

// 2. Render Visual Stopwords Filtering
function renderAppleStopwords(text, container) {
  const tokens = text.match(/\b[A-Za-z0-9'-]+\b/g) || [];
  let stopCount = 0;
  let keyCount = 0;

  const chipsHtml = tokens.map(tok => {
    const isStop = NLTK_STOPWORDS.has(tok.toLowerCase());
    if (isStop) {
      stopCount++;
      return `
        <span class="chip-stopword" title="Filtered Stopword">
          <span>${tok}</span>
          <span style="font-size:0.7rem; opacity:0.8;">❌</span>
        </span>
      `;
    } else {
      keyCount++;
      return `
        <span class="chip-keyword" title="Informative Keyword">
          <span>${tok}</span>
          <span style="font-size:0.7rem; color:var(--color-word);">⭐</span>
        </span>
      `;
    }
  }).join(' ');

  container.innerHTML = `
    <div class="stopwords-legend-bar">
      <div class="legend-item" style="color: #34d399;">
        <span>⭐ <strong>${keyCount}</strong> Informative Keywords Kept</span>
      </div>
      <div class="legend-item" style="color: #f87171;">
        <span>❌ <strong>${stopCount}</strong> Low-information Stopwords Removed</span>
      </div>
    </div>
    <div style="display:flex; flex-wrap:wrap; gap:0.5rem; line-height:2.2;">
      ${chipsHtml}
    </div>
  `;
}

// 3. Render Visual Stemming (Suffix Slicer)
function renderAppleStemming(text, container) {
  const tokens = text.match(/\b[A-Za-z0-9'-]+\b/g) || [];
  const uniqueTokens = Array.from(new Set(tokens));

  if (uniqueTokens.length === 0) {
    container.innerHTML = '<span style="color:#6b7280;">No words to stem.</span>';
    return;
  }

  const cardsHtml = uniqueTokens.slice(0, 12).map(orig => {
    const stem = simulateStem(orig);
    const suffix = orig.length > stem.length ? orig.slice(stem.length) : (orig !== stem ? 'changed' : 'none');
    return `
      <div class="slice-card">
        <div class="slice-top">
          <span>Word</span>
          <span class="slice-cut-label">${suffix !== 'none' ? `✂️ cut: -${suffix}` : 'no suffix'}</span>
        </div>
        <div class="slice-formula-row">
          <span class="slice-original">${orig}</span>
          <span class="slice-arrow">➔</span>
          <span class="slice-stem-badge">${stem}</span>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="slice-card-grid">
      ${cardsHtml}
    </div>
    <p style="margin-top: 1rem; font-size: 0.8rem; color: var(--text-dim);">
      💡 <strong>Stemming Rule:</strong> Chops affixes quickly using rules without checking a dictionary.
    </p>
  `;
}

// 4. Render Visual Lemmatization (Smart Roots)
function renderAppleLemmatization(text, container) {
  const tokens = text.match(/\b[A-Za-z0-9'-]+\b/g) || [];
  const uniqueTokens = Array.from(new Set(tokens.map(t => t.toLowerCase())));

  // Pick sample words that demonstrate lemmatization clearly
  const demoList = ['better', 'running', 'studies', 'corpora', 'wolves', 'crying'];
  uniqueTokens.forEach(t => {
    if (LEMMA_DICTIONARY[t] && !demoList.includes(t)) demoList.push(t);
  });

  const cardsHtml = demoList.slice(0, 8).map(w => {
    const entry = LEMMA_DICTIONARY[w] || { lemma: simulateStem(w), pos: 'Word' };
    return `
      <div class="lemma-card">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="lemma-pos-tag">${entry.pos}</span>
          <span style="font-size:0.75rem; color:#34d399;">✓ Valid Root</span>
        </div>
        <div class="lemma-resolution-row">
          <span class="lemma-input-word">${w}</span>
          <span style="color:var(--text-dim); font-size:1.1rem;">➔</span>
          <span class="lemma-result-badge">${entry.lemma}</span>
        </div>
        <div class="lemma-explanation">
          ${w === 'better' ? 'Recognized as superlative of "good"' : (w === 'corpora' ? 'Irregular plural of "corpus"' : 'Dictionary base form')}
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="lemma-card-grid">
      ${cardsHtml}
    </div>
    <p style="margin-top: 1rem; font-size: 0.8rem; color: var(--text-dim);">
      💡 <strong>Lemmatization Advantage:</strong> Looks up in WordNet dictionary to always return a valid, meaningful English root word.
    </p>
  `;
}

// 5. Render Visual FreqDist
function renderAppleFreqDist(text, container) {
  const words = (text.match(/\b[A-Za-z0-9'-]+\b/g) || []).map(w => w.toLowerCase());
  const freqMap = new Map();
  words.forEach(w => freqMap.set(w, (freqMap.get(w) || 0) + 1));

  const sorted = Array.from(freqMap.entries()).sort((a, b) => b[1] - a[1]);
  if (sorted.length === 0) {
    container.innerHTML = '<span style="color:#6b7280;">No words found.</span>';
    return;
  }

  const maxCount = sorted[0][1] || 1;
  const top10 = sorted.slice(0, 8);

  const barsHtml = top10.map(([w, c]) => {
    const pct = Math.max(8, Math.round((c / maxCount) * 100));
    return `
      <div class="freq-bar-row">
        <span class="freq-word-label" title="${w}">${w}</span>
        <div class="freq-track">
          <div class="freq-fill" style="width: ${pct}%;"></div>
        </div>
        <span class="freq-count-badge">${c}x</span>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div style="margin-bottom: 0.85rem; font-size: 0.85rem; color: var(--text-muted);">
      Vocabulary Size: <strong>${freqMap.size} Unique Words</strong> across <strong>${words.length} Total Tokens</strong>
    </div>
    <div class="freq-bars-list">
      ${barsHtml}
    </div>
  `;
}

// 1-Click Code Copy
function copyAppleCode() {
  const snippetEl = document.getElementById('apple-code-snippet');
  const btnEl = document.getElementById('apple-copy-btn');
  if (!snippetEl) return;

  navigator.clipboard.writeText(snippetEl.textContent).then(() => {
    if (btnEl) {
      btnEl.textContent = 'Copied! ✓';
      btnEl.style.background = '#059669';
      setTimeout(() => {
        btnEl.textContent = 'Copy Code';
        btnEl.style.background = '';
      }, 2000);
    }
  });
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

  // Initialize NLTK Tree Inspector if present
  if (document.getElementById('inspector-title')) {
    inspectTreeNode('word_tokenize');
  }

  // Initialize Apple Visual Studio if present
  if (document.getElementById('apple-studio-input')) {
    const appleInput = document.getElementById('apple-studio-input');
    appleInput.addEventListener('input', updateAppleVisualStage);
    switchAppleMode('token');
  }

  initCorpusDemo();
  initDocumentDemo();
  initVocabDemo();
  initWordDemo();

  // Initialize Practice 1 Lab if present
  if (document.getElementById('practice-input')) {
    const practiceInput = document.getElementById('practice-input');
    practiceInput.addEventListener('input', updatePracticeVisualStage);
    switchPracticeLab('tokenizer');
  }
});

/* =========================================================
   PRACTICE 1: INTERACTIVE NLP LAB LOGIC
   ========================================================= */

const PRACTICE_PRESETS = {
  tricky: "Dr. Smith said: 'NLP isn't easy in 2026, but it's 100% worth it at $49.99/mo!' Can't wait.",
  abbrev: "The U.S.A. and U.K. are developing Ph.D. level AI models. Isn't that fantastic?!",
  stemwords: "The programmer was running, easily studying algorithms, and making better programs.",
  review: "WOWWW!! This NLP software version 3.2 is AMAZINGGG & super-fast! 🚀 However, it crashed 2 times today on my MacBook... isn't that annoying? Can't wait for bug fixes. Still, I'm giving it 4.5/5 stars because of customer support!",
  notebook: "Hello! Welcome to Natural Language Processing (NLP) in Python. It's fascinating how computers learn to understand human languages, isn't it? In 2026, AI models are analyzing millions of texts—from emails to books—every single second. Running, ran, and runs all share the same root word, while words like \"better\" and \"good\" show how lemmatization works!"
};

const PRACTICE_LAB_CONFIGS = {
  tokenizer: {
    icon: "🥊",
    title: "Tokenizer Arena: The Benchmark Showdown",
    desc: "Comparing word_tokenize, wordpunct_tokenize, and TreebankWordTokenizer on real-world tricky contractions, money, and abbreviations.",
    badge: "Unit 1 Practice",
    code: `# Unit 1 Practice: Benchmark Tokenizers on Tricky Edge Cases
from nltk.tokenize import sent_tokenize, word_tokenize, wordpunct_tokenize, TreebankWordTokenizer

sample_text = "Dr. Smith said: 'NLP isn't easy in 2026, but it's 100% worth it at $49.99/mo!' Can't wait."

tb = TreebankWordTokenizer()
print("word_tokenize:      ", word_tokenize(sample_text))
print("wordpunct_tokenize: ", wordpunct_tokenize(sample_text))
print("TreebankTokenizer:  ", tb.tokenize(sample_text))`
  },
  stemming: {
    icon: "✂️",
    title: "Stemming Slicers: Porter vs. Snowball vs. Regexp",
    desc: "Visualizing rule-based heuristic suffix slicing. Compare how different stemmers chop suffixes on regular and irregular words.",
    badge: "Unit 2 Practice",
    code: `# Unit 2 Practice: Stemming Algorithms Showdown
from nltk.stem import PorterStemmer, SnowballStemmer, RegexpStemmer

porter = PorterStemmer()
snowball = SnowballStemmer('english')
regexp = RegexpStemmer('ing$|s$|ed$|ly$|ation$', min=4)

words = ["running", "runs", "ran", "studies", "fairly", "easily", "congratulations"]
for w in words:
    print(f"{w:15} | Porter: {porter.stem(w):10} | Snowball: {snowball.stem(w):10} | Regex: {regexp.stem(w):10}")`
  },
  stopwords: {
    icon: "🧹",
    title: "Stopword Noise Reducer & Compression Meter",
    desc: "Measures dataset compression ratio when filtering non-informative stopwords and punctuation out of raw human text.",
    badge: "Unit 3 Practice",
    code: `# Unit 3 Practice: Measuring Stopwords & Noise Reduction
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import string

nltk_stopwords = set(stopwords.words('english'))
tokens = word_tokenize(corpus)
clean_tokens = [w for w in tokens if w.lower() not in nltk_stopwords and w not in string.punctuation]

reduction_pct = ((len(tokens) - len(clean_tokens)) / len(tokens)) * 100
print(f"Noise Reduction Rate: {reduction_pct:.2f}%")
print("Clean Core Tokens:", clean_tokens)`
  },
  lemma: {
    icon: "📚",
    title: "Lemmatization with POS: Dictionary-Accurate Roots",
    desc: "Why WordNetLemmatizer needs Part-of-Speech tags (Verb, Adjective, Noun) to return legitimate dictionary base forms.",
    badge: "Unit 4 Practice",
    code: `# Unit 4 Practice: WordNetLemmatizer with Part-of-Speech (POS) Tagging
from nltk.stem import WordNetLemmatizer

lemmatizer = WordNetLemmatizer()

print("running (verb)      ➔", lemmatizer.lemmatize("running", pos='v')) # run
print("better (adjective)  ➔", lemmatizer.lemmatize("better", pos='a'))  # good
print("leaves (noun)       ➔", lemmatizer.lemmatize("leaves", pos='n'))  # leaf
print("leaves (verb)       ➔", lemmatizer.lemmatize("leaves", pos='v'))  # leave
print("corpora (noun)      ➔", lemmatizer.lemmatize("corpora", pos='n')) # corpus`
  },
  freqdist: {
    icon: "📊",
    title: "Vocabulary Analytics & Frequency Distribution Bars",
    desc: "Interactive horizontal frequency distribution bar chart and Lexical Diversity calculations (Unique Vocab / Total Words).",
    badge: "Unit 5 Practice",
    code: `# Unit 5 Practice: Vocabulary Analysis & Frequency Distribution
from nltk.probability import FreqDist
from nltk.tokenize import word_tokenize

clean_words = [w.lower() for w in word_tokenize(corpus) if w.isalnum()]
freq = FreqDist(clean_words)

print("Top 5 Words:", freq.most_common(5))
print("Vocabulary Size:", len(set(clean_words)))
print("Lexical Diversity:", f"{len(set(clean_words)) / len(clean_words) * 100:.2f}%")`
  },
  review: {
    icon: "🏆",
    title: "Real-World Challenge: Customer Review Cleaner",
    desc: "End-to-end practical cleaning of unstructured user reviews with emojis, contractions, and punctuation into clean ML keywords.",
    badge: "Unit 6 Practice",
    code: `# Unit 6 Practice: Messy Unstructured Text Cleaner
messy_review = """
WOWWW!! This NLP software version 3.2 is AMAZINGGG & super-fast! 🚀
However, it crashed 2 times today on my MacBook... isn't that annoying?
Can't wait for bug fixes. Still, I'm giving it 4.5/5 stars because of customer support!
"""
# Complete pipeline extracts clean sentiment keywords
clean_keywords = [lemmatizer.lemmatize(w.lower(), pos='v') for w in word_tokenize(messy_review) if w.isalnum() and w.lower() not in nltk_stopwords]
print("Extracted Keywords for Sentiment:", clean_keywords)`
  }
};

let currentPracticeLab = 'tokenizer';

function switchPracticeLab(labKey) {
  if (!PRACTICE_LAB_CONFIGS[labKey]) return;
  currentPracticeLab = labKey;

  // 1. Update Segmented Pills
  document.querySelectorAll('.practice-pill').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lab') === labKey);
  });

  // 2. Update Sidebar Items
  document.querySelectorAll('.practice-sidebar-item').forEach(item => {
    item.classList.toggle('active', item.getAttribute('data-lab') === labKey);
  });

  // 3. Update Canvas Header & Code
  const cfg = PRACTICE_LAB_CONFIGS[labKey];
  const iconEl = document.getElementById('practice-lab-icon');
  const titleEl = document.getElementById('practice-lab-title');
  const descEl = document.getElementById('practice-lab-desc');
  const badgeEl = document.getElementById('practice-lab-badge');
  const codeEl = document.getElementById('practice-python-code');

  if (iconEl) iconEl.textContent = cfg.icon;
  if (titleEl) titleEl.textContent = cfg.title;
  if (descEl) descEl.textContent = cfg.desc;
  if (badgeEl) badgeEl.textContent = cfg.badge;
  if (codeEl) codeEl.textContent = cfg.code;

  // 4. Update Visual Stage
  updatePracticeVisualStage();
}

function loadPracticePreset(presetKey) {
  const inputEl = document.getElementById('practice-input');
  if (inputEl && PRACTICE_PRESETS[presetKey]) {
    inputEl.value = PRACTICE_PRESETS[presetKey];
    updatePracticeVisualStage();
  }
}

function copyPracticeCode() {
  const codeEl = document.getElementById('practice-python-code');
  const labelEl = document.getElementById('copy-practice-label');
  if (!codeEl) return;

  navigator.clipboard.writeText(codeEl.textContent).then(() => {
    if (labelEl) {
      const orig = labelEl.textContent;
      labelEl.textContent = '✅ Copied to Clipboard!';
      setTimeout(() => {
        labelEl.textContent = orig;
      }, 2000);
    }
  });
}

function updatePracticeVisualStage() {
  const inputEl = document.getElementById('practice-input');
  const stageEl = document.getElementById('practice-visual-stage');
  if (!inputEl || !stageEl) return;

  const text = inputEl.value.trim();
  if (!text) {
    stageEl.innerHTML = `<div style="text-align: center; color: var(--text-dim); padding: 2rem;">Please enter or select text above to see live results.</div>`;
    return;
  }

  switch (currentPracticeLab) {
    case 'tokenizer':
      renderTokenizerArena(text, stageEl);
      break;
    case 'stemming':
      renderStemmingArena(text, stageEl);
      break;
    case 'stopwords':
      renderStopwordsDashboard(text, stageEl);
      break;
    case 'lemma':
      renderLemmatizerMatrix(text, stageEl);
      break;
    case 'freqdist':
      renderFreqDistBars(text, stageEl);
      break;
    case 'review':
      renderReviewCleaner(text, stageEl);
      break;
    default:
      renderTokenizerArena(text, stageEl);
  }
}

// 1. Tokenizer Arena Renderer
function renderTokenizerArena(text, container) {
  // Simulate word_tokenize (splits contractions standard NLTK style)
  let wordTok = text
    .replace(/n't\b/gi, " n't")
    .replace(/'s\b/gi, " 's")
    .replace(/'re\b/gi, " 're")
    .replace(/'ve\b/gi, " 've")
    .replace(/'ll\b/gi, " 'll")
    .replace(/'d\b/gi, " 'd")
    .match(/\b[\w$]+(?:\.\d+)?\b|n't|'[a-z]+|[.,!?;:()]/gi) || [];

  // Simulate wordpunct_tokenize (splits every single punctuation char)
  let punctTok = text.match(/\w+|[^\w\s]/g) || [];

  // Simulate TreebankWordTokenizer (standard Penn Treebank)
  let tbTok = text
    .replace(/n't\b/gi, " n't")
    .replace(/'([a-z]+)\b/gi, " '$1")
    .match(/\b[\w$]+(?:\.\d+)?\.?|n't|'[a-z]+|[.,!?;:()]/gi) || [];

  container.innerHTML = `
    <div style="margin-bottom: 1rem; color: var(--text-muted); font-size: 0.85rem;">
      Live side-by-side comparison of 3 tokenizers on the exact same string:
    </div>
    <div class="practice-arena-grid">
      
      <!-- word_tokenize() -->
      <div class="token-box-card">
        <div class="token-box-header">
          <div class="token-box-title">
            <span>✂️</span>
            <span>word_tokenize()</span>
          </div>
          <span class="token-box-badge">${wordTok.length} Tokens</span>
        </div>
        <p style="font-size: 0.75rem; color: var(--text-dim); margin-bottom: 0.75rem;">
          Splits contractions like <code>isn't</code> ➔ <code>['is', "n't"]</code>. Standard for general English.
        </p>
        <div class="token-list" style="max-height: 220px; overflow-y: auto;">
          ${wordTok.map((t, i) => `
            <span class="token-chip" style="background: rgba(56, 189, 248, 0.1); border-color: rgba(56, 189, 248, 0.3); color: #38bdf8;">
              <span class="token-index">#${i}</span>
              <span>${escapeHtml(t)}</span>
            </span>
          `).join('')}
        </div>
      </div>

      <!-- wordpunct_tokenize() -->
      <div class="token-box-card">
        <div class="token-box-header">
          <div class="token-box-title">
            <span>⚡</span>
            <span>wordpunct_tokenize()</span>
          </div>
          <span class="token-box-badge" style="background: rgba(52, 211, 153, 0.12); color: var(--color-word); border-color: rgba(52, 211, 153, 0.3);">${punctTok.length} Tokens</span>
        </div>
        <p style="font-size: 0.75rem; color: var(--text-dim); margin-bottom: 0.75rem;">
          Separates every punctuation mark individually: <code>it's</code> ➔ <code>['it', "'", 's']</code>.
        </p>
        <div class="token-list" style="max-height: 220px; overflow-y: auto;">
          ${punctTok.map((t, i) => `
            <span class="token-chip" style="background: rgba(52, 211, 153, 0.1); border-color: rgba(52, 211, 153, 0.3); color: var(--color-word);">
              <span class="token-index">#${i}</span>
              <span>${escapeHtml(t)}</span>
            </span>
          `).join('')}
        </div>
      </div>

      <!-- TreebankWordTokenizer -->
      <div class="token-box-card">
        <div class="token-box-header">
          <div class="token-box-title">
            <span>🏛️</span>
            <span>TreebankTokenizer</span>
          </div>
          <span class="token-box-badge" style="background: rgba(168, 85, 247, 0.12); color: #c084fc; border-color: rgba(168, 85, 247, 0.3);">${tbTok.length} Tokens</span>
        </div>
        <p style="font-size: 0.75rem; color: var(--text-dim); margin-bottom: 0.75rem;">
          Penn Treebank rules: leaves trailing periods on abbreviations, splits standard contractions.
        </p>
        <div class="token-list" style="max-height: 220px; overflow-y: auto;">
          ${tbTok.map((t, i) => `
            <span class="token-chip" style="background: rgba(168, 85, 247, 0.1); border-color: rgba(168, 85, 247, 0.3); color: #c084fc;">
              <span class="token-index">#${i}</span>
              <span>${escapeHtml(t)}</span>
            </span>
          `).join('')}
        </div>
      </div>

    </div>
  `;
}

// 2. Stemming Arena Renderer
function renderStemmingArena(text, container) {
  const words = text.match(/\b[A-Za-z]+\b/g) || [];
  const uniqueWords = Array.from(new Set(words.map(w => w.toLowerCase())));

  // Emulate Porter, Snowball, and Regexp
  const comparisons = uniqueWords.slice(0, 12).map(w => {
    // Porter heuristics
    let porter = w;
    if (porter.endsWith('ing') && porter.length > 4) porter = porter.slice(0, -3);
    else if (porter.endsWith('ies') && porter.length > 4) porter = porter.slice(0, -3) + 'i';
    else if (porter.endsWith('ly') && porter.length > 4) porter = porter.slice(0, -2);
    else if (porter.endsWith('ed') && porter.length > 4) porter = porter.slice(0, -2);
    else if (porter.endsWith('s') && !porter.endsWith('ss') && porter.length > 3) porter = porter.slice(0, -1);

    // Snowball heuristics (Porter2 handles fairly -> fair, easily -> easi)
    let snowball = porter;
    if (w === 'fairly') snowball = 'fair';
    if (w === 'easily') snowball = 'easili';

    // Regexp (only strips ing$, s$, ed$, ly$)
    let regex = w.replace(/(ing|s|ed|ly)$/i, '');
    if (regex.length < 3) regex = w;

    return { raw: w, porter, snowball, regex };
  });

  container.innerHTML = `
    <div style="margin-bottom: 1rem; color: var(--text-muted); font-size: 0.85rem;">
      Showing heuristic suffix chops for unique words in your input:
    </div>
    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
        <thead>
          <tr style="border-bottom: 2px solid rgba(255, 255, 255, 0.1); color: var(--text-dim); text-transform: uppercase; font-size: 0.72rem; letter-spacing: 0.05em;">
            <th style="padding: 0.75rem 1rem;">Raw Word</th>
            <th style="padding: 0.75rem 1rem; color: var(--color-corpus);">PorterStemmer</th>
            <th style="padding: 0.75rem 1rem; color: var(--color-word);">SnowballStemmer (Porter2)</th>
            <th style="padding: 0.75rem 1rem; color: #c084fc;">RegexpStemmer</th>
          </tr>
        </thead>
        <tbody>
          ${comparisons.map(c => `
            <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.04);">
              <td style="padding: 0.65rem 1rem; font-weight: 700; color: #fff;">${escapeHtml(c.raw)}</td>
              <td style="padding: 0.65rem 1rem; font-family: 'JetBrains Mono', monospace; color: var(--color-corpus);">${escapeHtml(c.porter)}</td>
              <td style="padding: 0.65rem 1rem; font-family: 'JetBrains Mono', monospace; color: var(--color-word);">${escapeHtml(c.snowball)}</td>
              <td style="padding: 0.65rem 1rem; font-family: 'JetBrains Mono', monospace; color: #c084fc;">${escapeHtml(c.regex)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// 3. Stopwords Dashboard Renderer
function renderStopwordsDashboard(text, container) {
  const rawTokens = text.match(/\b[A-Za-z0-9'-]+\b|[^\s\w]/g) || [];
  const total = rawTokens.length;

  const stopList = [];
  const keptList = [];
  const punctList = [];

  rawTokens.forEach(tok => {
    const low = tok.toLowerCase();
    if (/^[.,\/#!$%\^&\*;:{}=\-_`~()?'"“”‘’]+$/.test(tok)) {
      punctList.push(tok);
    } else if (NLTK_STOPWORDS.has(low)) {
      stopList.push(tok);
    } else {
      keptList.push(tok);
    }
  });

  const noiseCount = stopList.length + punctList.length;
  const reductionPct = total > 0 ? ((noiseCount / total) * 100).toFixed(1) : '0.0';

  container.innerHTML = `
    <!-- Reduction Dashboard Stats -->
    <div class="reduction-dashboard">
      <div class="metric-stat-box">
        <span class="metric-stat-value" style="color: var(--color-corpus);">${total}</span>
        <span class="metric-stat-label">Total Raw Tokens</span>
      </div>
      <div class="metric-stat-box">
        <span class="metric-stat-value" style="color: #fb7185;">${stopList.length}</span>
        <span class="metric-stat-label">Stopwords Filtered</span>
      </div>
      <div class="metric-stat-box">
        <span class="metric-stat-value" style="color: var(--color-word);">${keptList.length}</span>
        <span class="metric-stat-label">Meaningful Words</span>
      </div>
      <div class="metric-stat-box">
        <span class="metric-stat-value" style="color: #f59e0b;">${reductionPct}%</span>
        <span class="metric-stat-label">Noise Reduction Rate</span>
        <div class="reduction-progress-bar">
          <div class="reduction-progress-fill" style="width: ${reductionPct}%;"></div>
        </div>
      </div>
    </div>

    <!-- Chips breakdown -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
      <div class="token-box-card">
        <div class="token-box-header">
          <span class="token-box-title" style="color: #fb7185;">🛑 Removed Stopwords (${stopList.length})</span>
        </div>
        <div class="token-list" style="max-height: 180px; overflow-y: auto;">
          ${stopList.map(s => `<span class="token-chip" style="background: rgba(251, 113, 133, 0.1); border-color: rgba(251, 113, 133, 0.25); color: #fb7185;">${escapeHtml(s)}</span>`).join('') || '<span style="color:var(--text-dim); font-size:0.8rem;">No stopwords found</span>'}
        </div>
      </div>

      <div class="token-box-card">
        <div class="token-box-header">
          <span class="token-box-title" style="color: var(--color-word);">✨ Preserved Core Content (${keptList.length})</span>
        </div>
        <div class="token-list" style="max-height: 180px; overflow-y: auto;">
          ${keptList.map(k => `<span class="token-chip" style="background: rgba(52, 211, 153, 0.1); border-color: rgba(52, 211, 153, 0.25); color: var(--color-word);">#${escapeHtml(k)}</span>`).join('') || '<span style="color:var(--text-dim); font-size:0.8rem;">No words kept</span>'}
        </div>
      </div>
    </div>
  `;
}

// 4. Lemmatizer Matrix Renderer
function renderLemmatizerMatrix(text, container) {
  const dictionaryExamples = [
    { word: 'running', pos: 'v (Verb)', lemma: 'run', note: 'Accurately restores base verb' },
    { word: 'better', pos: 'a (Adjective)', lemma: 'good', note: 'Irregular comparative ➔ base root' },
    { word: 'worst', pos: 'a (Adjective)', lemma: 'bad', note: 'Irregular superlative ➔ base root' },
    { word: 'studies', pos: 'v (Verb)', lemma: 'study', note: 'Third-person singular ➔ base form' },
    { word: 'studies', pos: 'n (Noun)', lemma: 'study', note: 'Plural noun ➔ singular root' },
    { word: 'corpora', pos: 'n (Noun)', lemma: 'corpus', note: 'Latin plural ➔ authentic singular lemma' },
    { word: 'leaves', pos: 'n (Noun)', lemma: 'leaf', note: 'Plural noun ➔ singular leaf' },
    { word: 'leaves', pos: 'v (Verb)', lemma: 'leave', note: 'Verb ➔ infinitive leave' }
  ];

  container.innerHTML = `
    <div style="margin-bottom: 1rem; color: var(--text-muted); font-size: 0.85rem;">
      Unlike Stemming's naive suffix chopping, <strong>WordNetLemmatizer</strong> queries an authentic English morphological database with POS:
    </div>
    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
        <thead>
          <tr style="border-bottom: 2px solid rgba(255, 255, 255, 0.1); color: var(--text-dim); text-transform: uppercase; font-size: 0.72rem; letter-spacing: 0.05em;">
            <th style="padding: 0.75rem 1rem;">Target Word</th>
            <th style="padding: 0.75rem 1rem; color: #c084fc;">Supplied POS Tag</th>
            <th style="padding: 0.75rem 1rem; color: var(--color-word);">Lemmatized Base (WordNet)</th>
            <th style="padding: 0.75rem 1rem; color: var(--text-dim);">Linguistic Benefit</th>
          </tr>
        </thead>
        <tbody>
          ${dictionaryExamples.map(d => `
            <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.04);">
              <td style="padding: 0.65rem 1rem; font-weight: 700; color: #fff;">${d.word}</td>
              <td style="padding: 0.65rem 1rem; font-family: 'JetBrains Mono', monospace; color: #c084fc;">${d.pos}</td>
              <td style="padding: 0.65rem 1rem; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: var(--color-word);">${d.lemma} ✅</td>
              <td style="padding: 0.65rem 1rem; color: var(--text-muted); font-size: 0.8rem;">${d.note}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// 5. Frequency Distribution Bars Renderer
function renderFreqDistBars(text, container) {
  const words = (text.match(/\b[A-Za-z0-9'-]+\b/g) || [])
    .map(w => w.toLowerCase())
    .filter(w => !NLTK_STOPWORDS.has(w) && w.length > 1);

  const freqMap = new Map();
  words.forEach(w => freqMap.set(w, (freqMap.get(w) || 0) + 1));

  const sorted = Array.from(freqMap.entries()).sort((a, b) => b[1] - a[1]);
  const totalTokens = words.length;
  const uniqueVocab = sorted.length;
  const lexicalDiv = totalTokens > 0 ? ((uniqueVocab / totalTokens) * 100).toFixed(1) : '0.0';
  const maxFreq = sorted.length > 0 ? sorted[0][1] : 1;

  container.innerHTML = `
    <!-- Vocabulary Metrics -->
    <div class="reduction-dashboard" style="margin-bottom: 1.5rem;">
      <div class="metric-stat-box">
        <span class="metric-stat-value" style="color: var(--color-corpus);">${totalTokens}</span>
        <span class="metric-stat-label">Meaningful Tokens</span>
      </div>
      <div class="metric-stat-box">
        <span class="metric-stat-value" style="color: var(--color-vocab);">${uniqueVocab}</span>
        <span class="metric-stat-label">Unique Vocabulary</span>
      </div>
      <div class="metric-stat-box">
        <span class="metric-stat-value" style="color: var(--color-word);">${lexicalDiv}%</span>
        <span class="metric-stat-label">Lexical Diversity</span>
      </div>
    </div>

    <!-- Frequency Bars -->
    <div class="token-box-card">
      <div class="token-box-header">
        <span class="token-box-title" style="color: var(--color-vocab);">📊 Top Word Frequencies (ASCII Bar Chart)</span>
        <span class="token-box-badge" style="background: rgba(245, 158, 11, 0.12); color: var(--color-vocab); border-color: rgba(245, 158, 11, 0.3);">Top ${Math.min(8, sorted.length)}</span>
      </div>
      <div style="margin-top: 0.5rem;">
        ${sorted.slice(0, 8).map(([w, cnt]) => {
          const pct = Math.max(8, (cnt / maxFreq) * 100);
          return `
            <div class="practice-bar-row">
              <span class="practice-bar-word">${escapeHtml(w)}</span>
              <div class="practice-bar-track">
                <div class="practice-bar-fill" style="width: ${pct}%;"></div>
              </div>
              <span class="practice-bar-count">${cnt}</span>
            </div>
          `;
        }).join('') || '<div style="color:var(--text-dim); padding:1rem; text-align:center;">No frequent words detected</div>'}
      </div>
    </div>
  `;
}

// 6. Review Cleaner Renderer
function renderReviewCleaner(text, container) {
  const rawTokens = text.match(/\b[A-Za-z0-9'-]+\b|[^\s\w]/g) || [];
  
  // Clean tokens: lowercase, no punctuation, no stopwords
  const cleanTokens = rawTokens
    .map(w => w.toLowerCase())
    .filter(w => !NLTK_STOPWORDS.has(w) && /^[A-Za-z0-9]+$/.test(w));

  // Lemmatized keywords
  const keywords = cleanTokens.map(w => {
    if (w.endsWith('ing') && w.length > 4) return w.slice(0, -3);
    if (w.endsWith('ed') && w.length > 4) return w.slice(0, -2);
    if (w.endsWith('s') && !w.endsWith('ss') && w.length > 3) return w.slice(0, -1);
    return w;
  });

  const uniqueKeywords = Array.from(new Set(keywords));

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
      
      <!-- Raw Text -->
      <div class="token-box-card">
        <div class="token-box-header">
          <span class="token-box-title" style="color: #fb7185;">🔍 Unstructured Raw Review</span>
          <span class="token-box-badge" style="background: rgba(251, 113, 133, 0.1); color: #fb7185;">${rawTokens.length} Tokens</span>
        </div>
        <div style="background: rgba(0,0,0,0.3); border-radius: 8px; padding: 0.85rem; font-size: 0.82rem; color: var(--text-muted); line-height: 1.5; font-family: 'JetBrains Mono', monospace;">
          ${escapeHtml(text)}
        </div>
      </div>

      <!-- Clean Keywords Extracted -->
      <div class="token-box-card">
        <div class="token-box-header">
          <span class="token-box-title" style="color: #c084fc;">✨ Clean Extracted Signals</span>
          <span class="token-box-badge" style="background: rgba(168, 85, 247, 0.12); color: #c084fc;">${uniqueKeywords.length} Topics</span>
        </div>
        <p style="font-size: 0.75rem; color: var(--text-dim); margin-bottom: 0.75rem;">
          Low-value noise stripped, words lowercased and lemmatized for Machine Learning sentiment classifier:
        </p>
        <div class="token-list">
          ${uniqueKeywords.map(k => `
            <span class="token-chip" style="background: rgba(168, 85, 247, 0.12); border-color: rgba(168, 85, 247, 0.3); color: #c084fc;">
              ★ ${escapeHtml(k)}
            </span>
          `).join('')}
        </div>
      </div>

    </div>
  `;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

