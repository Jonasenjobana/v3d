export class DateUtil {
  checkValid(date: (Date | undefined)[]) {}
}
export class CandyDate {
  constructor(private date: Date) {}
  getYear() {
    return this.date.getFullYear();
  }
  getMonth() {
    return this.date.getMonth();
  }
  // 0 日 1-6 
  getDayOfWeek() {
    return this.date.getDay();
  }
  // 1
  getDayOfMonth() {
    return this.date.getDate();
  }
  toString(formate: 'YYYY-MM-DD HH:mm:ss' = 'YYYY-MM-DD HH:mm:ss') {
    const jsonStr = this.date.toJSON();
    const dateStr = jsonStr.split('T')[0];
    const timeStr = jsonStr.split('T')[1];
    return formate
      .replace('YYYY', dateStr.split('-')[0])
      .replace('MM', dateStr.split('-')[1])
      .replace('DD', dateStr.split('-')[2])
      .replace('HH', timeStr.split(':')[0])
      .replace('mm', timeStr.split(':')[1])
      .replace('ss', timeStr.split(':')[2]);
  }
}
