export class DateHandlerUtil {
  public static parseTtl(
    frecuency: 'day' | 'hours' | 'minutes' | 'today',
    increment: number
  ): number {
    const dateObj = new Date()
    switch (frecuency) {
      case 'day':
        return dateObj.setDate(new Date().getDate() + increment)
      case 'hours':
        return dateObj.setHours(new Date().getHours() + increment)
      case 'minutes':
        return dateObj.setMinutes(new Date().getMinutes() + increment)
      case 'today':
        return dateObj.valueOf()
    }
  }
}
