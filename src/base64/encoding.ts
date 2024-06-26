export default function base64Decode(inputs: any[]): any[] {
  return inputs.map(input => {
    try {
      // handle properly formatted string
      return window.atob(decodeURIComponent(input));
    } catch {
      // else return input
      return input;
    }
  });
}
