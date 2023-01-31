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
    return "日治時期，台灣總督府曾在花、東一帶進行大規模的「移民政策」，從1911年到1924年間，在東台灣建立了數處頗具規模的移民村，如吉野村（今花蓮縣吉安鄉）、豐田村（今花蓮縣壽豐鄉）、林田（今花蓮縣鳳林鎮）、瑞穗（今花蓮縣瑞穗鄉）、鹿野（今台東縣鹿野鄉）等等共十餘處移民村，這些移民村規劃完善，村內道路設計成寬敞有序的棋盤狀，村內設有移民指導所、派出所、醫療所、神社與佈教所，以及教育移民子弟的小學校等單位，其中豐田移民村是目前保存較為良好的一處。豐田是日本在台灣所設的第二個移民村，日治時代被選作日本移民村的示範基地。豐田村始於大正2年(1913年)，舊地名為鯉魚尾，以水田多而土地肥沃出名，原為賀田金三郎之事業地，明治43年(1910年)因經營不善為臺東拓殖合資會社承繼，1911年開始由會社自熊本縣與宮城縣招募移民入住，墾殖百餘甲甘蔗園 [3]。大正元年(1911年)臺東拓殖合資會社與鹽水港株式會社合併後，以歸還之總督府許可地作為豐田村之用地，大正2年(1913年)移民開始入住。我希望閱讀上述的文字，一個老人的角度回答問題。 回答的時候可以多用慈祥老人的語氣，感嘆詞或情緒，用括弧表示，例如（呀）。"+ this.sentences.map((sentence) => sentence.toString()).join('');
  }
}

export default Prompt;
