export default class fetchServer {
  //PRD
  //static baseUrl = 'http://localhost:4000/api/';
  //Local
  static baseUrl = 'http://localhost:4000/api/';

  constructor() {
  }

  static async call(url = '', method = 'GET', data = {}) {
      let othat = this;

      const token = localStorage.getItem('tokenTodo');

      let callUrl = othat.baseUrl + url;
      let settings = {
          method: method,
          headers: new Headers({
              'Authorization': 'Bearer ' + token,
              'Content-Type': 'application/json'
          })
      };
      if (data.constructor === Object && Object.keys(data).length !== 0) {
          settings.body = JSON.stringify(data);
      }
      return await fetch(callUrl, settings)
          .then(res => {
              //if (!res.ok) throw new Error(res.status);
              return res.text().then(function (text) {
                  return { 'data': text, 'status': res.status, 'ok': res.ok }
              });
          })
          .then(
              (result) => {
                  let response = result;
                  try {
                      response.data = JSON.parse(result.data);
                      return response;
                  } catch (er) {
                      return result;
                  }
              },
              (error) => {
                  throw new Error(error);
              }
          );
  }


  static getTextError(response, customMessage = 'Error') {
    return (response.data.error) ? ((response.data.msg) ? response.data.msg : customMessage) : '';
  }

}
