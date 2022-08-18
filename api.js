// const BASE_URL = `http://192.168.219.101/v1.0/`;

/* Return json */
// const fetchWithTimeout = async (resource, options) => {
//     // https://dmitripavlutin.com/timeout-fetch-request/

//     const { timeout = 10000 } = options;
    
//     // const controller = new AbortController();
//     // const id = setTimeout(() => controller.abort(), timeout);
//     console.log('1. start', new Date());
//     try {
//         await fetch(resource, {
//             ...options,
//             // signal: controller.signal  
//             })
//             .then((res) => {
//                 console.log('[fetchWithTimeout] res=', res);            
//                 // if (!response.ok) {
//                 //     throw new Error(response.statusText)
//                 // }
//                 return res.json();
//             // }, e => {
//             //     console.log('[fetchWithTimeout] fetch e=', e);             
//             // }
//             })
//             .then((jsonData) => {
//                 console.log('[fetchWithTimeout] json=', jsonData);
//                 return jsonData;
//             })
//             .catch((e) => {
//                 /***
//                 //  * Power Off / Not ready => [TypeError: Network request failed] / [AbortError: Aborted]???
//                 */
//                 console.log('[fetchWithTimeout] catch e=', e, new Date());
//             })
//             .finally(() => {
//                 // clearTimeout(id);
//                 console.log('[fetchWithTimeout] clearTimeout called');
//             })
//     } catch {(e) => {
//         console.log('[fetchWithTimeout] try... catch = e', e);
//     }}

//     console.log('[fetchWithTimeout] end');
//     // return null;
// }

import { Alert } from "react-native";

/***
 * async ... await 함수에서 fetchWithTimeout exception은 try {} catch {}
 *      async function func() {
 *          try{
 *              await fetchWithTimeout()
 *          } catch (e) {
 *          }
 *      }
 *      or
 *      async function func() {
 *          await fetchWithTimeout().catch((e) => {})
 *      }
 */
async function fetchWithTimeout(resource, options = {}) {
    // https://dmitripavlutin.com/timeout-fetch-request/

    const { timeout = 3000 } = options;
    
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    console.log('[fetchWithTimeout: start]', new Date());
    const response = await fetch(resource, {
        ...options,
        signal: controller.signal  
    })
    .finally(() => {
        clearTimeout(id);
        console.log('[fetchWithTimeout: end]', new Date());
    });    
    return response;
}

/**
{
    "login status": true,
    "model": "TAINER",
    "net": Object {
        "LAN": Object {
            "ip": "192.168.0.13",
            "status": "connected",
        },
    },
}                    
*/
/**
{
    "login status": true,
    "model": "TAINER",
    "net": Object {
        "Cloud": Object {
            "ip": "192.168.232.146",
            "manufacture": "SAMSUNG",
            "product": "SAMSUNG_Android",
            "ready": true,
            "serial": "R3CM40J3XXD",
            "status": "connected",
        },
    },
}
Object {
  "error": "authorization_pending",
  "error_description": "Pending the request.",
  "reason": "Accepted",
  "status": 202,
}

*/     
const CheckReady = async (url, sn, options = {}) => {
    try {
        const { timeout = 3000 } = options;

        console.log('[CheckReady] fetching data...');
        const response = await fetchWithTimeout(
            url+'/auth', {
                method: "POST",                       
                headers:{"cz-api-arg": JSON.stringify({'cmd': 'checkReady', 'sn':sn})},
                timeout: timeout  
            }
        );
        const data = await  response.json();
        return data;
    } catch (error) {
        /**
         * catch [TypeError: Network request failed] = power OFF
         * [AbortError: Aborted] = power ON before auth
         */
        console.log('[CheckReady] try.. catch e =', error);
    }
};       


const DeviceStatus = async (url, options = {}) => {
    try {
        const { timeout = 3000 } = options;

        console.log('[DeviceStatus] fetching data...', url);
        const response = await fetchWithTimeout(
                url+'/dev', {
                    method: "GET",
                    headers:{"cz-api-arg": JSON.stringify({'cmd': 'DeviceStatus'})},
                    timeout: timeout  
                },
        );
        const data = await  response.json();
        return data;
    } catch(error) {
        Alert.alert(
            "Connection Error",
            "Cannot fetch data from a device\nPlease check login or connection",
            [{ text: "Close", }]
        );            
        // throw Error('Fetch Error');
    }
};  


// const DeviceStatus2 = () => {
//     const options = {
//         method: "GET",
//         headers:{"cz-api-arg": JSON.stringify({'cmd': 'DeviceStatus'})},
//     }
//     fetch(
//         `${BASE_URL}/dev`,
//         options
//     ).then((res) => res.json());
// }

const DirList = (path = "/") => {
    const options = {
        method: "GET",
        "cz-api-arg": JSON.stringify({ 'cmd': 'DirList', 'path': {path} }),
    }
    fetch(
        `${BASE_URL}/dev`,
        options
    ).then((res) => res.json());
}


export const Api = { DeviceStatus, DirList, fetchWithTimeout, CheckReady };

                // CheckReady, DeviceStatus, FileList, DirList, 
                // CreateDir, SendFile, GetFile, GetRawFile,
                // GetThumb, RenameItem, SetItemMoifyTime                