import React from 'react';

import FileUpload from '../Components/FileUpload';


class SliceIt extends React.Component {
  state = {
    /** The total count of disputed square inches for the final result. */
    disputedSquareInches: null,
    /** The ID number of the claim with no overlaps */
    cleanId: null,
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
  static overlaps(claim1, claim2) {
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
  static getDots(claim) {
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
  findOverlaps(claims) {
    const disputes = [];
    const idDisputeStatus = [];
    claims.forEach(claim => idDisputeStatus[claim.id-1] = false);

    const isInBounds = (dot, claim) =>
      dot.x >= claim.x1 &&
      dot.x <= claim.x2 &&
      dot.y >= claim.y1 &&
      dot.y <= claim.y2;

    // Compare each claim to all of the claims after it
    for (let claimIdx1 = 0; claimIdx1 < claims.length; claimIdx1++) {
      const claim1 = claims[claimIdx1];
      console.log(`Checking claim ${claim1.id} of ${claims.length}`);
      for (let claimIdx2 = claimIdx1+1; claimIdx2 < claims.length; claimIdx2++) {
        const claim2 = claims[claimIdx2];
        // Check if claim 1 overlaps claim 2
        if (SliceIt.overlaps(claim1, claim2)) {
          const dots1 = SliceIt.getDots(claim1);
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

    this.setState({disputedSquareInches, cleanId});
  }

  /**
   * Render lifecycle function
   */
  render() {
    return (
      <div>
        <h2>Day 3: No Matter How You Slice It</h2>
        <FileUpload onUpload={(data) => this.findOverlaps(this.parseClaims(data)) } /><br />
        {this.state.disputedSquareInches !== null && `Disputed square inches: ${this.state.disputedSquareInches}`}<br/>
        {this.state.cleanId !== null && `Clean ID: ${this.state.cleanId}`}
      </div>
    )
  }
}

export default SliceIt;
