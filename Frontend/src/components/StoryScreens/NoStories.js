import React from "react";
import { RiSearchLine, RiBookOpenLine } from "react-icons/ri";

const NoStories = () => (
  <div className="no-story">
    <div className="no-story-content">
      <div className="no-story-icon">
        <RiBookOpenLine />
      </div>
      <h2>No Stories Found</h2>
      <p>Looks like there are no stories to display right now.</p>
      <p>Try adjusting your search or check back later for new content!</p>
    </div>
  </div>
);

export default NoStories;