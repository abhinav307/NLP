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

## 💻 How to Run Locally

No build step or server required! Simply clone and open `index.html`:

```bash
git clone https://github.com/abhinav307/NLP.git
cd NLP
# Open index.html in your default web browser
```
