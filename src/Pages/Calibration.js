import React from 'react';
import FileUpload from '../Components/FileUpload';

/**
 * Class for Day 1: Chronal Calibration.
 */
class Calibration extends React.Component {
  state = {
    /** The final frequency */
    frequency: null,
    /** The first doubled frequency */
    doubleFreq: null,
  };

  /**
   * Process the frequency input file.
   *
   * Just adds up all of the numbers in the input file, then sets frequency value in the state.
   * @param {array} data - File data separated into lines.
   */
  processFile(data) {
    let frequency = null;     // The final frequency
    let runningFrequency = 0; // The running frequency
    let doubleFreq = null; // The first frequency we hit twice
    let visitedFrequencies = {0: true}; // A list of all frequencies we've seen

    // Keep looping through the loop until we find a doubled frequency.
    while (doubleFreq===null) {
      // Go through each line of the input file while we're still looking for something. This
      for (let lineNum = 0; lineNum < data.length && (frequency===null || doubleFreq===null); lineNum++) {
        let delta = parseInt(data[lineNum]);
        if (!isNaN(delta)) { // Don't do anything if the delta isn't an integer.
          runningFrequency += delta; // Add the delta to the frequency

          // Are we still looking for a doubled frequency? If so, check this number.
          if (doubleFreq === null) {
            // Record the frequency as doubleFreq if we've seen it before.
            doubleFreq = typeof visitedFrequencies[runningFrequency] !== 'undefined' ? runningFrequency : null;
            // Otherwise, just make a note of it.
            visitedFrequencies[runningFrequency]=true;
          }
        }
      }
      if (frequency===null) {
        frequency = runningFrequency;
      }
    }

    // Update our state with the findings.
    this.setState({frequency, doubleFreq});
  }

  /**
   * Render lifecycle function
   */
  render() {
    return (
      <div>
        <FileUpload onUpload={ (data) => this.processFile(data) } /> <br />
        { this.state.frequency && `Frequency: ${this.state.frequency}` } <br />
        { this.state.doubleFreq && `First doubled frequency: ${this.state.doubleFreq}` }
      </div>
    );
  }
}

export default Calibration;
