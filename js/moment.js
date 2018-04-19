'use strict';
moment.updateLocale('en', {
  calendar : {
    lastDay : '[Yesterday at] HH:mm:ss',
    sameDay : '[Today at] HH:mm:ss',
    nextDay : '[Tomorrow at] HH:mm:ss',
    lastWeek : '[last] dddd [at] HH:mm:ss',
    nextWeek : 'dddd [at] HH:mm:ss',
    sameElse : 'YYYY/MM/DD'
  }
});
