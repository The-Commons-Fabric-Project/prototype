import { Calendar as BigCalendar } from 'react-big-calendar'

import { ToolbarComponent } from './CalendarToolbar'

import { localizer } from './localizer'


export function DemoCalendar() {
    return (
        <div className="w-full max-w-4xl mx-auto">
            <BigCalendar
                localizer={localizer}
                components={{ toolbar: ToolbarComponent }}
                style={{ height: 'auto' }}
            />
        </div>
    );
}
