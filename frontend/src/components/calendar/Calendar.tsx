
import { Calendar as BigCalendar } from 'react-big-calendar'

import { ToolbarComponent } from './CalendarToolbar'

import { localizer } from './localizer'

/* node_modules/@types/react-big-calendar/index.d.ts/CalendarProps

interface CalendarProps<TEvent extends object = Event, TResource extends object = object>
    extends React.RefAttributes<Calendar<TEvent, TResource>>
{
    children?: React.ReactNode;
    localizer: DateLocalizer;

    date?: stringOrDate | undefined;
    getNow?: () => stringOrDate | undefined;
    view?: View | undefined;
    events?: TEvent[] | undefined;
    backgroundEvents?: TEvent[] | undefined;
    handleDragStart?: ((event: TEvent) => void) | undefined;
    onNavigate?: ((newDate: Date, view: View, action: NavigateAction) => void) | undefined;
    onView?: ((view: View) => void) | undefined;
    onDrillDown?: ((date: Date, view: View) => void) | undefined;
    onSelectSlot?: ((slotInfo: SlotInfo) => void) | undefined;
    onDoubleClickEvent?: ((event: TEvent, e: React.SyntheticEvent<HTMLElement>) => void) | undefined;
    onSelectEvent?: ((event: TEvent, e: React.SyntheticEvent<HTMLElement>) => void) | undefined;
    onKeyPressEvent?: ((event: TEvent, e: React.SyntheticEvent<HTMLElement>) => void) | undefined;
    onSelecting?: (range: { start: Date; end: Date }) => boolean | undefined;
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    onRangeChange?: (range: Date[] | { start: Date; end: Date }, view?: View) => void | undefined;
    showAllEvents?: boolean | undefined;
    selected?: any;
    views?: ViewsProps<TEvent, TResource> | undefined;
    doShowMoreDrillDown?: boolean | undefined;
    drilldownView?: View | null | undefined;
    getDrilldownView?:
        | ((targetDate: Date, currentViewName: View, configuredViewNames: View[]) => void)
        | null
        | undefined;
    length?: number | undefined;
    toolbar?: boolean | undefined;
    popup?: boolean | undefined;
    popupOffset?: number | { x: number; y: number } | undefined;
    selectable?: boolean | "ignoreEvents" | undefined;
    longPressThreshold?: number | undefined;
    step?: number | undefined;
    timeslots?: number | undefined;
    rtl?: boolean | undefined;
    eventPropGetter?: EventPropGetter<TEvent> | undefined;
    slotPropGetter?: SlotPropGetter | undefined;
    slotGroupPropGetter?: SlotGroupPropGetter | undefined;
    dayPropGetter?: DayPropGetter | undefined;
    showMultiDayTimes?: boolean | undefined;
    allDayMaxRows?: number | undefined;
    min?: Date | undefined;
    max?: Date | undefined;
    scrollToTime?: Date | undefined;
    enableAutoScroll?: boolean | undefined;
    culture?: Culture | undefined;
    formats?: Formats | undefined;
    components?: Components<TEvent, TResource> | undefined;
    messages?: Messages<TEvent> | undefined;
    dayLayoutAlgorithm?: DayLayoutAlgorithm | DayLayoutFunction<TEvent> | undefined;
    titleAccessor?: keyof TEvent | ((event: TEvent) => string) | undefined;
    tooltipAccessor?: keyof TEvent | ((event: TEvent) => string) | null | undefined;
    allDayAccessor?: keyof TEvent | ((event: TEvent) => boolean) | undefined;
    startAccessor?: keyof TEvent | ((event: TEvent) => Date) | undefined;
    endAccessor?: keyof TEvent | ((event: TEvent) => Date) | undefined;
    resourceAccessor?: keyof TEvent | ((event: TEvent) => any) | undefined;
    resources?: TResource[] | undefined;
    resourceIdAccessor?: keyof TResource | ((resource: TResource) => any) | undefined;
    resourceTitleAccessor?: keyof TResource | ((resource: TResource) => any) | undefined;
    resourceGroupingLayout?: boolean | undefined;
    defaultView?: View | undefined;
    defaultDate?: stringOrDate | undefined;
    className?: string | undefined;
    elementProps?: React.HTMLAttributes<HTMLElement> | undefined;
    style?: React.CSSProperties | undefined;
    onShowMore?: ((events: TEvent[], date: Date) => void) | undefined;
} */

export function DemoCalendar() {
    return (
        <BigCalendar
            localizer={localizer}
            components={{ toolbar: ToolbarComponent }}
        />
    );
}