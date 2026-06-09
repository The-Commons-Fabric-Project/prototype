import { dateFnsLocalizer, DateLocalizer } from 'react-big-calendar'

import { format } from 'date-fns/format'
import { parse } from 'date-fns/parse'
import { startOfWeek } from 'date-fns/startOfWeek'
import { getDay}  from 'date-fns/getDay'
import { enCA } from 'date-fns/locale/en-CA'

const locales = {
  'en-CA': enCA,
}

export const localizer: DateLocalizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})