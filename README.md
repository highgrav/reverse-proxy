# A simple reverse proxy

This is a simple NodeJS-based reverse proxy that is suitable for development and test purposes. It allows for rapid testing and iteration of complex backend environments during development.

## Setup
Reverse-Proxy requires SSL to be set up. Key and certificate files should be placed in the ./ssl directory. You can trivially generate keys using openssl from the app directory:

openssl genrsa -out ./ssl/key.pem 2048
openssl req -new -sha256 -key ./ssl/key.pem -out ./ssl/csr.csr
openssl req -x509 -sha256 -days 365 -key ./ssl/key.pem -in ./ssl/csr.csr -out ./ssl/certificate.pem

Required directories and files are:
./paths
./ssl
  ./ssl/certificate.pem
  ./ssl/key.pem
  ./ssl/ca.pem (if using a custom CA)
./responses

## TLS Certificates
In addition to the default certificate and key, you can also place hostname-specific TLS certs in the ./ssl directory. Simply name the directory for the hostname, and the proxy will pick up and serve the certificates. The proxy expects "certificate.pem" and "key.pem" for its certs; if you're using a custom certificate authority, then include it as "ca.pem."

## Environment Variables
- PROXY_PORT: Port number to listen on.
- PROXY_MAX_CALLS_PER_SECOND: Global rate limit for API calls.
- PATH_FILE: Name of the "paths.json" file, as described below.

## path.json
The path.json file, if included, can define multiple paths. Each path uses a stringified regex value as the key, with an object containing configuration data about the path.

Each path object can take the following properties:
  - to: (String, String[], Function, must be defined as an imported path module if a function is used. Required. 
    Where to proxy the request to. May be a string (servername or, if prefaced with 'file:', a local filename), array of strings (servernames), or a function that should return a string. If an array is provided, the proxy will randomly select one of the servers to contact; at this point, there is no concept of a proxy session, so round-robining between servers will not be "sticky" for a user.

  - priority: (Int) If included, indicates the relative priority of the path, where lower is higher-priority. If not included, the path is assumed to have the lowest possible priority, and will only be matched if it is the first match for the path.

  - hostnames: (String[]) An optional array of requested hostnames that must be matched (using the client host request header). If not present or a zero-length array, the host header will be ignored.

  - rewriteRequest: (Function, must be defined as an imported path module) A function to rewrite the  ProxyRequest object, if needed. This may return a string, an value that implements the toString() method, or a Promise, whose resolution will be treated as a string or toString()able value. See the examples in the ./paths directory to see how this works in practice.

  - rewriteResponse: (Function, must be a path import) A function to rewrite the proxied response. Note that currently this does not allow interception of the proxied response, so use of this function should be limited to header writing. Use "rewriteRequest" to intercept the request if you need to do more complex proxying logic.

  - secure: (Boolean) Whether the target is TLS-secured. False if not provided.
 
  - websocket: (Boolean) Whether the target is a websocket. False if not provided.
 
  - allowedCidrs: (String[]) A list of CIDRs to allow. If the array is empty, no one will be able to  access the endpoint. If allowedCidrs does not exist or is not an array, all requests will be serviced.
 
  - ignoreProxiedIP: (Boolean) If false or undefined, both the IP the request comes from and the content  of the X-Forwarded-For header will be checked against the allow-list (if allowedCidrs is populated). If true, then the content of X-Forwarded-For will not be checked. The default is more restrictive (e.g., both the request origin and the proxied orgin must be allowed.)
  
  - contentType: (String) If included, will override content-type for static files and return functions.
  
  - enableCors: (Boolean) Add CORS headers to the response (non-Websockets only).

  - onRequest: (Function, must be defined as an imported path module) A function to run before any response is returned. Useful for validating requirements such as X-Api-Key header values. Return "true" to allow processing to continue; any other response will trigger a 403 error to the client.

## Path Module Exports
Path objects can also be defined in code by creating module exports in the ./paths directory. Simply add the path regex as a key to the "exports" object, with the value of a path object as described above, in any file in ./paths, and the proxy will auto-discover the new paths.

## Examples
The code repo comes with some sample paths in both paths.json and the ./paths directory.

## Static Responses
If you wish to return custom HTML responses to various error codes generated by the proxy (e.g., 404, 502, etc.), simply add the HTML to the ./responses directory, with the filename in the format "{HTTP response code}.html."

## License
See license.txt for the official license details.
