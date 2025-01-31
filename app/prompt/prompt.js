import { encode } from 'gpt-3-encoder';
import { t } from '../../locales/index.js';
import { PARTICIPANT_AI } from '../../services/openai.js';
import Sentence from './sentence.js';

const MAX_SENTENCES = 16;
const MAX_TOKENS = 1024;

class Prompt {
  sentences = [];

  constructor() {
    this.write(PARTICIPANT_AI, t('__COMPLETION_INIT_MESSAGE'));
  }

  /**
   * @returns {Sentence}
   */
  get lastSentence() {
    return this.sentences.length > 0 ? this.sentences[this.sentences.length - 1] : null;
  }

  get tokenCount() {
    const encoded = encode(this.toString());
    return encoded.length;
  }

  /**
   * @param {string} title
   * @param {string} text
   */
  write(title, text = '') {
    if (this.sentences.length >= MAX_SENTENCES || this.tokenCount >= MAX_TOKENS) {
      this.sentences.shift();
    }
    this.sentences.push(new Sentence({ title, text }));
    return this;
  }

  /**
   * @param {string} text
   */
  patch(text) {
    this.sentences[this.sentences.length - 1].text += text;
  }

  toString() {
    return "我希您用個一個老人的角度回答問題。 回答的時候可以多用慈祥老人的語氣，感嘆詞或情緒，用括弧表示，例如（呀）。"+ this.sentences.map((sentence) => sentence.toString()).join('');
  }
}

export default Prompt;
