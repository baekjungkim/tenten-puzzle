export class AudioManager {
  private bgm: HTMLAudioElement;
  private isInitialized: boolean = false;
  private currentVolume: number = 0.5;

  constructor() {
    this.bgm = new Audio('assets/audio/bgm.mp3');
    this.bgm.loop = true;

    // 볼륨 초기화
    const volumeSlider = document.getElementById('bgmVolume') as HTMLInputElement;
    if (volumeSlider) {
      this.currentVolume = parseInt(volumeSlider.value) / 100;
      this.bgm.volume = this.currentVolume;
    }

    // 모바일에서 오디오 초기화를 위한 이벤트 리스너
    document.addEventListener(
      'touchstart',
      () => {
        if (!this.isInitialized) {
          // 음소거로 재생했다가 바로 멈춤으로써 오디오 컨텍스트 초기화
          this.bgm.volume = 0;
          this.bgm.play().then(() => {
            this.bgm.pause();
            this.bgm.currentTime = 0;
            this.isInitialized = true;
            // 저장된 볼륨으로 복구
            this.bgm.volume = this.currentVolume;
          });
        }
      },
      { once: true }
    );

    // BGM이 끝나기 1.5초 전에 처음부터 다시 재생
    this.bgm.addEventListener('timeupdate', () => {
      if (this.bgm.currentTime > this.bgm.duration - 1.5) {
        this.bgm.currentTime = 0;
      }
    });
  }

  public playBGM(): void {
    this.bgm.volume = this.currentVolume;
    const playPromise = this.bgm.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        console.log('Autoplay prevented');
      });
    }
  }

  public stopBGM(): void {
    this.bgm.pause();
    this.bgm.currentTime = 0;
  }

  public setBGMVolume(volume: number): void {
    this.currentVolume = Math.max(0, Math.min(1, volume));
    this.bgm.volume = this.currentVolume;
  }
}
