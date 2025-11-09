import React, { PropsWithChildren, useState } from "react";
import { CardComponent } from "../../model/CardFormat/CardComponent";

interface CardProp {
  data: CardComponent;
  handleCardClick:(data:CardComponent) => void;
}

export const Card: React.FC<PropsWithChildren<CardProp>> = ({ data, handleCardClick }) => {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Card */}
      <div className="relative w-20 h-20">
        <div
          onClick={() => handleCardClick(data)}

          className={data.active ? "cursor-pointer w-full h-full rounded-xl border border-blue-400 bg-blue-50 p-5 dark:border-blue-500 dark:bg-blue-500/20 flex items-center justify-center transition shadow-lg hover:shadow-xl ring-2 ring-blue-300"
 : "cursor-pointer w-full h-full rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] flex items-center justify-center transition hover:shadow-md active:bg-red-300"} 
        >
          <h4 className="text-theme-xl font-medium text-gray-800 dark:text-white/90">
            {data.num}
          </h4>
        </div>

        {/* Dots on the top-right */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
          {data.fac &&
            <div
              className={`w-3 h-3 rounded-full bg-yellow-500 shadow-sm`}
            ></div>
          }
          {data.even &&
            <div
              className={`w-3 h-3 rounded-full bg-orange-500 shadow-sm`}
            ></div>
          }
          {data.odd &&
            <div
              className={`w-3 h-3 rounded-full bg-blue-500 shadow-sm`}
            ></div>
          }
          {data.data &&
            <div
              className={`w-3 h-3 rounded-full bg-green-500 shadow-sm`}
            ></div>
          }
        </div>
      </div>
    </div>
  );
};
