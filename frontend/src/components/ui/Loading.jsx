import React from "react";
import { OrbitProgress } from "react-loading-indicators";

const Loading = ({cor, txt}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <OrbitProgress
        dense
        color={cor}
        size="large"
        text=""
        textColor="#NaNNaNNaN"
      />
      <p className="text-center">{txt}</p>
    </div>
  );
};

export default Loading;
