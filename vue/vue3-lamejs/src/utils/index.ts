import * as lamejs from "lamejs";
import fs from "fs";

/**
 * @description 文字转语音方法
 * @public
 * @param { text, rate, lang, volume, pitch, startEvent, endEvent } object
 * @param text 要合成的文字内容，字符串
 * @param rate 读取文字的语速 0.1~10 正常1
 * @param lang 读取文字时的语言
 * @param volume 读取时声音的音量 0~1 正常1
 * @param pitch 读取时声音的音高 0~2 正常1
 * @param startEvent 播放开始时间
 * @param endEvent 播放结束时间
 * @returns SpeechSynthesisUtterance
 */
interface SpeakParams {
  text: string;
  rate?: number;
  lang?: string;
  volume?: number;
  pitch?: number;
  endEvent?: Function;
  startEvent?: Function;
  onboundaryEvent?: Function;
}

export class SpeechPlayer {
  private utterance: SpeechSynthesisUtterance;
  private isPlaying: boolean;

  constructor({
    text,
    rate = 1,
    lang = "zh-CN",
    volume = 1,
    pitch = 1,
    endEvent,
    startEvent,
    onboundaryEvent,
  }: SpeakParams) {
    this.utterance = new SpeechSynthesisUtterance();
    this.utterance.text = text;
    this.utterance.rate = rate;
    this.utterance.lang = lang;
    this.utterance.volume = volume;
    this.utterance.pitch = pitch;
    this.isPlaying = false;
    this.utterance.onstart = (e): void => startEvent && startEvent(e);
    this.utterance.onend = (e): void => endEvent && endEvent(e);
    this.utterance.onboundary = (e): void =>
      onboundaryEvent && onboundaryEvent(e, this.utterance);
  }

  // 设置语音类型
  public setVoice(name = "Yaoyao"): void {
    const voices = speechSynthesis.getVoices();
    const findVoice = voices.find((i) => i.name.includes(name));
    findVoice && (this.utterance.voice = findVoice);
  }

  // 开始播放
  public start(): void {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.setVoice();
      speechSynthesis.speak(this.utterance);
    }
  }

  // 暂停
  public pause(): void {
    if (this.isPlaying) {
      this.isPlaying = false;
      speechSynthesis.pause();
    }
  }

  // 恢复播放
  public resume(): void {
    if (!this.isPlaying) {
      this.isPlaying = true;
      speechSynthesis.resume();
    }
  }

  // 清空播放列表
  public cancel(): void {
    this.isPlaying = false;
    speechSynthesis.cancel();
  }
}

// 将 WAV URL 转换为 MP3
export async function wavToMp3(wavUrl: string) {
  try {
    // 下载 WAV 文件
    const response = await fetch(wavUrl);

    console.log(response, "response");

    const wavData = await response.arrayBuffer();

    console.log(new DataView(wavData).buffer, "new DataView(wavData)");

    // 解析 WAV 文件
    const wav = lamejs.WavHeader.readHeader(new DataView(wavData).buffer);

    console.log(wav, "wav");

    // 获取 PCM 数据
    const samples = new Int16Array(
      wavData,
      wav.dataOffset,
      wav.dataLen / 2 // 2 bytes per sample (16-bit PCM)
    );

    // 创建 LAME MP3 编码器实例
    const mp3Encoder = new lamejs.Mp3Encoder(wav.channels, wav.sampleRate, 128);

    // 编码 PCM 数据为 MP3
    const blockSize = 1152;
    const mp3Buffer = [];

    for (let i = 0; i < samples.length; i += blockSize) {
      const input = samples.subarray(i, i + blockSize);
      const mp3Data = mp3Encoder.encodeBuffer(input);
      mp3Buffer.push(...mp3Data);
    }

    const finalMp3Data = mp3Encoder.flush();
    mp3Buffer.push(...finalMp3Data);

    // 将 MP3 数据存储为 Uint8Array
    const mp3DataArray = new Uint8Array(mp3Buffer);

    // 返回 MP3 数据
    return mp3DataArray;
  } catch (error) {
    console.error("转换出错：", error);
    return null;
  }
}
