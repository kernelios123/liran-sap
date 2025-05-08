
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Leaf } from "lucide-react";

type ChatHeaderProps = {
  date?: Date;
  setDate: (date?: Date) => void;
};

export function ChatHeader({ date, setDate }: ChatHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-nature-leaf/10 to-nature-sky/5 rounded-t-md flex flex-row items-center justify-between p-6">
      <CardTitle className="flex items-center gap-2">
        <Leaf className="h-5 w-5 text-nature-leaf" />
        <span>Grove Guide</span>
      </CardTitle>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
            <CalendarIcon className="h-4 w-4" />
            <span className="sr-only">Select journal date</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => setDate(newDate)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
