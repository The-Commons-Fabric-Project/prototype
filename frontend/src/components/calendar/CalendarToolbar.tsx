import type { ToolbarProps } from 'react-big-calendar'
import { Navigate } from 'react-big-calendar'


export function ToolbarComponent(props: ToolbarProps) {
    
    /* @types/react-big-calendar/index.d.ts/ToolbarProps

    interface ToolbarProps<TEvent extends object = Event, TResource extends object = object> {
        date: Date;
        view: View;
        views: ViewsProps<TEvent, TResource>;
        label: string;
        localizer: { messages: Messages<TEvent> };
        onNavigate: (navigate: NavigateAction, date?: Date) => void;
        onView: (view: View) => void;
        children?: React.ReactNode | undefined;
    }
    */

    /*const { 
        date,
        view,
        views,
        label,
        localizer: { messages },
        onNavigate,
        onView,
        children, 
    } = props*/
     
    const { label, localizer: { messages }, onNavigate } = props
  
    return (
    <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
      <div className="flex gap-2">
        <button onClick={() => onNavigate(Navigate.PREVIOUS)} className="px-3 py-1 rounded bg-white hover:bg-gray-100">←</button>
        <button onClick={() => onNavigate(Navigate.TODAY)} className="px-3 py-1 rounded bg-white hover:bg-gray-100">{messages.today}</button>
        <button onClick={() => onNavigate(Navigate.NEXT)} className="px-3 py-1 rounded bg-white hover:bg-gray-100">→</button>
      </div>
      <h2 className="text-lg font-semibold">{label}</h2>

    </div>
  )
}