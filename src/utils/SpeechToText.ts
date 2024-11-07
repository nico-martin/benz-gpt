class SpeechToText {
  private recognition: SpeechRecognition;

  public start = () => {
    if (this.recognition) {
      throw new Error('Already started');
    }
    this.recognition = new webkitSpeechRecognition();
    this.recognition.lang = 'en-US';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 5;
    this.recognition.start();
  };

  public stop = () =>
    new Promise<string>((resolve) => {
      if (!this.recognition) {
        throw new Error('Not started');
      }
      this.recognition.onresult = (event) => {
        resolve(event.results[0][0].transcript);
      };
      this.recognition.stop();
      this.recognition = null;
    });
}

export default SpeechToText;
