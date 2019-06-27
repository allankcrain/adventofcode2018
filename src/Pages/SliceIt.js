import React from 'react';

import ProgressBar from 'react-bootstrap/ProgressBar';

import FileUpload from '../Components/FileUpload';


class SliceIt extends React.Component {
  state = {
    /** The total count of disputed square inches for the final result. */
    disputedSquareInches: null,
    /** The ID number of the claim with no overlaps */
    cleanId: null,
    /** Progress bar variables */
    progress: null,
  }

  /**
   * Callback function for when the Submit button is pressed.
   * Clears out the old results and starts the background process to find overlaps.
   * @param {object} data - Unparsed claim data
   */
  handleSubmit(data) {
    // Clear old data, then launch the background process when that setstate resolves.
    this.setState({
      progress: null,
      cleanId: null,
      disputedSquareInches: null,
    }, () => this.backgroundFindOverlaps(this.findOverlaps(this.parseClaims(data))));
  }

  /**
   * Run the Find Overlaps process in the background.
   * @param {function*} generator - Generator function that yields progress results
   */
  backgroundFindOverlaps(generator){
    const result = generator.next();
    if (!result.done) {
      this.setState({progress: result.value}, () => setTimeout(() => this.backgroundFindOverlaps(generator)));
    }
  }

  /**
   * Parse the claim data from the input file.
   *
   * Finds the rectangle of each claim and stores them all in state.claims.
   * @param {Array} data - Array of claim lines.
   * @return {Array} Array of objects of shape {id, x1, y1, x2, y2, width, height}
   */
  parseClaims(data) {
    // Claims are of the form "#47 @ 192,552: 17x26"
    const claimRegex = /#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/;
    const claims = data.map( line => {
      // Separate out the numbers (and convert them from strings)
      const [, id, x1,y1, width,height] = line.match(claimRegex).map(num => parseInt(num));
      // Calculate the other X and Y corners, since that makes calculations a little easier than width x height
      const x2 = x1+width-1;
      const y2 = y1+height-1;
      // Bundle it up
      return {id, x1,y1,x2,y2, width,height};
    });

    return claims;
  }

  /**
   * Check whether the two given claims overlap.
   * @param {Object} claim1
   * @param {Object} claim2
   * @return {bool}
   */
  overlaps(claim1, claim2) {
    // The logic here is a little backwards. Basically, they definitely don't
    // overlap if the right edge of one is further left than the left edge of
    // the other. Do that for all four edges and invert the result.
    return !(
      claim1.x1 > claim2.x2 ||
      claim1.x2 < claim2.x1 ||
      claim1.y1 > claim2.y2 ||
      claim1.y2 < claim2.y1
    )
  }

  /**
   * Get an array of all of the {x,y} points in the given claim.
   * @param {Object} claim
   * @return {Array} Array of the form [{x,y}, {x1, y1}, ... {xN,yN}]
   */
  getDots(claim) {
    const dots = [];
    for (let x=claim.x1; x<=claim.x2; x++){
      for (let y=claim.y1; y<=claim.y2; y++) {
        dots.push({x,y});
      }
    }
    return dots;
  }

  /**
   * Find all of the overlapping squares
   *
   * @param {Array} claims - Array of Claim objects.
   * @return {int} - Number of square inches that are disputed.
   */
  * findOverlaps(claims) {
    const disputes = [];
    const idDisputeStatus = [];
    claims.forEach(claim => idDisputeStatus[claim.id-1] = false);

    const isInBounds = (dot, claim) =>
      dot.x >= claim.x1 &&
      dot.x <= claim.x2 &&
      dot.y >= claim.y1 &&
      dot.y <= claim.y2;

    // My algorithm runs in O(triangle(n-1)). I.e., for n=10, it needs to run 9+8+7+6+5+4+3+2+1 times.
    // The lines below calculate the the total number of loops we gotta do.
    // Thanks, google search for "Factorial but addition"
    const max = ((claims.length-1) * claims.length)/2;
    let now = 1;

    // Compare each claim to all of the claims after it
    for (let claimIdx1 = 0; claimIdx1 < claims.length; claimIdx1++) {
      // Briefly pause processing so we can update the progress bar.
      yield {max, now, label: `Checking ${claimIdx1+1} of ${claims.length}`};

      const claim1 = claims[claimIdx1];
      for (let claimIdx2 = claimIdx1+1; claimIdx2 < claims.length; claimIdx2++) {
        now++;
        const claim2 = claims[claimIdx2];
        // Check if claim 1 overlaps claim 2
        if (this.overlaps(claim1, claim2)) {
          const dots1 = this.getDots(claim1);
          dots1.forEach( dot1 => {
            // If the dot from 1 is in claim 2, but not already noted, add it to the disputes.
            if (isInBounds(dot1, claim2) && !disputes.find( dot2 => dot1.x===dot2.x && dot1.y===dot2.y)){
              disputes.push(dot1);
              idDisputeStatus[claim1.id-1] = true;
              idDisputeStatus[claim2.id-1] = true;
            }
          });
        }
      }
    }
    const disputedSquareInches = disputes.length;
    const cleanId = idDisputeStatus.findIndex(value => value===false)+1;

    // Set the final state result and kill the progress bar.
    this.setState({progress: null, disputedSquareInches, cleanId});
  }

  /**
   * Render lifecycle function
   */
  render() {
    return (
      <div>
        <h2>Day 3: No Matter How You Slice It</h2>
        <FileUpload onUpload={(data) => this.handleSubmit(data) } /><br />
        {this.state.progress !== null && <ProgressBar {...this.state.progress} /> }
        {this.state.disputedSquareInches !== null && `Disputed square inches: ${this.state.disputedSquareInches}`}<br/>
        {this.state.cleanId !== null && `Clean ID: ${this.state.cleanId}`}
      </div>
    )
  }
}

export default SliceIt;
