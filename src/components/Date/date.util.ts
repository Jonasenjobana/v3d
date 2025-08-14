export const WeekList = ['日', '一', '二', '三', '四', '五', '六'];
export const MonthList = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
export class CandyDate {
  private date: Date
  constructor(inParam: Date | string | number | Nill) {
    if (inParam instanceof Date) {
      this.date = inParam;
    } else if (typeof inParam == 'string' || typeof inParam == 'number') {
      this.date = new Date(inParam);
    } else {
      this.date = new Date();
    }
  }
  isBefore(param: CandyDate | Date) {
    if (param instanceof CandyDate) {
      return this.date.getTime() < param.date.getTime();
    }
    return this.date.getTime() < param.getTime();
  }
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
  getHour() {
    return this.date.getHours();
  }
  getMinute() {
    return this.date.getMinutes();
  }
  getSecond() {
    return this.date.getSeconds();
  }
  // 1
  getDayOfMonth() {
    return this.date.getDate();
  }
  toString(formate: string = 'YYYY-MM-DD HH:mm:ss') {
    const year = this.getYear();
    const Month = this.getMonth();
    const day = this.getDayOfMonth();
    const hour = this.getHour()
    const minute = this.getMinute();
    const second = this.getSecond();
    console.log(year, Month, day, hour, minute, second)

    return formate
      .replace(/y{4}|Y{4}/, `${year}`.padStart(4, '0'))
      .replace(/(MM|mm)/, `${Month + 1}`.padStart(2, '0'))
      .replace(/(DD|dd)/, `${day}`.padStart(2, '0'))
      .replace(/(HH|hh)/, `${hour}`.padStart(2, '0'))
      .replace(/(MM|mm)/, `${minute}`.padStart(2, '0'))
      .replace(/(SS|ss)/, `${second}`.padStart(2, '0'));
  }
  clone() {
    return new CandyDate(new Date(this.date.getTime()));
  }
}
