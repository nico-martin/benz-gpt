const mapRange = (
  value: number,
  minInput: number,
  maxInput: number,
  minOutput: number,
  maxOutput: number
): number =>
  minOutput +
  ((value - minInput) * (maxOutput - minOutput)) / (maxInput - minInput);

export default mapRange;
