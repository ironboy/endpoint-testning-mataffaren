import { setWorldConstructor, setDefaultTimeout } from '@cucumber/cucumber';

class CustomWorld {

  setUrlPrefix(urlPrefix) {
    this.urlPrefx = urlPrefix
  }

  async fetch(url, options, responseType = 'json') {
    url = this.urlPrefx + url;
    if ((options.method === 'POST' || options.method === 'PUT') && responseType === 'json') {
      options.headers = { 'Content-Type': 'application/json' };
      typeof options.body !== 'string' && (options.body = JSON.stringify(body));
    }
    // current time in milliseconds
    let now = Date.now();
    // We save the raw response as a world property
    this.response = await fetch(url, options);
    // We svae the reponse time as a world property
    this.responseTime = Date.now() - now;
    // We save the 'unpacked reponse' (default type/property name is "json") 
    // as a world property
    this[responseType] = await this.response[responseType]();
    // let us also return the results directly (apart from saving them as properties)
    return {
      response: this.response,
      responseTime: this.responseTime,
      [responseType]: this[responseType]
    };
  }

}

// Normally the world gets recreated between each scenario by Cucumber!
// This means: Anything we store in the world is only persistant in inside ONE scenario
// But: In this set of tests we want properties stored on this/the world in our step definitions
// to be persistant between scenarios, so we use a small "trick" for this
// - creating a class that always returns the same instance of our CustomWorld
let persistantWorld = new CustomWorld();
class PersistantWorld {
  constructor() {
    return persistantWorld;
  }
}

setWorldConstructor(PersistantWorld);
setDefaultTimeout(60000);