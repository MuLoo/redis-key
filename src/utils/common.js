 import queryString from "query-string";
 /**
   * 对query参数进行排序返回
   * @param {string} uri
   * @returns string
   *
   * @memberOf PageCache
   */
 function parseQueryString(uri) {
  // 按unicode对请求参数排序
  uri = uri.split('?');
  if (uri.length === 2 && uri[1]) {
    let params = queryString.parse(uri[1]);
    let search = [];
    if (typeof params === 'object') {
      let keys = Object.keys(params);
      keys = keys.sort();
      while (keys.length) {
        const key = keys.pop();
        search.push([key, '=', params[key]].join(''));
      }
      uri[1] = search.join('&');
    }
  }
  uri = uri.join('?');

  return uri;
 }

 export { parseQueryString };