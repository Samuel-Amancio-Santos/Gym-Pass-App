export class MaxDistanceError extends Error {
  constructor() {
    super(
      'Max distance reached,You need to be closer than 100 meters to the gym',
    )
  }
}
