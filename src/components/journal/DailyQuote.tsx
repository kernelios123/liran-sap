
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DailyQuoteProps {
  className?: string;
}

const quotes = [{
  text: "The best time to plant a tree was 20 years ago. The second best time is now.",
  author: "Chinese Proverb"
}, {
  text: "In nature, nothing is perfect and everything is perfect. Trees can be contorted, bent in weird ways, and they're still beautiful.",
  author: "Alice Walker"
}, {
  text: "Look deep into nature, and then you will understand everything better.",
  author: "Albert Einstein"
}, {
  text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
  author: "Nelson Mandela"
}, {
  text: "Nature does not hurry, yet everything is accomplished.",
  author: "Lao Tzu"
}, {
  text: "We don't stop playing because we grow old; we grow old because we stop playing.",
  author: "George Bernard Shaw"
}, {
  text: "Study nature, love nature, stay close to nature. It will never fail you.",
  author: "Frank Lloyd Wright"
}, {
  text: "The journey of a thousand miles begins with a single step.",
  author: "Lao Tzu"
}, {
  text: "Adopt the pace of nature: her secret is patience.",
  author: "Ralph Waldo Emerson"
}, {
  text: "Every morning we are born again. What we do today is what matters most.",
  author: "Buddha"
}];

export function DailyQuote({
  className
}: DailyQuoteProps) {
  const [quote, setQuote] = useState({
    text: "",
    author: ""
  });
  
  useEffect(() => {
    // Use date-based seeding to ensure same quote for the entire day
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const quoteIndex = dayOfYear % quotes.length;
    setQuote(quotes[quoteIndex]);
  }, []);
  
  if (!quote.text) return null;
  
  return (
    <Card className={cn(
      "border-0 bg-grove-card/90 rounded-xl shadow-sm max-w-3xl w-full mx-auto mb-12",
      className
    )}>
      <CardContent className="py-8 px-8">
        <div className="flex flex-col text-center">
          <p className="text-xl text-grove-text font-serif mb-4">{quote.text}</p>
          <div className="flex items-center justify-center">
            <div className="h-px w-12 bg-grove-accent/40 mr-3"></div>
            <p className="text-sm text-grove-muted">— {quote.author}</p>
            <div className="h-px w-12 bg-grove-accent/40 ml-3"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
