export class AudioManager {
  private bgm: HTMLAudioElement;

  constructor() {
    this.bgm = new Audio('assets/audio/bgm.mp3');
    this.bgm.loop = true;

    // BGM이 끝나기 0.5초 전에 처음부터 다시 재생
    this.bgm.addEventListener('timeupdate', () => {
      if (this.bgm.currentTime > this.bgm.duration - 1.5) {
        this.bgm.currentTime = 0;
      }
    });
  }

  public playBGM(): void {
    this.bgm.play();
  }

  public stopBGM(): void {
    this.bgm.pause();
    this.bgm.currentTime = 0;
  }

  public setBGMVolume(volume: number): void {
    this.bgm.volume = Math.max(0, Math.min(1, volume));
  }
}
