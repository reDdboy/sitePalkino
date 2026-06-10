import ScheduleCard from "../components/ScheduleCard"
import { scheduleData } from "../data/schedule"

export default function Shedule() {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="font-serif text-4xl font-bold text-foreground text-center mb-8">
                Расписание богослужений
            </h1>
            <ScheduleCard />
        </div>
    )
}
