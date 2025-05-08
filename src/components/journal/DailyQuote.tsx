import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";
interface DailyQuoteProps {
  className?: string;
}
const quotes = [{
  text: "Your journal is a place to grow, not to show.",
  author: "Unknown"
}, {
  text: "The quieter you become, the more you can hear.",
  author: "Ram Dass"
}, {
  text: "Write what disturbs you, what you fear, what you have not been willing to speak about.",
  author: "Natalie Goldberg"
}, {
  text: "The habit of writing for my eye is good practice. It loosens the ligaments.",
  author: "Virginia Woolf"
}, {
  text: "Fill your paper with the breathings of your heart.",
  author: "William Wordsworth"
}, {
  text: "I can shake off everything as I write; my sorrows disappear, my courage is reborn.",
  author: "Anne Frank"
}, {
  text: "Journal writing is a voyage to the interior.",
  author: "Christina Baldwin"
}, {
  text: "Writing is medicine. It is an appropriate antidote to injury. It is an appropriate companion for any difficult change.",
  author: "Julia Cameron"
}, {
  text: "What would happen if one woman told the truth about her life? The world would split open.",
  author: "Muriel Rukeyser"
}, {
  text: "Documenting little details of your everyday life becomes a celebration of who you are.",
  author: "Carolyn V. Hamilton"
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
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    const quoteIndex = dayOfYear % quotes.length;
    setQuote(quotes[quoteIndex]);
  }, []);
  if (!quote.text) return null;
  return <Card className={`border-nature-sand/30 bg-white/90 ${className}`}>
      <CardContent className="pt-6 rounded-none px-[170px] bg-slate-50">
        <div className="flex gap-4">
          <Quote className="h-8 w-8 text-nature-forest flex-shrink-0 opacity-80" />
          <div>
            <p className="text-lg italic text-nature-forest">"{quote.text}"</p>
            <p className="text-sm text-muted-foreground mt-2 text-right">— {quote.author}</p>
          </div>
        </div>
      </CardContent>
    </Card>;
}