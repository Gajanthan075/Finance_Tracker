import { useState, useEffect, useCallback, useMemo } from "react";
import { RefreshOutlined } from "@mui/icons-material";

const FinanceAdvice = () => {
  const quotes = useMemo(
    () => [
      {
        text: "Difficulties increase the nearer we get to the goal!",
        author: "Johann Wolfgang von Goethe",
      },
      {
        text: "An investment in knowledge pays the best interest.",
        author: "Benjamin Franklin",
      },
      {
        text: "Do not save what is left after spending, but spend what is left after saving.",
        author: "Warren Buffett",
      },
      {
        text: "Beware of little expenses; a small leak will sink a great ship.",
        author: "Benjamin Franklin",
      },
      {
        text: "Financial freedom is available to those who learn about it and work for it.",
        author: "Robert Kiyosaki",
      },
    ],
    []
  );

  const [quote, setQuote] = useState(quotes[0]);

  const random = useCallback(() => {
    const select = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(select);
  }, [quotes]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      random();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [random]);

  return (
    <div className="flex flex-col items-center m-auto bg-blue-950 rounded">
      <div className="px-12 py-5 text-white text-[25px] flex items-center">
        {quote.text}
      </div>
      <div>
        <div className="w-15 h-[1.5px] bg-white"></div>
        <div className="flex flex-row justify-between items-center m-2">
          <div className="text-white text-[20px] font-medium">
            {quote.author}
          </div>
          <div className="flex gap-2 cursor-pointer">
            <p
              onClick={() => {
                random();
              }}
            >
              <RefreshOutlined />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceAdvice;
