import React from 'react';

import FileUpload from '../Components/FileUpload';

/**
 * Class for day 2 - Inventory Management System
 */
class InventoryManagementSystem extends React.Component {
  state = {
    checksum: null,
    commonLetters: '',
  };

  /**
   * Get the checksum value for the ID input file.
   *
   * This will be the number of IDs that contain a letter exactly twice times
   * the number of IDs that contain a letter exactly thrice.
   * @param {Array} data - Data file lines
   * @return {int} checksum
   */
  getChecksum(data) {
    let twoLetterIds = 0;
    let threeLetterIds = 0;

    data.forEach( id => {
      let counts = {};
      // Rip the ID into individual letters, count the number of times each
      // letter appears, then see if any of them appear 2 or 3 times.
      const exploded = id.split('');
      exploded.forEach( letter => counts[letter] ? counts[letter]++ : counts[letter]=1 );
      twoLetterIds   += Object.keys(counts).findIndex( key => counts[key]===2 ) !== -1 ? 1 : 0;
      threeLetterIds += Object.keys(counts).findIndex( key => counts[key]===3 ) !== -1 ? 1 : 0;
    });

    // The checksum
    return twoLetterIds * threeLetterIds;
  }

  /**
   * Find the two IDs that differ by only one letter and return the common letters.
   * @param {Object} data - Data file lines
   * @return {String} Common letters.
   */
  getCommonLetters(data) {
    let commonLetters = '';
    // Go through the list of IDs
    for (let idx1 = 0; idx1 < data.length && commonLetters===''; idx1++) {
      const id1 = data[idx1];
      // Compare each ID to all of the IDs after it
      for (let idx2 = idx1+1; idx2 < data.length && commonLetters===''; idx2++) {
        const id2 = data[idx2];
        let errors = 0;

        // Go through the letters in the two IDs; see if there's exactly one
        // differing letter.
        for (let letterIdx = 0; letterIdx < id1.length && errors <= 1; letterIdx++) {
          if (id1[letterIdx] === id2[letterIdx]) {
            commonLetters+= id1[letterIdx];
          }
          else {
            errors++;
          }
        }

        // If there were too many error characters, throw it away.
        if (errors !== 1) {
          commonLetters = '';
        }
      }
    }

    return commonLetters;
  }

  /**
   * Callback handler for when the file is uploaded.
   * Handles the processing for day 2
   */
  processFile(data) {
    const checksum = this.getChecksum(data);
    const commonLetters = this.getCommonLetters(data);
    this.setState({checksum, commonLetters});
  }

  /**
   * Render lifecycle function
   */
  render() {
    return (
      <div>
        <h2>Day 2: Inventory Management System</h2>
        <FileUpload onUpload={(data) => this.processFile(data)} /><br/>
        {this.state.checksum!==null && `Checksum: ${this.state.checksum}`}<br/>
        {this.state.commonLetters !== '' && `Common letters: ${this.state.commonLetters}`}
      </div>
    );
  }
}

export default InventoryManagementSystem;
