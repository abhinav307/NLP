# NLP - Basic Natural Language Processing Study Platform

An interactive, visual, study-based platform for mastering fundamental Natural Language Processing (NLP) concepts and the Python NLTK library.

---

## 🚀 Curriculum: 6 Complete Visual Units

### 🏛️ Unit 01: NLP Pillars (`study.html`)
The 4 core foundations of NLP:
- **Corpus = Paragraph:** The complete container holding all sentences.
- **Document = Sentence:** Standalone communicative clauses.
- **Word = Token:** Discrete atomic words.
- **Vocabulary = Unique Word:** The deduplicated distinct vocabulary set.
- **Live 4-Stage Conversion Pipeline:** Watch text convert stage-by-stage visually.

### 🐍 Unit 02: NLTK Visual Studio (`nltk.html`)
- Interactive NLTK Master Architecture & Tree Diagram.
- Real-time client-side NLTK Simulator in-browser.
- Quick Directory of core NLTK classes and functions.

### ✂️ Unit 03: Tokenization Practice (`tokenization.html`)
- Sourced from `tokenization Example using NLTK.ipynb`.
- **sent_tokenize():** Paragraph ➔ Documents (Sentences).
- **word_tokenize():** Sentence ➔ Words with contraction handling.
- **wordpunct_tokenize():** Punctuation-based isolation.
- **TreebankWordTokenizer():** Penn Treebank rules & trailing period handling.
- **3-Way Benchmark Arena:** Side-by-side comparative live playground.

### 🌱 Unit 04: Stemming & Its Types (`stemming.html`)
- Sourced from `Stemming And its Types- Text Processing.ipynb`.
- **PorterStemmer:** Rule-based suffix stripping (`sitting` 😘 vs. `congratulations` 😒).
- **RegexpStemmer (`ing$|s$|e$|able$`, min=4):** Custom regex rules & edge cases (`table` ➔ `t` 😒, `sing` ➔ `s` 😒).
- **SnowballStemmer (Porter2):** Improved English handling (`fairly` ➔ `fair`, `sportingly` ➔ `sport`).
- **Live 3-Way Suffix Slicer Table:** Side-by-side comparison on 32 notebook words.

### 🛑 Unit 05: Stopwords Preprocessing (`stopwords.html`)
- Sourced from `Text Preprocessing-Stopwords with NLTK.ipynb`.
- **Live Noise Reduction Dashboard:** Total raw tokens, stopwords filtered, and compression meter (~48% noise reduction).
- **Preserved vs Filtered Chips:** Visual red/green word tags.
- Multi-language stopword corpora exploration.

### 📚 Unit 06: Lemmatization Processing (`lemmatization.html`)
- Sourced from `Lemmatization- Text Processing.ipynb`.
- **WordNetLemmatizer:** Authentic morphological dictionary roots.
- **The 4 POS Tags:** Noun (`'n'`), Verb (`'v'`), Adjective (`'a'`), Adverb (`'r'`).
- Multi-POS live matrix on irregular words (`going`, `better`, `wolves`, `flies`).
- Real-world use cases: Q&A Systems, Conversational Chatbots, Text Summarization.

---

## 📓 User Notebook Practice Sources (`NLP practice/`)
- `tokenization Example using NLTK.ipynb`: Tokenization practice source.
- `Stemming And its Types- Text Processing.ipynb`: Stemming experiments source.
- `Text Preprocessing-Stopwords with NLTK.ipynb`: Stopwords practice source.
- `Lemmatization- Text Processing.ipynb`: WordNet Lemmatization source.
*(Note: All `.ipynb` files are strictly read-only practice sources and remain untouched)*


---

## 💻 How to Run Locally

No build step or server required! Simply clone and open `index.html`:

```bash
git clone https://github.com/abhinav307/NLP.git
cd NLP
# Open index.html in your default web browser
```
