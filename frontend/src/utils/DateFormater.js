import React from "react";
import Moment from "react-moment";

const DateFormater = ({ date }) => {
  return (
    <Moment format="D MMM YYYY" withTitle>
      {date}
    </Moment>
  );
};

export default DateFormater;
