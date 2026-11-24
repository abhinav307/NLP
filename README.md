# NLP - Basic Natural Language Processing Study Platform

An interactive, visual, study-based platform for mastering fundamental Natural Language Processing (NLP) concepts and the Python NLTK library.

---

## 🚀 Features & Modules

### 🏛️ Module 01: NLP Pillars (The 4 Core Foundations)
- **Corpus = Paragraph:** The complete container holding all sentences.
- **Document = Sentence:** Individual standalone communication units.
- **Word = Token:** Discrete atomic tokens parsed and counted.
- **Vocabulary = Unique Word:** The deduplicated distinct word set.
- **Interactive Visual Conversion Pipeline:** Watch text convert stage-by-stage:
  $$\text{Corpus (Paragraph)} \to \text{Document (Sentences)} \to \text{Word (Tokens)} \to \text{Vocabulary (Unique)}$$

---

### 🐍 Module 02: Python NLTK Library Masterclass
Comprehensive documentation, code examples, and use cases for:
- **Installation & Setup:** `pip install nltk` and `nltk.download()` best practices.
- **Tokenization:** `word_tokenize()`, `sent_tokenize()`, and `RegexpTokenizer`.
- **Corpora & Datasets:** `nltk.corpus` (Gutenberg, Brown, etc.).
- **Stopwords Removal:** `nltk.corpus.stopwords.words('english')`.
- **Stemming & Lemmatization:** `PorterStemmer` vs. `WordNetLemmatizer`.
- **Frequency Distribution:** `FreqDist(tokens)` with vocabulary analysis.
- **POS Tagging & NER:** `pos_tag()` and `ne_chunk()`.
- **In-Browser Interactive NLTK Simulator:** Test NLTK operations live in client-side JavaScript.

---

### 🧪 Module 03: Practice 1 — Hands-On NLP Practical Lab
Direct visual companion to `NLP practice/NLP learning.ipynb`:
- **Unit 1: Tokenizer Arena:** Benchmark `word_tokenize`, `wordpunct_tokenize`, and `TreebankWordTokenizer` on contractions, money, and abbreviations.
- **Unit 2: Stemming Slicers:** Compare `PorterStemmer`, `SnowballStemmer`, and `RegexpStemmer` side-by-side.
- **Unit 3: Stopword Noise Reducer:** Real-time data compression and noise reduction percentage meter.
- **Unit 4: Lemmatizer with POS Tagging:** WordNet morphological dictionary lookups with Verb, Adjective, and Noun tags.
- **Unit 5: Frequency Distribution & Vocabulary:** Interactive horizontal frequency distribution bars and Lexical Diversity calculation.
- **Unit 6: Real-World Text Cleaner:** Practical production cleaning of messy customer reviews into clean machine learning features.

---

## 📓 Jupyter Notebooks (`NLP practice/`)
- `NLP practice/NLP learning.ipynb`: Interactive Jupyter practice notebook with Units 1 through 6 and pre-computed visual ASCII outputs.
- `NLP practice/4-tokenization Example using NLTK.ipynb`: Tokenization and Stemming walkthroughs.
- `NLP practice/5-Stemming and Lemmatization using NLTK.ipynb`: Dedicated Stemming and Lemmatization experiments.


---

## 💻 How to Run Locally

No build step or server required! Simply clone and open `index.html`:

```bash
git clone https://github.com/abhinav307/NLP.git
cd NLP
# Open index.html in your default web browser
```
