interface RequestInit {
  method?: string;
  headers?: {
    [key: string]: string;
  };
  body?: BodyInit | null;
  mode?: RequestMode;
  credentials?: RequestCredentials;
  cache?: RequestCache;
  redirect?: RequestRedirect;
  referrerPolicy?: ReferrerPolicy;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any,
  ignore?: boolean
}

const HOST = 'http://localhost:8080';

function objectToQueryString(obj: Record<string, string | number>): string {
  const keyValuePairs: string[] = [];
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (value !== null && value !== undefined) {
        keyValuePairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(value.toString())}`);
      }
    }
  }
  return keyValuePairs.join('&');
}

class Http {
  constructor() {}
  public static request<T>(url: string, configs: RequestInit): Promise<T> {
    if(!configs.headers) configs.headers = {};
    const method = configs.method?.toLowerCase();
    if (method === 'get') {
      url += `?${objectToQueryString(configs.data)}`;
    } else if (method === 'post') {
      if(!configs.body) {
        configs.headers['Content-Type'] = 'application/json';
        configs.body = JSON.stringify(configs.data);
      }
    }
  
    delete configs.data;
  
    return fetch(HOST + url, {
      cache: 'no-cache',
      ...configs,
    }).then(async response => {
      if (!response.ok) {
        const errorData = await response.json();
        return Promise.reject({
          ok: response.ok,
          status: errorData.statusCode,
          statusText: errorData.message,
        });
      }
      return response.json().then(data => data.data);
    });
  }

  public static get<T>(url: string, configs?: RequestInit) {
    const requestConfigs: RequestInit = {
      method: 'GET',
      ...configs,
    };
    return Http.request<T>(url, requestConfigs);
  }

  public static post<T>(url: string, configs?: RequestInit) {
    const requestConfigs: RequestInit = {
      method: 'POST',
      ...configs,
    };
    return Http.request<T>(url, requestConfigs);
  }
}


export default Http;
