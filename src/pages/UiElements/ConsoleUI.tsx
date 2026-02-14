import React, { useEffect, useRef, useState } from "react";

type LogType = "info" | "error" | "warn";

interface LogItem {
  message: string;
  type: LogType;
}

const ConsoleUI: React.FC = () => {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Simulate backend logs
  useEffect(() => {
    const interval = setInterval(() => {
      const types: LogType[] = ["info", "warn", "error"];
      const randomType = types[Math.floor(Math.random() * types.length)];

      setLogs((prev) => [
        ...prev,
        {
          message: `[${new Date().toLocaleTimeString()}] Sample ${randomType} message`,
          type: randomType,
        },
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const getTextColor = (type: LogType) => {
    switch (type) {
      case "error":
        return "text-red-400";
      case "warn":
        return "text-yellow-400";
      default:
        return "text-gray-300";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-10">
      <div className="bg-[#1e1e1e] text-gray-300 font-mono text-sm p-4 h-96 overflow-auto rounded-xl shadow-2xl border border-gray-700">
        {logs.map((log, index) => (
          <div key={index} className={`${getTextColor(log.type)} whitespace-pre-wrap`}>
            {log.message}
          </div>
        ))}

        {/* Prompt line */}
        <div className="flex text-gray-400">
          <span>C:\app&gt;</span>
          <span className="ml-1 animate-pulse">▌</span>
        </div>

        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ConsoleUI;


// import React, { useEffect, useRef, useState } from "react";

// type LogType = "info" | "error" | "warn";

// interface LogItem {
//   message: string;
//   type: LogType;
// }

// const ConsoleUI: React.FC = () => {
//   const [logs, setLogs] = useState<LogItem[]>([]);
//   const bottomRef = useRef<HTMLDivElement | null>(null);

//   // Simulated backend logs
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const types: LogType[] = ["info", "warn", "error"];
//       const randomType = types[Math.floor(Math.random() * types.length)];

//       setLogs((prev) => [
//         ...prev,
//         {
//           message: `[${new Date().toLocaleTimeString()}] ${randomType.toUpperCase()} - Container running...`,
//           type: randomType,
//         },
//       ]);
//     }, 2500);

//     return () => clearInterval(interval);
//   }, []);

//   // Auto-scroll
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [logs]);

//   const getTextColor = (type: LogType) => {
//     switch (type) {
//       case "error":
//         return "text-red-400";
//       case "warn":
//         return "text-yellow-400";
//       default:
//         return "text-gray-200";
//     }
//   };

//   return (
//     <div className="w-full max-w-5xl mx-auto mt-10">
//       {/* Header Bar (Cloud Style) */}
//       <div className="bg-[#111827] text-gray-300 text-xs px-4 py-2 rounded-t-lg border border-gray-700 border-b-0 flex justify-between">
//         <span>container-logs</span>
//         <span className="text-gray-500">Connected</span>
//       </div>

//       {/* Terminal Body */}
//       <div className="bg-[#0f172a] font-mono text-sm p-4 h-96 overflow-auto rounded-b-lg border border-gray-700 shadow-xl">
//         {logs.map((log, index) => (
//           <div key={index} className={`${getTextColor(log.type)} whitespace-pre-wrap`}>
//             {log.message}
//           </div>
//         ))}

//         {/* Cloud-style prompt */}
//         <div className="flex text-gray-400 mt-2">
//           <span>user@container:~$</span>
//           <span className="ml-1 animate-pulse">▌</span>
//         </div>

//         <div ref={bottomRef} />
//       </div>
//     </div>
//   );
// };

// export default ConsoleUI;
