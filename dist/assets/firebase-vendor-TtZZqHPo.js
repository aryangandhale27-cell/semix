import{o as um,R as Da}from"./vendor-BkYca5zg.js";const lm=()=>{};var Yu={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rh=function(n){const e=[];let t=0;for(let r=0;r<n.length;r++){let s=n.charCodeAt(r);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(n.charCodeAt(++r)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},hm=function(n){const e=[];let t=0,r=0;for(;t<n.length;){const s=n[t++];if(s<128)e[r++]=String.fromCharCode(s);else if(s>191&&s<224){const i=n[t++];e[r++]=String.fromCharCode((s&31)<<6|i&63)}else if(s>239&&s<365){const i=n[t++],a=n[t++],c=n[t++],l=((s&7)<<18|(i&63)<<12|(a&63)<<6|c&63)-65536;e[r++]=String.fromCharCode(55296+(l>>10)),e[r++]=String.fromCharCode(56320+(l&1023))}else{const i=n[t++],a=n[t++];e[r++]=String.fromCharCode((s&15)<<12|(i&63)<<6|a&63)}}return e.join("")},Ph={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<n.length;s+=3){const i=n[s],a=s+1<n.length,c=a?n[s+1]:0,l=s+2<n.length,h=l?n[s+2]:0,f=i>>2,m=(i&3)<<4|c>>4;let y=(c&15)<<2|h>>6,b=h&63;l||(b=64,a||(y=64)),r.push(t[f],t[m],t[y],t[b])}return r.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(Rh(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):hm(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<n.length;){const i=t[n.charAt(s++)],c=s<n.length?t[n.charAt(s)]:0;++s;const h=s<n.length?t[n.charAt(s)]:64;++s;const m=s<n.length?t[n.charAt(s)]:64;if(++s,i==null||c==null||h==null||m==null)throw new dm;const y=i<<2|c>>4;if(r.push(y),h!==64){const b=c<<4&240|h>>2;if(r.push(b),m!==64){const V=h<<6&192|m;r.push(V)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class dm extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const fm=function(n){const e=Rh(n);return Ph.encodeByteArray(e,!0)},Pi=function(n){return fm(n).replace(/\./g,"")},bh=function(n){try{return Ph.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pm(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mm=()=>pm().__FIREBASE_DEFAULTS__,gm=()=>{if(typeof process>"u"||typeof Yu>"u")return;const n=Yu.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},_m=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&bh(n[1]);return e&&JSON.parse(e)},Qi=()=>{try{return lm()||mm()||gm()||_m()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},Sh=n=>{var e,t;return(t=(e=Qi())==null?void 0:e.emulatorHosts)==null?void 0:t[n]},Ch=n=>{const e=Sh(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),r]:[e.substring(0,t),r]},Vh=()=>{var n;return(n=Qi())==null?void 0:n.config},Nh=n=>{var e;return(e=Qi())==null?void 0:e[`_${n}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kh{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,r))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Dh(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},r=e||"demo-project",s=n.iat||0,i=n.sub||n.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const a={iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}},...n};return[Pi(JSON.stringify(t)),Pi(JSON.stringify(a)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function De(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function ym(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(De())}function wm(){var e;const n=(e=Qi())==null?void 0:e.forceEnvironment;if(n==="node")return!0;if(n==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Em(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Tm(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function Im(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function vm(){const n=De();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function Am(){return!wm()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Rm(){try{return typeof indexedDB=="object"}catch{return!1}}function Pm(){return new Promise((n,e)=>{try{let t=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(r),n(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{var i;e(((i=s.error)==null?void 0:i.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bm="FirebaseError";class It extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=bm,Object.setPrototypeOf(this,It.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Rs.prototype.create)}}class Rs{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){const r=t[0]||{},s=`${this.service}/${e}`,i=this.errors[e],a=i?Sm(i,r):"Error",c=`${this.serviceName}: ${a} (${s}).`;return new It(s,c,r)}}function Sm(n,e){try{let t=0,r="";for(;t<n.length;){const s=n.indexOf("{$",t);if(s===-1){r+=n.substring(t);break}const i=n.indexOf("}",s+2);if(i===-1){r+=n.substring(t);break}const a=n.substring(s+2,i),c=e[a];r+=n.substring(t,s)+(c!=null?String(c):`<${a}?>`),t=i+1}return r}catch{return n}}function Cm(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function xn(n,e){if(n===e)return!0;const t=Object.keys(n),r=Object.keys(e);for(const s of t){if(!r.includes(s))return!1;const i=n[s],a=e[s];if(Ju(i)&&Ju(a)){if(!xn(i,a))return!1}else if(i!==a)return!1}for(const s of r)if(!t.includes(s))return!1;return!0}function Ju(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ps(n){const e=[];for(const[t,r]of Object.entries(n))Array.isArray(r)?r.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function Hr(n){const e={};return n.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[s,i]=r.split("=");e[decodeURIComponent(s)]=decodeURIComponent(i)}}),e}function Wr(n){const e=n.indexOf("?");if(!e)return"";const t=n.indexOf("#",e);return n.substring(e,t>0?t:void 0)}function Vm(n,e){const t=new Nm(n,e);return t.subscribe.bind(t)}class Nm{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let s;if(e===void 0&&t===void 0&&r===void 0)throw new Error("Missing Observer.");km(e,["next","error","complete"])?s=e:s={next:e,error:t,complete:r},s.next===void 0&&(s.next=Jo),s.error===void 0&&(s.error=Jo),s.complete===void 0&&(s.complete=Jo);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function km(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function Jo(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function te(n){return n&&n._delegate?n._delegate:n}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $n(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function xa(n){return(await fetch(n,{credentials:"include"})).ok}class sn{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rn="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dm{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const r=new kh;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:t});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){const t=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(e==null?void 0:e.optional)??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(s){if(r)return null;throw s}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Om(e))try{this.getOrInitializeService({instanceIdentifier:Rn})}catch{}for(const[t,r]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(t);try{const i=this.getOrInitializeService({instanceIdentifier:s});r.resolve(i)}catch{}}}}clearInstance(e=Rn){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Rn){return this.instances.has(e)}getOptions(e=Rn){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:r,options:t});for(const[i,a]of this.instancesDeferred.entries()){const c=this.normalizeInstanceIdentifier(i);r===c&&a.resolve(s)}return s}onInit(e,t){const r=this.normalizeInstanceIdentifier(t),s=this.onInitCallbacks.get(r)??new Set;s.add(e),this.onInitCallbacks.set(r,s);const i=this.instances.get(r);return i&&e(i,r),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){const r=this.onInitCallbacks.get(t);if(r)for(const s of r)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:xm(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=Rn){return this.component?this.component.multipleInstances?e:Rn:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function xm(n){return n===Rn?void 0:n}function Om(n){return n.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lm{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new Dm(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Y;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(Y||(Y={}));const Mm={debug:Y.DEBUG,verbose:Y.VERBOSE,info:Y.INFO,warn:Y.WARN,error:Y.ERROR,silent:Y.SILENT},Um=Y.INFO,Fm={[Y.DEBUG]:"log",[Y.VERBOSE]:"log",[Y.INFO]:"info",[Y.WARN]:"warn",[Y.ERROR]:"error"},Bm=(n,e,...t)=>{if(e<n.logLevel)return;const r=new Date().toISOString(),s=Fm[e];if(s)console[s](`[${r}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Oa{constructor(e){this.name=e,this._logLevel=Um,this._logHandler=Bm,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in Y))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Mm[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,Y.DEBUG,...e),this._logHandler(this,Y.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,Y.VERBOSE,...e),this._logHandler(this,Y.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,Y.INFO,...e),this._logHandler(this,Y.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,Y.WARN,...e),this._logHandler(this,Y.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,Y.ERROR,...e),this._logHandler(this,Y.ERROR,...e)}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qm{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if($m(t)){const r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}}function $m(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const ua="@firebase/app",Xu="0.16.2";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nt=new Oa("@firebase/app"),jm="@firebase/app-compat",zm="@firebase/analytics-compat",Hm="@firebase/analytics",Wm="@firebase/app-check-compat",Gm="@firebase/app-check",Km="@firebase/auth",Qm="@firebase/auth-compat",Ym="@firebase/database",Jm="@firebase/data-connect",Xm="@firebase/database-compat",Zm="@firebase/functions",eg="@firebase/functions-compat",tg="@firebase/installations",ng="@firebase/installations-compat",rg="@firebase/messaging",sg="@firebase/messaging-compat",ig="@firebase/performance",og="@firebase/performance-compat",ag="@firebase/remote-config",cg="@firebase/remote-config-compat",ug="@firebase/storage",lg="@firebase/storage-compat",hg="@firebase/firestore",dg="@firebase/ai",fg="@firebase/firestore-compat",pg="firebase",mg="12.19.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const la="[DEFAULT]",gg={[ua]:"fire-core",[jm]:"fire-core-compat",[Hm]:"fire-analytics",[zm]:"fire-analytics-compat",[Gm]:"fire-app-check",[Wm]:"fire-app-check-compat",[Km]:"fire-auth",[Qm]:"fire-auth-compat",[Ym]:"fire-rtdb",[Jm]:"fire-data-connect",[Xm]:"fire-rtdb-compat",[Zm]:"fire-fn",[eg]:"fire-fn-compat",[tg]:"fire-iid",[ng]:"fire-iid-compat",[rg]:"fire-fcm",[sg]:"fire-fcm-compat",[ig]:"fire-perf",[og]:"fire-perf-compat",[ag]:"fire-rc",[cg]:"fire-rc-compat",[ug]:"fire-gcs",[lg]:"fire-gcs-compat",[hg]:"fire-fst",[fg]:"fire-fst-compat",[dg]:"fire-vertex","fire-js":"fire-js",[pg]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const On=new Map,ha=new Map,da=new Map;function Zu(n,e){try{n.container.addComponent(e)}catch(t){Nt.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function Ln(n){const e=n.name;if(da.has(e))return Nt.debug(`There were multiple attempts to register component ${e}.`),!1;da.set(e,n);for(const t of On.values())Zu(t,n);for(const t of ha.values())Zu(t,n);return!0}function Yi(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function qe(n){return n==null?!1:n.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _g={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},At=new Rs("app","Firebase",_g);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yg{constructor(e,t,r){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new sn("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw At.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jn=mg;function wg(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const r={name:la,automaticDataCollectionEnabled:!0,...e},s=r.name;if(typeof s!="string"||!s)throw At.create("bad-app-name",{appName:String(s)});if(t||(t=Vh()),!t)throw At.create("no-options");const i=On.get(s);if(i)if(xn(t,i.options)){if(xn(r,i.config))return i;throw At.create("duplicate-app",{appName:s,mismatchedParam:"config",oldValue:JSON.stringify(i.config),newValue:JSON.stringify(r)})}else throw At.create("duplicate-app",{appName:s,mismatchedParam:"options",oldValue:JSON.stringify(i.options),newValue:JSON.stringify(t)});const a=new Lm(s);for(const l of da.values())a.addComponent(l);const c=new yg(t,r,a);return On.set(s,c),c}function La(n=la){const e=On.get(n);if(!e&&n===la&&Vh())return wg();if(!e)throw At.create("no-app",{appName:n});return e}function XA(){return Array.from(On.values())}async function ZA(n){let e=!1;const t=n.name;On.has(t)?(e=!0,On.delete(t)):ha.has(t)&&n.decRefCount()<=0&&(ha.delete(t),e=!0),e&&(await Promise.all(n.container.getProviders().map(r=>r.delete())),n.isDeleted=!0)}function mt(n,e,t){let r=gg[n]??n;t&&(r+=`-${t}`);const s=r.match(/\s|\//),i=e.match(/\s|\//);if(s||i){const a=[`Unable to register library "${r}" with version "${e}":`];s&&a.push(`library name "${r}" contains illegal characters (whitespace or "/")`),s&&i&&a.push("and"),i&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Nt.warn(a.join(" "));return}Ln(new sn(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Eg="firebase-heartbeat-database",Tg=1,as="firebase-heartbeat-store";let Xo=null;function xh(){return Xo||(Xo=um(Eg,Tg,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(as)}catch(t){console.warn(t)}}}}).catch(n=>{throw At.create("idb-open",{originalErrorMessage:n.message})})),Xo}async function Ig(n){try{const t=(await xh()).transaction(as),r=await t.objectStore(as).get(Oh(n));return await t.done,r}catch(e){if(e instanceof It)Nt.warn(e.message);else{const t=At.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Nt.warn(t.message)}}}async function el(n,e){try{const r=(await xh()).transaction(as,"readwrite");await r.objectStore(as).put(e,Oh(n)),await r.done}catch(t){if(t instanceof It)Nt.warn(t.message);else{const r=At.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});Nt.warn(r.message)}}}function Oh(n){return`${n.name}!${n.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vg=1024,Ag=30;class Rg{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new bg(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,t;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=tl();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(a=>a.date===i))return;if(this._heartbeatsCache.heartbeats.push({date:i,agent:s}),this._heartbeatsCache.heartbeats.length>Ag){const a=Sg(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){Nt.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=tl(),{heartbeatsToSend:r,unsentEntries:s}=Pg(this._heartbeatsCache.heartbeats),i=Pi(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=t,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(t){return Nt.warn(t),""}}}function tl(){return new Date().toISOString().substring(0,10)}function Pg(n,e=vg){const t=[];let r=n.slice();for(const s of n){const i=t.find(a=>a.agent===s.agent);if(i){if(i.dates.push(s.date),nl(t)>e){i.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),nl(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}class bg{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Rm()?Pm().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await Ig(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return el(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return el(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function nl(n){return Pi(JSON.stringify({version:2,heartbeats:n})).length}function Sg(n){if(n.length===0)return-1;let e=0,t=n[0].date;for(let r=1;r<n.length;r++)n[r].date<t&&(t=n[r].date,e=r);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cg(n){Ln(new sn("platform-logger",e=>new qm(e),"PRIVATE")),Ln(new sn("heartbeat",e=>new Rg(e),"PRIVATE")),mt(ua,Xu,n),mt(ua,Xu,"esm2020"),mt("fire-js","")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Cg("");var rl=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Zt,Lh;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(I,g){function w(){}w.prototype=g.prototype,I.F=g.prototype,I.prototype=new w,I.prototype.constructor=I,I.D=function(v,T,R){for(var _=Array(arguments.length-2),Fe=2;Fe<arguments.length;Fe++)_[Fe-2]=arguments[Fe];return g.prototype[T].apply(v,_)}}function t(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(r,t),r.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(I,g,w){w||(w=0);const v=Array(16);if(typeof g=="string")for(var T=0;T<16;++T)v[T]=g.charCodeAt(w++)|g.charCodeAt(w++)<<8|g.charCodeAt(w++)<<16|g.charCodeAt(w++)<<24;else for(T=0;T<16;++T)v[T]=g[w++]|g[w++]<<8|g[w++]<<16|g[w++]<<24;g=I.g[0],w=I.g[1],T=I.g[2];let R=I.g[3],_;_=g+(R^w&(T^R))+v[0]+3614090360&4294967295,g=w+(_<<7&4294967295|_>>>25),_=R+(T^g&(w^T))+v[1]+3905402710&4294967295,R=g+(_<<12&4294967295|_>>>20),_=T+(w^R&(g^w))+v[2]+606105819&4294967295,T=R+(_<<17&4294967295|_>>>15),_=w+(g^T&(R^g))+v[3]+3250441966&4294967295,w=T+(_<<22&4294967295|_>>>10),_=g+(R^w&(T^R))+v[4]+4118548399&4294967295,g=w+(_<<7&4294967295|_>>>25),_=R+(T^g&(w^T))+v[5]+1200080426&4294967295,R=g+(_<<12&4294967295|_>>>20),_=T+(w^R&(g^w))+v[6]+2821735955&4294967295,T=R+(_<<17&4294967295|_>>>15),_=w+(g^T&(R^g))+v[7]+4249261313&4294967295,w=T+(_<<22&4294967295|_>>>10),_=g+(R^w&(T^R))+v[8]+1770035416&4294967295,g=w+(_<<7&4294967295|_>>>25),_=R+(T^g&(w^T))+v[9]+2336552879&4294967295,R=g+(_<<12&4294967295|_>>>20),_=T+(w^R&(g^w))+v[10]+4294925233&4294967295,T=R+(_<<17&4294967295|_>>>15),_=w+(g^T&(R^g))+v[11]+2304563134&4294967295,w=T+(_<<22&4294967295|_>>>10),_=g+(R^w&(T^R))+v[12]+1804603682&4294967295,g=w+(_<<7&4294967295|_>>>25),_=R+(T^g&(w^T))+v[13]+4254626195&4294967295,R=g+(_<<12&4294967295|_>>>20),_=T+(w^R&(g^w))+v[14]+2792965006&4294967295,T=R+(_<<17&4294967295|_>>>15),_=w+(g^T&(R^g))+v[15]+1236535329&4294967295,w=T+(_<<22&4294967295|_>>>10),_=g+(T^R&(w^T))+v[1]+4129170786&4294967295,g=w+(_<<5&4294967295|_>>>27),_=R+(w^T&(g^w))+v[6]+3225465664&4294967295,R=g+(_<<9&4294967295|_>>>23),_=T+(g^w&(R^g))+v[11]+643717713&4294967295,T=R+(_<<14&4294967295|_>>>18),_=w+(R^g&(T^R))+v[0]+3921069994&4294967295,w=T+(_<<20&4294967295|_>>>12),_=g+(T^R&(w^T))+v[5]+3593408605&4294967295,g=w+(_<<5&4294967295|_>>>27),_=R+(w^T&(g^w))+v[10]+38016083&4294967295,R=g+(_<<9&4294967295|_>>>23),_=T+(g^w&(R^g))+v[15]+3634488961&4294967295,T=R+(_<<14&4294967295|_>>>18),_=w+(R^g&(T^R))+v[4]+3889429448&4294967295,w=T+(_<<20&4294967295|_>>>12),_=g+(T^R&(w^T))+v[9]+568446438&4294967295,g=w+(_<<5&4294967295|_>>>27),_=R+(w^T&(g^w))+v[14]+3275163606&4294967295,R=g+(_<<9&4294967295|_>>>23),_=T+(g^w&(R^g))+v[3]+4107603335&4294967295,T=R+(_<<14&4294967295|_>>>18),_=w+(R^g&(T^R))+v[8]+1163531501&4294967295,w=T+(_<<20&4294967295|_>>>12),_=g+(T^R&(w^T))+v[13]+2850285829&4294967295,g=w+(_<<5&4294967295|_>>>27),_=R+(w^T&(g^w))+v[2]+4243563512&4294967295,R=g+(_<<9&4294967295|_>>>23),_=T+(g^w&(R^g))+v[7]+1735328473&4294967295,T=R+(_<<14&4294967295|_>>>18),_=w+(R^g&(T^R))+v[12]+2368359562&4294967295,w=T+(_<<20&4294967295|_>>>12),_=g+(w^T^R)+v[5]+4294588738&4294967295,g=w+(_<<4&4294967295|_>>>28),_=R+(g^w^T)+v[8]+2272392833&4294967295,R=g+(_<<11&4294967295|_>>>21),_=T+(R^g^w)+v[11]+1839030562&4294967295,T=R+(_<<16&4294967295|_>>>16),_=w+(T^R^g)+v[14]+4259657740&4294967295,w=T+(_<<23&4294967295|_>>>9),_=g+(w^T^R)+v[1]+2763975236&4294967295,g=w+(_<<4&4294967295|_>>>28),_=R+(g^w^T)+v[4]+1272893353&4294967295,R=g+(_<<11&4294967295|_>>>21),_=T+(R^g^w)+v[7]+4139469664&4294967295,T=R+(_<<16&4294967295|_>>>16),_=w+(T^R^g)+v[10]+3200236656&4294967295,w=T+(_<<23&4294967295|_>>>9),_=g+(w^T^R)+v[13]+681279174&4294967295,g=w+(_<<4&4294967295|_>>>28),_=R+(g^w^T)+v[0]+3936430074&4294967295,R=g+(_<<11&4294967295|_>>>21),_=T+(R^g^w)+v[3]+3572445317&4294967295,T=R+(_<<16&4294967295|_>>>16),_=w+(T^R^g)+v[6]+76029189&4294967295,w=T+(_<<23&4294967295|_>>>9),_=g+(w^T^R)+v[9]+3654602809&4294967295,g=w+(_<<4&4294967295|_>>>28),_=R+(g^w^T)+v[12]+3873151461&4294967295,R=g+(_<<11&4294967295|_>>>21),_=T+(R^g^w)+v[15]+530742520&4294967295,T=R+(_<<16&4294967295|_>>>16),_=w+(T^R^g)+v[2]+3299628645&4294967295,w=T+(_<<23&4294967295|_>>>9),_=g+(T^(w|~R))+v[0]+4096336452&4294967295,g=w+(_<<6&4294967295|_>>>26),_=R+(w^(g|~T))+v[7]+1126891415&4294967295,R=g+(_<<10&4294967295|_>>>22),_=T+(g^(R|~w))+v[14]+2878612391&4294967295,T=R+(_<<15&4294967295|_>>>17),_=w+(R^(T|~g))+v[5]+4237533241&4294967295,w=T+(_<<21&4294967295|_>>>11),_=g+(T^(w|~R))+v[12]+1700485571&4294967295,g=w+(_<<6&4294967295|_>>>26),_=R+(w^(g|~T))+v[3]+2399980690&4294967295,R=g+(_<<10&4294967295|_>>>22),_=T+(g^(R|~w))+v[10]+4293915773&4294967295,T=R+(_<<15&4294967295|_>>>17),_=w+(R^(T|~g))+v[1]+2240044497&4294967295,w=T+(_<<21&4294967295|_>>>11),_=g+(T^(w|~R))+v[8]+1873313359&4294967295,g=w+(_<<6&4294967295|_>>>26),_=R+(w^(g|~T))+v[15]+4264355552&4294967295,R=g+(_<<10&4294967295|_>>>22),_=T+(g^(R|~w))+v[6]+2734768916&4294967295,T=R+(_<<15&4294967295|_>>>17),_=w+(R^(T|~g))+v[13]+1309151649&4294967295,w=T+(_<<21&4294967295|_>>>11),_=g+(T^(w|~R))+v[4]+4149444226&4294967295,g=w+(_<<6&4294967295|_>>>26),_=R+(w^(g|~T))+v[11]+3174756917&4294967295,R=g+(_<<10&4294967295|_>>>22),_=T+(g^(R|~w))+v[2]+718787259&4294967295,T=R+(_<<15&4294967295|_>>>17),_=w+(R^(T|~g))+v[9]+3951481745&4294967295,I.g[0]=I.g[0]+g&4294967295,I.g[1]=I.g[1]+(T+(_<<21&4294967295|_>>>11))&4294967295,I.g[2]=I.g[2]+T&4294967295,I.g[3]=I.g[3]+R&4294967295}r.prototype.v=function(I,g){g===void 0&&(g=I.length);const w=g-this.blockSize,v=this.C;let T=this.h,R=0;for(;R<g;){if(T==0)for(;R<=w;)s(this,I,R),R+=this.blockSize;if(typeof I=="string"){for(;R<g;)if(v[T++]=I.charCodeAt(R++),T==this.blockSize){s(this,v),T=0;break}}else for(;R<g;)if(v[T++]=I[R++],T==this.blockSize){s(this,v),T=0;break}}this.h=T,this.o+=g},r.prototype.A=function(){var I=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);I[0]=128;for(var g=1;g<I.length-8;++g)I[g]=0;g=this.o*8;for(var w=I.length-8;w<I.length;++w)I[w]=g&255,g/=256;for(this.v(I),I=Array(16),g=0,w=0;w<4;++w)for(let v=0;v<32;v+=8)I[g++]=this.g[w]>>>v&255;return I};function i(I,g){var w=c;return Object.prototype.hasOwnProperty.call(w,I)?w[I]:w[I]=g(I)}function a(I,g){this.h=g;const w=[];let v=!0;for(let T=I.length-1;T>=0;T--){const R=I[T]|0;v&&R==g||(w[T]=R,v=!1)}this.g=w}var c={};function l(I){return-128<=I&&I<128?i(I,function(g){return new a([g|0],g<0?-1:0)}):new a([I|0],I<0?-1:0)}function h(I){if(isNaN(I)||!isFinite(I))return m;if(I<0)return x(h(-I));const g=[];let w=1;for(let v=0;I>=w;v++)g[v]=I/w|0,w*=4294967296;return new a(g,0)}function f(I,g){if(I.length==0)throw Error("number format error: empty string");if(g=g||10,g<2||36<g)throw Error("radix out of range: "+g);if(I.charAt(0)=="-")return x(f(I.substring(1),g));if(I.indexOf("-")>=0)throw Error('number format error: interior "-" character');const w=h(Math.pow(g,8));let v=m;for(let R=0;R<I.length;R+=8){var T=Math.min(8,I.length-R);const _=parseInt(I.substring(R,R+T),g);T<8?(T=h(Math.pow(g,T)),v=v.j(T).add(h(_))):(v=v.j(w),v=v.add(h(_)))}return v}var m=l(0),y=l(1),b=l(16777216);n=a.prototype,n.m=function(){if(M(this))return-x(this).m();let I=0,g=1;for(let w=0;w<this.g.length;w++){const v=this.i(w);I+=(v>=0?v:4294967296+v)*g,g*=4294967296}return I},n.toString=function(I){if(I=I||10,I<2||36<I)throw Error("radix out of range: "+I);if(V(this))return"0";if(M(this))return"-"+x(this).toString(I);const g=h(Math.pow(I,6));var w=this;let v="";for(;;){const T=ne(w,g).g;w=z(w,T.j(g));let R=((w.g.length>0?w.g[0]:w.h)>>>0).toString(I);if(w=T,V(w))return R+v;for(;R.length<6;)R="0"+R;v=R+v}},n.i=function(I){return I<0?0:I<this.g.length?this.g[I]:this.h};function V(I){if(I.h!=0)return!1;for(let g=0;g<I.g.length;g++)if(I.g[g]!=0)return!1;return!0}function M(I){return I.h==-1}n.l=function(I){return I=z(this,I),M(I)?-1:V(I)?0:1};function x(I){const g=I.g.length,w=[];for(let v=0;v<g;v++)w[v]=~I.g[v];return new a(w,~I.h).add(y)}n.abs=function(){return M(this)?x(this):this},n.add=function(I){const g=Math.max(this.g.length,I.g.length),w=[];let v=0;for(let T=0;T<=g;T++){let R=v+(this.i(T)&65535)+(I.i(T)&65535),_=(R>>>16)+(this.i(T)>>>16)+(I.i(T)>>>16);v=_>>>16,R&=65535,_&=65535,w[T]=_<<16|R}return new a(w,w[w.length-1]&-2147483648?-1:0)};function z(I,g){return I.add(x(g))}n.j=function(I){if(V(this)||V(I))return m;if(M(this))return M(I)?x(this).j(x(I)):x(x(this).j(I));if(M(I))return x(this.j(x(I)));if(this.l(b)<0&&I.l(b)<0)return h(this.m()*I.m());const g=this.g.length+I.g.length,w=[];for(var v=0;v<2*g;v++)w[v]=0;for(v=0;v<this.g.length;v++)for(let T=0;T<I.g.length;T++){const R=this.i(v)>>>16,_=this.i(v)&65535,Fe=I.i(T)>>>16,wn=I.i(T)&65535;w[2*v+2*T]+=_*wn,G(w,2*v+2*T),w[2*v+2*T+1]+=R*wn,G(w,2*v+2*T+1),w[2*v+2*T+1]+=_*Fe,G(w,2*v+2*T+1),w[2*v+2*T+2]+=R*Fe,G(w,2*v+2*T+2)}for(I=0;I<g;I++)w[I]=w[2*I+1]<<16|w[2*I];for(I=g;I<2*g;I++)w[I]=0;return new a(w,0)};function G(I,g){for(;(I[g]&65535)!=I[g];)I[g+1]+=I[g]>>>16,I[g]&=65535,g++}function X(I,g){this.g=I,this.h=g}function ne(I,g){if(V(g))throw Error("division by zero");if(V(I))return new X(m,m);if(M(I))return g=ne(x(I),g),new X(x(g.g),x(g.h));if(M(g))return g=ne(I,x(g)),new X(x(g.g),g.h);if(I.g.length>30){if(M(I)||M(g))throw Error("slowDivide_ only works with positive integers.");for(var w=y,v=g;v.l(I)<=0;)w=he(w),v=he(v);var T=de(w,1),R=de(v,1);for(v=de(v,2),w=de(w,2);!V(v);){var _=R.add(v);_.l(I)<=0&&(T=T.add(w),R=_),v=de(v,1),w=de(w,1)}return g=z(I,T.j(g)),new X(T,g)}for(T=m;I.l(g)>=0;){for(w=Math.max(1,Math.floor(I.m()/g.m())),v=Math.ceil(Math.log(w)/Math.LN2),v=v<=48?1:Math.pow(2,v-48),R=h(w),_=R.j(g);M(_)||_.l(I)>0;)w-=v,R=h(w),_=R.j(g);V(R)&&(R=y),T=T.add(R),I=z(I,_)}return new X(T,I)}n.B=function(I){return ne(this,I).h},n.and=function(I){const g=Math.max(this.g.length,I.g.length),w=[];for(let v=0;v<g;v++)w[v]=this.i(v)&I.i(v);return new a(w,this.h&I.h)},n.or=function(I){const g=Math.max(this.g.length,I.g.length),w=[];for(let v=0;v<g;v++)w[v]=this.i(v)|I.i(v);return new a(w,this.h|I.h)},n.xor=function(I){const g=Math.max(this.g.length,I.g.length),w=[];for(let v=0;v<g;v++)w[v]=this.i(v)^I.i(v);return new a(w,this.h^I.h)};function he(I){const g=I.g.length+1,w=[];for(let v=0;v<g;v++)w[v]=I.i(v)<<1|I.i(v-1)>>>31;return new a(w,I.h)}function de(I,g){const w=g>>5;g%=32;const v=I.g.length-w,T=[];for(let R=0;R<v;R++)T[R]=g>0?I.i(R+w)>>>g|I.i(R+w+1)<<32-g:I.i(R+w);return new a(T,I.h)}r.prototype.digest=r.prototype.A,r.prototype.reset=r.prototype.u,r.prototype.update=r.prototype.v,Lh=r,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.B,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=h,a.fromString=f,Zt=a}).apply(typeof rl<"u"?rl:typeof self<"u"?self:typeof window<"u"?window:{});var ii=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Mh,Gr,Uh,pi,fa,Fh,Bh,qh;(function(){var n,e=Object.defineProperty;function t(o){o=[typeof globalThis=="object"&&globalThis,o,typeof window=="object"&&window,typeof self=="object"&&self,typeof ii=="object"&&ii];for(var u=0;u<o.length;++u){var d=o[u];if(d&&d.Math==Math)return d}throw Error("Cannot find global object")}var r=t(this);function s(o,u){if(u)e:{var d=r;o=o.split(".");for(var p=0;p<o.length-1;p++){var A=o[p];if(!(A in d))break e;d=d[A]}o=o[o.length-1],p=d[o],u=u(p),u!=p&&u!=null&&e(d,o,{configurable:!0,writable:!0,value:u})}}s("Symbol.dispose",function(o){return o||Symbol("Symbol.dispose")}),s("Array.prototype.values",function(o){return o||function(){return this[Symbol.iterator]()}}),s("Object.entries",function(o){return o||function(u){var d=[],p;for(p in u)Object.prototype.hasOwnProperty.call(u,p)&&d.push([p,u[p]]);return d}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var i=i||{},a=this||self;function c(o){var u=typeof o;return u=="object"&&o!=null||u=="function"}function l(o,u,d){return o.call.apply(o.bind,arguments)}function h(o,u,d){return h=l,h.apply(null,arguments)}function f(o,u){var d=Array.prototype.slice.call(arguments,1);return function(){var p=d.slice();return p.push.apply(p,arguments),o.apply(this,p)}}function m(o,u){function d(){}d.prototype=u.prototype,o.Z=u.prototype,o.prototype=new d,o.prototype.constructor=o,o.Ob=function(p,A,P){for(var O=Array(arguments.length-2),W=2;W<arguments.length;W++)O[W-2]=arguments[W];return u.prototype[A].apply(p,O)}}var y=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?o=>o&&AsyncContext.Snapshot.wrap(o):o=>o;function b(o){const u=o.length;if(u>0){const d=Array(u);for(let p=0;p<u;p++)d[p]=o[p];return d}return[]}function V(o,u){for(let p=1;p<arguments.length;p++){const A=arguments[p];var d=typeof A;if(d=d!="object"?d:A?Array.isArray(A)?"array":d:"null",d=="array"||d=="object"&&typeof A.length=="number"){d=o.length||0;const P=A.length||0;o.length=d+P;for(let O=0;O<P;O++)o[d+O]=A[O]}else o.push(A)}}class M{constructor(u,d){this.i=u,this.j=d,this.h=0,this.g=null}get(){let u;return this.h>0?(this.h--,u=this.g,this.g=u.next,u.next=null):u=this.i(),u}}function x(o){a.setTimeout(()=>{throw o},0)}function z(){var o=I;let u=null;return o.g&&(u=o.g,o.g=o.g.next,o.g||(o.h=null),u.next=null),u}class G{constructor(){this.h=this.g=null}add(u,d){const p=X.get();p.set(u,d),this.h?this.h.next=p:this.g=p,this.h=p}}var X=new M(()=>new ne,o=>o.reset());class ne{constructor(){this.next=this.g=this.h=null}set(u,d){this.h=u,this.g=d,this.next=null}reset(){this.next=this.g=this.h=null}}let he,de=!1,I=new G,g=()=>{const o=Promise.resolve(void 0);he=()=>{o.then(w)}};function w(){for(var o;o=z();){try{o.h.call(o.g)}catch(d){x(d)}var u=X;u.j(o),u.h<100&&(u.h++,o.next=u.g,u.g=o)}de=!1}function v(){this.u=this.u,this.C=this.C}v.prototype.u=!1,v.prototype.dispose=function(){this.u||(this.u=!0,this.N())},v.prototype[Symbol.dispose]=function(){this.dispose()},v.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function T(o,u){this.type=o,this.g=this.target=u,this.defaultPrevented=!1}T.prototype.h=function(){this.defaultPrevented=!0};var R=(function(){if(!a.addEventListener||!Object.defineProperty)return!1;var o=!1,u=Object.defineProperty({},"passive",{get:function(){o=!0}});try{const d=()=>{};a.addEventListener("test",d,u),a.removeEventListener("test",d,u)}catch{}return o})();function _(o){return/^[\s\xa0]*$/.test(o)}function Fe(o,u){T.call(this,o?o.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,o&&this.init(o,u)}m(Fe,T),Fe.prototype.init=function(o,u){const d=this.type=o.type,p=o.changedTouches&&o.changedTouches.length?o.changedTouches[0]:null;this.target=o.target||o.srcElement,this.g=u,u=o.relatedTarget,u||(d=="mouseover"?u=o.fromElement:d=="mouseout"&&(u=o.toElement)),this.relatedTarget=u,p?(this.clientX=p.clientX!==void 0?p.clientX:p.pageX,this.clientY=p.clientY!==void 0?p.clientY:p.pageY,this.screenX=p.screenX||0,this.screenY=p.screenY||0):(this.clientX=o.clientX!==void 0?o.clientX:o.pageX,this.clientY=o.clientY!==void 0?o.clientY:o.pageY,this.screenX=o.screenX||0,this.screenY=o.screenY||0),this.button=o.button,this.key=o.key||"",this.ctrlKey=o.ctrlKey,this.altKey=o.altKey,this.shiftKey=o.shiftKey,this.metaKey=o.metaKey,this.pointerId=o.pointerId||0,this.pointerType=o.pointerType,this.state=o.state,this.i=o,o.defaultPrevented&&Fe.Z.h.call(this)},Fe.prototype.h=function(){Fe.Z.h.call(this);const o=this.i;o.preventDefault?o.preventDefault():o.returnValue=!1};var wn="closure_listenable_"+(Math.random()*1e6|0),Np=0;function kp(o,u,d,p,A){this.listener=o,this.proxy=null,this.src=u,this.type=d,this.capture=!!p,this.ha=A,this.key=++Np,this.da=this.fa=!1}function zs(o){o.da=!0,o.listener=null,o.proxy=null,o.src=null,o.ha=null}function Hs(o,u,d){for(const p in o)u.call(d,o[p],p,o)}function Dp(o,u){for(const d in o)u.call(void 0,o[d],d,o)}function Qc(o){const u={};for(const d in o)u[d]=o[d];return u}const Yc="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function Jc(o,u){let d,p;for(let A=1;A<arguments.length;A++){p=arguments[A];for(d in p)o[d]=p[d];for(let P=0;P<Yc.length;P++)d=Yc[P],Object.prototype.hasOwnProperty.call(p,d)&&(o[d]=p[d])}}function Ws(o){this.src=o,this.g={},this.h=0}Ws.prototype.add=function(o,u,d,p,A){const P=o.toString();o=this.g[P],o||(o=this.g[P]=[],this.h++);const O=So(o,u,p,A);return O>-1?(u=o[O],d||(u.fa=!1)):(u=new kp(u,this.src,P,!!p,A),u.fa=d,o.push(u)),u};function bo(o,u){const d=u.type;if(d in o.g){var p=o.g[d],A=Array.prototype.indexOf.call(p,u,void 0),P;(P=A>=0)&&Array.prototype.splice.call(p,A,1),P&&(zs(u),o.g[d].length==0&&(delete o.g[d],o.h--))}}function So(o,u,d,p){for(let A=0;A<o.length;++A){const P=o[A];if(!P.da&&P.listener==u&&P.capture==!!d&&P.ha==p)return A}return-1}var Co="closure_lm_"+(Math.random()*1e6|0),Vo={};function Xc(o,u,d,p,A){if(Array.isArray(u)){for(let P=0;P<u.length;P++)Xc(o,u[P],d,p,A);return null}return d=tu(d),o&&o[wn]?o.J(u,d,c(p)?!!p.capture:!1,A):xp(o,u,d,!1,p,A)}function xp(o,u,d,p,A,P){if(!u)throw Error("Invalid event type");const O=c(A)?!!A.capture:!!A;let W=ko(o);if(W||(o[Co]=W=new Ws(o)),d=W.add(u,d,p,O,P),d.proxy)return d;if(p=Op(),d.proxy=p,p.src=o,p.listener=d,o.addEventListener)R||(A=O),A===void 0&&(A=!1),o.addEventListener(u.toString(),p,A);else if(o.attachEvent)o.attachEvent(eu(u.toString()),p);else if(o.addListener&&o.removeListener)o.addListener(p);else throw Error("addEventListener and attachEvent are unavailable.");return d}function Op(){function o(d){return u.call(o.src,o.listener,d)}const u=Lp;return o}function Zc(o,u,d,p,A){if(Array.isArray(u))for(var P=0;P<u.length;P++)Zc(o,u[P],d,p,A);else p=c(p)?!!p.capture:!!p,d=tu(d),o&&o[wn]?(o=o.i,P=String(u).toString(),P in o.g&&(u=o.g[P],d=So(u,d,p,A),d>-1&&(zs(u[d]),Array.prototype.splice.call(u,d,1),u.length==0&&(delete o.g[P],o.h--)))):o&&(o=ko(o))&&(u=o.g[u.toString()],o=-1,u&&(o=So(u,d,p,A)),(d=o>-1?u[o]:null)&&No(d))}function No(o){if(typeof o!="number"&&o&&!o.da){var u=o.src;if(u&&u[wn])bo(u.i,o);else{var d=o.type,p=o.proxy;u.removeEventListener?u.removeEventListener(d,p,o.capture):u.detachEvent?u.detachEvent(eu(d),p):u.addListener&&u.removeListener&&u.removeListener(p),(d=ko(u))?(bo(d,o),d.h==0&&(d.src=null,u[Co]=null)):zs(o)}}}function eu(o){return o in Vo?Vo[o]:Vo[o]="on"+o}function Lp(o,u){if(o.da)o=!0;else{u=new Fe(u,this);const d=o.listener,p=o.ha||o.src;o.fa&&No(o),o=d.call(p,u)}return o}function ko(o){return o=o[Co],o instanceof Ws?o:null}var Do="__closure_events_fn_"+(Math.random()*1e9>>>0);function tu(o){return typeof o=="function"?o:(o[Do]||(o[Do]=function(u){return o.handleEvent(u)}),o[Do])}function Ce(){v.call(this),this.i=new Ws(this),this.M=this,this.G=null}m(Ce,v),Ce.prototype[wn]=!0,Ce.prototype.removeEventListener=function(o,u,d,p){Zc(this,o,u,d,p)};function Oe(o,u){var d,p=o.G;if(p)for(d=[];p;p=p.G)d.push(p);if(o=o.M,p=u.type||u,typeof u=="string")u=new T(u,o);else if(u instanceof T)u.target=u.target||o;else{var A=u;u=new T(p,o),Jc(u,A)}A=!0;let P,O;if(d)for(O=d.length-1;O>=0;O--)P=u.g=d[O],A=Gs(P,p,!0,u)&&A;if(P=u.g=o,A=Gs(P,p,!0,u)&&A,A=Gs(P,p,!1,u)&&A,d)for(O=0;O<d.length;O++)P=u.g=d[O],A=Gs(P,p,!1,u)&&A}Ce.prototype.N=function(){if(Ce.Z.N.call(this),this.i){var o=this.i;for(const u in o.g){const d=o.g[u];for(let p=0;p<d.length;p++)zs(d[p]);delete o.g[u],o.h--}}this.G=null},Ce.prototype.J=function(o,u,d,p){return this.i.add(String(o),u,!1,d,p)},Ce.prototype.K=function(o,u,d,p){return this.i.add(String(o),u,!0,d,p)};function Gs(o,u,d,p){if(u=o.i.g[String(u)],!u)return!0;u=u.concat();let A=!0;for(let P=0;P<u.length;++P){const O=u[P];if(O&&!O.da&&O.capture==d){const W=O.listener,Ee=O.ha||O.src;O.fa&&bo(o.i,O),A=W.call(Ee,p)!==!1&&A}}return A&&!p.defaultPrevented}function Mp(o,u){if(typeof o!="function")if(o&&typeof o.handleEvent=="function")o=h(o.handleEvent,o);else throw Error("Invalid listener argument");return Number(u)>2147483647?-1:a.setTimeout(o,u||0)}function nu(o){o.g=Mp(()=>{o.g=null,o.i&&(o.i=!1,nu(o))},o.l);const u=o.h;o.h=null,o.m.apply(null,u)}class Up extends v{constructor(u,d){super(),this.m=u,this.l=d,this.h=null,this.i=!1,this.g=null}j(u){this.h=arguments,this.g?this.i=!0:nu(this)}N(){super.N(),this.g&&(a.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Pr(o){v.call(this),this.h=o,this.g={}}m(Pr,v);var ru=[];function su(o){Hs(o.g,function(u,d){this.g.hasOwnProperty(d)&&No(u)},o),o.g={}}Pr.prototype.N=function(){Pr.Z.N.call(this),su(this)},Pr.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var xo=a.JSON.stringify,Fp=a.JSON.parse,Bp=class{stringify(o){return a.JSON.stringify(o,void 0)}parse(o){return a.JSON.parse(o,void 0)}};function iu(){}function ou(){}var br={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function Oo(){T.call(this,"d")}m(Oo,T);function Lo(){T.call(this,"c")}m(Lo,T);var En={},au=null;function Ks(){return au=au||new Ce}En.Ia="serverreachability";function cu(o){T.call(this,En.Ia,o)}m(cu,T);function Sr(o){const u=Ks();Oe(u,new cu(u))}En.STAT_EVENT="statevent";function uu(o,u){T.call(this,En.STAT_EVENT,o),this.stat=u}m(uu,T);function Le(o){const u=Ks();Oe(u,new uu(u,o))}En.Ja="timingevent";function lu(o,u){T.call(this,En.Ja,o),this.size=u}m(lu,T);function Cr(o,u){if(typeof o!="function")throw Error("Fn must not be null and must be a function");return a.setTimeout(function(){o()},u)}function Vr(){this.g=!0}Vr.prototype.ua=function(){this.g=!1};function qp(o,u,d,p,A,P){o.info(function(){if(o.g)if(P){var O="",W=P.split("&");for(let re=0;re<W.length;re++){var Ee=W[re].split("=");if(Ee.length>1){const Ie=Ee[0];Ee=Ee[1];const lt=Ie.split("_");O=lt.length>=2&&lt[1]=="type"?O+(Ie+"="+Ee+"&"):O+(Ie+"=redacted&")}}}else O=null;else O=P;return"XMLHTTP REQ ("+p+") [attempt "+A+"]: "+u+`
`+d+`
`+O})}function $p(o,u,d,p,A,P,O){o.info(function(){return"XMLHTTP RESP ("+p+") [ attempt "+A+"]: "+u+`
`+d+`
`+P+" "+O})}function Kn(o,u,d,p){o.info(function(){return"XMLHTTP TEXT ("+u+"): "+zp(o,d)+(p?" "+p:"")})}function jp(o,u){o.info(function(){return"TIMEOUT: "+u})}Vr.prototype.info=function(){};function zp(o,u){if(!o.g)return u;if(!u)return null;try{const P=JSON.parse(u);if(P){for(o=0;o<P.length;o++)if(Array.isArray(P[o])){var d=P[o];if(!(d.length<2)){var p=d[1];if(Array.isArray(p)&&!(p.length<1)){var A=p[0];if(A!="noop"&&A!="stop"&&A!="close")for(let O=1;O<p.length;O++)p[O]=""}}}}return xo(P)}catch{return u}}var Qs={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},hu={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"},du;function Mo(){}m(Mo,iu),Mo.prototype.g=function(){return new XMLHttpRequest},du=new Mo;function Nr(o){return encodeURIComponent(String(o))}function Hp(o){var u=1;o=o.split(":");const d=[];for(;u>0&&o.length;)d.push(o.shift()),u--;return o.length&&d.push(o.join(":")),d}function Ut(o,u,d,p){this.j=o,this.i=u,this.l=d,this.S=p||1,this.V=new Pr(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new fu}function fu(){this.i=null,this.g="",this.h=!1}var pu={},Uo={};function Fo(o,u,d){o.M=1,o.A=Js(ut(u)),o.u=d,o.R=!0,mu(o,null)}function mu(o,u){o.F=Date.now(),Ys(o),o.B=ut(o.A);var d=o.B,p=o.S;Array.isArray(p)||(p=[String(p)]),Su(d.i,"t",p),o.C=0,d=o.j.L,o.h=new fu,o.g=Wu(o.j,d?u:null,!o.u),o.P>0&&(o.O=new Up(h(o.Y,o,o.g),o.P)),u=o.V,d=o.g,p=o.ba;var A="readystatechange";Array.isArray(A)||(A&&(ru[0]=A.toString()),A=ru);for(let P=0;P<A.length;P++){const O=Xc(d,A[P],p||u.handleEvent,!1,u.h||u);if(!O)break;u.g[O.key]=O}u=o.J?Qc(o.J):{},o.u?(o.v||(o.v="POST"),u["Content-Type"]="application/x-www-form-urlencoded",o.g.ea(o.B,o.v,o.u,u)):(o.v="GET",o.g.ea(o.B,o.v,null,u)),Sr(),qp(o.i,o.v,o.B,o.l,o.S,o.u)}Ut.prototype.ba=function(o){o=o.target;const u=this.O;u&&qt(o)==3?u.j():this.Y(o)},Ut.prototype.Y=function(o){try{if(o==this.g)e:{const W=qt(this.g),Ee=this.g.ya(),re=this.g.ca();if(!(W<3)&&(W!=3||this.g&&(this.h.h||this.g.la()||Ou(this.g)))){this.K||W!=4||Ee==7||(Ee==8||re<=0?Sr(3):Sr(2)),Bo(this);var u=this.g.ca();this.X=u;var d=Wp(this);if(this.o=u==200,$p(this.i,this.v,this.B,this.l,this.S,W,u),this.o){if(this.U&&!this.L){t:{if(this.g){var p,A=this.g;if((p=A.g?A.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!_(p)){var P=p;break t}}P=null}if(o=P)Kn(this.i,this.l,o,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,qo(this,o);else{this.o=!1,this.m=3,Le(12),Tn(this),kr(this);break e}}if(this.R){o=!0;let Ie;for(;!this.K&&this.C<d.length;)if(Ie=Gp(this,d),Ie==Uo){W==4&&(this.m=4,Le(14),o=!1),Kn(this.i,this.l,null,"[Incomplete Response]");break}else if(Ie==pu){this.m=4,Le(15),Kn(this.i,this.l,d,"[Invalid Chunk]"),o=!1;break}else Kn(this.i,this.l,Ie,null),qo(this,Ie);if(gu(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),W!=4||d.length!=0||this.h.h||(this.m=1,Le(16),o=!1),this.o=this.o&&o,!o)Kn(this.i,this.l,d,"[Invalid Chunked Response]"),Tn(this),kr(this);else if(d.length>0&&!this.W){this.W=!0;var O=this.j;O.g==this&&O.aa&&!O.P&&(O.j.info("Great, no buffering proxy detected. Bytes received: "+d.length),Qo(O),O.P=!0,Le(11))}}else Kn(this.i,this.l,d,null),qo(this,d);W==4&&Tn(this),this.o&&!this.K&&(W==4?$u(this.j,this):(this.o=!1,Ys(this)))}else am(this.g),u==400&&d.indexOf("Unknown SID")>0?(this.m=3,Le(12)):(this.m=0,Le(13)),Tn(this),kr(this)}}}catch{}finally{}};function Wp(o){if(!gu(o))return o.g.la();const u=Ou(o.g);if(u==="")return"";let d="";const p=u.length,A=qt(o.g)==4;if(!o.h.i){if(typeof TextDecoder>"u")return Tn(o),kr(o),"";o.h.i=new a.TextDecoder}for(let P=0;P<p;P++)o.h.h=!0,d+=o.h.i.decode(u[P],{stream:!(A&&P==p-1)});return u.length=0,o.h.g+=d,o.C=0,o.h.g}function gu(o){return o.g?o.v=="GET"&&o.M!=2&&o.j.Aa:!1}function Gp(o,u){var d=o.C,p=u.indexOf(`
`,d);return p==-1?Uo:(d=Number(u.substring(d,p)),isNaN(d)?pu:(p+=1,p+d>u.length?Uo:(u=u.slice(p,p+d),o.C=p+d,u)))}Ut.prototype.cancel=function(){this.K=!0,Tn(this)};function Ys(o){o.T=Date.now()+o.H,_u(o,o.H)}function _u(o,u){if(o.D!=null)throw Error("WatchDog timer not null");o.D=Cr(h(o.aa,o),u)}function Bo(o){o.D&&(a.clearTimeout(o.D),o.D=null)}Ut.prototype.aa=function(){this.D=null;const o=Date.now();o-this.T>=0?(jp(this.i,this.B),this.M!=2&&(Sr(),Le(17)),Tn(this),this.m=2,kr(this)):_u(this,this.T-o)};function kr(o){o.j.I==0||o.K||$u(o.j,o)}function Tn(o){Bo(o);var u=o.O;u&&typeof u.dispose=="function"&&u.dispose(),o.O=null,su(o.V),o.g&&(u=o.g,o.g=null,u.abort(),u.dispose())}function qo(o,u){try{var d=o.j;if(d.I!=0&&(d.g==o||$o(d.h,o))){if(!o.L&&$o(d.h,o)&&d.I==3){try{var p=d.Ba.g.parse(u)}catch{p=null}if(Array.isArray(p)&&p.length==3){var A=p;if(A[0]==0){e:if(!d.v){if(d.g)if(d.g.F+3e3<o.F)ni(d),ei(d);else break e;Ko(d),Le(18)}}else d.xa=A[1],0<d.xa-d.K&&A[2]<37500&&d.F&&d.A==0&&!d.C&&(d.C=Cr(h(d.Va,d),6e3));Eu(d.h)<=1&&d.ta&&(d.ta=void 0)}else vn(d,11)}else if((o.L||d.g==o)&&ni(d),!_(u))for(A=d.Ba.g.parse(u),u=0;u<A.length;u++){let re=A[u];const Ie=re[0];if(!(Ie<=d.K))if(d.K=Ie,re=re[1],d.I==2)if(re[0]=="c"){d.M=re[1],d.ba=re[2];const lt=re[3];lt!=null&&(d.ka=lt,d.j.info("VER="+d.ka));const An=re[4];An!=null&&(d.za=An,d.j.info("SVER="+d.za));const $t=re[5];$t!=null&&typeof $t=="number"&&$t>0&&(p=1.5*$t,d.O=p,d.j.info("backChannelRequestTimeoutMs_="+p)),p=d;const jt=o.g;if(jt){const si=jt.g?jt.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(si){var P=p.h;P.g||si.indexOf("spdy")==-1&&si.indexOf("quic")==-1&&si.indexOf("h2")==-1||(P.j=P.l,P.g=new Set,P.h&&(jo(P,P.h),P.h=null))}if(p.G){const Yo=jt.g?jt.g.getResponseHeader("X-HTTP-Session-Id"):null;Yo&&(p.wa=Yo,se(p.J,p.G,Yo))}}d.I=3,d.l&&d.l.ra(),d.aa&&(d.T=Date.now()-o.F,d.j.info("Handshake RTT: "+d.T+"ms")),p=d;var O=o;if(p.na=Hu(p,p.L?p.ba:null,p.W),O.L){Tu(p.h,O);var W=O,Ee=p.O;Ee&&(W.H=Ee),W.D&&(Bo(W),Ys(W)),p.g=O}else Bu(p);d.i.length>0&&ti(d)}else re[0]!="stop"&&re[0]!="close"||vn(d,7);else d.I==3&&(re[0]=="stop"||re[0]=="close"?re[0]=="stop"?vn(d,7):Go(d):re[0]!="noop"&&d.l&&d.l.qa(re),d.A=0)}}Sr(4)}catch{}}var Kp=class{constructor(o,u){this.g=o,this.map=u}};function yu(o){this.l=o||10,a.PerformanceNavigationTiming?(o=a.performance.getEntriesByType("navigation"),o=o.length>0&&(o[0].nextHopProtocol=="hq"||o[0].nextHopProtocol=="h2")):o=!!(a.chrome&&a.chrome.loadTimes&&a.chrome.loadTimes()&&a.chrome.loadTimes().wasFetchedViaSpdy),this.j=o?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function wu(o){return o.h?!0:o.g?o.g.size>=o.j:!1}function Eu(o){return o.h?1:o.g?o.g.size:0}function $o(o,u){return o.h?o.h==u:o.g?o.g.has(u):!1}function jo(o,u){o.g?o.g.add(u):o.h=u}function Tu(o,u){o.h&&o.h==u?o.h=null:o.g&&o.g.has(u)&&o.g.delete(u)}yu.prototype.cancel=function(){if(this.i=Iu(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const o of this.g.values())o.cancel();this.g.clear()}};function Iu(o){if(o.h!=null)return o.i.concat(o.h.G);if(o.g!=null&&o.g.size!==0){let u=o.i;for(const d of o.g.values())u=u.concat(d.G);return u}return b(o.i)}var vu=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Qp(o,u){if(o){o=o.split("&");for(let d=0;d<o.length;d++){const p=o[d].indexOf("=");let A,P=null;p>=0?(A=o[d].substring(0,p),P=o[d].substring(p+1)):A=o[d],u(A,P?decodeURIComponent(P.replace(/\+/g," ")):"")}}}function Ft(o){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let u;o instanceof Ft?(this.l=o.l,Dr(this,o.j),this.o=o.o,this.g=o.g,xr(this,o.u),this.h=o.h,zo(this,Cu(o.i)),this.m=o.m):o&&(u=String(o).match(vu))?(this.l=!1,Dr(this,u[1]||"",!0),this.o=Or(u[2]||""),this.g=Or(u[3]||"",!0),xr(this,u[4]),this.h=Or(u[5]||"",!0),zo(this,u[6]||"",!0),this.m=Or(u[7]||"")):(this.l=!1,this.i=new Mr(null,this.l))}Ft.prototype.toString=function(){const o=[];var u=this.j;u&&o.push(Lr(u,Au,!0),":");var d=this.g;return(d||u=="file")&&(o.push("//"),(u=this.o)&&o.push(Lr(u,Au,!0),"@"),o.push(Nr(d).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),d=this.u,d!=null&&o.push(":",String(d))),(d=this.h)&&(this.g&&d.charAt(0)!="/"&&o.push("/"),o.push(Lr(d,d.charAt(0)=="/"?Xp:Jp,!0))),(d=this.i.toString())&&o.push("?",d),(d=this.m)&&o.push("#",Lr(d,em)),o.join("")},Ft.prototype.resolve=function(o){const u=ut(this);let d=!!o.j;d?Dr(u,o.j):d=!!o.o,d?u.o=o.o:d=!!o.g,d?u.g=o.g:d=o.u!=null;var p=o.h;if(d)xr(u,o.u);else if(d=!!o.h){if(p.charAt(0)!="/")if(this.g&&!this.h)p="/"+p;else{var A=u.h.lastIndexOf("/");A!=-1&&(p=u.h.slice(0,A+1)+p)}if(A=p,A==".."||A==".")p="";else if(A.indexOf("./")!=-1||A.indexOf("/.")!=-1){p=A.lastIndexOf("/",0)==0,A=A.split("/");const P=[];for(let O=0;O<A.length;){const W=A[O++];W=="."?p&&O==A.length&&P.push(""):W==".."?((P.length>1||P.length==1&&P[0]!="")&&P.pop(),p&&O==A.length&&P.push("")):(P.push(W),p=!0)}p=P.join("/")}else p=A}return d?u.h=p:d=o.i.toString()!=="",d?zo(u,Cu(o.i)):d=!!o.m,d&&(u.m=o.m),u};function ut(o){return new Ft(o)}function Dr(o,u,d){o.j=d?Or(u,!0):u,o.j&&(o.j=o.j.replace(/:$/,""))}function xr(o,u){if(u){if(u=Number(u),isNaN(u)||u<0)throw Error("Bad port number "+u);o.u=u}else o.u=null}function zo(o,u,d){u instanceof Mr?(o.i=u,tm(o.i,o.l)):(d||(u=Lr(u,Zp)),o.i=new Mr(u,o.l))}function se(o,u,d){o.i.set(u,d)}function Js(o){return se(o,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),o}function Or(o,u){return o?u?decodeURI(o.replace(/%25/g,"%2525")):decodeURIComponent(o):""}function Lr(o,u,d){return typeof o=="string"?(o=encodeURI(o).replace(u,Yp),d&&(o=o.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),o):null}function Yp(o){return o=o.charCodeAt(0),"%"+(o>>4&15).toString(16)+(o&15).toString(16)}var Au=/[#\/\?@]/g,Jp=/[#\?:]/g,Xp=/[#\?]/g,Zp=/[#\?@]/g,em=/#/g;function Mr(o,u){this.h=this.g=null,this.i=o||null,this.j=!!u}function In(o){o.g||(o.g=new Map,o.h=0,o.i&&Qp(o.i,function(u,d){o.add(decodeURIComponent(u.replace(/\+/g," ")),d)}))}n=Mr.prototype,n.add=function(o,u){In(this),this.i=null,o=Qn(this,o);let d=this.g.get(o);return d||this.g.set(o,d=[]),d.push(u),this.h+=1,this};function Ru(o,u){In(o),u=Qn(o,u),o.g.has(u)&&(o.i=null,o.h-=o.g.get(u).length,o.g.delete(u))}function Pu(o,u){return In(o),u=Qn(o,u),o.g.has(u)}n.forEach=function(o,u){In(this),this.g.forEach(function(d,p){d.forEach(function(A){o.call(u,A,p,this)},this)},this)};function bu(o,u){In(o);let d=[];if(typeof u=="string")Pu(o,u)&&(d=d.concat(o.g.get(Qn(o,u))));else for(o=Array.from(o.g.values()),u=0;u<o.length;u++)d=d.concat(o[u]);return d}n.set=function(o,u){return In(this),this.i=null,o=Qn(this,o),Pu(this,o)&&(this.h-=this.g.get(o).length),this.g.set(o,[u]),this.h+=1,this},n.get=function(o,u){return o?(o=bu(this,o),o.length>0?String(o[0]):u):u};function Su(o,u,d){Ru(o,u),d.length>0&&(o.i=null,o.g.set(Qn(o,u),b(d)),o.h+=d.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const o=[],u=Array.from(this.g.keys());for(let p=0;p<u.length;p++){var d=u[p];const A=Nr(d);d=bu(this,d);for(let P=0;P<d.length;P++){let O=A;d[P]!==""&&(O+="="+Nr(d[P])),o.push(O)}}return this.i=o.join("&")};function Cu(o){const u=new Mr;return u.i=o.i,o.g&&(u.g=new Map(o.g),u.h=o.h),u}function Qn(o,u){return u=String(u),o.j&&(u=u.toLowerCase()),u}function tm(o,u){u&&!o.j&&(In(o),o.i=null,o.g.forEach(function(d,p){const A=p.toLowerCase();p!=A&&(Ru(this,p),Su(this,A,d))},o)),o.j=u}function nm(o,u){const d=new Vr;if(a.Image){const p=new Image;p.onload=f(Bt,d,"TestLoadImage: loaded",!0,u,p),p.onerror=f(Bt,d,"TestLoadImage: error",!1,u,p),p.onabort=f(Bt,d,"TestLoadImage: abort",!1,u,p),p.ontimeout=f(Bt,d,"TestLoadImage: timeout",!1,u,p),a.setTimeout(function(){p.ontimeout&&p.ontimeout()},1e4),p.src=o}else u(!1)}function rm(o,u){const d=new Vr,p=new AbortController,A=setTimeout(()=>{p.abort(),Bt(d,"TestPingServer: timeout",!1,u)},1e4);fetch(o,{signal:p.signal}).then(P=>{clearTimeout(A),P.ok?Bt(d,"TestPingServer: ok",!0,u):Bt(d,"TestPingServer: server error",!1,u)}).catch(()=>{clearTimeout(A),Bt(d,"TestPingServer: error",!1,u)})}function Bt(o,u,d,p,A){try{A&&(A.onload=null,A.onerror=null,A.onabort=null,A.ontimeout=null),p(d)}catch{}}function sm(){this.g=new Bp}function Ho(o){this.i=o.Sb||null,this.h=o.ab||!1}m(Ho,iu),Ho.prototype.g=function(){return new Xs(this.i,this.h)};function Xs(o,u){Ce.call(this),this.H=o,this.o=u,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}m(Xs,Ce),n=Xs.prototype,n.open=function(o,u){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=o,this.D=u,this.readyState=1,Fr(this)},n.send=function(o){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const u={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};o&&(u.body=o),(this.H||a).fetch(new Request(this.D,u)).then(this.Pa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,Ur(this)),this.readyState=0},n.Pa=function(o){if(this.g&&(this.l=o,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=o.headers,this.readyState=2,Fr(this)),this.g&&(this.readyState=3,Fr(this),this.g)))if(this.responseType==="arraybuffer")o.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof a.ReadableStream<"u"&&"body"in o){if(this.j=o.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;Vu(this)}else o.text().then(this.Oa.bind(this),this.ga.bind(this))};function Vu(o){o.j.read().then(o.Ma.bind(o)).catch(o.ga.bind(o))}n.Ma=function(o){if(this.g){if(this.o&&o.value)this.response.push(o.value);else if(!this.o){var u=o.value?o.value:new Uint8Array(0);(u=this.B.decode(u,{stream:!o.done}))&&(this.response=this.responseText+=u)}o.done?Ur(this):Fr(this),this.readyState==3&&Vu(this)}},n.Oa=function(o){this.g&&(this.response=this.responseText=o,Ur(this))},n.Na=function(o){this.g&&(this.response=o,Ur(this))},n.ga=function(){this.g&&Ur(this)};function Ur(o){o.readyState=4,o.l=null,o.j=null,o.B=null,Fr(o)}n.setRequestHeader=function(o,u){this.A.append(o,u)},n.getResponseHeader=function(o){return this.h&&this.h.get(o.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const o=[],u=this.h.entries();for(var d=u.next();!d.done;)d=d.value,o.push(d[0]+": "+d[1]),d=u.next();return o.join(`\r
`)};function Fr(o){o.onreadystatechange&&o.onreadystatechange.call(o)}Object.defineProperty(Xs.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(o){this.m=o?"include":"same-origin"}});function Nu(o){let u="";return Hs(o,function(d,p){u+=p,u+=":",u+=d,u+=`\r
`}),u}function Wo(o,u,d){e:{for(p in d){var p=!1;break e}p=!0}p||(d=Nu(d),typeof o=="string"?d!=null&&Nr(d):se(o,u,d))}function ce(o){Ce.call(this),this.headers=new Map,this.L=o||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}m(ce,Ce);var im=/^https?$/i,om=["POST","PUT"];n=ce.prototype,n.Fa=function(o){this.H=o},n.ea=function(o,u,d,p){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+o);u=u?u.toUpperCase():"GET",this.D=o,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():du.g(),this.g.onreadystatechange=y(h(this.Ca,this));try{this.B=!0,this.g.open(u,String(o),!0),this.B=!1}catch(P){ku(this,P);return}if(o=d||"",d=new Map(this.headers),p)if(Object.getPrototypeOf(p)===Object.prototype)for(var A in p)d.set(A,p[A]);else if(typeof p.keys=="function"&&typeof p.get=="function")for(const P of p.keys())d.set(P,p.get(P));else throw Error("Unknown input type for opt_headers: "+String(p));p=Array.from(d.keys()).find(P=>P.toLowerCase()=="content-type"),A=a.FormData&&o instanceof a.FormData,!(Array.prototype.indexOf.call(om,u,void 0)>=0)||p||A||d.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[P,O]of d)this.g.setRequestHeader(P,O);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(o),this.v=!1}catch(P){ku(this,P)}};function ku(o,u){o.h=!1,o.g&&(o.j=!0,o.g.abort(),o.j=!1),o.l=u,o.o=5,Du(o),Zs(o)}function Du(o){o.A||(o.A=!0,Oe(o,"complete"),Oe(o,"error"))}n.abort=function(o){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=o||7,Oe(this,"complete"),Oe(this,"abort"),Zs(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Zs(this,!0)),ce.Z.N.call(this)},n.Ca=function(){this.u||(this.B||this.v||this.j?xu(this):this.Xa())},n.Xa=function(){xu(this)};function xu(o){if(o.h&&typeof i<"u"){if(o.v&&qt(o)==4)setTimeout(o.Ca.bind(o),0);else if(Oe(o,"readystatechange"),qt(o)==4){o.h=!1;try{const P=o.ca();e:switch(P){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var u=!0;break e;default:u=!1}var d;if(!(d=u)){var p;if(p=P===0){let O=String(o.D).match(vu)[1]||null;!O&&a.self&&a.self.location&&(O=a.self.location.protocol.slice(0,-1)),p=!im.test(O?O.toLowerCase():"")}d=p}if(d)Oe(o,"complete"),Oe(o,"success");else{o.o=6;try{var A=qt(o)>2?o.g.statusText:""}catch{A=""}o.l=A+" ["+o.ca()+"]",Du(o)}}finally{Zs(o)}}}}function Zs(o,u){if(o.g){o.m&&(clearTimeout(o.m),o.m=null);const d=o.g;o.g=null,u||Oe(o,"ready");try{d.onreadystatechange=null}catch{}}}n.isActive=function(){return!!this.g};function qt(o){return o.g?o.g.readyState:0}n.ca=function(){try{return qt(this)>2?this.g.status:-1}catch{return-1}},n.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.La=function(o){if(this.g){var u=this.g.responseText;return o&&u.indexOf(o)==0&&(u=u.substring(o.length)),Fp(u)}};function Ou(o){try{if(!o.g)return null;if("response"in o.g)return o.g.response;switch(o.F){case"":case"text":return o.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in o.g)return o.g.mozResponseArrayBuffer}return null}catch{return null}}function am(o){const u={};o=(o.g&&qt(o)>=2&&o.g.getAllResponseHeaders()||"").split(`\r
`);for(let p=0;p<o.length;p++){if(_(o[p]))continue;var d=Hp(o[p]);const A=d[0];if(d=d[1],typeof d!="string")continue;d=d.trim();const P=u[A]||[];u[A]=P,P.push(d)}Dp(u,function(p){return p.join(", ")})}n.ya=function(){return this.o},n.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function Br(o,u,d){return d&&d.internalChannelParams&&d.internalChannelParams[o]||u}function Lu(o){this.za=0,this.i=[],this.j=new Vr,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=Br("failFast",!1,o),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=Br("baseRetryDelayMs",5e3,o),this.Za=Br("retryDelaySeedMs",1e4,o),this.Ta=Br("forwardChannelMaxRetries",2,o),this.va=Br("forwardChannelRequestTimeoutMs",2e4,o),this.ma=o&&o.xmlHttpFactory||void 0,this.Ua=o&&o.Rb||void 0,this.Aa=o&&o.useFetchStreams||!1,this.O=void 0,this.L=o&&o.supportsCrossDomainXhr||!1,this.M="",this.h=new yu(o&&o.concurrentRequestLimit),this.Ba=new sm,this.S=o&&o.fastHandshake||!1,this.R=o&&o.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=o&&o.Pb||!1,o&&o.ua&&this.j.ua(),o&&o.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&o&&o.detectBufferingProxy||!1,this.ia=void 0,o&&o.longPollingTimeout&&o.longPollingTimeout>0&&(this.ia=o.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}n=Lu.prototype,n.ka=8,n.I=1,n.connect=function(o,u,d,p){Le(0),this.W=o,this.H=u||{},d&&p!==void 0&&(this.H.OSID=d,this.H.OAID=p),this.F=this.X,this.J=Hu(this,null,this.W),ti(this)};function Go(o){if(Mu(o),o.I==3){var u=o.V++,d=ut(o.J);if(se(d,"SID",o.M),se(d,"RID",u),se(d,"TYPE","terminate"),qr(o,d),u=new Ut(o,o.j,u),u.M=2,u.A=Js(ut(d)),d=!1,a.navigator&&a.navigator.sendBeacon)try{d=a.navigator.sendBeacon(u.A.toString(),"")}catch{}!d&&a.Image&&(new Image().src=u.A,d=!0),d||(u.g=Wu(u.j,null),u.g.ea(u.A)),u.F=Date.now(),Ys(u)}zu(o)}function ei(o){o.g&&(Qo(o),o.g.cancel(),o.g=null)}function Mu(o){ei(o),o.v&&(a.clearTimeout(o.v),o.v=null),ni(o),o.h.cancel(),o.m&&(typeof o.m=="number"&&a.clearTimeout(o.m),o.m=null)}function ti(o){if(!wu(o.h)&&!o.m){o.m=!0;var u=o.Ea;he||g(),de||(he(),de=!0),I.add(u,o),o.D=0}}function cm(o,u){return Eu(o.h)>=o.h.j-(o.m?1:0)?!1:o.m?(o.i=u.G.concat(o.i),!0):o.I==1||o.I==2||o.D>=(o.Sa?0:o.Ta)?!1:(o.m=Cr(h(o.Ea,o,u),ju(o,o.D)),o.D++,!0)}n.Ea=function(o){if(this.m)if(this.m=null,this.I==1){if(!o){this.V=Math.floor(Math.random()*1e5),o=this.V++;const A=new Ut(this,this.j,o);let P=this.o;if(this.U&&(P?(P=Qc(P),Jc(P,this.U)):P=this.U),this.u!==null||this.R||(A.J=P,P=null),this.S)e:{for(var u=0,d=0;d<this.i.length;d++){t:{var p=this.i[d];if("__data__"in p.map&&(p=p.map.__data__,typeof p=="string")){p=p.length;break t}p=void 0}if(p===void 0)break;if(u+=p,u>4096){u=d;break e}if(u===4096||d===this.i.length-1){u=d+1;break e}}u=1e3}else u=1e3;u=Fu(this,A,u),d=ut(this.J),se(d,"RID",o),se(d,"CVER",22),this.G&&se(d,"X-HTTP-Session-Id",this.G),qr(this,d),P&&(this.R?u="headers="+Nr(Nu(P))+"&"+u:this.u&&Wo(d,this.u,P)),jo(this.h,A),this.Ra&&se(d,"TYPE","init"),this.S?(se(d,"$req",u),se(d,"SID","null"),A.U=!0,Fo(A,d,null)):Fo(A,d,u),this.I=2}}else this.I==3&&(o?Uu(this,o):this.i.length==0||wu(this.h)||Uu(this))};function Uu(o,u){var d;u?d=u.l:d=o.V++;const p=ut(o.J);se(p,"SID",o.M),se(p,"RID",d),se(p,"AID",o.K),qr(o,p),o.u&&o.o&&Wo(p,o.u,o.o),d=new Ut(o,o.j,d,o.D+1),o.u===null&&(d.J=o.o),u&&(o.i=u.G.concat(o.i)),u=Fu(o,d,1e3),d.H=Math.round(o.va*.5)+Math.round(o.va*.5*Math.random()),jo(o.h,d),Fo(d,p,u)}function qr(o,u){o.H&&Hs(o.H,function(d,p){se(u,p,d)}),o.l&&Hs({},function(d,p){se(u,p,d)})}function Fu(o,u,d){d=Math.min(o.i.length,d);const p=o.l?h(o.l.Ka,o.l,o):null;e:{var A=o.i;let W=-1;for(;;){const Ee=["count="+d];W==-1?d>0?(W=A[0].g,Ee.push("ofs="+W)):W=0:Ee.push("ofs="+W);let re=!0;for(let Ie=0;Ie<d;Ie++){var P=A[Ie].g;const lt=A[Ie].map;if(P-=W,P<0)W=Math.max(0,A[Ie].g-100),re=!1;else try{P="req"+P+"_"||"";try{var O=lt instanceof Map?lt:Object.entries(lt);for(const[An,$t]of O){let jt=$t;c($t)&&(jt=xo($t)),Ee.push(P+An+"="+encodeURIComponent(jt))}}catch(An){throw Ee.push(P+"type="+encodeURIComponent("_badmap")),An}}catch{p&&p(lt)}}if(re){O=Ee.join("&");break e}}O=void 0}return o=o.i.splice(0,d),u.G=o,O}function Bu(o){if(!o.g&&!o.v){o.Y=1;var u=o.Da;he||g(),de||(he(),de=!0),I.add(u,o),o.A=0}}function Ko(o){return o.g||o.v||o.A>=3?!1:(o.Y++,o.v=Cr(h(o.Da,o),ju(o,o.A)),o.A++,!0)}n.Da=function(){if(this.v=null,qu(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var o=4*this.T;this.j.info("BP detection timer enabled: "+o),this.B=Cr(h(this.Wa,this),o)}},n.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,Le(10),ei(this),qu(this))};function Qo(o){o.B!=null&&(a.clearTimeout(o.B),o.B=null)}function qu(o){o.g=new Ut(o,o.j,"rpc",o.Y),o.u===null&&(o.g.J=o.o),o.g.P=0;var u=ut(o.na);se(u,"RID","rpc"),se(u,"SID",o.M),se(u,"AID",o.K),se(u,"CI",o.F?"0":"1"),!o.F&&o.ia&&se(u,"TO",o.ia),se(u,"TYPE","xmlhttp"),qr(o,u),o.u&&o.o&&Wo(u,o.u,o.o),o.O&&(o.g.H=o.O);var d=o.g;o=o.ba,d.M=1,d.A=Js(ut(u)),d.u=null,d.R=!0,mu(d,o)}n.Va=function(){this.C!=null&&(this.C=null,ei(this),Ko(this),Le(19))};function ni(o){o.C!=null&&(a.clearTimeout(o.C),o.C=null)}function $u(o,u){var d=null;if(o.g==u){ni(o),Qo(o),o.g=null;var p=2}else if($o(o.h,u))d=u.G,Tu(o.h,u),p=1;else return;if(o.I!=0){if(u.o)if(p==1){d=u.u?u.u.length:0,u=Date.now()-u.F;var A=o.D;p=Ks(),Oe(p,new lu(p,d)),ti(o)}else Bu(o);else if(A=u.m,A==3||A==0&&u.X>0||!(p==1&&cm(o,u)||p==2&&Ko(o)))switch(d&&d.length>0&&(u=o.h,u.i=u.i.concat(d)),A){case 1:vn(o,5);break;case 4:vn(o,10);break;case 3:vn(o,6);break;default:vn(o,2)}}}function ju(o,u){let d=o.Qa+Math.floor(Math.random()*o.Za);return o.isActive()||(d*=2),d*u}function vn(o,u){if(o.j.info("Error code "+u),u==2){var d=h(o.bb,o),p=o.Ua;const A=!p;p=new Ft(p||"//www.google.com/images/cleardot.gif"),a.location&&a.location.protocol=="http"||Dr(p,"https"),Js(p),A?nm(p.toString(),d):rm(p.toString(),d)}else Le(2);o.I=0,o.l&&o.l.pa(u),zu(o),Mu(o)}n.bb=function(o){o?(this.j.info("Successfully pinged google.com"),Le(2)):(this.j.info("Failed to ping google.com"),Le(1))};function zu(o){if(o.I=0,o.ja=[],o.l){const u=Iu(o.h);(u.length!=0||o.i.length!=0)&&(V(o.ja,u),V(o.ja,o.i),o.h.i.length=0,b(o.i),o.i.length=0),o.l.oa()}}function Hu(o,u,d){var p=d instanceof Ft?ut(d):new Ft(d);if(p.g!="")u&&(p.g=u+"."+p.g),xr(p,p.u);else{var A=a.location;p=A.protocol,u=u?u+"."+A.hostname:A.hostname,A=+A.port;const P=new Ft(null);p&&Dr(P,p),u&&(P.g=u),A&&xr(P,A),d&&(P.h=d),p=P}return d=o.G,u=o.wa,d&&u&&se(p,d,u),se(p,"VER",o.ka),qr(o,p),p}function Wu(o,u,d){if(u&&!o.L)throw Error("Can't create secondary domain capable XhrIo object.");return u=o.Aa&&!o.ma?new ce(new Ho({ab:d})):new ce(o.ma),u.Fa(o.L),u}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function Gu(){}n=Gu.prototype,n.ra=function(){},n.qa=function(){},n.pa=function(){},n.oa=function(){},n.isActive=function(){return!0},n.Ka=function(){};function ri(){}ri.prototype.g=function(o,u){return new Ge(o,u)};function Ge(o,u){Ce.call(this),this.g=new Lu(u),this.l=o,this.h=u&&u.messageUrlParams||null,o=u&&u.messageHeaders||null,u&&u.clientProtocolHeaderRequired&&(o?o["X-Client-Protocol"]="webchannel":o={"X-Client-Protocol":"webchannel"}),this.g.o=o,o=u&&u.initMessageHeaders||null,u&&u.messageContentType&&(o?o["X-WebChannel-Content-Type"]=u.messageContentType:o={"X-WebChannel-Content-Type":u.messageContentType}),u&&u.sa&&(o?o["X-WebChannel-Client-Profile"]=u.sa:o={"X-WebChannel-Client-Profile":u.sa}),this.g.U=o,(o=u&&u.Qb)&&!_(o)&&(this.g.u=o),this.A=u&&u.supportsCrossDomainXhr||!1,this.v=u&&u.sendRawJson||!1,(u=u&&u.httpSessionIdParam)&&!_(u)&&(this.g.G=u,o=this.h,o!==null&&u in o&&(o=this.h,u in o&&delete o[u])),this.j=new Yn(this)}m(Ge,Ce),Ge.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},Ge.prototype.close=function(){Go(this.g)},Ge.prototype.o=function(o){var u=this.g;if(typeof o=="string"){var d={};d.__data__=o,o=d}else this.v&&(d={},d.__data__=xo(o),o=d);u.i.push(new Kp(u.Ya++,o)),u.I==3&&ti(u)},Ge.prototype.N=function(){this.g.l=null,delete this.j,Go(this.g),delete this.g,Ge.Z.N.call(this)};function Ku(o){Oo.call(this),o.__headers__&&(this.headers=o.__headers__,this.statusCode=o.__status__,delete o.__headers__,delete o.__status__);var u=o.__sm__;if(u){e:{for(const d in u){o=d;break e}o=void 0}(this.i=o)&&(o=this.i,u=u!==null&&o in u?u[o]:void 0),this.data=u}else this.data=o}m(Ku,Oo);function Qu(){Lo.call(this),this.status=1}m(Qu,Lo);function Yn(o){this.g=o}m(Yn,Gu),Yn.prototype.ra=function(){Oe(this.g,"a")},Yn.prototype.qa=function(o){Oe(this.g,new Ku(o))},Yn.prototype.pa=function(o){Oe(this.g,new Qu)},Yn.prototype.oa=function(){Oe(this.g,"b")},ri.prototype.createWebChannel=ri.prototype.g,Ge.prototype.send=Ge.prototype.o,Ge.prototype.open=Ge.prototype.m,Ge.prototype.close=Ge.prototype.close,qh=function(){return new ri},Bh=function(){return Ks()},Fh=En,fa={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},Qs.NO_ERROR=0,Qs.TIMEOUT=8,Qs.HTTP_ERROR=6,pi=Qs,hu.COMPLETE="complete",Uh=hu,ou.EventType=br,br.OPEN="a",br.CLOSE="b",br.ERROR="c",br.MESSAGE="d",Ce.prototype.listen=Ce.prototype.J,Gr=ou,ce.prototype.listenOnce=ce.prototype.K,ce.prototype.getLastError=ce.prototype.Ha,ce.prototype.getLastErrorCode=ce.prototype.ya,ce.prototype.getStatus=ce.prototype.ca,ce.prototype.getResponseJson=ce.prototype.La,ce.prototype.getResponseText=ce.prototype.la,ce.prototype.send=ce.prototype.ea,ce.prototype.setWithCredentials=ce.prototype.Fa,Mh=ce}).apply(typeof ii<"u"?ii:typeof self<"u"?self:typeof window<"u"?window:{});/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let pr="12.19.0";function Vg(n){pr=n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mn=new Oa("@firebase/firestore");function Jn(){return Mn.logLevel}function L(n,...e){if(Mn.logLevel<=Y.DEBUG){const t=e.map(Ma);Mn.debug(`Firestore (${pr}): ${n}`,...t)}}function kt(n,...e){if(Mn.logLevel<=Y.ERROR){const t=e.map(Ma);Mn.error(`Firestore (${pr}): ${n}`,...t)}}function at(n,...e){if(Mn.logLevel<=Y.WARN){const t=e.map(Ma);Mn.warn(`Firestore (${pr}): ${n}`,...t)}}function Ma(n){if(typeof n=="string")return n;try{return(function(t){return JSON.stringify(t)})(n)}catch{return n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function F(n,e,t){let r="Unexpected state";typeof e=="string"?r=e:t=e,$h(n,r,t)}function $h(n,e,t){let r=`FIRESTORE (${pr}) INTERNAL ASSERTION FAILED: ${e} (ID: ${n.toString(16)})`;if(t!==void 0)try{r+=" CONTEXT: "+JSON.stringify(t)}catch{r+=" CONTEXT: "+t}throw kt(r),new Error(r)}function U(n,e,t,r){let s="Unexpected state";typeof t=="string"?s=t:r=t,n||$h(e,s,r)}function H(n,e){return n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ng(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let r=0;r<n;r++)t[r]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ua{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let r="";for(;r.length<20;){const s=Ng(40);for(let i=0;i<s.length;++i)r.length<20&&s[i]<t&&(r+=e.charAt(s[i]%62))}return r}}function Q(n,e){return n<e?-1:n>e?1:0}function pa(n,e){const t=Math.min(n.length,e.length);for(let r=0;r<t;r++){const s=n.charAt(r),i=e.charAt(r);if(s!==i)return Zo(s)===Zo(i)?Q(s,i):Zo(s)?1:-1}return Q(n.length,e.length)}const kg=55296,Dg=57343;function Zo(n){const e=n.charCodeAt(0);return e>=kg&&e<=Dg}function or(n,e,t){return n.length===e.length&&n.every(((r,s)=>t(r,e[s])))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oe{constructor(e,t){this.comparator=e,this.root=t||be.EMPTY}insert(e,t){return new oe(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,be.BLACK,null,null))}remove(e){return new oe(this.comparator,this.root.remove(e,this.comparator).copy(null,null,be.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const r=this.comparator(e,t.key);if(r===0)return t.value;r<0?t=t.left:r>0&&(t=t.right)}return null}indexOf(e){let t=0,r=this.root;for(;!r.isEmpty();){const s=this.comparator(e,r.key);if(s===0)return t+r.left.size;s<0?r=r.left:(t+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,r)=>(e(t,r),!1)))}toString(){const e=[];return this.inorderTraversal(((t,r)=>(e.push(`${t}:${r}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new oi(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new oi(this.root,e,this.comparator,!1)}getReverseIterator(){return new oi(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new oi(this.root,e,this.comparator,!0)}}class oi{constructor(e,t,r,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?r(e.key,t):1,t&&s&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class be{constructor(e,t,r,s,i){this.key=e,this.value=t,this.color=r??be.RED,this.left=s??be.EMPTY,this.right=i??be.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,r,s,i){return new be(e??this.key,t??this.value,r??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,r){let s=this;const i=r(e,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(e,t,r),null):i===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,r)),s.fixUp()}removeMin(){if(this.left.isEmpty())return be.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let r,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return be.EMPTY;r=s.right.min(),s=s.copy(r.key,r.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,be.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,be.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw F(43730,{key:this.key,value:this.value});if(this.right.isRed())throw F(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw F(27949);return e+(this.isRed()?0:1)}}be.EMPTY=null,be.RED=!0,be.BLACK=!1;be.EMPTY=new class{constructor(){this.size=0}get key(){throw F(57766)}get value(){throw F(16141)}get color(){throw F(16727)}get left(){throw F(29726)}get right(){throw F(36894)}copy(e,t,r,s,i){return this}insert(e,t,r){return new be(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _e{constructor(e){this.comparator=e,this.data=new oe(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,r)=>(e(t),!1)))}forEachInRange(e,t){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const s=r.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let r;for(r=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new sl(this.data.getIterator())}getIteratorFrom(e){return new sl(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((r=>{t=t.add(r)})),t}isEqual(e){if(!(e instanceof _e)||this.size!==e.size)return!1;const t=this.data.getIterator(),r=e.data.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=r.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new _e(this.comparator);return t.data=e,t}}class sl{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const S={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class k extends It{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dt="__name__";class ht{constructor(e,t,r){t===void 0?t=0:t>e.length&&F(637,{offset:t,range:e.length}),r===void 0?r=e.length-t:r>e.length-t&&F(1746,{length:r,range:e.length-t}),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return ht.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof ht?e.forEach((r=>{t.push(r)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const r=Math.min(e.length,t.length);for(let s=0;s<r;s++){const i=ht.compareSegments(e.get(s),t.get(s));if(i!==0)return i}return Q(e.length,t.length)}static compareSegments(e,t){const r=ht.isNumericId(e),s=ht.isNumericId(t);return r&&!s?-1:!r&&s?1:r&&s?ht.extractNumericId(e).compare(ht.extractNumericId(t)):pa(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return Zt.fromString(e.substring(4,e.length-2))}}class Z extends ht{construct(e,t,r){return new Z(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toStringWithLeadingSlash(){return`/${this.canonicalString()}`}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const r of e){if(r.indexOf("//")>=0)throw new k(S.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter((s=>s.length>0)))}return new Z(t)}static emptyPath(){return new Z([])}}const xg=/^[_a-zA-Z][_a-zA-Z0-9]*$/;let Ze=class Xn extends ht{construct(e,t,r){return new Xn(e,t,r)}static isValidIdentifier(e){return xg.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Xn.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===dt}static keyField(){return new Xn([dt])}static fromServerFormat(e){const t=[];let r="",s=0;const i=()=>{if(r.length===0)throw new k(S.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""};let a=!1;for(;s<e.length;){const c=e[s];if(c==="\\"){if(s+1===e.length)throw new k(S.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const l=e[s+1];if(l!=="\\"&&l!=="."&&l!=="`")throw new k(S.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=l,s+=2}else c==="`"?(a=!a,s++):c!=="."||a?(r+=c,s++):(i(),s++)}if(i(),a)throw new k(S.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Xn(t)}static emptyPath(){return new Xn([])}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ye{constructor(e){this.fields=e,e.sort(Ze.comparator)}static empty(){return new Ye([])}unionWith(e){let t=new _e(Ze.comparator);for(const r of this.fields)t=t.add(r);for(const r of e)t=t.add(r);return new Ye(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return or(this.fields,e.fields,((t,r)=>t.isEqual(r)))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bi(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function _n(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function Og(n,e){const t=[];for(const r in n)Object.prototype.hasOwnProperty.call(n,r)&&t.push(e(n[r],r,n));return t}function jh(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class B{constructor(e){this.path=e}static fromPath(e){return new B(Z.fromString(e))}static fromName(e){return new B(Z.fromString(e).popFirst(5))}static empty(){return new B(Z.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&Z.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return Z.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new B(new Z(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zh(n,e,t){if(!t)throw new k(S.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function Lg(n,e,t,r){if(e===!0&&r===!0)throw new k(S.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function il(n){if(!B.isDocumentKey(n))throw new k(S.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function ol(n){if(B.isDocumentKey(n))throw new k(S.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function bs(n){return typeof n=="object"&&n!==null&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null)}function Ji(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=(function(r){return r.constructor?r.constructor.name:null})(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":F(12329,{type:typeof n})}function Pe(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new k(S.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Ji(n);throw new k(S.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}function Mg(n,e){if(e<=0)throw new k(S.INVALID_ARGUMENT,`Function ${n}() requires a positive number, but it was: ${e}.`)}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ge(n,e){const t={typeString:n};return e&&(t.value=e),t}function Ss(n,e){if(!bs(n))throw new k(S.INVALID_ARGUMENT,"JSON must be an object");let t;for(const r in e)if(e[r]){const s=e[r].typeString,i="value"in e[r]?{value:e[r].value}:void 0;if(!(r in n)){t=`JSON missing required field: '${r}'`;break}const a=n[r];if(s&&typeof a!==s){t=`JSON field '${r}' must be a ${s}.`;break}if(i!==void 0&&a!==i.value){t=`Expected '${r}' field to equal '${i.value}'`;break}}if(t)throw new k(S.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const al=-62135596800,cl=1e6;class ee{static now(){return ee.fromMillis(Date.now())}static fromDate(e){return ee.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),r=Math.floor((e-1e3*t)*cl);return new ee(t,r)}static fromInstant(e){if(!e||typeof e.t!="bigint")throw new k(S.INVALID_ARGUMENT,"Invalid Temporal.Instant object provided.");return ee._fromEpochNanoseconds(e.t)}static _fromEpochNanoseconds(e){let t,r;if(e>=0n)t=Number(e/1000000000n),r=Number(e%1000000000n);else{const s=e%1000000000n;s===0n?(t=Number(e/1000000000n),r=0):(t=Number(e/1000000000n-1n),r=Number(s+1000000000n))}return new ee(t,r)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new k(S.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new k(S.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<al)throw new k(S.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new k(S.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/cl}toInstant(){if(typeof Temporal>"u"||!Temporal.Instant)throw new k(S.FAILED_PRECONDITION,"The Temporal object is not available in the current environment.");const e=1000000000n*BigInt(this.seconds)+BigInt(this.nanoseconds);return Temporal.Instant.__PRIVATE_fromEpochNanoseconds(e)}_compareTo(e){return this.seconds===e.seconds?Q(this.nanoseconds,e.nanoseconds):Q(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:ee._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(Ss(e,ee._jsonSchema))return new ee(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-al;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}ee._jsonSchemaVersion="firestore/timestamp/1.0",ee._jsonSchema={type:ge("string",ee._jsonSchemaVersion),seconds:ge("number"),nanoseconds:ge("number")};/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hh extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ye{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new Hh("Invalid base64 string: "+i):i}})(e);return new ye(t)}static fromUint8Array(e){const t=(function(s){let i="";for(let a=0;a<s.length;++a)i+=String.fromCharCode(s[a]);return i})(e);return new ye(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const r=new Uint8Array(t.length);for(let s=0;s<t.length;s++)r[s]=t.charCodeAt(s);return r})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return Q(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}ye.EMPTY_BYTE_STRING=new ye("");const Ug=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function on(n){if(U(!!n,39018),typeof n=="string"){let e=0;const t=Ug.exec(n);if(U(!!t,46558,{timestamp:n}),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}const r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:ae(n.seconds),nanos:ae(n.nanos)}}function ae(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function an(n){return typeof n=="string"?ye.fromBase64String(n):ye.fromUint8Array(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wh="server_timestamp",Gh="__type__",Kh="__previous_value__",Qh="__local_write_time__";function Xi(n){var t,r;return((r=(((t=n==null?void 0:n.mapValue)==null?void 0:t.fields)||{})[Gh])==null?void 0:r.stringValue)===Wh}function Cs(n){const e=n.mapValue.fields[Kh];return Xi(e)?Cs(e):e}function ar(n){const e=on(n.mapValue.fields[Qh].timestampValue);return new ee(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fg{constructor(e,t,r,s,i,a,c,l,h,f,m,y,b){this.databaseId=e,this.appId=t,this.persistenceKey=r,this.host=s,this.ssl=i,this.forceLongPolling=a,this.autoDetectLongPolling=c,this.longPollingOptions=l,this.useFetchStreams=h,this.isUsingEmulator=f,this.apiKey=m,this._customHeaders=y,this.grpcFlowControlWindow=b}}const Si="(default)";class cs{constructor(e,t){this.projectId=e,this.database=t||Si}static empty(){return new cs("","")}get isDefaultDatabase(){return this.database===Si}isEqual(e){return e instanceof cs&&e.projectId===this.projectId&&e.database===this.database}}function Bg(n,e){if(!Object.prototype.hasOwnProperty.apply(n.options,["projectId"]))throw new k(S.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new cs(n.options.projectId,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fa=-1;function Vs(n){return n==null}function us(n){return n===0&&1/n==-1/0}function qg(n){return typeof n=="number"&&Number.isInteger(n)&&!us(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}function $g(n){return typeof n=="string"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yh="__type__",jg="__max__",ai={mapValue:{}},Jh="__vector__",ls="value",cr={nullValue:"NULL_VALUE"},ze={booleanValue:!0},Re={booleanValue:!1};function we(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?Xi(n)?4:zg(n)?9007199254740991:Ci(n)?10:11:F(28295,{value:n})}function nt(n,e,t){if(n===e)return!0;const r=we(n);if(r!==we(e))return!1;switch(r){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return ar(n).isEqual(ar(e));case 3:return(function(i,a){if(typeof i.timestampValue=="string"&&typeof a.timestampValue=="string"&&i.timestampValue.length===a.timestampValue.length)return i.timestampValue===a.timestampValue;const c=on(i.timestampValue),l=on(a.timestampValue);return c.seconds===l.seconds&&c.nanos===l.nanos})(n,e);case 5:return n.stringValue===e.stringValue;case 6:return(function(i,a){return an(i.bytesValue).isEqual(an(a.bytesValue))})(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return(function(i,a){return ae(i.geoPointValue.latitude)===ae(a.geoPointValue.latitude)&&ae(i.geoPointValue.longitude)===ae(a.geoPointValue.longitude)})(n,e);case 2:return(function(i,a,c){if("integerValue"in i&&"integerValue"in a)return ae(i.integerValue)===ae(a.integerValue);let l,h;if("doubleValue"in i&&"doubleValue"in a)l=ae(i.doubleValue),h=ae(a.doubleValue);else{if(!(c!=null&&c.i))return!1;l=ae(i.integerValue??i.doubleValue),h=ae(a.integerValue??a.doubleValue)}return l===h?!!(c!=null&&c.o)||us(l)===us(h):!!(c===void 0||c.u)&&isNaN(l)&&isNaN(h)})(n,e,t);case 9:return or(n.arrayValue.values||[],e.arrayValue.values||[],((s,i)=>nt(s,i,t)));case 10:case 11:return(function(i,a,c){const l=i.mapValue.fields||{},h=a.mapValue.fields||{};if(bi(l)!==bi(h))return!1;for(const f in l)if(l.hasOwnProperty(f)&&(h[f]===void 0||!nt(l[f],h[f],c)))return!1;return!0})(n,e,t);default:return F(52216,{left:n})}}function hs(n,e){return(n.values||[]).find((t=>nt(t,e)))!==void 0}function He(n,e){if(n===e)return 0;const t=we(n),r=we(e);if(t!==r)return Q(t,r);switch(t){case 0:case 9007199254740991:return 0;case 1:return Q(n.booleanValue,e.booleanValue);case 2:return(function(i,a){const c=ae(i.integerValue||i.doubleValue),l=ae(a.integerValue||a.doubleValue);return c<l?-1:c>l?1:c===l?0:isNaN(c)?isNaN(l)?0:-1:1})(n,e);case 3:return ul(n.timestampValue,e.timestampValue);case 4:return ul(ar(n),ar(e));case 5:return pa(n.stringValue,e.stringValue);case 6:return(function(i,a){const c=an(i),l=an(a);return c.compareTo(l)})(n.bytesValue,e.bytesValue);case 7:return(function(i,a){const c=i.split("/"),l=a.split("/");for(let h=0;h<c.length&&h<l.length;h++){const f=Q(c[h],l[h]);if(f!==0)return f}return Q(c.length,l.length)})(n.referenceValue,e.referenceValue);case 8:return(function(i,a){const c=Q(ae(i.latitude),ae(a.latitude));return c!==0?c:Q(ae(i.longitude),ae(a.longitude))})(n.geoPointValue,e.geoPointValue);case 9:return ll(n.arrayValue,e.arrayValue);case 10:return(function(i,a){var y,b,V,M;const c=i.fields||{},l=a.fields||{},h=(y=c[ls])==null?void 0:y.arrayValue,f=(b=l[ls])==null?void 0:b.arrayValue,m=Q(((V=h==null?void 0:h.values)==null?void 0:V.length)||0,((M=f==null?void 0:f.values)==null?void 0:M.length)||0);return m!==0?m:ll(h,f)})(n.mapValue,e.mapValue);case 11:return(function(i,a){if(i===ai.mapValue&&a===ai.mapValue)return 0;if(i===ai.mapValue)return 1;if(a===ai.mapValue)return-1;const c=i.fields||{},l=Object.keys(c),h=a.fields||{},f=Object.keys(h);l.sort(),f.sort();for(let m=0;m<l.length&&m<f.length;++m){const y=pa(l[m],f[m]);if(y!==0)return y;const b=He(c[l[m]],h[f[m]]);if(b!==0)return b}return Q(l.length,f.length)})(n.mapValue,e.mapValue);default:throw F(23264,{l:t})}}function ul(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return Q(n,e);const t=on(n),r=on(e),s=Q(t.seconds,r.seconds);return s!==0?s:Q(t.nanos,r.nanos)}function ll(n,e){const t=n.values||[],r=e.values||[];for(let s=0;s<t.length&&s<r.length;++s){const i=He(t[s],r[s]);if(i!==void 0&&i!==0)return i}return Q(t.length,r.length)}function ur(n){return ma(n)}function ma(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?(function(t){const r=on(t);return`time(${r.seconds},${r.nanos})`})(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?(function(t){return an(t).toBase64()})(n.bytesValue):"referenceValue"in n?(function(t){return B.fromName(t).toString()})(n.referenceValue):"geoPointValue"in n?(function(t){return`geo(${t.latitude},${t.longitude})`})(n.geoPointValue):"arrayValue"in n?(function(t){let r="[",s=!0;for(const i of t.values||[])s?s=!1:r+=",",r+=ma(i);return r+"]"})(n.arrayValue):"mapValue"in n?(function(t){const r=Object.keys(t.fields||{}).sort();let s="{",i=!0;for(const a of r)i?i=!1:s+=",",s+=`${a}:${ma(t.fields[a])}`;return s+"}"})(n.mapValue):F(61005,{value:n})}function mi(n){switch(we(n)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=Cs(n);return e?16+mi(e):16;case 5:return 2*n.stringValue.length;case 6:return an(n.bytesValue).approximateByteSize();case 7:return n.referenceValue.length;case 9:return(function(r){return(r.values||[]).reduce(((s,i)=>s+mi(i)),0)})(n.arrayValue);case 10:case 11:return(function(r){let s=0;return _n(r.fields,((i,a)=>{s+=i.length+mi(a)})),s})(n.mapValue);default:throw F(13486,{value:n})}}function hl(n,e){return{referenceValue:`projects/${n.projectId}/databases/${n.database}/documents/${e.path.canonicalString()}`}}function ft(n){return!!n&&"integerValue"in n}function bn(n){return!!n&&"doubleValue"in n}function cn(n){return ft(n)||bn(n)}function lr(n){return!!n&&"arrayValue"in n}function Je(n){return!!n&&"nullValue"in n}function We(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function Cn(n){return!!n&&"mapValue"in n}function Ci(n){var t,r;return((r=(((t=n==null?void 0:n.mapValue)==null?void 0:t.fields)||{})[Yh])==null?void 0:r.stringValue)===Jh}function ga(n){var e,t;return(t=(((e=n==null?void 0:n.mapValue)==null?void 0:e.fields)||{})[ls])==null?void 0:t.arrayValue}function Yr(n){if(n.geoPointValue)return{geoPointValue:{...n.geoPointValue}};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:{...n.timestampValue}};if(n.mapValue){const e={mapValue:{fields:{}}};return _n(n.mapValue.fields,((t,r)=>e.mapValue.fields[t]=Yr(r))),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Yr(n.arrayValue.values[t]);return e}return{...n}}function zg(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue===jg}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ke{constructor(e){this.value=e}static empty(){return new ke({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let r=0;r<e.length-1;++r)if(t=(t.mapValue.fields||{})[e.get(r)],!Cn(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Yr(t)}setAll(e){let t=Ze.emptyPath(),r={},s=[];e.forEach(((a,c)=>{if(!t.isImmediateParentOf(c)){const l=this.getFieldsMap(t);this.applyChanges(l,r,s),r={},s=[],t=c.popLast()}a?r[c.lastSegment()]=Yr(a):s.push(c.lastSegment())}));const i=this.getFieldsMap(t);this.applyChanges(i,r,s)}delete(e){const t=this.field(e.popLast());Cn(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return nt(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let r=0;r<e.length;++r){let s=t.mapValue.fields[e.get(r)];Cn(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(r)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,r){_n(t,((s,i)=>e[s]=i));for(const s of r)delete e[s]}clone(){return new ke(Yr(this.value))}}function Xh(n){const e=[];return _n(n.fields,((t,r)=>{const s=new Ze([t]);if(Cn(r)){const i=Xh(r.mapValue).fields;if(i.length===0)e.push(s);else for(const a of i)e.push(s.child(a))}else e.push(s)})),new Ye(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zi(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:us(e)?"-0":e}}function Ba(n){return{integerValue:""+n}}function eo(n,e,t){return qg(e)?Ba(e):Zi(n,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class to{constructor(){this._=void 0}}function Hg(n,e,t){return n instanceof ds?(function(s,i){const a={fields:{[Gh]:{stringValue:Wh},[Qh]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&Xi(i)&&(i=Cs(i)),i&&(a.fields[Kh]=i),{mapValue:a}})(t,e):n instanceof fs?ed(n,e):n instanceof ps?td(n,e):n instanceof hr?(function(s,i){const a=Zh(s,i),c=ki(a)+ki(s.h);return ft(a)&&ft(s.h)?Ba(c):Zi(s.serializer,c)})(n,e):n instanceof Vi?(function(s,i){return dl(s,i,Math.min)})(n,e):n instanceof Ni?(function(s,i){return dl(s,i,Math.max)})(n,e):void 0}function Wg(n,e,t){return n instanceof fs?ed(n,e):n instanceof ps?td(n,e):t}function Zh(n,e){return n instanceof hr?cn(e)?e:{integerValue:0}:null}class ds extends to{}class fs extends to{constructor(e){super(),this.elements=e}}function ed(n,e){const t=nd(e);for(const r of n.elements)t.some((s=>nt(s,r)))||t.push(r);return{arrayValue:{values:t}}}class ps extends to{constructor(e){super(),this.elements=e}}function td(n,e){let t=nd(e);for(const r of n.elements)t=t.filter((s=>!nt(s,r)));return{arrayValue:{values:t}}}class qa extends to{constructor(e,t){super(),this.serializer=e,this.h=t}}class hr extends qa{}class Vi extends qa{}class Ni extends qa{}function dl(n,e,t){if(!cn(e))return n.h;const r=t(ki(e),ki(n.h));return ft(e)&&ft(n.h)?Ba(r):Zi(n.serializer,r)}function ki(n){return ae(n.integerValue||n.doubleValue)}function nd(n){return lr(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rd{constructor(e,t){this.field=e,this.transform=t}}function Gg(n,e){return n.field.isEqual(e.field)&&(function(r,s){return r instanceof fs&&s instanceof fs||r instanceof ps&&s instanceof ps?or(r.elements,s.elements,nt):r instanceof hr&&s instanceof hr||r instanceof Vi&&s instanceof Vi||r instanceof Ni&&s instanceof Ni?nt(r.h,s.h):r instanceof ds&&s instanceof ds})(n.transform,e.transform)}class Kg{constructor(e,t){this.version=e,this.transformResults=t}}class pe{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new pe}static exists(e){return new pe(void 0,e)}static updateTime(e){return new pe(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function gi(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class no{}function sd(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new ks(n.key,pe.none()):new Ns(n.key,n.data,pe.none());{const t=n.data,r=ke.empty();let s=new _e(Ze.comparator);for(let i of e.fields)if(!s.has(i)){let a=t.field(i);a===null&&i.length>1&&(i=i.popLast(),a=t.field(i)),a===null?r.delete(i):r.set(i,a),s=s.add(i)}return new yn(n.key,r,new Ye(s.toArray()),pe.none())}}function Qg(n,e,t){n instanceof Ns?(function(s,i,a){const c=s.value.clone(),l=pl(s.fieldTransforms,i,a.transformResults);c.setAll(l),i.convertToFoundDocument(a.version,c).setHasCommittedMutations()})(n,e,t):n instanceof yn?(function(s,i,a){if(!gi(s.precondition,i))return void i.convertToUnknownDocument(a.version);const c=pl(s.fieldTransforms,i,a.transformResults),l=i.data;l.setAll(id(s)),l.setAll(c),i.convertToFoundDocument(a.version,l).setHasCommittedMutations()})(n,e,t):(function(s,i,a){i.convertToNoDocument(a.version).setHasCommittedMutations()})(0,e,t)}function Jr(n,e,t,r){return n instanceof Ns?(function(i,a,c,l){if(!gi(i.precondition,a))return c;const h=i.value.clone(),f=ml(i.fieldTransforms,l,a);return h.setAll(f),a.convertToFoundDocument(a.version,h).setHasLocalMutations(),null})(n,e,t,r):n instanceof yn?(function(i,a,c,l){if(!gi(i.precondition,a))return c;const h=ml(i.fieldTransforms,l,a),f=a.data;return f.setAll(id(i)),f.setAll(h),a.convertToFoundDocument(a.version,f).setHasLocalMutations(),c===null?null:c.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map((m=>m.field)))})(n,e,t,r):(function(i,a,c){return gi(i.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):c})(n,e,t)}function Yg(n,e){let t=null;for(const r of n.fieldTransforms){const s=e.data.field(r.field),i=Zh(r.transform,s||null);i!=null&&(t===null&&(t=ke.empty()),t.set(r.field,i))}return t||null}function fl(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!(function(r,s){return r===void 0&&s===void 0||!(!r||!s)&&or(r,s,((i,a)=>Gg(i,a)))})(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class Ns extends no{constructor(e,t,r,s=[]){super(),this.key=e,this.value=t,this.precondition=r,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class yn extends no{constructor(e,t,r,s,i=[]){super(),this.key=e,this.data=t,this.fieldMask=r,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function id(n){const e=new Map;return n.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const r=n.data.field(t);e.set(t,r)}})),e}function pl(n,e,t){const r=new Map;U(n.length===t.length,32656,{T:t.length,P:n.length});for(let s=0;s<t.length;s++){const i=n[s],a=i.transform,c=e.data.field(i.field);r.set(i.field,Wg(a,c,t[s]))}return r}function ml(n,e,t){const r=new Map;for(const s of n){const i=s.transform,a=t.data.field(s.field);r.set(s.field,Hg(i,a,e))}return r}class ks extends no{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class od extends no{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Di{constructor(e,t){this.position=e,this.inclusive=t}}function gl(n,e,t){let r=0;for(let s=0;s<n.position.length;s++){const i=e[s],a=n.position[s];if(i.field.isKeyField()?r=B.comparator(B.fromName(a.referenceValue),t.key):r=He(a,t.data.field(i.field)),i.dir==="desc"&&(r*=-1),r!==0)break}return r}function _l(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!nt(n.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ad{}class me extends ad{constructor(e,t,r){super(),this.field=e,this.op=t,this.value=r}static create(e,t,r){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,r):new Xg(e,t,r):t==="array-contains"?new t_(e,r):t==="in"?new n_(e,r):t==="not-in"?new r_(e,r):t==="array-contains-any"?new s_(e,r):new me(e,t,r)}static createKeyFieldInFilter(e,t,r){return t==="in"?new Zg(e,r):new e_(e,r)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(He(t,this.value)):t!==null&&we(this.value)===we(t)&&this.matchesComparison(He(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return F(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class ct extends ad{constructor(e,t){super(),this.filters=e,this.op=t,this.I=null}static create(e,t){return new ct(e,t)}matches(e){return cd(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.I!==null||(this.I=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.I}getFilters(){return Object.assign([],this.filters)}}function cd(n){return n.op==="and"}function ud(n){return Jg(n)&&cd(n)}function Jg(n){for(const e of n.filters)if(e instanceof ct)return!1;return!0}function _a(n){if(n instanceof me)return n.field.canonicalString()+n.op.toString()+ur(n.value);if(ud(n))return n.filters.map((e=>_a(e))).join(",");{const e=n.filters.map((t=>_a(t))).join(",");return`${n.op}(${e})`}}function ld(n,e){return n instanceof me?(function(r,s){return s instanceof me&&r.op===s.op&&r.field.isEqual(s.field)&&nt(r.value,s.value)})(n,e):n instanceof ct?(function(r,s){return s instanceof ct&&r.op===s.op&&r.filters.length===s.filters.length?r.filters.reduce(((i,a,c)=>i&&ld(a,s.filters[c])),!0):!1})(n,e):void F(19439)}function hd(n){return n instanceof me?(function(t){return`${t.field.canonicalString()} ${t.op} ${ur(t.value)}`})(n):n instanceof ct?(function(t){return t.op.toString()+" {"+t.getFilters().map(hd).join(" ,")+"}"})(n):"Filter"}class Xg extends me{constructor(e,t,r){super(e,t,r),this.key=B.fromName(r.referenceValue)}matches(e){const t=B.comparator(e.key,this.key);return this.matchesComparison(t)}}class Zg extends me{constructor(e,t){super(e,"in",t),this.keys=dd("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class e_ extends me{constructor(e,t){super(e,"not-in",t),this.keys=dd("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function dd(n,e){var t;return(((t=e.arrayValue)==null?void 0:t.values)||[]).map((r=>B.fromName(r.referenceValue)))}class t_ extends me{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return lr(t)&&hs(t.arrayValue,this.value)}}class n_ extends me{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&hs(this.value.arrayValue,t)}}class r_ extends me{constructor(e,t){super(e,"not-in",t)}matches(e){if(hs(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!hs(this.value.arrayValue,t)}}class s_ extends me{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!lr(t)||!t.arrayValue.values)&&t.arrayValue.values.some((r=>hs(this.value.arrayValue,r)))}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ms{constructor(e,t="asc"){this.field=e,this.dir=t}}function i_(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ${static fromTimestamp(e){return new $(e)}static min(){return new $(new ee(0,0))}static max(){return new $(new ee(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ae{constructor(e,t,r,s,i,a,c){this.key=e,this.documentType=t,this.version=r,this.readTime=s,this.createTime=i,this.data=a,this.documentState=c}static newInvalidDocument(e){return new Ae(e,0,$.min(),$.min(),$.min(),ke.empty(),0)}static newFoundDocument(e,t,r,s){return new Ae(e,1,t,$.min(),r,s,0)}static newNoDocument(e,t){return new Ae(e,2,t,$.min(),$.min(),ke.empty(),0)}static newUnknownDocument(e,t){return new Ae(e,3,t,$.min(),$.min(),ke.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual($.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=ke.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=ke.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=$.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Ae&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Ae(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gs=-1;function o_(n,e){const t=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,s=$.fromTimestamp(r===1e9?new ee(t+1,0):new ee(t,r));return new un(s,B.empty(),e)}function a_(n){return new un(n.readTime,n.key,gs)}class un{constructor(e,t,r){this.readTime=e,this.documentKey=t,this.largestBatchId=r}static min(){return new un($.min(),B.empty(),gs)}static max(){return new un($.max(),B.empty(),gs)}}function c_(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=B.comparator(n.documentKey,e.documentKey),t!==0?t:Q(n.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class u_{constructor(e,t=null,r=[],s=[],i=null,a=null,c=null){this.path=e,this.collectionGroup=t,this.orderBy=r,this.filters=s,this.limit=i,this.startAt=a,this.endAt=c,this.R=null}}function yl(n,e=null,t=[],r=[],s=null,i=null,a=null){return new u_(n,e,t,r,s,i,a)}function fd(n){const e=H(n);if(e.R===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((r=>_a(r))).join(","),t+="|ob:",t+=e.orderBy.map((r=>(function(i){return i.field.canonicalString()+i.dir})(r))).join(","),Vs(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((r=>ur(r))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((r=>ur(r))).join(",")),e.R=t}return e.R}function pd(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!i_(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!ld(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!_l(n.startAt,e.startAt)&&_l(n.endAt,e.endAt)}function Pn(n){return!!n.isCorePipeline}function md(n){return!!n.path&&B.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mr{constructor(e,t=null,r=[],s=[],i=null,a="F",c=null,l=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=s,this.limit=i,this.limitType=a,this.startAt=c,this.endAt=l,this.A=null,this.V=null,this.m=null,this.startAt,this.endAt}}function l_(n,e,t,r,s,i,a,c){return new mr(n,e,t,r,s,i,a,c)}function ro(n){return new mr(n)}function wl(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function h_(n){return B.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}function gd(n){return n.collectionGroup!==null}function Xr(n){const e=H(n);if(e.A===null){e.A=[];const t=new Set;for(const i of e.explicitOrderBy)e.A.push(i),t.add(i.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(a){let c=new _e(Ze.comparator);return a.filters.forEach((l=>{l.getFlattenedFilters().forEach((h=>{h.isInequality()&&(c=c.add(h.field))}))})),c})(e).forEach((i=>{t.has(i.canonicalString())||i.isKeyField()||e.A.push(new ms(i,r))})),t.has(Ze.keyField().canonicalString())||e.A.push(new ms(Ze.keyField(),r))}return e.A}function gt(n){const e=H(n);return e.V||(e.V=d_(e,Xr(n))),e.V}function d_(n,e){if(n.limitType==="F")return yl(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map((s=>{const i=s.dir==="desc"?"asc":"desc";return new ms(s.field,i)}));const t=n.endAt?new Di(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new Di(n.startAt.position,n.startAt.inclusive):null;return yl(n.path,n.collectionGroup,e,n.filters,n.limit,t,r)}}function ya(n,e){const t=n.filters.concat([e]);return new mr(n.path,n.collectionGroup,n.explicitOrderBy.slice(),t,n.limit,n.limitType,n.startAt,n.endAt)}function f_(n,e){const t=n.explicitOrderBy.concat([e]);return new mr(n.path,n.collectionGroup,t,n.filters.slice(),n.limit,n.limitType,n.startAt,n.endAt)}function xi(n,e,t){return new mr(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function p_(n,e){return pd(gt(n),gt(e))&&n.limitType===e.limitType}function Zr(n){return`Query(target=${(function(t){let r=t.path.canonicalString();return t.collectionGroup!==null&&(r+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(r+=`, filters: [${t.filters.map((s=>hd(s))).join(", ")}]`),Vs(t.limit)||(r+=", limit: "+t.limit),t.orderBy.length>0&&(r+=`, orderBy: [${t.orderBy.map((s=>(function(a){return`${a.field.canonicalString()} (${a.dir})`})(s))).join(", ")}]`),t.startAt&&(r+=", startAt: ",r+=t.startAt.inclusive?"b:":"a:",r+=t.startAt.position.map((s=>ur(s))).join(",")),t.endAt&&(r+=", endAt: ",r+=t.endAt.inclusive?"a:":"b:",r+=t.endAt.position.map((s=>ur(s))).join(",")),`Target(${r})`})(gt(n))}; limitType=${n.limitType})`}function so(n,e){return e.isFoundDocument()&&(function(r,s){const i=s.key.path;return r.collectionGroup!==null?s.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(i):B.isDocumentKey(r.path)?r.path.isEqual(i):r.path.isImmediateParentOf(i)})(n,e)&&(function(r,s){for(const i of Xr(r))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0})(n,e)&&(function(r,s){for(const i of r.filters)if(!i.matches(s))return!1;return!0})(n,e)&&(function(r,s){return!(r.startAt&&!(function(a,c,l){const h=gl(a,c,l);return a.inclusive?h<=0:h<0})(r.startAt,Xr(r),s)||r.endAt&&!(function(a,c,l){const h=gl(a,c,l);return a.inclusive?h>=0:h>0})(r.endAt,Xr(r),s))})(n,e)}function $a(n){return(e,t)=>{let r=!1;for(const s of Xr(n)){const i=m_(s,e,t);if(i!==0)return i;r=r||s.field.isKeyField()}return 0}}function m_(n,e,t){const r=n.field.isKeyField()?B.comparator(e.key,t.key):(function(i,a,c){const l=a.data.field(i),h=c.data.field(i);return l!==null&&h!==null?He(l,h):F(42886)})(n.field,e,t);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return F(19790,{direction:n.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class g_{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var fe,J;function _d(n){switch(n){case S.OK:return F(64938);case S.CANCELLED:case S.UNKNOWN:case S.DEADLINE_EXCEEDED:case S.RESOURCE_EXHAUSTED:case S.INTERNAL:case S.UNAVAILABLE:case S.UNAUTHENTICATED:return!1;case S.INVALID_ARGUMENT:case S.NOT_FOUND:case S.ALREADY_EXISTS:case S.PERMISSION_DENIED:case S.FAILED_PRECONDITION:case S.ABORTED:case S.OUT_OF_RANGE:case S.UNIMPLEMENTED:case S.DATA_LOSS:return!0;default:return F(15467,{code:n})}}function yd(n){if(n===void 0)return kt("GRPC error has no .code"),S.UNKNOWN;switch(n){case fe.OK:return S.OK;case fe.CANCELLED:return S.CANCELLED;case fe.UNKNOWN:return S.UNKNOWN;case fe.DEADLINE_EXCEEDED:return S.DEADLINE_EXCEEDED;case fe.RESOURCE_EXHAUSTED:return S.RESOURCE_EXHAUSTED;case fe.INTERNAL:return S.INTERNAL;case fe.UNAVAILABLE:return S.UNAVAILABLE;case fe.UNAUTHENTICATED:return S.UNAUTHENTICATED;case fe.INVALID_ARGUMENT:return S.INVALID_ARGUMENT;case fe.NOT_FOUND:return S.NOT_FOUND;case fe.ALREADY_EXISTS:return S.ALREADY_EXISTS;case fe.PERMISSION_DENIED:return S.PERMISSION_DENIED;case fe.FAILED_PRECONDITION:return S.FAILED_PRECONDITION;case fe.ABORTED:return S.ABORTED;case fe.OUT_OF_RANGE:return S.OUT_OF_RANGE;case fe.UNIMPLEMENTED:return S.UNIMPLEMENTED;case fe.DATA_LOSS:return S.DATA_LOSS;default:return F(39323,{code:n})}}(J=fe||(fe={}))[J.OK=0]="OK",J[J.CANCELLED=1]="CANCELLED",J[J.UNKNOWN=2]="UNKNOWN",J[J.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",J[J.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",J[J.NOT_FOUND=5]="NOT_FOUND",J[J.ALREADY_EXISTS=6]="ALREADY_EXISTS",J[J.PERMISSION_DENIED=7]="PERMISSION_DENIED",J[J.UNAUTHENTICATED=16]="UNAUTHENTICATED",J[J.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",J[J.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",J[J.ABORTED=10]="ABORTED",J[J.OUT_OF_RANGE=11]="OUT_OF_RANGE",J[J.UNIMPLEMENTED=12]="UNIMPLEMENTED",J[J.INTERNAL=13]="INTERNAL",J[J.UNAVAILABLE=14]="UNAVAILABLE",J[J.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zn{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r!==void 0){for(const[s,i]of r)if(this.equalsFn(s,e))return i}}has(e){return this.get(e)!==void 0}set(e,t){const r=this.mapKeyFn(e),s=this.inner[r];if(s===void 0)return this.inner[r]=[[e,t]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return void(s[i]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r===void 0)return!1;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],e))return r.length===1?delete this.inner[t]:r.splice(s,1),this.innerSize--,!0;return!1}forEach(e){_n(this.inner,((t,r)=>{for(const[s,i]of r)e(s,i)}))}isEmpty(){return jh(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const __=new oe(B.comparator);function $e(){return __}const wd=new oe(B.comparator);function Zn(...n){let e=wd;for(const t of n)e=e.insert(t.key,t);return e}function Ed(n){let e=wd;return n.forEach(((t,r)=>e=e.insert(t,r.overlayedDocument))),e}function Ht(){return es()}function Td(){return es()}function es(){return new zn((n=>n.toString()),((n,e)=>n.isEqual(e)))}const y_=new oe(B.comparator),w_=new _e(B.comparator);function K(...n){let e=w_;for(const t of n)e=e.add(t);return e}const E_=new _e(Q);function T_(){return E_}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function I_(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const v_=new Zt([4294967295,4294967295],0);function El(n){const e=I_().encode(n),t=new Lh;return t.update(e),new Uint8Array(t.digest())}function Tl(n){const e=new DataView(n.buffer),t=e.getUint32(0,!0),r=e.getUint32(4,!0),s=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new Zt([t,r],0),new Zt([s,i],0)]}class ja{constructor(e,t,r){if(this.bitmap=e,this.padding=t,this.hashCount=r,t<0||t>=8)throw new Kr(`Invalid padding: ${t}`);if(r<0)throw new Kr(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new Kr(`Invalid hash count: ${r}`);if(e.length===0&&t!==0)throw new Kr(`Invalid padding when bitmap length is 0: ${t}`);this.p=8*e.length-t,this.S=Zt.fromNumber(this.p)}v(e,t,r){let s=e.add(t.multiply(Zt.fromNumber(r)));return s.compare(v_)===1&&(s=new Zt([s.getBits(0),s.getBits(1)],0)),s.modulo(this.S).toNumber()}D(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.p===0)return!1;const t=El(e),[r,s]=Tl(t);for(let i=0;i<this.hashCount;i++){const a=this.v(r,s,i);if(!this.D(a))return!1}return!0}static create(e,t,r){const s=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),a=new ja(i,s,t);return r.forEach((c=>a.insert(c))),a}insert(e){if(this.p===0)return;const t=El(e),[r,s]=Tl(t);for(let i=0;i<this.hashCount;i++){const a=this.v(r,s,i);this.C(a)}}C(e){const t=Math.floor(e/8),r=e%8;this.bitmap[t]|=1<<r}}class Kr extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ds{constructor(e,t,r,s,i,a){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=r,this.documentUpdates=s,this.augmentedDocumentUpdates=i,this.resolvedLimboDocuments=a}static createSynthesizedRemoteEventForCurrentChange(e,t,r){const s=new Map;return s.set(e,xs.createSynthesizedTargetChangeForCurrentChange(e,t,r)),new Ds($.min(),s,new oe(Q),$e(),$e(),K())}}class xs{constructor(e,t,r,s,i){this.resumeToken=e,this.current=t,this.addedDocuments=r,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,r){return new xs(r,t,K(),K(),K())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _i{constructor(e,t,r,s){this.F=e,this.removedTargetIds=t,this.key=r,this.O=s}}class Id{constructor(e,t){this.targetId=e,this.M=t}}class vd{constructor(e,t,r=ye.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=t,this.resumeToken=r,this.cause=s}}class Il{constructor(e){this.targetId=e,this.N=0,this.L=vl(),this.B=ye.EMPTY_BYTE_STRING,this.U=!1,this.k=!0}get current(){return this.U}get resumeToken(){return this.B}get q(){return this.N!==0}get $(){return this.k}K(e){e.approximateByteSize()>0&&(this.k=!0,this.B=e)}W(){let e=K(),t=K(),r=K();return this.L.forEach(((s,i)=>{switch(i){case 0:e=e.add(s);break;case 2:t=t.add(s);break;case 1:r=r.add(s);break;default:F(38017,{changeType:i})}})),new xs(this.B,this.U,e,t,r)}G(){this.k=!1,this.L=vl()}j(e,t){this.k=!0,this.L=this.L.insert(e,t)}H(e){this.k=!0,this.L=this.L.remove(e)}J(){this.N+=1}Y(){this.N-=1,U(this.N>=0,3241,{N:this.N,targetId:this.targetId})}Z(){this.k=!0,this.U=!0}}const $r="WatchChangeAggregator";class A_{constructor(e){this.X=e,this.ee=new Map,this.te=$e(),this.ne=ci(),this.re=$e(),this.ie=ci(),this.se=new oe(Q)}_e(e){for(const t of e.F)e.O&&e.O.isFoundDocument()?this.oe(t,e.O):this.ae(t,e.key,e.O);for(const t of e.removedTargetIds)this.ae(t,e.key,e.O)}ue(e){this.forEachTarget(e,(t=>{const r=this.ee.get(t);if(r)switch(e.state){case 0:this.ce(t)&&r.K(e.resumeToken);break;case 1:r.Y(),r.q||r.G(),r.K(e.resumeToken);break;case 2:r.Y(),r.q||this.removeTarget(t);break;case 3:this.ce(t)&&(r.Z(),r.K(e.resumeToken));break;case 4:this.ce(t)&&(this.le(t),r.K(e.resumeToken));break;default:F(56790,{state:e.state})}else L($r,`handleTargetChange received targetChange for untracked target ID (${t}) with state (${e.state})`)}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.ee.forEach(((r,s)=>{this.ce(s)&&t(s)}))}Ee(e){var t;return Pn(e)?e.getPipelineSourceType()==="documents"&&((t=e.getPipelineDocuments())==null?void 0:t.length)===1:md(e)}he(e){const t=e.targetId,r=e.M.count,s=this.Te(t);if(s){const i=s.target;if(this.Ee(i))if(r===0){const a=new B(Pn(i)?Z.fromString(i.getPipelineDocuments()[0]):i.path);this.ae(t,a,Ae.newNoDocument(a,$.min()))}else U(r===1,20013,"Single document existence filter with count: "+r);else{const a=this.Pe(t);if(a!==r){const c=this.Ie(e),l=c?this.Re(c,e,a):1;if(l!==0){this.le(t);const h=l===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.se=this.se.insert(t,h)}}}}}Ie(e){const t=e.M.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:r="",padding:s=0},hashCount:i=0}=t;let a,c;try{a=an(r).toUint8Array()}catch(l){if(l instanceof Hh)return at("Decoding the base64 bloom filter in existence filter failed ("+l.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw l}try{c=new ja(a,s,i)}catch(l){return at(l instanceof Kr?"BloomFilter error: ":"Applying bloom filter failed: ",l),null}return c.p===0?null:c}Re(e,t,r){return t.M.count===r-this.de(e,t.targetId)?0:2}de(e,t){const r=this.X.getRemoteKeysForTarget(t);let s=0;return r.forEach((i=>{const a=this.X.Ve(),c=`projects/${a.projectId}/databases/${a.database}/documents/${i.path.canonicalString()}`;e.mightContain(c)||(this.ae(t,i,null),s++)})),s}fe(e){const t=new Map;this.ee.forEach(((i,a)=>{const c=this.Te(a);if(c){if(i.current&&this.Ee(c.target)){const l=Pn(c.target)?Z.fromString(c.target.getPipelineDocuments()[0]):c.target.path,h=new B(l);this.me(h).has(a)||this.pe(a,h)||this.ae(a,h,Ae.newNoDocument(h,e))}i.$&&(t.set(a,i.W()),i.G())}}));let r=K();this.ie.forEach(((i,a)=>{let c=!0;a.forEachWhile((l=>{const h=this.Te(l);return!h||h.purpose==="TargetPurposeLimboResolution"||(c=!1,!1)})),c&&(r=r.add(i))})),this.te.forEach(((i,a)=>a.setReadTime(e))),this.re.forEach(((i,a)=>a.setReadTime(e)));const s=new Ds(e,t,this.se,this.te,this.re,r);return this.te=$e(),this.ne=ci(),this.re=$e(),this.ie=ci(),this.se=new oe(Q),s}oe(e,t){const r=this.ee.get(e);if(!r||!this.ce(e))return void L($r,`addDocumentToTarget received document for unknown inactive target (${e})`);const s=this.pe(e,t.key)?2:0;r.j(t.key,s),Pn(this.Te(e).target)&&this.Te(e).target.getPipelineFlavor()!=="exact"?this.re=this.re.insert(t.key,t):this.te=this.te.insert(t.key,t),this.ne=this.ne.insert(t.key,this.me(t.key).add(e)),this.ie=this.ie.insert(t.key,this.ge(t.key).add(e))}ae(e,t,r){const s=this.ee.get(e);s&&this.ce(e)?(this.pe(e,t)?s.j(t,1):s.H(t),this.ie=this.ie.insert(t,this.ge(t).delete(e)),this.ie=this.ie.insert(t,this.ge(t).add(e)),r&&(Pn(this.Te(e).target)&&this.Te(e).target.getPipelineFlavor()!=="exact"?this.re=this.re.insert(t,r):this.te=this.te.insert(t,r))):L($r,`removeDocumentFromTarget received document for unknown or inactive target (${e})`)}removeTarget(e){this.ee.delete(e)}Pe(e){const t=this.ee.get(e);if(!t)return 0;const r=t.W();return this.X.getRemoteKeysForTarget(e).size+r.addedDocuments.size-r.removedDocuments.size}J(e){let t=this.ee.get(e);t||(L($r,`recordPendingTargetRequest set up tracking for target ID ${e}`),t=new Il(e),this.ee.set(e,t)),t.J()}ge(e){let t=this.ie.get(e);return t||(t=new _e(Q),this.ie=this.ie.insert(e,t)),t}me(e){let t=this.ne.get(e);return t||(t=new _e(Q),this.ne=this.ne.insert(e,t)),t}ce(e){const t=this.Te(e)!==null;return t||L($r,"Detected inactive target",e),t}Te(e){const t=this.ee.get(e);return t===void 0||t.q?null:this.X.ye(e)}le(e){this.ee.set(e,new Il(e)),this.X.getRemoteKeysForTarget(e).forEach((t=>{this.ae(e,t,null)}))}pe(e,t){return this.X.getRemoteKeysForTarget(e).has(t)}}function ci(){return new oe(B.comparator)}function vl(){return new oe(B.comparator)}const R_={asc:"ASCENDING",desc:"DESCENDING"},P_={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},b_={and:"AND",or:"OR"};class S_{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function wa(n,e){return n.useProto3Json||Vs(e)?e:{value:e}}function ts(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function za(n){const e=on(n);return new ee(e.seconds,e.nanos)}function Ad(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function yi(n,e){return ts(n,e.toTimestamp())}function et(n){return U(!!n,49232),$.fromTimestamp(za(n))}function Ha(n,e){return Ea(n,e).canonicalString()}function Ea(n,e){const t=(function(s){return new Z(["projects",s.projectId,"databases",s.database])})(n).child("documents");return e===void 0?t:t.child(e)}function Rd(n){const e=Z.fromString(n);return U(Nd(e),10190,{key:e.toString()}),e}function _s(n,e){return Ha(n.databaseId,e.path)}function ns(n,e){const t=Rd(e);if(t.get(1)!==n.databaseId.projectId)throw new k(S.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new k(S.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new B(bd(t))}function Pd(n,e){return Ha(n.databaseId,e)}function C_(n){const e=Rd(n);return e.length===4?Z.emptyPath():bd(e)}function Ta(n){return new Z(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function bd(n){return U(n.length>4&&n.get(4)==="documents",29091,{key:n.toString()}),n.popFirst(5)}function Al(n,e,t){return{name:_s(n,e),fields:t.value.mapValue.fields}}function V_(n,e){return"found"in e?(function(r,s){U(!!s.found,43571),s.found.name,s.found.updateTime;const i=ns(r,s.found.name),a=et(s.found.updateTime),c=s.found.createTime?et(s.found.createTime):$.min(),l=new ke({mapValue:{fields:s.found.fields}});return Ae.newFoundDocument(i,a,c,l)})(n,e):"missing"in e?(function(r,s){U(!!s.missing,3894),U(!!s.readTime,22933);const i=ns(r,s.missing),a=et(s.readTime);return Ae.newNoDocument(i,a)})(n,e):F(7234,{result:e})}function N_(n,e){let t;if("targetChange"in e){e.targetChange;const r=(function(h){return h==="NO_CHANGE"?0:h==="ADD"?1:h==="REMOVE"?2:h==="CURRENT"?3:h==="RESET"?4:F(39313,{state:h})})(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],i=(function(h,f){return h.useProto3Json?(U(f===void 0||typeof f=="string",58123),ye.fromBase64String(f||"")):(U(f===void 0||f instanceof Buffer||f instanceof Uint8Array,16193),ye.fromUint8Array(f||new Uint8Array))})(n,e.targetChange.resumeToken),a=e.targetChange.cause,c=a&&(function(h){const f=h.code===void 0?S.UNKNOWN:yd(h.code);return new k(f,h.message||"")})(a);t=new vd(r,s,i,c||null)}else if("documentChange"in e){e.documentChange;const r=e.documentChange;r.document,r.document.name,r.document.updateTime;const s=ns(n,r.document.name),i=et(r.document.updateTime),a=r.document.createTime?et(r.document.createTime):$.min(),c=new ke({mapValue:{fields:r.document.fields}}),l=Ae.newFoundDocument(s,i,a,c),h=r.targetIds||[],f=r.removedTargetIds||[];t=new _i(h,f,l.key,l)}else if("documentDelete"in e){e.documentDelete;const r=e.documentDelete;r.document;const s=ns(n,r.document),i=r.readTime?et(r.readTime):$.min(),a=Ae.newNoDocument(s,i),c=r.removedTargetIds||[];t=new _i([],c,a.key,a)}else if("documentRemove"in e){e.documentRemove;const r=e.documentRemove;r.document;const s=ns(n,r.document),i=r.removedTargetIds||[];t=new _i([],i,s,null)}else{if(!("filter"in e))return F(11601,{we:e});{e.filter;const r=e.filter;r.targetId;const{count:s=0,unchangedNames:i}=r,a=new g_(s,i),c=r.targetId;t=new Id(c,a)}}return t}function Sd(n,e){let t;if(e instanceof Ns)t={update:Al(n,e.key,e.value)};else if(e instanceof ks)t={delete:_s(n,e.key)};else if(e instanceof yn)t={update:Al(n,e.key,e.data),updateMask:q_(e.fieldMask)};else{if(!(e instanceof od))return F(16599,{be:e.type});t={verify:_s(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((r=>(function(i,a){const c=a.transform;if(c instanceof ds)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(c instanceof fs)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:c.elements}};if(c instanceof ps)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:c.elements}};if(c instanceof hr)return{fieldPath:a.field.canonicalString(),increment:c.h};if(c instanceof Vi)return{fieldPath:a.field.canonicalString(),minimum:c.h};if(c instanceof Ni)return{fieldPath:a.field.canonicalString(),maximum:c.h};throw F(20930,{transform:a.transform})})(0,r)))),e.precondition.isNone||(t.currentDocument=(function(s,i){return i.updateTime!==void 0?{updateTime:yi(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:F(27497)})(n,e.precondition)),t}function k_(n,e){return n&&n.length>0?(U(e!==void 0,14353),n.map((t=>(function(s,i){let a=s.updateTime?et(s.updateTime):et(i);return a.isEqual($.min())&&(a=et(i)),new Kg(a,s.transformResults||[])})(t,e)))):[]}function D_(n,e){return{documents:[Pd(n,e.path)]}}function x_(n,e){const t={structuredQuery:{}},r=e.path;let s;e.collectionGroup!==null?(s=r,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=r.popLast(),t.structuredQuery.from=[{collectionId:r.lastSegment()}]),t.parent=Pd(n,s);const i=(function(h){if(h.length!==0)return Vd(ct.create(h,"and"))})(e.filters);i&&(t.structuredQuery.where=i);const a=(function(h){if(h.length!==0)return h.map((f=>(function(y){return{field:er(y.field),direction:U_(y.dir)}})(f)))})(e.orderBy);a&&(t.structuredQuery.orderBy=a);const c=wa(n,e.limit);return c!==null&&(t.structuredQuery.limit=c),e.startAt&&(t.structuredQuery.startAt=(function(h){return{before:h.inclusive,values:h.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(h){return{before:!h.inclusive,values:h.position}})(e.endAt)),{Se:t,parent:s}}function O_(n){let e=C_(n.parent);const t=n.structuredQuery,r=t.from?t.from.length:0;let s=null;if(r>0){U(r===1,65062);const f=t.from[0];f.allDescendants?s=f.collectionId:e=e.child(f.collectionId)}let i=[];t.where&&(i=(function(m){const y=Cd(m);return y instanceof ct&&ud(y)?y.getFilters():[y]})(t.where));let a=[];t.orderBy&&(a=(function(m){return m.map((y=>(function(V){return new ms(tr(V.field),(function(x){switch(x){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(V.direction))})(y)))})(t.orderBy));let c=null;t.limit&&(c=(function(m){let y;return y=typeof m=="object"?m.value:m,Vs(y)?null:y})(t.limit));let l=null;t.startAt&&(l=(function(m){const y=!!m.before,b=m.values||[];return new Di(b,y)})(t.startAt));let h=null;return t.endAt&&(h=(function(m){const y=!m.before,b=m.values||[];return new Di(b,y)})(t.endAt)),l_(e,s,a,i,c,"F",l,h)}function L_(n,e){const t=(function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return F(28987,{purpose:s})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function M_(n,e){return{structuredPipeline:{pipeline:{stages:e.stages.map((t=>t._toProto(n)))}}}}function Cd(n){return n.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const r=tr(t.unaryFilter.field);return me.create(r,"==",{doubleValue:NaN});case"IS_NULL":const s=tr(t.unaryFilter.field);return me.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=tr(t.unaryFilter.field);return me.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=tr(t.unaryFilter.field);return me.create(a,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return F(61313);default:return F(60726)}})(n):n.fieldFilter!==void 0?(function(t){return me.create(tr(t.fieldFilter.field),(function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return F(58110);default:return F(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(n):n.compositeFilter!==void 0?(function(t){return ct.create(t.compositeFilter.filters.map((r=>Cd(r))),(function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return F(1026)}})(t.compositeFilter.op))})(n):F(30097,{filter:n})}function U_(n){return R_[n]}function F_(n){return P_[n]}function B_(n){return b_[n]}function er(n){return{fieldPath:n.canonicalString()}}function tr(n){return Ze.fromServerFormat(n.fieldPath)}function Vd(n){return n instanceof me?(function(t){if(t.op==="=="){if(We(t.value))return{unaryFilter:{field:er(t.field),op:"IS_NAN"}};if(Je(t.value))return{unaryFilter:{field:er(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(We(t.value))return{unaryFilter:{field:er(t.field),op:"IS_NOT_NAN"}};if(Je(t.value))return{unaryFilter:{field:er(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:er(t.field),op:F_(t.op),value:t.value}}})(n):n instanceof ct?(function(t){const r=t.getFilters().map((s=>Vd(s)));return r.length===1?r[0]:{compositeFilter:{op:B_(t.op),filters:r}}})(n):F(54877,{filter:n})}function q_(n){const e=[];return n.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function Nd(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}function kd(n){return!!n&&typeof n._toProto=="function"&&n._protoValueType==="ProtoValue"}function ys(n,e){const t={fields:{}};return e.forEach(((r,s)=>{if(typeof s!="string")throw new Error(`Cannot encode map with non-string key: ${s}`);t.fields[s]=r._toProto(n)})),{mapValue:t}}function Dd(n){return{stringValue:n}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function io(n){return new S_(n,!0)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qe{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Qe(ye.fromBase64String(e))}catch(t){throw new k(S.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Qe(ye.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:Qe._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(Ss(e,Qe._jsonSchema))return Qe.fromBase64String(e.bytes)}}Qe._jsonSchemaVersion="firestore/bytes/1.0",Qe._jsonSchema={type:ge("string",Qe._jsonSchemaVersion),bytes:ge("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gr{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new k(S.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Ze(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}function $_(){return new gr(dt)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Os{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _t{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new k(S.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new k(S.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return Q(this._lat,e._lat)||Q(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:_t._jsonSchemaVersion}}static fromJSON(e){if(Ss(e,_t._jsonSchema))return new _t(e.latitude,e.longitude)}}_t._jsonSchemaVersion="firestore/geoPoint/1.0",_t._jsonSchema={type:ge("string",_t._jsonSchemaVersion),latitude:ge("number"),longitude:ge("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ne{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Ne.UNAUTHENTICATED=new Ne(null),Ne.GOOGLE_CREDENTIALS=new Ne("google-credentials-uid"),Ne.FIRST_PARTY=new Ne("first-party-uid"),Ne.MOCK_USER=new Ne("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yt{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xd{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class j_{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(Ne.UNAUTHENTICATED)))}shutdown(){}}class z_{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class H_{constructor(e){this.De=e,this.currentUser=Ne.UNAUTHENTICATED,this.xe=0,this.forceRefresh=!1,this.auth=null}start(e,t){U(this.Ce===void 0,42304);let r=this.xe;const s=l=>this.xe!==r?(r=this.xe,t(l)):Promise.resolve();let i=new yt;this.Ce=()=>{this.xe++,this.currentUser=this.Fe(),i.resolve(),i=new yt,e.enqueueRetryable((()=>s(this.currentUser)))};const a=()=>{const l=i;e.enqueueRetryable((async()=>{await l.promise,await s(this.currentUser)}))},c=l=>{L("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=l,this.Ce&&(this.auth.addAuthTokenListener(this.Ce),a())};this.De.onInit((l=>c(l))),setTimeout((()=>{if(!this.auth){const l=this.De.getImmediate({optional:!0});l?c(l):(L("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new yt)}}),0),a()}getToken(){const e=this.xe,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((r=>this.xe!==e?(L("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(U(typeof r.accessToken=="string",31837,{Oe:r}),new xd(r.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.Ce&&this.auth.removeAuthTokenListener(this.Ce),this.Ce=void 0}Fe(){const e=this.auth&&this.auth.getUid();return U(e===null||typeof e=="string",2055,{Me:e}),new Ne(e)}}class W_{constructor(e,t,r){this.Ne=e,this.Le=t,this.Be=r,this.type="FirstParty",this.user=Ne.FIRST_PARTY,this.Ue=new Map}ke(){return this.Be?this.Be():null}get headers(){this.Ue.set("X-Goog-AuthUser",this.Ne);const e=this.ke();return e&&this.Ue.set("Authorization",e),this.Le&&this.Ue.set("X-Goog-Iam-Authorization-Token",this.Le),this.Ue}}class G_{constructor(e,t,r){this.Ne=e,this.Le=t,this.Be=r}getToken(){return Promise.resolve(new W_(this.Ne,this.Le,this.Be))}start(e,t){e.enqueueRetryable((()=>t(Ne.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class Rl{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class K_{constructor(e,t){this.qe=t,this.forceRefresh=!1,this.appCheck=null,this.$e=null,this.Ke=null,qe(e)&&e.settings.appCheckToken&&(this.Ke=e.settings.appCheckToken)}start(e,t){U(this.Ce===void 0,3512);const r=i=>{i.error!=null&&L("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const a=i.token!==this.$e;return this.$e=i.token,L("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?t(i.token):Promise.resolve()};this.Ce=i=>{e.enqueueRetryable((()=>r(i)))};const s=i=>{L("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.Ce&&this.appCheck.addTokenListener(this.Ce)};this.qe.onInit((i=>s(i))),setTimeout((()=>{if(!this.appCheck){const i=this.qe.getImmediate({optional:!0});i?s(i):L("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.Ke)return Promise.resolve(new Rl(this.Ke));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(U(typeof t.token=="string",44558,{tokenResult:t}),this.$e=t.token,new Rl(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.Ce&&this.appCheck.removeTokenListener(this.Ce),this.Ce=void 0}}function Od(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Q_{Qe(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pl="ConnectivityMonitor";class bl{constructor(){this.We=()=>this.Ge(),this.ze=()=>this.je(),this.He=[],this.Je()}Qe(e){this.He.push(e)}shutdown(){window.removeEventListener("online",this.We),window.removeEventListener("offline",this.ze)}Je(){window.addEventListener("online",this.We),window.addEventListener("offline",this.ze)}Ge(){L(Pl,"Network connectivity changed: AVAILABLE");for(const e of this.He)e(0)}je(){L(Pl,"Network connectivity changed: UNAVAILABLE");for(const e of this.He)e(1)}static Ye(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ui=null;function Ia(){return ui===null?ui=(function(){return 268435456+Math.round(2147483648*Math.random())})():ui++,"0x"+ui.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ea="RestConnection",Y_={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"};class J_{get Ze(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Xe=t+"://"+e.host,this.et=`projects/${r}/databases/${s}`,this.tt=this.databaseId.database===Si?`project_id=${r}`:`project_id=${r}&database_id=${s}`}nt(e,t,r,s,i){const a=Ia(),c=this.rt(e,t.toUriEncodedString());L(ea,`Sending RPC '${e}' ${a}:`,c,r);const l={"google-cloud-resource-prefix":this.et,"x-goog-request-params":this.tt};this.it(l,s,i);const{host:h}=new URL(c),f=$n(h);return this.st(e,c,l,r,f).then((m=>(L(ea,`Received RPC '${e}' ${a}: `,m),m)),(m=>{throw at(ea,`RPC '${e}' ${a} failed with error: `,m,"url: ",c,"request:",r),m}))}_t(e,t,r,s,i,a){return this.nt(e,t,r,s,i)}it(e,t,r){if(e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+pr})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((s,i)=>e[i]=s)),r&&r.headers.forEach(((s,i)=>e[i]=s)),this.databaseInfo._customHeaders)for(const s of Object.keys(this.databaseInfo._customHeaders))e[s]=this.databaseInfo._customHeaders[s]}rt(e,t){const r=Y_[e];let s=`${this.Xe}/v1/${t}:${r}`;return this.databaseInfo.apiKey&&(s=`${s}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),s}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class X_{constructor(e){this.ot=e.ot,this.ut=e.ut}ct(e){this.lt=e}Et(e){this.ht=e}Tt(e){this.Pt=e}onMessage(e){this.It=e}close(){this.ut()}send(e){this.ot(e)}Rt(){this.lt()}At(){this.ht()}Vt(e){this.Pt(e)}dt(e){this.It(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ve="WebChannelConnection",jr=(n,e,t)=>{n.listen(e,(r=>{try{t(r)}catch(s){setTimeout((()=>{throw s}),0)}}))};class rr extends J_{constructor(e){super(e),this.ft=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}static gt(){if(!rr.yt){const e=Bh();jr(e,Fh.STAT_EVENT,(t=>{t.stat===fa.PROXY?L(Ve,"STAT_EVENT: detected buffering proxy"):t.stat===fa.NOPROXY&&L(Ve,"STAT_EVENT: detected no buffering proxy")})),rr.yt=!0}}st(e,t,r,s,i){const a=Ia();return new Promise(((c,l)=>{const h=new Mh;h.setWithCredentials(!0),h.listenOnce(Uh.COMPLETE,(()=>{try{switch(h.getLastErrorCode()){case pi.NO_ERROR:const m=h.getResponseJson();L(Ve,`XHR for RPC '${e}' ${a} received:`,JSON.stringify(m)),c(m);break;case pi.TIMEOUT:L(Ve,`RPC '${e}' ${a} timed out`),l(new k(S.DEADLINE_EXCEEDED,"Request time out"));break;case pi.HTTP_ERROR:const y=h.getStatus();if(L(Ve,`RPC '${e}' ${a} failed with status:`,y,"response text:",h.getResponseText()),y>0){let b=h.getResponseJson();Array.isArray(b)&&(b=b[0]);const V=b==null?void 0:b.error;if(V&&V.status&&V.message){const M=(function(z){const G=z.toLowerCase().replace(/_/g,"-");return Object.values(S).indexOf(G)>=0?G:S.UNKNOWN})(V.status);l(new k(M,V.message))}else l(new k(S.UNKNOWN,"Server responded with status "+h.getStatus()))}else l(new k(S.UNAVAILABLE,"Connection failed."));break;default:F(9055,{wt:e,streamId:a,bt:h.getLastErrorCode(),St:h.getLastError()})}}finally{L(Ve,`RPC '${e}' ${a} completed.`)}}));const f=JSON.stringify(s);L(Ve,`RPC '${e}' ${a} sending request:`,s),h.send(t,"POST",f,r,15)}))}vt(e,t,r){const s=Ia(),i=[this.Xe,"/","google.firestore.v1.Firestore","/",e,"/channel"],a=this.createWebChannelTransport(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},l=this.longPollingOptions.timeoutSeconds;l!==void 0&&(c.longPollingTimeout=Math.round(1e3*l)),this.useFetchStreams&&(c.useFetchStreams=!0),this.it(c.initMessageHeaders,t,r),c.encodeInitMessageHeaders=!0;const h=i.join("");L(Ve,`Creating RPC '${e}' stream ${s}: ${h}`,c);const f=a.createWebChannel(h,c);this.Dt(f);let m=!1,y=!1;const b=new X_({ot:V=>{y?L(Ve,`Not sending because RPC '${e}' stream ${s} is closed:`,V):(m||(L(Ve,`Opening RPC '${e}' stream ${s} transport.`),f.open(),m=!0),L(Ve,`RPC '${e}' stream ${s} sending:`,V),f.send(V))},ut:()=>f.close()});return jr(f,Gr.EventType.OPEN,(()=>{y||(L(Ve,`RPC '${e}' stream ${s} transport opened.`),b.Rt())})),jr(f,Gr.EventType.CLOSE,(()=>{y||(y=!0,L(Ve,`RPC '${e}' stream ${s} transport closed`),b.Vt(),this.xt(f))})),jr(f,Gr.EventType.ERROR,(V=>{y||(y=!0,at(Ve,`RPC '${e}' stream ${s} transport errored. Name:`,V.name,"Message:",V.message),b.Vt(new k(S.UNAVAILABLE,"The operation could not be completed")))})),jr(f,Gr.EventType.MESSAGE,(V=>{var M;if(!y){const x=V.data[0];U(!!x,16349);const z=x,G=(z==null?void 0:z.error)||((M=z[0])==null?void 0:M.error);if(G){L(Ve,`RPC '${e}' stream ${s} received error:`,G);const X=G.status;let ne=(function(I){const g=fe[I];if(g!==void 0)return yd(g)})(X),he=G.message;X==="NOT_FOUND"&&he.includes("database")&&he.includes("does not exist")&&he.includes(this.databaseId.database)&&at(`Database '${this.databaseId.database}' not found. Please check your project configuration.`),ne===void 0&&(ne=S.INTERNAL,he="Unknown error status: "+X+" with message "+G.message),y=!0,b.Vt(new k(ne,he)),f.close()}else L(Ve,`RPC '${e}' stream ${s} received:`,x),b.dt(x)}})),rr.gt(),setTimeout((()=>{b.At()}),0),b}terminate(){this.ft.forEach((e=>e.close())),this.ft=[]}Dt(e){this.ft.push(e)}xt(e){this.ft=this.ft.filter((t=>t===e))}it(e,t,r){super.it(e,t,r),this.databaseInfo.apiKey&&(e["x-goog-api-key"]=this.databaseInfo.apiKey)}createWebChannelTransport(){return qh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Z_(n){return new rr(n)}rr.yt=!1;class Wa{constructor(e,t,r=1e3,s=1.5,i=6e4){this.Ct=e,this.timerId=t,this.Ft=r,this.Ot=s,this.Mt=i,this.Nt=0,this.Lt=null,this.Bt=Date.now(),this.reset()}reset(){this.Nt=0}Ut(){this.Nt=this.Mt}kt(e){this.cancel();const t=Math.floor(this.Nt+this.qt()),r=Math.max(0,Date.now()-this.Bt),s=Math.max(0,t-r);s>0&&L("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.Nt} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.Lt=this.Ct.enqueueAfterDelay(this.timerId,s,(()=>(this.Bt=Date.now(),e()))),this.Nt*=this.Ot,this.Nt<this.Ft&&(this.Nt=this.Ft),this.Nt>this.Mt&&(this.Nt=this.Mt)}$t(){this.Lt!==null&&(this.Lt.skipDelay(),this.Lt=null)}cancel(){this.Lt!==null&&(this.Lt.cancel(),this.Lt=null)}qt(){return(Math.random()-.5)*this.Nt}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sl="PersistentStream";class Ld{constructor(e,t,r,s,i,a,c,l){this.Ct=e,this.Kt=r,this.Qt=s,this.connection=i,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=c,this.listener=l,this.state=0,this.Wt=0,this.Gt=null,this.zt=null,this.stream=null,this.jt=0,this.Ht=new Wa(e,t)}Jt(){return this.state===1||this.state===5||this.Yt()}Yt(){return this.state===2||this.state===3}start(){this.jt=0,this.state!==4?this.auth():this.Zt()}async stop(){this.Jt()&&await this.close(0)}Xt(){this.state=0,this.Ht.reset()}en(){this.Yt()&&this.Gt===null&&(this.Gt=this.Ct.enqueueAfterDelay(this.Kt,6e4,(()=>this.tn())))}nn(e){this.rn(),this.stream.send(e)}async tn(){if(this.Yt())return this.close(0)}rn(){this.Gt&&(this.Gt.cancel(),this.Gt=null)}sn(){this.zt&&(this.zt.cancel(),this.zt=null)}async close(e,t){this.rn(),this.sn(),this.Ht.cancel(),this.Wt++,e!==4?this.Ht.reset():t&&t.code===S.RESOURCE_EXHAUSTED?(kt(t.toString()),kt("Using maximum backoff delay to prevent overloading the backend."),this.Ht.Ut()):t&&t.code===S.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this._n(),this.stream.close(),this.stream=null),this.state=e,await this.listener.Tt(t)}_n(){}auth(){this.state=1;const e=this.an(this.Wt),t=this.Wt;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([r,s])=>{this.Wt===t&&this.un(r,s)}),(r=>{e((()=>{const s=new k(S.UNKNOWN,"Fetching auth token failed: "+r.message);return this.cn(s)}))}))}un(e,t){const r=this.an(this.Wt);this.stream=this.En(e,t),this.stream.ct((()=>{r((()=>this.listener.ct()))})),this.stream.Et((()=>{r((()=>(this.state=2,this.zt=this.Ct.enqueueAfterDelay(this.Qt,1e4,(()=>(this.Yt()&&(this.state=3),Promise.resolve()))),this.listener.Et())))})),this.stream.Tt((s=>{r((()=>this.cn(s)))})),this.stream.onMessage((s=>{r((()=>++this.jt==1?this.hn(s):this.onNext(s)))}))}Zt(){this.state=5,this.Ht.kt((async()=>{this.state=0,this.start()}))}cn(e){return L(Sl,`close with error: ${e}`),this.stream=null,this.close(4,e)}an(e){return t=>{this.Ct.enqueueAndForget((()=>this.Wt===e?t():(L(Sl,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class ey extends Ld{constructor(e,t,r,s,i,a){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,r,s,a),this.serializer=i}En(e,t){return this.connection.vt("Listen",e,t)}hn(e){return this.onNext(e)}onNext(e){this.Ht.reset();const t=N_(this.serializer,e),r=(function(i){if(!("targetChange"in i))return $.min();const a=i.targetChange;return a.targetIds&&a.targetIds.length?$.min():a.readTime?et(a.readTime):$.min()})(e);return this.listener.Tn(t,r)}Pn(e){const t={};t.database=Ta(this.serializer),t.addTarget=(function(i,a){let c;const l=a.target;if(c=Pn(l)?{pipelineQuery:M_(i,l)}:md(l)?{documents:D_(i,l)}:{query:x_(i,l).Se},c.targetId=a.targetId,a.resumeToken.approximateByteSize()>0){c.resumeToken=Ad(i,a.resumeToken);const h=wa(i,a.expectedCount);h!==null&&(c.expectedCount=h)}else if(a.snapshotVersion.compareTo($.min())>0){c.readTime=ts(i,a.snapshotVersion.toTimestamp());const h=wa(i,a.expectedCount);h!==null&&(c.expectedCount=h)}return c})(this.serializer,e);const r=L_(this.serializer,e);r&&(t.labels=r),this.nn(t)}In(e){const t={};t.database=Ta(this.serializer),t.removeTarget=e,this.nn(t)}}class ty extends Ld{constructor(e,t,r,s,i,a){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,r,s,a),this.serializer=i}get Rn(){return this.jt>0}start(){this.lastStreamToken=void 0,super.start()}_n(){this.Rn&&this.An([])}En(e,t){return this.connection.vt("Write",e,t)}hn(e){return U(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,U(!e.writeResults||e.writeResults.length===0,55816),this.listener.Vn()}onNext(e){U(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.Ht.reset();const t=k_(e.writeResults,e.commitTime),r=et(e.commitTime);return this.listener.dn(r,t)}fn(){const e={};e.database=Ta(this.serializer),this.nn(e)}An(e){const t={streamToken:this.lastStreamToken,writes:e.map((r=>Sd(this.serializer,r)))};this.nn(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ny{}class ry extends ny{constructor(e,t,r,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=r,this.serializer=s,this.mn=!1}pn(){if(this.mn)throw new k(S.FAILED_PRECONDITION,"The client has already been terminated.")}nt(e,t,r,s){return this.pn(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([i,a])=>this.connection.nt(e,Ea(t,r),s,i,a))).catch((i=>{throw i.name==="FirebaseError"?(i.code===S.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new k(S.UNKNOWN,i.toString())}))}_t(e,t,r,s,i){return this.pn(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([a,c])=>this.connection._t(e,Ea(t,r),s,a,c,i))).catch((a=>{throw a.name==="FirebaseError"?(a.code===S.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new k(S.UNKNOWN,a.toString())}))}terminate(){this.mn=!0,this.connection.terminate()}}function sy(n,e,t,r){return new ry(n,e,t,r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const iy="ComponentProvider",Cl=new Map;function oy(n,e,t,r,s){return new Fg(n,e,t,s.host,s.ssl,s.experimentalForceLongPolling,s.experimentalAutoDetectLongPolling,Od(s.experimentalLongPollingOptions),s.useFetchStreams,s.isUsingEmulator,r,s._customHeaders,s.grpcFlowControlWindow)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vl={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},Md=41943040;class Be{static withCacheSize(e){return new Be(e,Be.DEFAULT_COLLECTION_PERCENTILE,Be.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,r){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=r}}Be.DEFAULT_COLLECTION_PERCENTILE=10,Be.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Be.DEFAULT=new Be(Md,Be.DEFAULT_COLLECTION_PERCENTILE,Be.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Be.DISABLED=new Be(-1,0,0);/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oo{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=r=>this.gn(r),this.yn=r=>t.writeSequenceNumber(r))}gn(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.yn&&this.yn(e),e}}oo.wn=-1;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ay="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class cy{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _r(n){if(n.code!==S.FAILED_PRECONDITION||n.message!==ay)throw n;L("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class N{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&F(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new N(((r,s)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(r,s)},this.catchCallback=i=>{this.wrapFailure(t,i).next(r,s)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof N?t:N.resolve(t)}catch(t){return N.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):N.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):N.reject(t)}static resolve(e){return new N(((t,r)=>{t(e)}))}static reject(e){return new N(((t,r)=>{r(e)}))}static waitFor(e){return new N(((t,r)=>{let s=0,i=0,a=!1;e.forEach((c=>{++s,c.next((()=>{++i,a&&i===s&&t()}),(l=>r(l)))})),a=!0,i===s&&t()}))}static or(e){let t=N.resolve(!1);for(const r of e)t=t.next((s=>s?N.resolve(s):r()));return t}static forEach(e,t){const r=[];return e.forEach(((s,i)=>{r.push(t.call(this,s,i))})),this.waitFor(r)}static mapArray(e,t){return new N(((r,s)=>{const i=e.length,a=new Array(i);let c=0;for(let l=0;l<i;l++){const h=l;t(e[h]).next((f=>{a[h]=f,++c,c===i&&r(a)}),(f=>s(f)))}}))}static doWhile(e,t){return new N(((r,s)=>{const i=()=>{e()===!0?t().next((()=>{i()}),s):r()};i()}))}}function uy(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function yr(n){return n.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nl="LruGarbageCollector",ly=1048576;function kl([n,e],[t,r]){const s=Q(n,t);return s===0?Q(e,r):s}class hy{constructor(e){this.Yn=e,this.buffer=new _e(kl),this.Zn=0}Xn(){return++this.Zn}er(e){const t=[e,this.Xn()];if(this.buffer.size<this.Yn)this.buffer=this.buffer.add(t);else{const r=this.buffer.last();kl(t,r)<0&&(this.buffer=this.buffer.delete(r).add(t))}}get maxValue(){return this.buffer.last()[0]}}class dy{constructor(e,t,r){this.garbageCollector=e,this.asyncQueue=t,this.localStore=r,this.tr=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.nr(6e4)}stop(){this.tr&&(this.tr.cancel(),this.tr=null)}get started(){return this.tr!==null}nr(e){L(Nl,`Garbage collection scheduled in ${e}ms`),this.tr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.tr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){yr(t)?L(Nl,"Ignoring IndexedDB error during garbage collection: ",t):await _r(t)}await this.nr(3e5)}))}}class fy{constructor(e,t){this.rr=e,this.params=t}calculateTargetCount(e,t){return this.rr.ir(e).next((r=>Math.floor(t/100*r)))}nthSequenceNumber(e,t){if(t===0)return N.resolve(oo.wn);const r=new hy(t);return this.rr.forEachTarget(e,(s=>r.er(s.sequenceNumber))).next((()=>this.rr.sr(e,(s=>r.er(s))))).next((()=>r.maxValue))}removeTargets(e,t,r){return this.rr.removeTargets(e,t,r)}removeOrphanedDocuments(e,t){return this.rr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(L("LruGarbageCollector","Garbage collection skipped; disabled"),N.resolve(Vl)):this.getCacheSize(e).next((r=>r<this.params.cacheSizeCollectionThreshold?(L("LruGarbageCollector",`Garbage collection skipped; Cache size ${r} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Vl):this._r(e,t)))}getCacheSize(e){return this.rr.getCacheSize(e)}_r(e,t){let r,s,i,a,c,l,h;const f=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((m=>(m>this.params.maximumSequenceNumbersToCollect?(L("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${m}`),s=this.params.maximumSequenceNumbersToCollect):s=m,a=Date.now(),this.nthSequenceNumber(e,s)))).next((m=>(r=m,c=Date.now(),this.removeTargets(e,r,t)))).next((m=>(i=m,l=Date.now(),this.removeOrphanedDocuments(e,r)))).next((m=>(h=Date.now(),Jn()<=Y.DEBUG&&L("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${a-f}ms
	Determined least recently used ${s} in `+(c-a)+`ms
	Removed ${i} targets in `+(l-c)+`ms
	Removed ${m} documents in `+(h-l)+`ms
Total Duration: ${h-f}ms`),N.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:i,documentsRemoved:m}))))}}function py(n,e){return new fy(n,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ud="firestore.googleapis.com",Dl=!0;class xl{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new k(S.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=Ud,this.ssl=Dl}else this.host=e.host,this.ssl=e.ssl??Dl;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e._customHeaders&&(this._customHeaders={...e._customHeaders}),e.cacheSizeBytes===void 0)this.cacheSizeBytes=Md;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<ly)throw new k(S.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}if(Lg("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Od(e.experimentalLongPollingOptions??{}),(function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new k(S.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new k(S.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new k(S.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams,e.grpcFlowControlWindow!==void 0){if(typeof e.grpcFlowControlWindow!="number"||e.grpcFlowControlWindow<=0||e.grpcFlowControlWindow>2147483647||!Number.isInteger(e.grpcFlowControlWindow))throw new k(S.INVALID_ARGUMENT,"grpcFlowControlWindow must be a positive integer and cannot exceed 2147483647");this.grpcFlowControlWindow=e.grpcFlowControlWindow}}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(r,s){return r.timeoutSeconds===s.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams&&this.grpcFlowControlWindow===e.grpcFlowControlWindow&&(function(r,s){if(r===s)return!0;if(!r||!s)return!1;const i=Object.keys(r),a=Object.keys(s);if(i.length!==a.length)return!1;for(const c of i)if(r[c]!==s[c])return!1;return!0})(this._customHeaders,e._customHeaders)}}let ao=class{constructor(e,t,r,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new xl({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new k(S.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new k(S.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new xl(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(r){if(!r)return new j_;switch(r.type){case"firstParty":return new G_(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new k(S.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const r=Cl.get(t);r&&(L(iy,"Removing Datastore"),Cl.delete(t),r.terminate())})(this),Promise.resolve()}};function my(n,e,t,r={}){var h;n=Pe(n,ao);const s=$n(e),i=n._getSettings(),a={...i,emulatorOptions:n._getEmulatorOptions()},c=`${e}:${t}`;s&&xa(`https://${c}`),i.host!==Ud&&i.host!==c&&at("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const l={...i,host:c,ssl:s,emulatorOptions:r};if(!xn(l,a)&&(n._setSettings(l),r.mockUserToken)){let f,m;if(typeof r.mockUserToken=="string")f=r.mockUserToken,m=Ne.MOCK_USER;else{f=Dh(r.mockUserToken,(h=n._app)==null?void 0:h.options.projectId);const y=r.mockUserToken.sub||r.mockUserToken.user_id;if(!y)throw new k(S.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");m=new Ne(y)}n._authCredentials=new z_(new xd(f,m))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ot{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new Ot(this.firestore,e,this._query)}}class ie{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new en(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new ie(this.firestore,e,this._key)}toJSON(){return{type:ie._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,r){if(Ss(t,ie._jsonSchema))return new ie(e,r||null,new B(Z.fromString(t.referencePath)))}}ie._jsonSchemaVersion="firestore/documentReference/1.0",ie._jsonSchema={type:ge("string",ie._jsonSchemaVersion),referencePath:ge("string")};class en extends Ot{constructor(e,t,r){super(e,t,ro(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new ie(this.firestore,null,new B(e))}withConverter(e){return new en(this.firestore,e,this._path)}}function nR(n,e,...t){if(n=te(n),zh("collection","path",e),n instanceof ao){const r=Z.fromString(e,...t);return ol(r),new en(n,null,r)}{if(!(n instanceof ie||n instanceof en))throw new k(S.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(Z.fromString(e,...t));return ol(r),new en(n.firestore,null,r)}}function gy(n,e,...t){if(n=te(n),arguments.length===1&&(e=Ua.newId()),zh("doc","path",e),n instanceof ao){const r=Z.fromString(e,...t);return il(r),new ie(n,null,new B(r))}{if(!(n instanceof ie||n instanceof en))throw new k(S.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(Z.fromString(e,...t));return il(r),new ie(n.firestore,n instanceof en?n.converter:null,new B(r))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class je{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(r,s){if(r.length!==s.length)return!1;for(let i=0;i<r.length;++i)if(r[i]!==s[i])return!1;return!0})(this._values,e._values)}toJSON(){return{type:je._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(Ss(e,je._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new je(e.vectorValues);throw new k(S.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}je._jsonSchemaVersion="firestore/vectorValue/1.0",je._jsonSchema={type:ge("string",je._jsonSchemaVersion),vectorValues:ge("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _y=/^__.*__$/;class yy{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return this.fieldMask!==null?new yn(e,this.data,this.fieldMask,t,this.fieldTransforms):new Ns(e,this.data,t,this.fieldTransforms)}}class Fd{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return new yn(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function Bd(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw F(40011,{dataSource:n})}}class Ga{constructor(e,t,r,s,i,a){this.settings=e,this.databaseId=t,this.serializer=r,this.ignoreUndefinedProperties=s,i===void 0&&this.validatePath(),this.fieldTransforms=i||[],this.fieldMask=a||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}contextWith(e){return new Ga({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}childContextForField(e){var s;const t=(s=this.path)==null?void 0:s.child(e),r=this.contextWith({path:t,arrayElement:!1});return r.validatePathSegment(e),r}childContextForFieldPath(e){var s;const t=(s=this.path)==null?void 0:s.child(e),r=this.contextWith({path:t,arrayElement:!1});return r.validatePath(),r}childContextForArray(e){return this.contextWith({path:void 0,arrayElement:!0})}createError(e){return Oi(e,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}validatePath(){if(this.path)for(let e=0;e<this.path.length;e++)this.validatePathSegment(this.path.get(e))}validatePathSegment(e){if(e.length===0)throw this.createError("Document fields must not be empty");if(Bd(this.dataSource)&&_y.test(e))throw this.createError('Document fields cannot begin and end with "__"')}}class wy{constructor(e,t,r){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=r||io(e)}createContext(e,t,r,s=!1){return new Ga({dataSource:e,methodName:t,targetDoc:r,path:Ze.emptyPath(),arrayElement:!1,hasConverter:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function wr(n){const e=n._freezeSettings(),t=io(n._databaseId);return new wy(n._databaseId,!!e.ignoreUndefinedProperties,t)}function co(n,e,t,r,s,i={}){const a=n.createContext(i.merge||i.mergeFields?2:0,e,t,s);Xa("Data must be an object, but it was:",a,r);const c=qd(r,a);let l,h;if(i.merge)l=new Ye(a.fieldMask),h=a.fieldTransforms;else if(i.mergeFields){const f=[];for(const m of i.mergeFields){const y=hn(e,m,t);if(!a.contains(y))throw new k(S.INVALID_ARGUMENT,`Field '${y}' is specified in your field mask but missing from your input data.`);Hd(f,y)||f.push(y)}l=new Ye(f),h=a.fieldTransforms.filter((m=>l.covers(m.field)))}else l=null,h=a.fieldTransforms;return new yy(new ke(c),l,h)}class uo extends Os{_toFieldTransform(e){if(e.dataSource!==2)throw e.dataSource===1?e.createError(`${this._methodName}() can only appear at the top level of your update data`):e.createError(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof uo}}class Ka extends Os{_toFieldTransform(e){return new rd(e.path,new ds)}isEqual(e){return e instanceof Ka}}class Qa extends Os{constructor(e,t){super(e),this.ur=t}_toFieldTransform(e){const t=new hr(e.serializer,eo(e.serializer,this.ur));return new rd(e.path,t)}isEqual(e){return e instanceof Qa&&(this.ur===e.ur||Number.isNaN(this.ur)&&Number.isNaN(e.ur))}}function Ya(n,e,t,r){const s=n.createContext(1,e,t);Xa("Data must be an object, but it was:",s,r);const i=[],a=ke.empty();_n(r,((l,h)=>{const f=zd(e,l,t);h=te(h);const m=s.childContextForFieldPath(f);if(h instanceof uo)i.push(f);else{const y=ln(h,m);y!=null&&(i.push(f),a.set(f,y))}}));const c=new Ye(i);return new Fd(a,c,s.fieldTransforms)}function Ja(n,e,t,r,s,i){const a=n.createContext(1,e,t),c=[hn(e,r,t)],l=[s];if(i.length%2!=0)throw new k(S.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let y=0;y<i.length;y+=2)c.push(hn(e,i[y])),l.push(i[y+1]);const h=[],f=ke.empty();for(let y=c.length-1;y>=0;--y)if(!Hd(h,c[y])){const b=c[y];let V=l[y];V=te(V);const M=a.childContextForFieldPath(b);if(V instanceof uo)h.push(b);else{const x=ln(V,M);x!=null&&(h.push(b),f.set(b,x))}}const m=new Ye(h);return new Fd(f,m,a.fieldTransforms)}function Ey(n,e,t,r=!1){return ln(t,n.createContext(r?4:3,e))}function ln(n,e,t){if(jd(n=te(n)))return Xa("Unsupported field value:",e,n),qd(n,e);if(n instanceof Os)return(function(s,i){if(!Bd(i.dataSource))throw i.createError(`${s._methodName}() can only be used with update() and set()`);if(!i.path)throw i.createError(`${s._methodName}() is not currently supported inside arrays`);const a=s._toFieldTransform(i);a&&i.fieldTransforms.push(a)})(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.arrayElement&&e.dataSource!==4)throw e.createError("Nested arrays are not supported");return(function(s,i){const a=[];let c=0;for(const l of s){let h=ln(l,i.childContextForArray(c));h==null&&(h={nullValue:"NULL_VALUE"}),a.push(h),c++}return{arrayValue:{values:a}}})(n,e)}return(function(s,i,a){if((s=te(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return eo(i.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const c=ee.fromDate(s);return{timestampValue:ts(i.serializer,c)}}if(s instanceof ee){const c=new ee(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:ts(i.serializer,c)}}if($d(s)){const c=ee.fromInstant(s),l=new ee(c.seconds,1e3*Math.floor(c.nanoseconds/1e3));return{timestampValue:ts(i.serializer,l)}}if(s instanceof _t)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof Qe)return{bytesValue:Ad(i.serializer,s._byteString)};if(s instanceof ie){const c=i.databaseId,l=s.firestore._databaseId;if(!l.isEqual(c))throw i.createError(`Document reference is for database ${l.projectId}/${l.database} but should be for database ${c.projectId}/${c.database}`);return{referenceValue:Ha(s.firestore._databaseId||i.databaseId,s._key.path)}}if(s instanceof je)return(function(l,h){const f=l instanceof je?l.toArray():l;return{mapValue:{fields:{[Yh]:{stringValue:Jh},[ls]:{arrayValue:{values:f.map((y=>{if(typeof y!="number")throw h.createError("VectorValues must only contain numeric values.");return Zi(h.serializer,y)}))}}}}}})(s,i);if(kd(s))return s._toProto(i.serializer);throw i.createError(`Unsupported field value: ${Ji(s)}`)})(n,e)}function qd(n,e){const t={};return jh(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):_n(n,((r,s)=>{const i=ln(s,e.childContextForField(r));i!=null&&(t[r]=i)})),{mapValue:{fields:t}}}function $d(n){if(typeof n!="object"||n===null)return!1;if(typeof Temporal<"u"&&typeof Temporal.Instant=="function"&&n instanceof Temporal.Instant)return!0;const e=n;return e[Symbol.toStringTag]==="Temporal.Instant"&&typeof e.t=="bigint"}function jd(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof ee||n instanceof _t||n instanceof Qe||n instanceof ie||n instanceof Os||n instanceof je||$d(n)||kd(n))}function Xa(n,e,t){if(!jd(t)||!bs(t)){const r=Ji(t);throw r==="an object"?e.createError(n+" a custom object"):e.createError(n+" "+r)}}function hn(n,e,t){if((e=te(e))instanceof gr)return e._internalPath;if(typeof e=="string")return zd(n,e);throw Oi("Field path arguments must be of type string or ",n,!1,void 0,t)}const Ty=new RegExp("[~\\*/\\[\\]]");function zd(n,e,t){if(e.search(Ty)>=0)throw Oi(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new gr(...e.split("."))._internalPath}catch{throw Oi(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function Oi(n,e,t,r,s){const i=r&&!r.isEmpty(),a=s!==void 0;let c=`Function ${e}() called with invalid data`;t&&(c+=" (via `toFirestore()`)"),c+=". ";let l="";return(i||a)&&(l+=" (found",i&&(l+=` in field ${r}`),a&&(l+=` in document ${s}`),l+=")"),new k(S.INVALID_ARGUMENT,c+n+l)}function Hd(n,e){return n.some((t=>t.isEqual(e)))}function Wd(n){return typeof n._readUserData=="function"}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xe{constructor(e){this.optionDefinitions=e}_getKnownOptions(e,t){const r=ke.empty();for(const s in this.optionDefinitions)if(this.optionDefinitions.hasOwnProperty(s)){const i=this.optionDefinitions[s];if(s in e){const a=e[s];let c;i.nestedOptions&&bs(a)?c={mapValue:{fields:new xe(i.nestedOptions).getOptionsProto(t,a)}}:a&&(c=ln(a,t)??void 0),c&&r.set(Ze.fromServerFormat(i.serverName),c)}}return r}getOptionsProto(e,t,r){const s=this._getKnownOptions(t,e);if(r){const i=new Map(Og(r,((a,c)=>[Ze.fromServerFormat(c),a!==void 0?ln(a,e):null])));s.setAll(i)}return s.value.mapValue.fields??{}}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Iy(n){return typeof n=="object"&&n!==null&&!!("nullValue"in n&&(n.nullValue===null||n.nullValue==="NULL_VALUE")||"booleanValue"in n&&(n.booleanValue===null||typeof n.booleanValue=="boolean")||"integerValue"in n&&(n.integerValue===null||typeof n.integerValue=="number"||typeof n.integerValue=="string")||"doubleValue"in n&&(n.doubleValue===null||typeof n.doubleValue=="number")||"timestampValue"in n&&(n.timestampValue===null||(function(t){return typeof t=="object"&&t!==null&&"seconds"in t&&(t.seconds===null||typeof t.seconds=="number"||typeof t.seconds=="string")&&"nanos"in t&&(t.nanos===null||typeof t.nanos=="number")})(n.timestampValue))||"stringValue"in n&&(n.stringValue===null||typeof n.stringValue=="string")||"bytesValue"in n&&(n.bytesValue===null||n.bytesValue instanceof Uint8Array)||"referenceValue"in n&&(n.referenceValue===null||typeof n.referenceValue=="string")||"geoPointValue"in n&&(n.geoPointValue===null||(function(t){return typeof t=="object"&&t!==null&&"latitude"in t&&(t.latitude===null||typeof t.latitude=="number")&&"longitude"in t&&(t.longitude===null||typeof t.longitude=="number")})(n.geoPointValue))||"arrayValue"in n&&(n.arrayValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("values"in t)||t.values!==null&&!Array.isArray(t.values))})(n.arrayValue))||"mapValue"in n&&(n.mapValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("fields"in t)||t.fields!==null&&!bs(t.fields))})(n.mapValue))||"fieldReferenceValue"in n&&(n.fieldReferenceValue===null||typeof n.fieldReferenceValue=="string")||"functionValue"in n&&(n.functionValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("name"in t)||t.name!==null&&typeof t.name!="string"||!("args"in t)||t.args!==null&&!Array.isArray(t.args))})(n.functionValue))||"pipelineValue"in n&&(n.pipelineValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("stages"in t)||t.stages!==null&&!Array.isArray(t.stages))})(n.pipelineValue)))}function rR(){return new Ka("serverTimestamp")}function sR(n){return new Qa("increment",n)}function vy(n){return new je(n)}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function D(n){let e;return n instanceof Hn?n:(e=bs(n)?Sy(n):n instanceof Array?Cy(n):Gd(n,void 0),e)}function ta(n){if(n instanceof Hn)return n;if(n instanceof je)return ws(n);if(Array.isArray(n))return ws(vy(n));throw new Error("Unsupported value: "+typeof n)}function Za(n){return $g(n)?wi(n):D(n)}class Hn{constructor(){this._protoValueType="ProtoValue"}add(e){return new C("add",[this,D(e)],"add")}asBoolean(){if(this instanceof dn)return this;if(this instanceof Tr)return new Qd(this);if(this instanceof Er)return new by(this);if(this instanceof C)return new Kd(this);throw new k("invalid-argument",`Conversion of type ${typeof this} to BooleanExpression not supported.`)}subtract(e){return new C("subtract",[this,D(e)],"subtract")}multiply(e){return new C("multiply",[this,D(e)],"multiply")}divide(e){return new C("divide",[this,D(e)],"divide")}mod(e){return new C("mod",[this,D(e)],"mod")}equal(e){return new C("equal",[this,D(e)],"equal").asBoolean()}notEqual(e){return new C("not_equal",[this,D(e)],"notEqual").asBoolean()}lessThan(e){return new C("less_than",[this,D(e)],"lessThan").asBoolean()}lessThanOrEqual(e){return new C("less_than_or_equal",[this,D(e)],"lessThanOrEqual").asBoolean()}greaterThan(e){return new C("greater_than",[this,D(e)],"greaterThan").asBoolean()}greaterThanOrEqual(e){return new C("greater_than_or_equal",[this,D(e)],"greaterThanOrEqual").asBoolean()}arrayConcat(e,...t){const r=[e,...t].map((s=>D(s)));return new C("array_concat",[this,...r],"arrayConcat")}arrayContains(e){return new C("array_contains",[this,D(e)],"arrayContains").asBoolean()}arrayContainsAll(e){const t=Array.isArray(e)?new Qr(e.map(D),"arrayContainsAll"):e;return new C("array_contains_all",[this,t],"arrayContainsAll").asBoolean()}arrayContainsAny(e){const t=Array.isArray(e)?new Qr(e.map(D),"arrayContainsAny"):e;return new C("array_contains_any",[this,t],"arrayContainsAny").asBoolean()}arrayReverse(){return new C("array_reverse",[this])}arrayLength(){return new C("array_length",[this],"arrayLength")}equalAny(e){const t=Array.isArray(e)?new Qr(e.map(D),"equalAny"):e;return new C("equal_any",[this,t],"equalAny").asBoolean()}notEqualAny(e){const t=Array.isArray(e)?new Qr(e.map(D),"notEqualAny"):e;return new C("not_equal_any",[this,t],"notEqualAny").asBoolean()}exists(){return new C("exists",[this],"exists").asBoolean()}charLength(){return new C("char_length",[this],"charLength")}like(e){return new C("like",[this,D(e)],"like").asBoolean()}regexContains(e){return new C("regex_contains",[this,D(e)],"regexContains").asBoolean()}regexFind(e){return new C("regex_find",[this,D(e)],"regexFind")}regexFindAll(e){return new C("regex_find_all",[this,D(e)],"regexFindAll")}regexMatch(e){return new C("regex_match",[this,D(e)],"regexMatch").asBoolean()}stringContains(e){return new C("string_contains",[this,D(e)],"stringContains").asBoolean()}startsWith(e){return new C("starts_with",[this,D(e)],"startsWith").asBoolean()}endsWith(e){return new C("ends_with",[this,D(e)],"endsWith").asBoolean()}toLower(){return new C("to_lower",[this],"toLower")}toUpper(){return new C("to_upper",[this],"toUpper")}trim(e){const t=[this];return e&&t.push(D(e)),new C("trim",t,"trim")}ltrim(e){const t=[this];return e&&t.push(D(e)),new C("ltrim",t,"ltrim")}rtrim(e){const t=[this];return e&&t.push(D(e)),new C("rtrim",t,"rtrim")}type(){return new C("type",[this])}isType(e){return new C("is_type",[this,ws(e)],"isType").asBoolean()}stringConcat(e,...t){const r=[e,...t].map(D);return new C("string_concat",[this,...r],"stringConcat")}stringIndexOf(e){return new C("string_index_of",[this,D(e)],"stringIndexOf")}stringRepeat(e){return new C("string_repeat",[this,D(e)],"stringRepeat")}stringReplaceAll(e,t){return new C("string_replace_all",[this,D(e),D(t)],"stringReplaceAll")}stringReplaceOne(e,t){return new C("string_replace_one",[this,D(e),D(t)],"stringReplaceOne")}concat(e,...t){const r=[e,...t].map(D);return new C("concat",[this,...r],"concat")}reverse(){return new C("reverse",[this],"reverse")}arrayFilter(e,t){return new C("array_filter",[this,D(e),t],"arrayFilter")}arrayTransform(e,t){return new C("array_transform",[this,D(e),t],"arrayTransform")}arrayTransformWithIndex(e,t,r){return new C("array_transform",[this,D(e),D(t),r],"arrayTransformWithIndex")}arraySlice(e,t){const r=[this,D(e)];return t!==void 0&&r.push(D(t)),new C("array_slice",r,"arraySlice")}arrayFirst(){return new C("array_first",[this],"arrayFirst")}arrayFirstN(e){return new C("array_first_n",[this,D(e)],"arrayFirstN")}arrayLast(){return new C("array_last",[this],"arrayLast")}arrayLastN(e){return new C("array_last_n",[this,D(e)],"arrayLastN")}arrayMaximum(){return new C("maximum",[this],"arrayMaximum")}arrayMaximumN(e){return new C("maximum_n",[this,D(e)],"arrayMaximumN")}arrayMinimum(){return new C("minimum",[this],"arrayMinimum")}arrayMinimumN(e){return new C("minimum_n",[this,D(e)],"arrayMinimumN")}arrayIndexOf(e){return new C("array_index_of",[this,D(e),D("first")],"arrayIndexOf")}arrayLastIndexOf(e){return new C("array_index_of",[this,D(e),D("last")],"arrayLastIndexOf")}arrayIndexOfAll(e){return new C("array_index_of_all",[this,D(e)],"arrayIndexOfAll")}byteLength(){return new C("byte_length",[this],"byteLength")}ceil(){return new C("ceil",[this])}floor(){return new C("floor",[this])}abs(){return new C("abs",[this])}exp(){return new C("exp",[this])}mapGet(e){return new C("map_get",[this,ws(e)],"mapGet")}mapSet(e,t,...r){const s=[this,D(e),D(t),...r.map(D)];return new C("map_set",s,"mapSet")}mapKeys(){return new C("map_keys",[this],"mapKeys")}mapValues(){return new C("map_values",[this],"mapValues")}mapEntries(){return new C("map_entries",[this],"mapEntries")}getField(e){return new C("get_field",[this,D(e)],"get_field")}count(){return Ke._create("count",[this],"count")}sum(){return Ke._create("sum",[this],"sum")}average(){return Ke._create("average",[this],"average")}minimum(){return Ke._create("minimum",[this],"minimum")}maximum(){return Ke._create("maximum",[this],"maximum")}first(){return Ke._create("first",[this],"first")}last(){return Ke._create("last",[this],"last")}arrayAgg(){return Ke._create("array_agg",[this],"arrayAgg")}arrayAggDistinct(){return Ke._create("array_agg_distinct",[this],"arrayAggDistinct")}countDistinct(){return Ke._create("count_distinct",[this],"countDistinct")}logicalMaximum(e,...t){const r=[e,...t];return new C("maximum",[this,...r.map(D)],"logicalMaximum")}logicalMinimum(e,...t){const r=[e,...t];return new C("minimum",[this,...r.map(D)],"minimum")}vectorLength(){return new C("vector_length",[this],"vectorLength")}cosineDistance(e){return new C("cosine_distance",[this,ta(e)],"cosineDistance")}dotProduct(e){return new C("dot_product",[this,ta(e)],"dotProduct")}euclideanDistance(e){return new C("euclidean_distance",[this,ta(e)],"euclideanDistance")}unixMicrosToTimestamp(){return new C("unix_micros_to_timestamp",[this],"unixMicrosToTimestamp")}timestampToUnixMicros(){return new C("timestamp_to_unix_micros",[this],"timestampToUnixMicros")}unixMillisToTimestamp(){return new C("unix_millis_to_timestamp",[this],"unixMillisToTimestamp")}timestampToUnixMillis(){return new C("timestamp_to_unix_millis",[this],"timestampToUnixMillis")}unixSecondsToTimestamp(){return new C("unix_seconds_to_timestamp",[this],"unixSecondsToTimestamp")}timestampToUnixSeconds(){return new C("timestamp_to_unix_seconds",[this],"timestampToUnixSeconds")}timestampAdd(e,t){return new C("timestamp_add",[this,D(e),D(t)],"timestampAdd")}timestampSubtract(e,t){return new C("timestamp_subtract",[this,D(e),D(t)],"timestampSubtract")}timestampDiff(e,t){return new C("timestamp_diff",[this,Za(e),D(t)],"timestampDiff")}timestampExtract(e,t){const r=[this,D(e)];return t&&r.push(D(t)),new C("timestamp_extract",r,"timestampExtract")}documentId(){return new C("document_id",[this],"documentId")}parent(){return new C("parent",[this],"parent")}substring(e,t){const r=D(e);return new C("substring",t===void 0?[this,r]:[this,r,D(t)],"substring")}arrayGet(e){return new C("array_get",[this,D(e)],"arrayGet")}isError(){return new C("is_error",[this],"isError").asBoolean()}ifError(e){const t=new C("if_error",[this,D(e)],"ifError");return e instanceof dn?t.asBoolean():t}isAbsent(){return new C("is_absent",[this],"isAbsent").asBoolean()}mapRemove(e){return new C("map_remove",[this,D(e)],"mapRemove")}mapMerge(e,...t){const r=D(e),s=t.map(D);return new C("map_merge",[this,r,...s],"mapMerge")}pow(e){return new C("pow",[this,D(e)])}trunc(e){return e===void 0?new C("trunc",[this]):new C("trunc",[this,D(e)],"trunc")}round(e){return e===void 0?new C("round",[this]):new C("round",[this,D(e)],"round")}collectionId(){return new C("collection_id",[this])}length(){return new C("length",[this])}ln(){return new C("ln",[this])}sqrt(){return new C("sqrt",[this])}stringReverse(){return new C("string_reverse",[this])}ifAbsent(e){return new C("if_absent",[this,D(e)],"ifAbsent")}ifNull(e){return new C("if_null",[this,D(e)],"ifNull")}coalesce(e,...t){return new C("coalesce",[this,D(e),...t.map(D)],"coalesce")}join(e){return new C("join",[this,D(e)],"join")}log10(){return new C("log10",[this])}arraySum(){return new C("sum",[this])}split(e){return new C("split",[this,D(e)])}timestampTruncate(e,t){const r=[this,D(e)];return t&&r.push(D(t)),new C("timestamp_trunc",r)}ascending(){return Vy(this)}descending(){return Ny(this)}as(e){return new Ry(this,e,"as")}}class Ke{constructor(e,t){this.name=e,this.params=t,this.exprType="AggregateFunction",this._protoValueType="ProtoValue"}static _create(e,t,r){const s=new Ke(e,t);return s._methodName=r,s}as(e){return new Ay(this,e,"as")}_toProto(e){return{functionValue:{name:this.name,args:this.params.map((t=>t._toProto(e)))}}}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,this.params.forEach((t=>t._readUserData(e)))}}class Ay{constructor(e,t,r){this.aggregate=e,this.alias=t,this._methodName=r}_readUserData(e){this.aggregate._readUserData(e)}}class Ry{constructor(e,t,r){this.expr=e,this.alias=t,this._methodName=r,this.exprType="AliasedExpression",this.selectable=!0}_readUserData(e){this.expr._readUserData(e)}}class Qr extends Hn{constructor(e,t){super(),this.cr=e,this._methodName=t,this.expressionType="ListOfExpressions"}_toProto(e){return{arrayValue:{values:this.cr.map((t=>t._toProto(e)))}}}_readUserData(e){this.cr.forEach((t=>t._readUserData(e)))}}class Er extends Hn{constructor(e,t){super(),this.fieldPath=e,this._methodName=t,this.expressionType="Field",this.selectable=!0}get _fieldPath(){return this.fieldPath}get fieldName(){return this.fieldPath.canonicalString()}get alias(){return this.fieldName}get expr(){return this}geoDistance(e){return new C("geo_distance",[this,D(e)],"geoDistance")}_toProto(e){return{fieldReferenceValue:this.fieldPath.canonicalString()}}_readUserData(e){}}function wi(n){return Py(n,"field")}function Py(n,e){return new Er(typeof n=="string"?dt===n?$_()._internalPath:hn("field",n):n._internalPath,e)}class Tr extends Hn{constructor(e,t){super(),this.value=e,this._methodName=t,this.expressionType="Constant"}static _fromProto(e){const t=new Tr(e,void 0);return t._protoValue=e,t}_toProto(e){return U(this._protoValue!==void 0,237),this._protoValue}_getValue(){return this._protoValue}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,Iy(this._protoValue)||(this._protoValue=ln(this.value,e))}}function ws(n,e){return Gd(n,"constant")}function Gd(n,e){const t=new Tr(n,e);return typeof n=="boolean"?new Qd(t):t}class C extends Hn{constructor(e,t,r,s){super(),this.name=e,this.params=t,this.expressionType="Function",this._optionsProto=void 0,r!==void 0&&(this._methodName=r),s!==void 0&&(this._options=s)}get _optionsUtil(){return new xe({})}_toProto(e){const t={functionValue:{name:this.name,args:this.params.map((r=>r._toProto(e)))}};return this._optionsProto&&(t.functionValue.options=this._optionsProto),t}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,this.params.forEach((t=>t._readUserData(e))),this._options&&(this._optionsProto=this._optionsUtil.getOptionsProto(e,this._options))}}class dn extends Hn{get _methodName(){return this._expr._methodName}countIf(){return Ke._create("count_if",[this],"countIf")}not(){return new C("not",[this],"not").asBoolean()}conditional(e,t){return new C("conditional",[this,e,t],"conditional")}ifError(e){const t=D(e),r=new C("if_error",[this,t],"ifError");return t instanceof dn?r.asBoolean():r}_toProto(e){return this._expr._toProto(e)}_readUserData(e){this._expr._readUserData(e)}}class Kd extends dn{constructor(e){super(),this._expr=e,this.expressionType="Function"}}class Qd extends dn{constructor(e){super(),this._expr=e,this.expressionType="Constant"}_getValue(){return this._expr._getValue()}}class by extends dn{constructor(e){super(),this._expr=e,this.expressionType="Field"}}function Sy(n,e){const t=[];for(const r in n)if(Object.prototype.hasOwnProperty.call(n,r)){const s=n[r];t.push(ws(r)),t.push(D(s))}return new C("map",t,"map")}function Cy(n){return(function(t,r){return new C("array",t.map((s=>D(s))),r)})(n,"array")}function Vy(n){return new Yd(Za(n),"ascending","ascending")}function Ny(n){return new Yd(Za(n),"descending","descending")}class Yd{constructor(e,t,r){this.expr=e,this.direction=t,this._methodName=r,this._protoValueType="ProtoValue"}_toProto(e){return{mapValue:{fields:{direction:Dd(this.direction),expression:this.expr._toProto(e)}}}}_readUserData(e){this.expr._readUserData(e)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tt{constructor(e){this.optionsProto=void 0,{rawOptions:this.rawOptions,...this.knownOptions}=e}_readUserData(e){this.optionsProto=this._optionsUtil.getOptionsProto(e,this.knownOptions,this.rawOptions)}_toProto(e){return{name:this._name,options:this.optionsProto}}}class Jd extends tt{get _name(){return"add_fields"}get _optionsUtil(){return new xe({})}constructor(e,t){super(t),this.fields=e}_toProto(e){return{...super._toProto(e),args:[ys(e,this.fields)]}}_readUserData(e){super._readUserData(e),fn(this.fields,e)}}class Xd extends tt{get _name(){return"aggregate"}get _optionsUtil(){return new xe({})}constructor(e,t,r){super(r),this.groups=e,this.accumulators=t}_toProto(e){return{...super._toProto(e),args:[ys(e,this.accumulators),ys(e,this.groups)]}}_readUserData(e){super._readUserData(e),fn(this.groups,e),fn(this.accumulators,e)}}class Zd extends tt{get _name(){return"distinct"}get _optionsUtil(){return new xe({})}constructor(e,t){super(t),this.groups=e}_toProto(e){return{...super._toProto(e),args:[ys(e,this.groups)]}}_readUserData(e){super._readUserData(e),fn(this.groups,e)}}class lo extends tt{get _name(){return"collection"}get _optionsUtil(){return new xe({forceIndex:{serverName:"force_index"}})}constructor(e,t){super(t),this.hr=e.startsWith("/")?e:"/"+e}_toProto(e){return{...super._toProto(e),args:[{referenceValue:this.hr}]}}_readUserData(e){super._readUserData(e)}}class ho extends tt{get _name(){return"collection_group"}get _optionsUtil(){return new xe({forceIndex:{serverName:"force_index"}})}constructor(e,t){super(t),this.collectionId=e}_toProto(e){return{...super._toProto(e),args:[{referenceValue:""},{stringValue:this.collectionId}]}}_readUserData(e){super._readUserData(e)}}class ec extends tt{get _name(){return"database"}get _optionsUtil(){return new xe({})}_toProto(e){return{...super._toProto(e)}}_readUserData(e){super._readUserData(e)}}class tc extends tt{get _name(){return"documents"}get _optionsUtil(){return new xe({})}constructor(e,t){if(super(t),!e||e.length===0)throw new k(S.INVALID_ARGUMENT,"Empty document paths are not allowed in DocumentsSource");const r=e.map((i=>i.startsWith("/")?i:"/"+i)),s=new Set(r);if(s.size!==r.length)throw new k(S.INVALID_ARGUMENT,"Duplicate document paths are not allowed in DocumentsSource");this.Tr=r,this.Pr=s}_toProto(e){return{...super._toProto(e),args:this.Tr.map((t=>({referenceValue:t})))}}_readUserData(e){super._readUserData(e)}}class fo extends tt{get _name(){return"where"}get _optionsUtil(){return new xe({})}constructor(e,t){super(t),this.condition=e}_toProto(e){return{...super._toProto(e),args:[this.condition._toProto(e)]}}_readUserData(e){super._readUserData(e),fn(this.condition,e)}}class Un extends tt{get _name(){return"limit"}get _optionsUtil(){return new xe({})}constructor(e,t){U(!isNaN(e)&&e!==1/0&&e!==-1/0,34860),super(t),this.limit=e}_toProto(e){return{...super._toProto(e),args:[eo(e,this.limit)]}}}class Ol extends tt{get _name(){return"offset"}get _optionsUtil(){return new xe({})}constructor(e,t){super(t),this.offset=e}_toProto(e){return{...super._toProto(e),args:[eo(e,this.offset)]}}}class ky extends tt{get _name(){return"select"}get _optionsUtil(){return new xe({})}constructor(e,t){super(t),this.selections=e}_toProto(e){return{...super._toProto(e),args:[ys(e,this.selections)]}}_readUserData(e){super._readUserData(e),fn(this.selections,e)}}class Rt extends tt{get _name(){return"sort"}get _optionsUtil(){return new xe({})}constructor(e,t){super(t),this.orderings=e}_toProto(e){return{...super._toProto(e),args:this.orderings.map((t=>t._toProto(e)))}}_readUserData(e){super._readUserData(e),fn(this.orderings,e)}}class nc extends tt{get _name(){return"replace_with"}get _optionsUtil(){return new xe({})}constructor(e,t){super(t),this.map=e}_toProto(e){return{...super._toProto(e),args:[this.map._toProto(e),Dd(nc.Ir)]}}_readUserData(e){super._readUserData(e),fn(this.map,e)}}nc.Ir="full_replace";function fn(n,e){return Wd(n)?n._readUserData(e):Array.isArray(n)?n.forEach((t=>t._readUserData(e))):n instanceof Map?n.forEach((t=>t._readUserData(e))):Object.values(n).forEach((t=>t._readUserData(e))),n}/**
 * @license
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rs{constructor(e,t,r,s){this._db=e,this.userDataReader=t,this._userDataWriter=r,this.stages=s}Vr(e,t){const r=this.userDataReader.createContext(3,e);return Wd(t)?t._readUserData(r):Array.isArray(t)?t.forEach((s=>s._readUserData(r))):t.forEach((s=>s._readUserData(r))),t}where(e){const t=this.stages.map((r=>r));return this.Vr("where",e),t.push(new fo(e,{})),new rs(this._db,this.userDataReader,this._userDataWriter,t)}limit(e){const t=this.stages.map((r=>r));return t.push(new Un(e,{})),new rs(this._db,this.userDataReader,this._userDataWriter,t)}sort(e,...t){const r=this.stages.map((s=>s));return"orderings"in e?r.push(new Rt(this.Vr("sort",e.orderings),{})):r.push(new Rt(this.Vr("sort",[e,...t]),{})),new rs(this._db,this.userDataReader,this._userDataWriter,r)}dr(e){return{pipeline:{stages:this.stages.map((t=>t._toProto(e)))}}}}// Copyright 2024 Google LLC* @license
class Ue{constructor(e,t,r){this.serializer=e,this.stages=t,this.listenOptions=r,this.isCorePipeline=!0}getPipelineCollection(){return po(this)}getPipelineCollectionGroup(){return rc(this)}getPipelineCollectionId(){return Dy(this)}getPipelineDocuments(){return va(this)}getPipelineFlavor(){return(function(t){let r="exact";return t.stages.forEach(((s,i)=>{s._name!==Zd.name&&s._name!==Xd.name||(r="keyless"),s._name===ky.name&&r==="exact"&&(r="augmented"),s._name===Jd.name&&i<t.stages.length-1&&r==="exact"&&(r="augmented")})),r})(this)}getPipelineSourceType(){return tn(this)}}function tn(n){const e=n.stages[0];return e instanceof lo||e instanceof ho||e instanceof ec||e instanceof tc?e._name:"unknown"}function po(n){if(tn(n)==="collection")return n.stages[0].hr}function rc(n){if(tn(n)==="collection_group")return n.stages[0].collectionId}function Dy(n){switch(tn(n)){case"collection":return Z.fromString(po(n)).lastSegment();case"collection_group":return rc(n);default:return}}function va(n){if(tn(n)==="documents")return n.stages[0].Tr}class E{constructor(e,t){this.type=e,this.value=t}static mr(){return new E("ERROR",void 0)}static pr(){return new E("UNSET",void 0)}static gr(){return new E("NULL",cr)}static newValue(e){return Je(e)?new E("NULL",cr):(function(r){return!!r&&"booleanValue"in r})(e)?new E("BOOLEAN",e):ft(e)?new E("INT",e):bn(e)?new E("DOUBLE",e):(function(r){return!!r&&"timestampValue"in r&&!!r.timestampValue})(e)?new E("TIMESTAMP",e):(function(r){return!!r&&"stringValue"in r})(e)?new E("STRING",e):(function(r){return!!r&&"bytesValue"in r})(e)?new E("BYTES",e):e.referenceValue?new E("REFERENCE",e):e.geoPointValue?new E("GEO_POINT",e):lr(e)?new E("ARRAY",e):Ci(e)?new E("VECTOR",e):Cn(e)?new E("MAP",e):new E("ERROR",void 0)}yr(){return this.type==="ERROR"||this.type==="UNSET"}wr(){return this.type==="NULL"}}function ss(n){if(!n.yr())return n.value}function ef(n){return n instanceof dn?n._expr:n}function q(n){if((n=ef(n))instanceof Er)return new xy(n);if(n instanceof Tr)return new Oy(n);if(n instanceof Qr)return new Ly(n);if(n instanceof C){if(n.name==="add")return new Fy(n);if(n.name==="subtract")return new By(n);if(n.name==="multiply")return new qy(n);if(n.name==="divide")return new $y(n);if(n.name==="mod")return new jy(n);if(n.name==="and")return new zy(n);if(n.name==="equal")return new nw(n);if(n.name==="not_equal")return new rw(n);if(n.name==="less_than")return new sw(n);if(n.name==="less_than_or_equal")return new iw(n);if(n.name==="greater_than")return new ow(n);if(n.name==="greater_than_or_equal")return new aw(n);if(n.name==="array_concat")return new cw(n);if(n.name==="array_reverse")return new uw(n);if(n.name==="array_contains")return new lw(n);if(n.name==="array_contains_all")return new hw(n);if(n.name==="array_contains_any")return new dw(n);if(n.name==="array_length")return new fw(n);if(n.name==="array_element")return new pw(n);if(n.name==="equal_any")return new tf(n);if(n.name==="not_equal_any")return new Wy(n);if(n.name==="is_nan")return new Gy(n);if(n.name==="is_not_nan")return new Ky(n);if(n.name==="is_null")return new Qy(n);if(n.name==="is_not_null")return new Yy(n);if(n.name==="is_error")return new Jy(n);if(n.name==="exists")return new Xy(n);if(n.name==="not")return new mo(n);if(n.name==="or")return new Hy(n);if(n.name==="xor")return new sc(n);if(n.name==="conditional")return new Zy(n);if(n.name==="maximum")return new ew(n);if(n.name==="minimum")return new tw(n);if(n.name==="reverse")return new mw(n);if(n.name==="replace_first")return new gw(n);if(n.name==="replace_all")return new _w(n);if(n.name==="char_length")return new yw(n);if(n.name==="byte_length")return new ww(n);if(n.name==="like")return new Ew(n);if(n.name==="regex_contains")return new Tw(n);if(n.name==="regex_match")return new Iw(n);if(n.name==="string_contains")return new vw(n);if(n.name==="starts_with")return new Aw(n);if(n.name==="ends_with")return new Rw(n);if(n.name==="to_lower")return new Pw(n);if(n.name==="to_upper")return new bw(n);if(n.name==="trim")return new Sw(n);if(n.name==="string_concat")return new Cw(n);if(n.name==="map_get")return new Vw(n);if(n.name==="cosine_distance")return new Nw(n);if(n.name==="dot_product")return new kw(n);if(n.name==="euclidean_distance")return new Dw(n);if(n.name==="vector_length")return new xw(n);if(n.name==="unix_micros_to_timestamp")return new Fw(n);if(n.name==="timestamp_to_unix_micros")return new $w(n);if(n.name==="unix_millis_to_timestamp")return new Bw(n);if(n.name==="timestamp_to_unix_millis")return new jw(n);if(n.name==="unix_seconds_to_timestamp")return new qw(n);if(n.name==="timestamp_to_unix_seconds")return new zw(n);if(n.name==="timestamp_add")return new Hw(n);if(n.name==="timestamp_subtract")return new Ww(n)}throw new Error(`Unknown Expr : ${n}`)}class xy{constructor(e){this.expr=e}evaluate(e,t){if(this.expr.fieldName===dt)return E.newValue({referenceValue:_s(e.serializer,t.key)});if(this.expr.fieldName==="__update_time__")return E.newValue({timestampValue:yi(e.serializer,t.version)});if(this.expr.fieldName==="__create_time__")return E.newValue({timestampValue:yi(e.serializer,t.createTime)});const r=t.data.field(this.expr._fieldPath);return r?Xi(r)?E.newValue((function(i,a){if(i.serverTimestampBehavior==="estimate")return{timestampValue:yi(i.serializer,$.fromTimestamp(ar(a)))};if(i.serverTimestampBehavior==="previous"){const c=Cs(a);if(c)return c}return{nullValue:"NULL_VALUE"}})(e,r)):E.newValue(r):E.pr()}}class Oy{constructor(e){this.expr=e}evaluate(e,t){return E.newValue(this.expr._getValue())}}class Ly{constructor(e){this.expr=e}evaluate(e,t){const r=this.expr.cr.map((s=>q(s).evaluate(e,t)));return r.some((s=>s.yr()))?E.mr():E.newValue({arrayValue:{values:r.map((s=>s.value))}})}}function Se(n){return bn(n)?Number(n.doubleValue):Number(n.integerValue)}function Et(n){return BigInt(n.integerValue)}const My=BigInt("0x7fffffffffffffff"),Uy=-BigInt("0x8000000000000000");class Ls{constructor(e){this.expr=e}evaluate(e,t){U(this.expr.params.length>=2,24778);const r=q(this.expr.params[0]).evaluate(e,t),s=q(this.expr.params[1]).evaluate(e,t);let i=this.br(r,s);for(const a of this.expr.params.slice(2)){const c=q(a).evaluate(e,t);i=this.br(i,c)}return i}br(e,t){if(e.yr()||t.yr())return E.mr();if(e.wr()||t.wr())return E.gr();const r=e.value,s=t.value;if(!bn(r)&&!ft(r)||!bn(s)&&!ft(s))return E.mr();if(bn(r)||bn(s)){const i=this.Sr(r,s);return i?E.newValue(i):E.mr()}if(ft(r)&&ft(s)){const i=this.vr(r,s);return i===void 0?E.mr():typeof i=="number"?E.newValue({doubleValue:i}):i<Uy||i>My?E.mr():E.newValue({integerValue:`${i}`})}return E.mr()}}function Dt(n,e){return we(n)!==we(e)?"TYPE_MISMATCH":We(n)||We(e)?"NOT_EQ":Je(n)&&Je(e)?"EQ":Je(n)||Je(e)?"NULL":lr(n)&&lr(e)?(function(r,s){var a,c,l;if(((a=r.values)==null?void 0:a.length)!==((c=s.values)==null?void 0:c.length))return"NOT_EQ";let i=!1;for(let h=0;h<(((l=r.values)==null?void 0:l.length)??0);h++){const f=r.values[h],m=s.values[h];switch(Dt(f,m)){case"EQ":break;case"NOT_EQ":case"TYPE_MISMATCH":return"NOT_EQ";case"NULL":i=!0;break;default:F(44609,{Dr:f,Cr:m})}}return i?"NULL":"EQ"})(n.arrayValue,e.arrayValue):Ci(n)&&Ci(e)||Cn(n)&&Cn(e)?(function(r,s){const i=r.fields||{},a=s.fields||{};if(bi(i)!==bi(a))return"NOT_EQ";let c=!1;for(const l in i)if(i.hasOwnProperty(l)){if(a[l]===void 0)return"NOT_EQ";switch(Dt(i[l],a[l])){case"NOT_EQ":case"TYPE_MISMATCH":return"NOT_EQ";case"NULL":c=!0}}return c?"NULL":"EQ"})(n.mapValue,e.mapValue):(function(r,s){return nt(r,s,{u:!1,i:!0,o:!0})})(n,e)?"EQ":"NOT_EQ"}class Fy extends Ls{vr(e,t){return Et(e)+Et(t)}Sr(e,t){return{doubleValue:Se(e)+Se(t)}}}class By extends Ls{constructor(e){super(e),this.expr=e}vr(e,t){return Et(e)-Et(t)}Sr(e,t){return{doubleValue:Se(e)-Se(t)}}}class qy extends Ls{constructor(e){super(e),this.expr=e}vr(e,t){return Et(e)*Et(t)}Sr(e,t){return{doubleValue:Se(e)*Se(t)}}}class $y extends Ls{constructor(e){super(e),this.expr=e}vr(e,t){const r=Et(t);if(r!==BigInt(0))return Et(e)/r}Sr(e,t){const r=Se(t);return r===0?{doubleValue:us(r)?Number.NEGATIVE_INFINITY:Number.POSITIVE_INFINITY}:{doubleValue:Se(e)/r}}}class jy extends Ls{constructor(e){super(e),this.expr=e}vr(e,t){const r=Et(t);if(r!==BigInt(0))return Et(e)%r}Sr(e,t){const r=Se(t);if(r!==0)return{doubleValue:Se(e)%r}}}class zy{constructor(e){this.expr=e}evaluate(e,t){var i;let r=!1,s=!1;for(const a of this.expr.params){const c=q(a).evaluate(e,t);switch(c.type){case"BOOLEAN":if(!((i=c.value)!=null&&i.booleanValue))return E.newValue(Re);break;case"NULL":s=!0;break;default:r=!0}}return r?E.mr():s?E.gr():E.newValue(ze)}}class mo{constructor(e){this.expr=e}evaluate(e,t){var s;U(this.expr.params.length===1,9634);const r=q(this.expr.params[0]).evaluate(e,t);switch(r.type){case"BOOLEAN":return E.newValue({booleanValue:!((s=r.value)!=null&&s.booleanValue)});case"NULL":return E.gr();default:return E.mr()}}}class Hy{constructor(e){this.expr=e}evaluate(e,t){var i;let r=!1,s=!1;for(const a of this.expr.params){const c=q(a).evaluate(e,t);switch(c.type){case"BOOLEAN":if((i=c.value)!=null&&i.booleanValue)return E.newValue(ze);break;case"NULL":s=!0;break;default:r=!0}}return r?E.mr():s?E.gr():E.newValue(Re)}}class sc{constructor(e){this.expr=e}evaluate(e,t){var i;let r=!1,s=!1;for(const a of this.expr.params){const c=q(a).evaluate(e,t);switch(c.type){case"BOOLEAN":r=sc.xor(r,!!((i=c.value)!=null&&i.booleanValue));break;case"NULL":s=!0;break;default:return E.mr()}}return s?E.gr():E.newValue({booleanValue:r})}static xor(e,t){return(e||t)&&!(e&&t)}}class tf{constructor(e){this.expr=e}evaluate(e,t){var a,c;U(this.expr.params.length===2,55094);let r=!1;const s=q(this.expr.params[0]).evaluate(e,t);switch(s.type){case"NULL":r=!0;break;case"ERROR":case"UNSET":return E.mr()}const i=q(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":r=!0;break;default:return E.mr()}if(r)return E.gr();for(const l of((c=(a=i.value)==null?void 0:a.arrayValue)==null?void 0:c.values)??[])switch(Je(s.value)&&Je(l)?"EQ":Dt(s.value,l)){case"EQ":return E.newValue(ze);case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":r=!0;break;default:F(44608,{value:s.value,candidate:l})}return r?E.gr():E.newValue(Re)}}class Wy{constructor(e){this.expr=e}evaluate(e,t){return new mo(new C("not",[new C("equal_any",this.expr.params)])).evaluate(e,t)}}class Gy{constructor(e){this.expr=e}evaluate(e,t){U(this.expr.params.length===1,23322);const r=q(this.expr.params[0]).evaluate(e,t);switch(r.type){case"INT":return E.newValue(Re);case"DOUBLE":return E.newValue({booleanValue:isNaN(Se(r.value))});case"NULL":return E.gr();default:return E.mr()}}}class Ky{constructor(e){this.expr=e}evaluate(e,t){return U(this.expr.params.length===1,50406),new mo(new C("not",[new C("is_nan",this.expr.params)])).evaluate(e,t)}}class Qy{constructor(e){this.expr=e}evaluate(e,t){switch(U(this.expr.params.length===1,23123),q(this.expr.params[0]).evaluate(e,t).type){case"NULL":return E.newValue(ze);case"UNSET":case"ERROR":return E.mr();default:return E.newValue(Re)}}}class Yy{constructor(e){this.expr=e}evaluate(e,t){return U(this.expr.params.length===1,23167),new mo(new C("not",[new C("is_null",this.expr.params)])).evaluate(e,t)}}class Jy{constructor(e){this.expr=e}evaluate(e,t){return U(this.expr.params.length===1,5228),q(this.expr.params[0]).evaluate(e,t).type==="ERROR"?E.newValue(ze):E.newValue(Re)}}class Xy{constructor(e){this.expr=e}evaluate(e,t){switch(U(this.expr.params.length===1,6877),q(this.expr.params[0]).evaluate(e,t).type){case"ERROR":return E.mr();case"UNSET":return E.newValue(Re);default:return E.newValue(ze)}}}class Zy{constructor(e){this.expr=e}evaluate(e,t){var s;U(this.expr.params.length===3,11706);const r=q(this.expr.params[0]).evaluate(e,t);switch(r.type){case"BOOLEAN":return(s=r.value)!=null&&s.booleanValue?q(this.expr.params[1]).evaluate(e,t):q(this.expr.params[2]).evaluate(e,t);case"NULL":return q(this.expr.params[2]).evaluate(e,t);default:return E.mr()}}}class ew{constructor(e){this.expr=e}evaluate(e,t){const r=this.expr.params.map((i=>q(i).evaluate(e,t)));let s;for(const i of r)switch(i.type){case"ERROR":case"UNSET":case"NULL":continue;default:s=s===void 0||He(i.value,s.value)>0?i:s}return s===void 0?E.gr():s}}class tw{constructor(e){this.expr=e}evaluate(e,t){const r=this.expr.params.map((i=>q(i).evaluate(e,t)));let s;for(const i of r)switch(i.type){case"ERROR":case"UNSET":case"NULL":continue;default:s=s===void 0||He(i.value,s.value)<0?i:s}return s===void 0?E.gr():s}}class Ir{constructor(e){this.expr=e}evaluate(e,t){U(this.expr.params.length===2,31033,`${this.expr.name}() function should have exactly 2 params`);const r=q(this.expr.params[0]).evaluate(e,t);switch(r.type){case"ERROR":case"UNSET":return E.mr()}const s=q(this.expr.params[1]).evaluate(e,t);switch(s.type){case"ERROR":case"UNSET":return E.mr()}return this.Fr(r,s)}}class nw extends Ir{constructor(e){super(e),this.expr=e}Fr(e,t){if(e.wr()&&t.wr())return E.newValue(ze);if(e.wr()||t.wr()||We(e.value)||We(t.value)||we(e.value)!==we(t.value))return E.newValue(Re);switch(Dt(e.value,t.value)){case"EQ":return E.newValue(ze);case"NOT_EQ":return E.newValue(Re);case"NULL":return E.gr();default:F(44615,{left:e,right:t})}}}class rw extends Ir{constructor(e){super(e),this.expr=e}Fr(e,t){switch(Dt(e.value,t.value)){case"EQ":return E.newValue(Re);case"NOT_EQ":case"TYPE_MISMATCH":return E.newValue(ze);case"NULL":return E.gr();default:F(44614,{left:e,right:t})}}}class sw extends Ir{constructor(e){super(e),this.expr=e}Fr(e,t){return we(e.value)!==we(t.value)||We(e.value)||We(t.value)?E.newValue(Re):E.newValue({booleanValue:He(e.value,t.value)<0})}}class iw extends Ir{constructor(e){super(e),this.expr=e}Fr(e,t){return we(e.value)!==we(t.value)||We(e.value)||We(t.value)?E.newValue(Re):Dt(e.value,t.value)==="EQ"?E.newValue(ze):E.newValue({booleanValue:He(e.value,t.value)<0})}}class ow extends Ir{constructor(e){super(e),this.expr=e}Fr(e,t){return we(e.value)!==we(t.value)||We(e.value)||We(t.value)?E.newValue(Re):E.newValue({booleanValue:He(e.value,t.value)>0})}}class aw extends Ir{constructor(e){super(e),this.expr=e}Fr(e,t){return we(e.value)!==we(t.value)||We(e.value)||We(t.value)?E.newValue(Re):Dt(e.value,t.value)==="EQ"?E.newValue(ze):E.newValue({booleanValue:He(e.value,t.value)>0})}}class cw{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class uw{constructor(e){this.expr=e}evaluate(e,t){var s;U(this.expr.params.length===1,216);const r=q(this.expr.params[0]).evaluate(e,t);switch(r.type){case"NULL":return E.gr();case"ARRAY":{const i=((s=r.value.arrayValue)==null?void 0:s.values)??[];return E.newValue({arrayValue:{values:[...i].reverse()}})}default:return E.mr()}}}class lw{constructor(e){this.expr=e}evaluate(e,t){return U(this.expr.params.length===2,52884),new tf(new C("eq_any",[this.expr.params[1],this.expr.params[0]])).evaluate(e,t)}}class hw{constructor(e){this.expr=e}evaluate(e,t){var l,h,f,m;U(this.expr.params.length===2,1392);let r=!1;const s=q(this.expr.params[0]).evaluate(e,t);switch(s.type){case"ARRAY":break;case"NULL":r=!0;break;default:return E.mr()}const i=q(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":r=!0;break;default:return E.mr()}if(r)return E.gr();const a=((h=(l=i.value)==null?void 0:l.arrayValue)==null?void 0:h.values)??[],c=((m=(f=s.value)==null?void 0:f.arrayValue)==null?void 0:m.values)??[];for(const y of a){let b=!1;r=!1;for(const V of c){switch(Je(y)&&Je(V)?"EQ":Dt(y,V)){case"EQ":b=!0;break;case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":r=!0;break;default:F(44613,{value:V,search:y})}if(b)break}if(!b)return E.newValue(Re)}return E.newValue(ze)}}class dw{constructor(e){this.expr=e}evaluate(e,t){var l,h,f,m;U(this.expr.params.length===2,2680);let r=!1;const s=q(this.expr.params[0]).evaluate(e,t);switch(s.type){case"ARRAY":break;case"NULL":r=!0;break;default:return E.mr()}const i=q(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":r=!0;break;default:return E.mr()}if(r)return E.gr();const a=((h=(l=i.value)==null?void 0:l.arrayValue)==null?void 0:h.values)??[],c=((m=(f=s.value)==null?void 0:f.arrayValue)==null?void 0:m.values)??[];for(const y of c)for(const b of a)switch(Je(y)&&Je(b)?"EQ":Dt(y,b)){case"EQ":return E.newValue(ze);case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":r=!0;break;default:F(60403,{value:y,search:b})}return r?E.gr():E.newValue(Re)}}class fw{constructor(e){this.expr=e}evaluate(e,t){var s,i,a;U(this.expr.params.length===1,38605);const r=q(this.expr.params[0]).evaluate(e,t);switch(r.type){case"NULL":return E.gr();case"ARRAY":return E.newValue({integerValue:`${((a=(i=(s=r.value)==null?void 0:s.arrayValue)==null?void 0:i.values)==null?void 0:a.length)??0}`});default:return E.mr()}}}class pw{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class mw{constructor(e){this.expr=e}evaluate(e,t){var s,i;U(this.expr.params.length===1,1508);const r=q(this.expr.params[0]).evaluate(e,t);switch(r.type){case"NULL":return E.gr();case"BYTES":{const a=(s=r.value)==null?void 0:s.bytesValue;if(typeof a=="string"){const c=ye.fromBase64String(a).toUint8Array();return c.reverse(),E.newValue({bytesValue:ye.fromUint8Array(c).toBase64()})}return E.newValue({bytesValue:new Uint8Array(a).reverse()})}case"STRING":{const a=(i=r.value)==null?void 0:i.stringValue,c=new Intl.__PRIVATE_Segmenter(void 0,{granularity:"grapheme"}).segment(a),l=Array.from(c,(h=>h.segment)).reverse();return E.newValue({stringValue:l.join("")})}default:return E.mr()}}}class gw{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class _w{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class yw{constructor(e){this.expr=e}evaluate(e,t){U(this.expr.params.length===1,19400);const r=q(this.expr.params[0]).evaluate(e,t);switch(r.type){case"NULL":return E.gr();case"STRING":{const s=(function(a){let c=0;for(let l=0;l<a.length;l++){const h=a.codePointAt(l);if(h===void 0)return;if(h<=65535)if(h>=55296&&h<=57343)if(h<=56319){const f=a.codePointAt(l+1);f!==void 0&&f>=56320&&f<=57343?(c+=1,l++):c+=1}else c+=1;else c+=1;else{if(!(h<=1114111))return;c+=1,l++}}return c})(r.value.stringValue);return s===void 0?E.mr():E.newValue({integerValue:s})}default:return E.mr()}}}class ww{constructor(e){this.expr=e}evaluate(e,t){var s,i;U(this.expr.params.length===1,8486);const r=q(this.expr.params[0]).evaluate(e,t);switch(r.type){case"BYTES":{const a=(s=r.value)==null?void 0:s.bytesValue;return typeof a=="string"?E.newValue({integerValue:ye.fromBase64String(a).toUint8Array().length}):E.newValue({integerValue:new Uint8Array(a).length})}case"STRING":{const a=(function(l){let h=0;for(let f=0;f<l.length;f++){const m=l.codePointAt(f);if(m===void 0)return;if(m>=55296&&m<=57343){if(!(m<=56319))return;{const y=l.codePointAt(f+1);if(y===void 0||!(y>=56320&&y<=57343))return;h+=4,f++}}else if(m<=127)h+=1;else if(m<=2047)h+=2;else if(m<=65535)h+=3;else{if(!(m<=1114111))return;h+=4,f++}}return h})((i=r.value)==null?void 0:i.stringValue);return a===void 0?E.mr():E.newValue({integerValue:a})}case"NULL":return E.gr();default:return E.mr()}}}class vr{constructor(e){this.expr=e}evaluate(e,t){var a,c;U(this.expr.params.length===2,39773,`${this.expr.name}() function should have exactly two parameters`);let r=!1;const s=q(this.expr.params[0]).evaluate(e,t);switch(s.type){case"STRING":break;case"NULL":r=!0;break;default:return E.mr()}const i=q(this.expr.params[1]).evaluate(e,t);switch(i.type){case"STRING":break;case"NULL":r=!0;break;default:return E.mr()}return r?E.gr():this.Or((a=s.value)==null?void 0:a.stringValue,(c=i.value)==null?void 0:c.stringValue)}}class Ew extends vr{Or(e,t){try{const r=(function(a){let c="";for(let l=0;l<a.length;l++){const h=a.charAt(l);switch(h){case"_":c+=".";break;case"%":c+=".*";break;case"\\":case".":case"*":case"?":case"+":case"^":case"$":case"|":case"(":case")":case"[":case"]":case"{":case"}":c+="\\"+h;break;default:c+=h}}return"^"+c+"$"})(t),s=Da.compile(r);return E.newValue({booleanValue:s.matches(e)})}catch(r){return at(`Invalid LIKE pattern converted to regex: ${t}, returning error. Error: ${r}`),E.mr()}}}class Tw extends vr{Or(e,t){try{const r=Da.compile(t);return E.newValue({booleanValue:r.test(e)})}catch{return at(`Invalid regex pattern found in regex_contains: ${t}, returning error`),E.mr()}}}class Iw extends vr{Or(e,t){try{return E.newValue({booleanValue:Da.compile(t).matches(e)})}catch{return at(`Invalid regex pattern found in regex_match: ${t}, returning error`),E.mr()}}}class vw extends vr{Or(e,t){return E.newValue({booleanValue:e.includes(t)})}}class Aw extends vr{Or(e,t){return E.newValue({booleanValue:e.startsWith(t)})}}class Rw extends vr{Or(e,t){return E.newValue({booleanValue:e.endsWith(t)})}}class Pw{constructor(e){this.expr=e}evaluate(e,t){var s,i;U(this.expr.params.length===1,29079);const r=q(this.expr.params[0]).evaluate(e,t);switch(r.type){case"STRING":return E.newValue({stringValue:(i=(s=r.value)==null?void 0:s.stringValue)==null?void 0:i.toLowerCase()});case"NULL":return E.gr();default:return E.mr()}}}class bw{constructor(e){this.expr=e}evaluate(e,t){var s,i;U(this.expr.params.length===1,60487);const r=q(this.expr.params[0]).evaluate(e,t);switch(r.type){case"STRING":return E.newValue({stringValue:(i=(s=r.value)==null?void 0:s.stringValue)==null?void 0:i.toUpperCase()});case"NULL":return E.gr();default:return E.mr()}}}class Sw{constructor(e){this.expr=e}evaluate(e,t){var s,i;U(this.expr.params.length===1,28544);const r=q(this.expr.params[0]).evaluate(e,t);switch(r.type){case"STRING":return E.newValue({stringValue:(i=(s=r.value)==null?void 0:s.stringValue)==null?void 0:i.trim()});case"NULL":return E.gr();default:return E.mr()}}}class Cw{constructor(e){this.expr=e}evaluate(e,t){const r=this.expr.params.map((a=>q(a).evaluate(e,t)));let s="",i=!1;for(const a of r)switch(a.type){case"STRING":s+=a.value.stringValue;break;case"NULL":i=!0;break;default:return E.mr()}return i?E.gr():E.newValue({stringValue:s})}}class Vw{constructor(e){this.expr=e}evaluate(e,t){var a,c,l,h;U(this.expr.params.length===2,4483);const r=q(this.expr.params[0]).evaluate(e,t);switch(r.type){case"UNSET":return E.pr();case"MAP":break;default:return E.mr()}const s=q(this.expr.params[1]).evaluate(e,t);if(s.type!=="STRING")return E.mr();const i=(h=(c=(a=r.value)==null?void 0:a.mapValue)==null?void 0:c.fields)==null?void 0:h[(l=s.value)==null?void 0:l.stringValue];return i===void 0?E.pr():E.newValue(i)}}class ic{constructor(e){this.expr=e}evaluate(e,t){var h,f;U(this.expr.params.length===2,25231,`${this.expr.name}() function should have exactly 2 params`);let r=!1;const s=q(this.expr.params[0]).evaluate(e,t);switch(s.type){case"VECTOR":break;case"NULL":r=!0;break;default:return E.mr()}const i=q(this.expr.params[1]).evaluate(e,t);switch(i.type){case"VECTOR":break;case"NULL":r=!0;break;default:return E.mr()}if(r)return E.gr();const a=ga(s.value),c=ga(i.value);if(a===void 0||c===void 0||((h=a.values)==null?void 0:h.length)!==((f=c.values)==null?void 0:f.length))return E.mr();const l=this.Mr(a,c);return l===void 0||isNaN(l)?E.mr():E.newValue({doubleValue:l})}}class Nw extends ic{Mr(e,t){const r=(e==null?void 0:e.values)??[],s=(t==null?void 0:t.values)??[];if(r.length===0)return;let i=0,a=0,c=0;for(let h=0;h<r.length;h++){if(!cn(r[h])||!cn(s[h]))return;const f=Se(r[h]),m=Se(s[h]);i+=f*m,a+=f*f,c+=m*m}const l=Math.sqrt(a)*Math.sqrt(c);if(l!==0)return 1-Math.max(-1,Math.min(1,i/l))}}class kw extends ic{Mr(e,t){const r=(e==null?void 0:e.values)??[],s=(t==null?void 0:t.values)??[];if(r.length===0)return 0;let i=0;for(let a=0;a<r.length;a++){if(!cn(r[a])||!cn(s[a]))return;i+=Se(r[a])*Se(s[a])}return i}}class Dw extends ic{Mr(e,t){const r=(e==null?void 0:e.values)??[],s=(t==null?void 0:t.values)??[];if(r.length===0)return 0;let i=0;for(let a=0;a<r.length;a++){if(!cn(r[a])||!cn(s[a]))return;const c=Se(r[a]),l=Se(s[a]);i+=Math.pow(c-l,2)}return Math.sqrt(i)}}class xw{constructor(e){this.expr=e}evaluate(e,t){var s;U(this.expr.params.length===1,39044);const r=q(this.expr.params[0]).evaluate(e,t);switch(r.type){case"VECTOR":{const i=ga(r.value);return E.newValue({integerValue:((s=i==null?void 0:i.values)==null?void 0:s.length)??0})}case"NULL":return E.gr();default:return E.mr()}}}const Es=BigInt(-62135596800),Ts=BigInt(253402300799),Li=BigInt(1e3),nn=BigInt(1e6),Ow=Es*Li,Lw=Ts*Li+BigInt(999),Mw=Es*nn,Uw=Ts*nn+BigInt(999999);function oc(n){return n>=Mw&&n<=Uw}function nf(n){return n>=Es&&n<=Ts}function Is(n,e){const t=BigInt(n);return!(t<Es||t>Ts)&&!(e<0||e>=1e9)&&(t!==Es||e===0)&&!(t===Ts&&e>999999999)}function rf(n,e){return e<0?{seconds:n-1,nanos:e+1e9}:{seconds:n,nanos:e}}function ac(n){return BigInt(n.seconds)*nn+BigInt(Math.trunc(n.nanoseconds/1e3))}class cc{constructor(e){this.expr=e}evaluate(e,t){U(this.expr.params.length===1,49262,`${this.expr.name}() function should have exactly one parameter`);const r=q(this.expr.params[0]).evaluate(e,t);switch(r.type){case"INT":return this.toTimestamp(BigInt(r.value.integerValue));case"NULL":return E.gr();default:return E.mr()}}}class Fw extends cc{toTimestamp(e){if(!oc(e))return E.mr();let t=Number(e/nn),r=Number(e%nn*BigInt(1e3));const s=rf(t,r);return t=s.seconds,r=s.nanos,Is(t,r)?E.newValue({timestampValue:{seconds:t,nanos:r}}):E.mr()}}class Bw extends cc{toTimestamp(e){if(!(function(a){return a>=Ow&&a<=Lw})(e))return E.mr();let t=Number(e/Li),r=Number(e%Li*BigInt(1e6));const s=rf(t,r);return t=s.seconds,r=s.nanos,Is(t,r)?E.newValue({timestampValue:{seconds:t,nanos:r}}):E.mr()}}class qw extends cc{toTimestamp(e){if(!nf(e))return E.mr();const t=Number(e);return E.newValue({timestampValue:{seconds:t,nanos:0}})}}class uc{constructor(e){this.expr=e}evaluate(e,t){U(this.expr.params.length===1,1265,`${this.expr.name}() function should have exactly one parameter`);const r=q(this.expr.params[0]).evaluate(e,t);switch(r.type){case"TIMESTAMP":break;case"NULL":return E.gr();default:return E.mr()}const s=za(r.value.timestampValue);return Is(s.seconds,s.nanoseconds)?this.Nr(s):E.mr()}}class $w extends uc{Nr(e){const t=ac(e);return oc(t)?E.newValue({integerValue:`${t.toString()}`}):E.mr()}}class jw extends uc{Nr(e){const t=ac(e),r=t/BigInt(1e3),s=t%BigInt(1e3);return r>BigInt(0)||s===BigInt(0)?E.newValue({integerValue:r.toString()}):E.newValue({integerValue:(r-BigInt(1)).toString()})}}class zw extends uc{Nr(e){const t=BigInt(e.seconds);return nf(t)?E.newValue({integerValue:t.toString()}):E.mr()}}class sf{constructor(e){this.expr=e}evaluate(e,t){U(this.expr.params.length===3,2775,`${this.expr.name}() function should have exactly 3 parameters`);let r=!1;const s=q(this.expr.params[0]).evaluate(e,t);switch(s.type){case"TIMESTAMP":break;case"NULL":r=!0;break;default:return E.mr()}const i=q(this.expr.params[1]).evaluate(e,t);let a;switch(i.type){case"STRING":if(a=(function(G){switch(G){case"microsecond":return"microsecond";case"millisecond":return"millisecond";case"second":return"second";case"minute":return"minute";case"hour":return"hour";case"day":return"day";default:return}})(i.value.stringValue),a===void 0)return E.mr();break;case"NULL":r=!0;break;default:return E.mr()}const c=q(this.expr.params[2]).evaluate(e,t);switch(c.type){case"INT":break;case"NULL":r=!0;break;default:return E.mr()}if(r)return E.gr();const l=BigInt(c.value.integerValue);let h;try{switch(a){case"microsecond":h=l;break;case"millisecond":h=l*BigInt(1e3);break;case"second":h=l*BigInt(1e6);break;case"minute":h=l*BigInt(6e7);break;case"hour":h=l*BigInt(36e8);break;case"day":h=l*BigInt(864e8);break;default:return E.mr()}if(a!=="microsecond"&&l!==BigInt(0)&&h/l!==BigInt(this.Lr(a)))return E.mr()}catch(z){return at(`Error during timestamp arithmetic: ${z}`),E.mr()}const f=za(s.value.timestampValue);if(!Is(f.seconds,f.nanoseconds))return E.mr();const m=ac(f),y=this.Br(m,h);if(!oc(y))return E.mr();const b=Number(y/nn),V=y%nn,M=Number((V<0?V+nn:V)*BigInt(1e3)),x=V<0?b-1:b;return Is(x,M)?E.newValue({timestampValue:{seconds:x,nanos:M}}):E.mr()}Lr(e){switch(e){case"millisecond":return 1e3;case"second":return 1e6;case"minute":return 6e7;case"hour":return 36e8;case"day":return 864e8;default:return 1}}}class Hw extends sf{Br(e,t){return e+t}}class Ww extends sf{Br(e,t){return e-t}}function vs(n){if((n=ef(n))instanceof Er)return`fld(${n.fieldName})`;if(n instanceof Tr)return`cst(${(function(t){return t===null?"null":typeof t=="number"?t.toString():typeof t=="string"?`"${t}"`:t instanceof ie?`ref(${t.path})`:t instanceof je?`vec(${JSON.stringify(t)})`:JSON.stringify(t)})(n.value)})`;if(n instanceof C)return`fn(${n.name},[${n.params.map(vs).join(",")}])`;if(n.expressionType==="ListOfExpressions")return`list([${n.cr.map(vs).join(",")}])`;throw new Error(`Unrecognized expr ${JSON.stringify(n,null,2)}`)}function Gw(n){if(n instanceof Jd)return`${n._name}(${li(n.fields)})`;if(n instanceof Xd){let e=`${n._name}(${li(n.accumulators)})`;return n.groups.size>0&&(e+=`grouping(${li(n.groups)})`),e}if(n instanceof Zd)return`${n._name}(${li(n.groups)})`;if(n instanceof lo)return`${n._name}(${n.hr})`;if(n instanceof ho)return`${n._name}(${n.collectionId})`;if(n instanceof ec)return`${n._name}()`;if(n instanceof tc)return`${n._name}(${n.Tr.sort()})`;if(n instanceof fo)return`${n._name}(${vs(n.condition)})`;if(n instanceof Un)return`${n._name}(${n.limit})`;if(n instanceof Rt)return`${n._name}(${(function(t){return t.map((r=>`${vs(r.expr)}${r.direction}`)).join(",")})(n.orderings)})`;throw new Error(`Unrecognized stage ${n._name}`)}function li(n){return`${Array.from(n.entries()).sort().map((([e,t])=>`${e}=${vs(t)}`)).join(",")}`}function Ct(n){return n.stages.map((e=>Gw(e))).join("|")}function of(n,e){return Ct(n)===Ct(e)}function Te(n){return n instanceof Ue}function Ll(n){return Te(n)?Ct(n):Zr(n)}function af(n){return Te(n)?Ct(n):(function(t){return`${fd(gt(t))}|lt:${t.limitType}`})(n)}function go(n,e){return n instanceof Ue&&e instanceof Ue?of(n,e):!(n instanceof Ue&&!(e instanceof Ue)||!(n instanceof Ue)&&e instanceof Ue)&&p_(n,e)}function cf(n){return Pn(n)?Ct(n):fd(n)}function uf(n,e){return n instanceof Ue&&e instanceof Ue?of(n,e):!(n instanceof Ue&&!(e instanceof Ue)||!(n instanceof Ue)&&e instanceof Ue)&&pd(n,e)}function Kw(n,e){const t=(function(s){let i=!1;const a=[];for(const c of s)if(c instanceof Rt)if(i=!0,c.orderings.some((l=>l.expr instanceof Er&&l.expr.fieldName===dt)))a.push(c);else{const l=c.orderings.map((h=>h));l.push(wi(dt).ascending()),a.push(new Rt(l,{}))}else c instanceof Un&&(i||(a.push(new Rt([wi(dt).ascending()],{})),i=!0)),a.push(c);return i||a.push(new Rt([wi(dt).ascending()],{})),a})(n.stages);if(n.userDataReader){const r=n.userDataReader.createContext(3,"toCorePipeline");t.forEach((s=>s._readUserData(r)))}return new Ue(n.userDataReader.serializer,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qw{constructor(e,t,r,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=r,this.mutations=s}applyToRemoteDocument(e,t){const r=t.mutationResults;for(let s=0;s<this.mutations.length;s++){const i=this.mutations[s];i.key.isEqual(e.key)&&Qg(i,e,r[s])}}applyToLocalView(e,t){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(t=Jr(r,e,t,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(t=Jr(r,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const r=Td();return this.mutations.forEach((s=>{const i=e.get(s.key),a=i.overlayedDocument;let c=this.applyToLocalView(a,i.mutatedFields);c=t.has(s.key)?null:c;const l=sd(a,c);l!==null&&r.set(s.key,l),a.isValidDocument()||a.convertToNoDocument($.min())})),r}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),K())}isEqual(e){return this.batchId===e.batchId&&or(this.mutations,e.mutations,((t,r)=>fl(t,r)))&&or(this.baseMutations,e.baseMutations,((t,r)=>fl(t,r)))}}class lc{constructor(e,t,r,s){this.batch=e,this.commitVersion=t,this.mutationResults=r,this.docVersions=s}static from(e,t,r){U(e.mutations.length===r.length,58842,{Ur:e.mutations.length,kr:r.length});let s=(function(){return y_})();const i=e.mutations;for(let a=0;a<i.length;a++)s=s.insert(i[a].key,r[a].version);return new lc(e,t,r,s)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lf="";function Yw(n){let e="";for(let t=0;t<n.length;t++)e.length>0&&(e=Ml(e)),e=Jw(n.get(t),e);return Ml(e)}function Jw(n,e){let t=e;const r=n.length;for(let s=0;s<r;s++){const i=n.charAt(s);switch(i){case"\0":t+="";break;case lf:t+="";break;default:t+=i}}return t}function Ml(n){return n+lf+""}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xw{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pt{constructor(e,t,r,s,i=$.min(),a=$.min(),c=ye.EMPTY_BYTE_STRING,l=null){this.target=e,this.targetId=t,this.purpose=r,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=c,this.expectedCount=l}withSequenceNumber(e){return new Pt(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new Pt(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Pt(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Pt(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zw{constructor(e){this.$r=e}}function eE(n){const e=O_({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?xi(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tE{constructor(){this.Zi=new nE}addToCollectionParentIndex(e,t){return this.Zi.add(t),N.resolve()}getCollectionParents(e,t){return N.resolve(this.Zi.getEntries(t))}addFieldIndex(e,t){return N.resolve()}deleteFieldIndex(e,t){return N.resolve()}deleteAllFieldIndexes(e){return N.resolve()}createTargetIndexes(e,t){return N.resolve()}getDocumentsMatchingTarget(e,t){return N.resolve(null)}getIndexType(e,t){return N.resolve(0)}getFieldIndexes(e,t){return N.resolve([])}getNextCollectionGroupToUpdate(e){return N.resolve(null)}getMinOffset(e,t){return N.resolve(un.min())}getMinOffsetFromCollectionGroup(e,t){return N.resolve(un.min())}updateCollectionGroup(e,t,r){return N.resolve()}updateIndexEntries(e,t){return N.resolve()}}class nE{constructor(){this.index={}}add(e){const t=e.lastSegment(),r=e.popLast(),s=this.index[t]||new _e(Z.comparator),i=!s.has(r);return this.index[t]=s.add(r),i}has(e){const t=e.lastSegment(),r=e.popLast(),s=this.index[t];return s&&s.has(r)}getEntries(e){return(this.index[e]||new _e(Z.comparator)).toArray()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pn{constructor(e){this.ys=e}next(){return this.ys+=2,this.ys}static ws(){return new pn(0)}static bs(){return new pn(-1)}}// Copyright 2024 Google LLC* @license
function hf(n,e){var r;let t=e;for(const s of n.stages)t=sE({serializer:n.serializer,serverTimestampBehavior:(r=n.listenOptions)==null?void 0:r.serverTimestampBehavior},s,t);return t}function _o(n,e){return hf(n,[e]).length>0}function rE(n,e){return Te(n)?_o(n,e):so(n,e)}function sE(n,e,t){if(e instanceof lo)return(function(s,i,a){return a.filter((c=>c.isFoundDocument()&&`/${c.key.getCollectionPath().canonicalString()}`===i.hr))})(0,e,t);if(e instanceof fo)return(function(s,i,a){return a.filter((c=>{const l=ss(q(i.condition).evaluate(s,c));return l!==void 0&&nt(l,ze)}))})(n,e,t);if(e instanceof ho)return(function(s,i,a){return a.filter((c=>c.isFoundDocument()&&c.key.getCollectionPath().lastSegment()===i.collectionId))})(0,e,t);if(e instanceof ec)return(function(s,i,a){return a.filter((c=>c.isFoundDocument()))})(0,0,t);if(e instanceof tc)return(function(s,i,a){return a.filter((c=>c.isFoundDocument()&&i.Pr.has(c.key.path.toStringWithLeadingSlash())))})(0,e,t);if(e instanceof Un)return(function(s,i,a){return a.slice(0,i.limit)})(0,e,t);if(e instanceof Rt)return(function(s,i,a){const c=i.orderings.map((l=>({Ms:q(l.expr),direction:l.direction})));return[...a].sort(((l,h)=>{for(const{Ms:f,direction:m}of c){const y=ss(f.evaluate(s,l)),b=ss(f.evaluate(s,h)),V=He(y??cr,b??cr);if(V!==0)return m==="ascending"?V:-V}return 0}))})(n,e,t);throw new Error(`Unknown stage: ${e._name}`)}function Aa(n){const e=(function(r){for(let s=r.stages.length-1;s>=0;s--){const i=r.stages[s];if(i instanceof Rt)return i.orderings}throw new Error("Pipeline must contain at least one Sort stage")})(n);return(t,r)=>{for(const s of e){const i=ss(q(s.expr).evaluate({serializer:n.serializer},t)),a=ss(q(s.expr).evaluate({serializer:n.serializer},r)),c=He(i||cr,a||cr);if(c!==0)return s.direction==="ascending"?c:-c}return 0}}function na(n){for(let e=n.stages.length-1;e>=0;e--){const t=n.stages[e];if(t instanceof Un)return{limit:t.limit}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iE{constructor(){this.changes=new zn((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Ae.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const r=this.changes.get(t);return r!==void 0?N.resolve(r):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oE{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class aE{constructor(e,t,r,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=r,this.indexManager=s}getDocument(e,t){let r=null;return this.documentOverlayCache.getOverlay(e,t).next((s=>(r=s,this.remoteDocumentCache.getEntry(e,t)))).next((s=>(r!==null&&Jr(r.mutation,s,Ye.empty(),ee.now()),s)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((r=>this.getLocalViewOfDocuments(e,r,K()).next((()=>r))))}getLocalViewOfDocuments(e,t,r=K()){const s=Ht();return this.populateOverlays(e,s,t).next((()=>this.computeViews(e,t,s,r).next((i=>{let a=Zn();return i.forEach(((c,l)=>{a=a.insert(c,l.overlayedDocument)})),a}))))}getOverlayedDocuments(e,t){const r=Ht();return this.populateOverlays(e,r,t).next((()=>this.computeViews(e,t,r,K())))}populateOverlays(e,t,r){const s=[];return r.forEach((i=>{t.has(i)||s.push(i)})),this.documentOverlayCache.getOverlays(e,s).next((i=>{i.forEach(((a,c)=>{t.set(a,c)}))}))}computeViews(e,t,r,s){let i=$e();const a=es(),c=(function(){return es()})();return t.forEach(((l,h)=>{const f=r.get(h.key);s.has(h.key)&&(f===void 0||f.mutation instanceof yn)?i=i.insert(h.key,h):f!==void 0?(a.set(h.key,f.mutation.getFieldMask()),Jr(f.mutation,h,f.mutation.getFieldMask(),ee.now())):a.set(h.key,Ye.empty())})),this.recalculateAndSaveOverlays(e,i).next((l=>(l.forEach(((h,f)=>a.set(h,f))),t.forEach(((h,f)=>c.set(h,new oE(f,a.get(h)??null)))),c)))}recalculateAndSaveOverlays(e,t){const r=es();let s=new oe(((a,c)=>a-c)),i=K();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((a=>{for(const c of a)c.keys().forEach((l=>{const h=t.get(l);if(h===null)return;let f=r.get(l)||Ye.empty();f=c.applyToLocalView(h,f),r.set(l,f);const m=(s.get(c.batchId)||K()).add(l);s=s.insert(c.batchId,m)}))})).next((()=>{const a=[],c=s.getReverseIterator();for(;c.hasNext();){const l=c.getNext(),h=l.key,f=l.value,m=Td();f.forEach((y=>{if(!i.has(y)){const b=sd(t.get(y),r.get(y));b!==null&&m.set(y,b),i=i.add(y)}})),a.push(this.documentOverlayCache.saveOverlays(e,h,m))}return N.waitFor(a)})).next((()=>r))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((r=>this.recalculateAndSaveOverlays(e,r)))}getDocumentsMatchingQuery(e,t,r,s){return Te(t)?this.getDocumentsMatchingPipeline(e,t,r,s):h_(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):gd(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,r,s):this.getDocumentsMatchingCollectionQuery(e,t,r,s)}getNextDocuments(e,t,r,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,r,s).next((i=>{const a=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,r.largestBatchId,s-i.size):N.resolve(Ht());let c=gs,l=i;return a.next((h=>N.forEach(h,((f,m)=>(c<m.largestBatchId&&(c=m.largestBatchId),i.get(f)?N.resolve():this.remoteDocumentCache.getEntry(e,f).next((y=>{l=l.insert(f,y)}))))).next((()=>this.populateOverlays(e,h,i))).next((()=>this.computeViews(e,l,h,K()))).next((f=>({batchId:c,changes:Ed(f)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new B(t)).next((r=>{let s=Zn();return r.isFoundDocument()&&(s=s.insert(r.key,r)),s}))}getDocumentsMatchingCollectionGroupQuery(e,t,r,s){const i=t.collectionGroup;let a=Zn();return this.indexManager.getCollectionParents(e,i).next((c=>N.forEach(c,(l=>{const h=(function(m,y){return new mr(y,null,m.explicitOrderBy.slice(),m.filters.slice(),m.limit,m.limitType,m.startAt,m.endAt)})(t,l.child(i));return this.getDocumentsMatchingCollectionQuery(e,h,r,s).next((f=>{f.forEach(((m,y)=>{a=a.insert(m,y)}))}))})).next((()=>a))))}getDocumentsMatchingCollectionQuery(e,t,r,s){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,r.largestBatchId).next((a=>(i=a,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,i,s)))).next((a=>this.retrieveMatchingLocalDocuments(i,a,(c=>so(t,c)))))}getDocumentsMatchingPipeline(e,t,r,s){if(tn(t)==="collection_group"){const i=rc(t);let a=Zn();return this.indexManager.getCollectionParents(e,i).next((c=>N.forEach(c,(l=>{const h=(function(m,y){const b=m.stages.map((V=>V instanceof ho?new lo(y.canonicalString(),{}):V));return new Ue(m.serializer,b)})(t,l.child(i));return this.getDocumentsMatchingPipeline(e,h,r,s).next((f=>{f.forEach(((m,y)=>{a=a.insert(m,y)}))}))})).next((()=>a))))}{let i;return this.getOverlaysForPipeline(e,t,r.largestBatchId).next((a=>{switch(i=a,tn(t)){case"collection":return this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,i,s);case"documents":let c=K();for(const l of va(t))c=c.add(B.fromPath(l));return this.remoteDocumentCache.getEntries(e,c);case"database":return this.remoteDocumentCache.getAllEntries(e);default:throw new k("invalid-argument",`Invalid pipeline source to execute offline: ${Ct(t)}`)}})).next((a=>this.retrieveMatchingLocalDocuments(i,a,(c=>_o(t,c)))))}}retrieveMatchingLocalDocuments(e,t,r){e.forEach(((i,a)=>{const c=a.getKey();t.get(c)===null&&(t=t.insert(c,Ae.newInvalidDocument(c)))}));let s=Zn();return t.forEach(((i,a)=>{const c=e.get(i);c!==void 0&&Jr(c.mutation,a,Ye.empty(),ee.now()),r(a)&&(s=s.insert(i,a))})),s}getOverlaysForPipeline(e,t,r){switch(tn(t)){case"collection":return this.documentOverlayCache.getOverlaysForCollection(e,Z.fromString(po(t)),r);case"collection_group":throw new k("invalid-argument",`Unexpected collection group pipeline: ${Ct(t)}`);case"documents":return this.documentOverlayCache.getOverlays(e,va(t).map((s=>B.fromPath(s))));case"database":return this.documentOverlayCache.getAllOverlays(e,r);default:throw new k("invalid-argument",`Failed to get overlays for pipeline: ${Ct(t)}`)}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cE{constructor(e){this.serializer=e,this.Qs=new Map,this.Ws=new Map}getBundleMetadata(e,t){return N.resolve(this.Qs.get(t))}saveBundleMetadata(e,t){return this.Qs.set(t.id,(function(s){return{id:s.id,version:s.version,createTime:et(s.createTime)}})(t)),N.resolve()}getNamedQuery(e,t){return N.resolve(this.Ws.get(t))}saveNamedQuery(e,t){return this.Ws.set(t.name,(function(s){return{name:s.name,query:eE(s.bundledQuery),readTime:et(s.readTime)}})(t)),N.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uE{constructor(){this.overlays=new oe(B.comparator),this.Gs=new Map}getOverlay(e,t){return N.resolve(this.overlays.get(t))}getOverlays(e,t){const r=Ht();return N.forEach(t,(s=>this.getOverlay(e,s).next((i=>{i!==null&&r.set(s,i)})))).next((()=>r))}getAllOverlays(e,t){const r=Ht();return this.overlays.forEach(((s,i)=>{i.largestBatchId>t&&r.set(s,i)})),N.resolve(r)}saveOverlays(e,t,r){return r.forEach(((s,i)=>{this.Zr(e,t,i)})),N.resolve()}removeOverlaysForBatchId(e,t,r){const s=this.Gs.get(r);return s!==void 0&&(s.forEach((i=>this.overlays=this.overlays.remove(i))),this.Gs.delete(r)),N.resolve()}getOverlaysForCollection(e,t,r){const s=Ht(),i=t.length+1,a=new B(t.child("")),c=this.overlays.getIteratorFrom(a);for(;c.hasNext();){const l=c.getNext().value,h=l.getKey();if(!t.isPrefixOf(h.path))break;h.path.length===i&&l.largestBatchId>r&&s.set(l.getKey(),l)}return N.resolve(s)}getOverlaysForCollectionGroup(e,t,r,s){let i=new oe(((h,f)=>h-f));const a=this.overlays.getIterator();for(;a.hasNext();){const h=a.getNext().value;if(h.getKey().getCollectionGroup()===t&&h.largestBatchId>r){let f=i.get(h.largestBatchId);f===null&&(f=Ht(),i=i.insert(h.largestBatchId,f)),f.set(h.getKey(),h)}}const c=Ht(),l=i.getIterator();for(;l.hasNext()&&(l.getNext().value.forEach(((h,f)=>c.set(h,f))),!(c.size()>=s)););return N.resolve(c)}Zr(e,t,r){const s=this.overlays.get(r.key);if(s!==null){const a=this.Gs.get(s.largestBatchId).delete(r.key);this.Gs.set(s.largestBatchId,a)}this.overlays=this.overlays.insert(r.key,new Xw(t,r));let i=this.Gs.get(t);i===void 0&&(i=K(),this.Gs.set(t,i)),this.Gs.set(t,i.add(r.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lE{constructor(){this.sessionToken=ye.EMPTY_BYTE_STRING}getSessionToken(e){return N.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,N.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hc{constructor(){this.zs=new _e(ve.js),this.Hs=new _e(ve.Js)}isEmpty(){return this.zs.isEmpty()}addReference(e,t){const r=new ve(e,t);this.zs=this.zs.add(r),this.Hs=this.Hs.add(r)}Ys(e,t){e.forEach((r=>this.addReference(r,t)))}removeReference(e,t){this.Zs(new ve(e,t))}Xs(e,t){e.forEach((r=>this.removeReference(r,t)))}e_(e){const t=new B(new Z([])),r=new ve(t,e),s=new ve(t,e+1),i=[];return this.Hs.forEachInRange([r,s],(a=>{this.Zs(a),i.push(a.key)})),i}t_(){this.zs.forEach((e=>this.Zs(e)))}Zs(e){this.zs=this.zs.delete(e),this.Hs=this.Hs.delete(e)}n_(e){const t=new B(new Z([])),r=new ve(t,e),s=new ve(t,e+1);let i=K();return this.Hs.forEachInRange([r,s],(a=>{i=i.add(a.key)})),i}containsKey(e){const t=new ve(e,0),r=this.zs.firstAfterOrEqual(t);return r!==null&&e.isEqual(r.key)}}class ve{constructor(e,t){this.key=e,this.r_=t}static js(e,t){return B.comparator(e.key,t.key)||Q(e.r_,t.r_)}static Js(e,t){return Q(e.r_,t.r_)||B.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hE{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Gr=1,this.i_=new _e(ve.js)}checkEmpty(e){return N.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,r,s){const i=this.Gr;this.Gr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new Qw(i,t,r,s);this.mutationQueue.push(a);for(const c of s)this.i_=this.i_.add(new ve(c.key,i)),this.indexManager.addToCollectionParentIndex(e,c.key.path.popLast());return N.resolve(a)}lookupMutationBatch(e,t){return N.resolve(this.s_(t))}getNextMutationBatchAfterBatchId(e,t){const r=t+1,s=this.__(r),i=s<0?0:s;return N.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return N.resolve(this.mutationQueue.length===0?Fa:this.Gr-1)}getAllMutationBatches(e){return N.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const r=new ve(t,0),s=new ve(t,Number.POSITIVE_INFINITY),i=[];return this.i_.forEachInRange([r,s],(a=>{const c=this.s_(a.r_);i.push(c)})),N.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let r=new _e(Q);return t.forEach((s=>{const i=new ve(s,0),a=new ve(s,Number.POSITIVE_INFINITY);this.i_.forEachInRange([i,a],(c=>{r=r.add(c.r_)}))})),N.resolve(this.o_(r))}getAllMutationBatchesAffectingQuery(e,t){const r=t.path,s=r.length+1;let i=r;B.isDocumentKey(i)||(i=i.child(""));const a=new ve(new B(i),0);let c=new _e(Q);return this.i_.forEachWhile((l=>{const h=l.key.path;return!!r.isPrefixOf(h)&&(h.length===s&&(c=c.add(l.r_)),!0)}),a),N.resolve(this.o_(c))}o_(e){const t=[];return e.forEach((r=>{const s=this.s_(r);s!==null&&t.push(s)})),t}removeMutationBatch(e,t){U(this.a_(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let r=this.i_;return N.forEach(t.mutations,(s=>{const i=new ve(s.key,t.batchId);return r=r.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)})).next((()=>{this.i_=r}))}Hr(e){}containsKey(e,t){const r=new ve(t,0),s=this.i_.firstAfterOrEqual(r);return N.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,N.resolve()}a_(e,t){return this.__(e)}__(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}s_(e){const t=this.__(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dE{constructor(e){this.u_=e,this.docs=(function(){return new oe(B.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const r=t.key,s=this.docs.get(r),i=s?s.size:0,a=this.u_(t);return this.docs=this.docs.insert(r,{document:t.mutableCopy(),size:a}),this.size+=a-i,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const r=this.docs.get(t);return N.resolve(r?r.document.mutableCopy():Ae.newInvalidDocument(t))}getEntries(e,t){let r=$e();return t.forEach((s=>{const i=this.docs.get(s);r=r.insert(s,i?i.document.mutableCopy():Ae.newInvalidDocument(s))})),N.resolve(r)}getAllEntries(e){let t=$e();return this.docs.forEach(((r,s)=>{t=t.insert(r,s.document)})),N.resolve(t)}getDocumentsMatchingQuery(e,t,r,s){let i,a;Te(t)?(i=Z.fromString(po(t)),a=f=>_o(t,f)):(i=t.path,a=f=>so(t,f));let c=$e();const l=new B(i.child("__id-9223372036854775808__")),h=this.docs.getIteratorFrom(l);for(;h.hasNext();){const{key:f,value:{document:m}}=h.getNext();if(!i.isPrefixOf(f.path))break;f.path.length>i.length+1||c_(a_(m),r)<=0||(s.has(m.key)||a(m))&&(c=c.insert(m.key,m.mutableCopy()))}return N.resolve(c)}getAllFromCollectionGroup(e,t,r,s){F(9500)}c_(e,t){return N.forEach(this.docs,(r=>t(r)))}newChangeBuffer(e){return new fE(this)}getSize(e){return N.resolve(this.size)}}class fE extends iE{constructor(e){super(),this.$s=e}applyChanges(e){const t=[];return this.changes.forEach(((r,s)=>{s.isValidDocument()?t.push(this.$s.addEntry(e,s)):this.$s.removeEntry(r)})),N.waitFor(t)}getFromCache(e,t){return this.$s.getEntry(e,t)}getAllFromCache(e,t){return this.$s.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pE{constructor(e){this.persistence=e,this.l_=new zn((t=>cf(t)),uf),this.lastRemoteSnapshotVersion=$.min(),this.highestTargetId=0,this.E_=0,this.h_=new hc,this.targetCount=0,this.T_=pn.ws()}forEachTarget(e,t){return this.l_.forEach(((r,s)=>t(s))),N.resolve()}getLastRemoteSnapshotVersion(e){return N.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return N.resolve(this.E_)}allocateTargetId(e){return this.highestTargetId=this.T_.next(),N.resolve(this.highestTargetId)}setTargetsMetadata(e,t,r){return r&&(this.lastRemoteSnapshotVersion=r),t>this.E_&&(this.E_=t),N.resolve()}Ds(e){this.l_.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.T_=new pn(t),this.highestTargetId=t),e.sequenceNumber>this.E_&&(this.E_=e.sequenceNumber)}addTargetData(e,t){return this.Ds(t),this.targetCount+=1,N.resolve()}updateTargetData(e,t){return this.Ds(t),N.resolve()}removeTargetData(e,t){return this.l_.delete(t.target),this.h_.e_(t.targetId),this.targetCount-=1,N.resolve()}removeTargets(e,t,r){let s=0;const i=[];return this.l_.forEach(((a,c)=>{c.sequenceNumber<=t&&r.get(c.targetId)===null&&(this.l_.delete(a),i.push(this.removeMatchingKeysForTargetId(e,c.targetId)),s++)})),N.waitFor(i).next((()=>s))}getTargetCount(e){return N.resolve(this.targetCount)}getTargetData(e,t){const r=this.l_.get(t)||null;return N.resolve(r)}addMatchingKeys(e,t,r){return this.h_.Ys(t,r),N.resolve()}removeMatchingKeys(e,t,r){this.h_.Xs(t,r);const s=this.persistence.referenceDelegate,i=[];return s&&t.forEach((a=>{i.push(s.markPotentiallyOrphaned(e,a))})),N.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.h_.e_(t),N.resolve()}getMatchingKeysForTargetId(e,t){const r=this.h_.n_(t);return N.resolve(r)}containsKey(e,t){return N.resolve(this.h_.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class df{constructor(e,t){this.P_={},this.overlays={},this.I_=new oo(0),this.R_=!1,this.R_=!0,this.A_=new lE,this.referenceDelegate=e(this),this.V_=new pE(this),this.indexManager=new tE,this.remoteDocumentCache=(function(s){return new dE(s)})((r=>this.referenceDelegate.d_(r))),this.serializer=new Zw(t),this.f_=new cE(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.R_=!1,Promise.resolve()}get started(){return this.R_}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new uE,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let r=this.P_[e.toKey()];return r||(r=new hE(t,this.referenceDelegate),this.P_[e.toKey()]=r),r}getGlobalsCache(){return this.A_}getTargetCache(){return this.V_}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.f_}runTransaction(e,t,r){L("MemoryPersistence","Starting transaction:",e);const s=new mE(this.I_.next());return this.referenceDelegate.m_(),r(s).next((i=>this.referenceDelegate.p_(s).next((()=>i)))).toPromise().then((i=>(s.raiseOnCommittedEvent(),i)))}g_(e,t){return N.or(Object.values(this.P_).map((r=>()=>r.containsKey(e,t))))}}class mE extends cy{constructor(e){super(),this.currentSequenceNumber=e}}class dc{constructor(e){this.persistence=e,this.y_=new hc,this.w_=null}static b_(e){return new dc(e)}get S_(){if(this.w_)return this.w_;throw F(60996)}addReference(e,t,r){return this.y_.addReference(r,t),this.S_.delete(r.toString()),N.resolve()}removeReference(e,t,r){return this.y_.removeReference(r,t),this.S_.add(r.toString()),N.resolve()}markPotentiallyOrphaned(e,t){return this.S_.add(t.toString()),N.resolve()}removeTarget(e,t){this.y_.e_(t.targetId).forEach((s=>this.S_.add(s.toString())));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,t.targetId).next((s=>{s.forEach((i=>this.S_.add(i.toString())))})).next((()=>r.removeTargetData(e,t)))}m_(){this.w_=new Set}p_(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return N.forEach(this.S_,(r=>{const s=B.fromPath(r);return this.v_(e,s).next((i=>{i||t.removeEntry(s,$.min())}))})).next((()=>(this.w_=null,t.apply(e))))}updateLimboDocument(e,t){return this.v_(e,t).next((r=>{r?this.S_.delete(t.toString()):this.S_.add(t.toString())}))}d_(e){return 0}v_(e,t){return N.or([()=>N.resolve(this.y_.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.g_(e,t)])}}class Mi{constructor(e,t){this.persistence=e,this.D_=new zn((r=>Yw(r.path)),((r,s)=>r.isEqual(s))),this.garbageCollector=py(this,t)}static b_(e,t){return new Mi(e,t)}m_(){}p_(e){return N.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}ir(e){const t=this.Cs(e);return this.persistence.getTargetCache().getTargetCount(e).next((r=>t.next((s=>r+s))))}Cs(e){let t=0;return this.sr(e,(r=>{t++})).next((()=>t))}sr(e,t){return N.forEach(this.D_,((r,s)=>this.Os(e,r,s).next((i=>i?N.resolve():t(s)))))}removeTargets(e,t,r){return this.persistence.getTargetCache().removeTargets(e,t,r)}removeOrphanedDocuments(e,t){let r=0;const s=this.persistence.getRemoteDocumentCache(),i=s.newChangeBuffer();return s.c_(e,(a=>this.Os(e,a,t).next((c=>{c||(r++,i.removeEntry(a,$.min()))})))).next((()=>i.apply(e))).next((()=>r))}markPotentiallyOrphaned(e,t){return this.D_.set(t,e.currentSequenceNumber),N.resolve()}removeTarget(e,t){const r=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,r)}addReference(e,t,r){return this.D_.set(r,e.currentSequenceNumber),N.resolve()}removeReference(e,t,r){return this.D_.set(r,e.currentSequenceNumber),N.resolve()}updateLimboDocument(e,t){return this.D_.set(t,e.currentSequenceNumber),N.resolve()}d_(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=mi(e.data.value)),t}Os(e,t,r){return N.or([()=>this.persistence.g_(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const s=this.D_.get(t);return N.resolve(s!==void 0&&s>r)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fc{constructor(e,t,r,s){this.targetId=e,this.fromCache=t,this.Vo=r,this.fo=s}static mo(e,t){let r=K(),s=K();for(const i of t.docChanges)switch(i.type){case 0:r=r.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new fc(e,t.fromCache,r,s)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gE(n,e){return B.comparator(n.key,e.key)}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _E{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yE{constructor(){this.po=!1,this.yo=!1,this.wo=100,this.bo=(function(){return Am()?8:uy(De())>0?6:4})()}initialize(e,t){this.So=e,this.indexManager=t,this.po=!0}getDocumentsMatchingQuery(e,t,r,s){const i={result:null};return this.vo(e,t).next((a=>{i.result=a})).next((()=>{if(!i.result)return this.Do(e,t,s,r).next((a=>{i.result=a}))})).next((()=>{if(i.result)return;const a=new _E;return this.xo(e,t,a).next((c=>{if(i.result=c,this.yo)return this.Co(e,t,a,c.size)}))})).next((()=>i.result))}Co(e,t,r,s){return Te(t)?N.resolve():r.documentReadCount<this.wo?(Jn()<=Y.DEBUG&&L("QueryEngine","SDK will not create cache indexes for query:",Zr(t),"since it only creates cache indexes for collection contains","more than or equal to",this.wo,"documents"),N.resolve()):(Jn()<=Y.DEBUG&&L("QueryEngine","Query:",Zr(t),"scans",r.documentReadCount,"local documents and returns",s,"documents as results."),r.documentReadCount>this.bo*s?(Jn()<=Y.DEBUG&&L("QueryEngine","The SDK decides to create cache indexes for query:",Zr(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,gt(t))):N.resolve())}vo(e,t){if(Te(t))return N.resolve(null);let r=t;if(wl(r))return N.resolve(null);let s=gt(r);return this.indexManager.getIndexType(e,s).next((i=>i===0?null:(r.limit!==null&&i===1&&(r=xi(r,null,"F"),s=gt(r)),this.indexManager.getDocumentsMatchingTarget(e,s).next((a=>{const c=K(...a);return this.So.getDocuments(e,c).next((l=>this.indexManager.getMinOffset(e,s).next((h=>{const f=this.Fo(r,l);return this.Oo(r,f,c,h.readTime)?this.vo(e,xi(r,null,"F")):this.Mo(e,f,r,h)}))))})))))}Do(e,t,r,s){return(Te(t)?(function(a){for(const c of a.stages){if(c instanceof Un||c instanceof Ol)return!1;if(c instanceof fo){if(c.condition instanceof Kd&&c.condition._expr.name==="exists"&&c.condition._expr.params[0]instanceof Er&&c.condition._expr.params[0].fieldName===dt)continue;return!1}}return!0})(t):wl(t))||s.isEqual($.min())?N.resolve(null):this.So.getDocuments(e,r).next((i=>{const a=this.Fo(t,i);return this.Oo(t,a,r,s)?N.resolve(null):(Jn()<=Y.DEBUG&&L("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),Ll(t)),this.Mo(e,a,t,o_(s,gs)).next((c=>c)))}))}Fo(e,t){let r,s;return Te(e)?(r=new _e(gE),s=i=>_o(e,i)):(r=new _e($a(e)),s=i=>so(e,i)),t.forEach(((i,a)=>{s(a)&&(r=r.add(a))})),r}Oo(e,t,r,s){if(Te(e))return(function(c){return c.stages.some((l=>l instanceof Un||l instanceof Ol))})(e);if(e.limit===null)return!1;if(r.size!==t.size)return!0;const i=e.limitType==="F"?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}xo(e,t,r){return Jn()<=Y.DEBUG&&L("QueryEngine","Using full collection scan to execute query:",Ll(t)),this.So.getDocumentsMatchingQuery(e,t,un.min(),r)}Mo(e,t,r,s){return this.So.getDocumentsMatchingQuery(e,r,s).next((i=>(t.forEach((a=>{i=i.insert(a.key,a)})),i)))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pc="LocalStore",wE=3e8;class EE{constructor(e,t,r,s){this.persistence=e,this.No=t,this.serializer=s,this.Lo=new oe(Q),this.Bo=new zn((i=>cf(i)),uf),this.Uo=new Map,this.ko=e.getRemoteDocumentCache(),this.V_=e.getTargetCache(),this.f_=e.getBundleCache(),this.qo(r)}qo(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new aE(this.ko,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.ko.setIndexManager(this.indexManager),this.No.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.Lo)))}}function TE(n,e,t,r){return new EE(n,e,t,r)}async function ff(n,e){const t=H(n);return await t.persistence.runTransaction("Handle user change","readonly",(r=>{let s;return t.mutationQueue.getAllMutationBatches(r).next((i=>(s=i,t.qo(e),t.mutationQueue.getAllMutationBatches(r)))).next((i=>{const a=[],c=[];let l=K();for(const h of s){a.push(h.batchId);for(const f of h.mutations)l=l.add(f.key)}for(const h of i){c.push(h.batchId);for(const f of h.mutations)l=l.add(f.key)}return t.localDocuments.getDocuments(r,l).next((h=>({$o:h,removedBatchIds:a,addedBatchIds:c})))}))}))}function IE(n,e){const t=H(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(r=>{const s=e.batch.keys(),i=t.ko.newChangeBuffer({trackRemovals:!0});return(function(c,l,h,f){const m=h.batch,y=m.keys();let b=N.resolve();return y.forEach((V=>{b=b.next((()=>f.getEntry(l,V))).next((M=>{const x=h.docVersions.get(V);U(x!==null,48541),M.version.compareTo(x)<0&&(m.applyToRemoteDocument(M,h),M.isValidDocument()&&(M.setReadTime(h.commitVersion),f.addEntry(M)))}))})),b.next((()=>c.mutationQueue.removeMutationBatch(l,m)))})(t,r,e,i).next((()=>i.apply(r))).next((()=>t.mutationQueue.performConsistencyCheck(r))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(r,s,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,(function(c){let l=K();for(let h=0;h<c.mutationResults.length;++h)c.mutationResults[h].transformResults.length>0&&(l=l.add(c.batch.mutations[h].key));return l})(e)))).next((()=>t.localDocuments.getDocuments(r,s)))}))}function pf(n){const e=H(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.V_.getLastRemoteSnapshotVersion(t)))}function vE(n,e){const t=H(n),r=e.snapshotVersion;let s=t.Lo;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(i=>{const a=t.ko.newChangeBuffer({trackRemovals:!0});s=t.Lo;const c=[];e.targetChanges.forEach(((f,m)=>{const y=s.get(m);if(!y)return;c.push(t.V_.removeMatchingKeys(i,f.removedDocuments,m).next((()=>t.V_.addMatchingKeys(i,f.addedDocuments,m))));let b=y.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(m)!==null?b=b.withResumeToken(ye.EMPTY_BYTE_STRING,$.min()).withLastLimboFreeSnapshotVersion($.min()):f.resumeToken.approximateByteSize()>0&&(b=b.withResumeToken(f.resumeToken,r)),s=s.insert(m,b),(function(M,x,z){return M.resumeToken.approximateByteSize()===0||x.snapshotVersion.toMicroseconds()-M.snapshotVersion.toMicroseconds()>=wE?!0:z.addedDocuments.size+z.modifiedDocuments.size+z.removedDocuments.size>0})(y,b,f)&&c.push(t.V_.updateTargetData(i,b))}));let l=$e(),h=K();if(e.documentUpdates.forEach((f=>{e.resolvedLimboDocuments.has(f)&&c.push(t.persistence.referenceDelegate.updateLimboDocument(i,f))})),c.push(AE(i,a,e.documentUpdates).next((f=>{l=f.Ko,h=f.Qo}))),!r.isEqual($.min())){const f=t.V_.getLastRemoteSnapshotVersion(i).next((m=>t.V_.setTargetsMetadata(i,i.currentSequenceNumber,r)));c.push(f)}return N.waitFor(c).next((()=>a.apply(i))).next((()=>t.localDocuments.getLocalViewOfDocuments(i,l,h))).next((()=>l))})).then((i=>(t.Lo=s,i)))}function AE(n,e,t){let r=K(),s=K();return t.forEach((i=>r=r.add(i))),e.getEntries(n,r).next((i=>{let a=$e();return t.forEach(((c,l)=>{const h=i.get(c);l.isFoundDocument()!==h.isFoundDocument()&&(s=s.add(c)),l.isNoDocument()&&l.version.isEqual($.min())?(e.removeEntry(c,l.readTime),a=a.insert(c,l)):!h.isValidDocument()||l.version.compareTo(h.version)>0||l.version.compareTo(h.version)===0&&h.hasPendingWrites?(e.addEntry(l),a=a.insert(c,l)):L(pc,"Ignoring outdated watch update for ",c,". Current version:",h.version," Watch version:",l.version)})),{Ko:a,Qo:s}}))}function RE(n,e){const t=H(n);return t.persistence.runTransaction("Get next mutation batch","readonly",(r=>(e===void 0&&(e=Fa),t.mutationQueue.getNextMutationBatchAfterBatchId(r,e))))}function PE(n,e){const t=H(n);return t.persistence.runTransaction("Allocate target","readwrite",(r=>{let s;return t.V_.getTargetData(r,e).next((i=>i?(s=i,N.resolve(s)):t.V_.allocateTargetId(r).next((a=>(s=new Pt(e,a,"TargetPurposeListen",r.currentSequenceNumber),t.V_.addTargetData(r,s).next((()=>s)))))))})).then((r=>{const s=t.Lo.get(r.targetId);return(s===null||r.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(t.Lo=t.Lo.insert(r.targetId,r),t.Bo.set(e,r.targetId)),r}))}async function Ra(n,e,t){const r=H(n),s=r.Lo.get(e),i=t?"readwrite":"readwrite-primary";try{t||await r.persistence.runTransaction("Release target",i,(a=>r.persistence.referenceDelegate.removeTarget(a,s)))}catch(a){if(!yr(a))throw a;L(pc,`Failed to update sequence numbers for target ${e}: ${a}`)}r.Lo=r.Lo.remove(e),r.Bo.delete(s.target)}function Ul(n,e,t){const r=H(n);let s=$.min(),i=K();return r.persistence.runTransaction("Execute query","readwrite",(a=>(function(l,h,f){const m=H(l),y=m.Bo.get(f);return y!==void 0?N.resolve(m.Lo.get(y)):m.V_.getTargetData(h,f)})(r,a,Te(e)?e:gt(e)).next((c=>{if(c)return s=c.lastLimboFreeSnapshotVersion,r.V_.getMatchingKeysForTargetId(a,c.targetId).next((l=>{i=l}))})).next((()=>r.No.getDocumentsMatchingQuery(a,e,t?s:$.min(),t?i:K()))).next((c=>(bE(r,c),{documents:c,Wo:i})))))}function bE(n,e){e.forEach(((t,r)=>{const s=r.key.getCollectionGroup(),i=n.Uo.get(s)||$.min();r.readTime.compareTo(i)>0&&n.Uo.set(s,r.readTime)}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class SE{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.Yo=0,this.Zo=null,this.Xo=!0}ea(){this.Yo===0&&(this.ta("Unknown"),this.Zo=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this.Zo=null,this.na("Backend didn't respond within 10 seconds."),this.ta("Offline"),Promise.resolve()))))}ra(e){this.state==="Online"?this.ta("Unknown"):(this.Yo++,this.Yo>=1&&(this.ia(),this.na(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ta("Offline")))}set(e){this.ia(),this.Yo=0,e==="Online"&&(this.Xo=!1),this.ta(e)}ta(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}na(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.Xo?(kt(t),this.Xo=!1):L("OnlineStateTracker",t)}ia(){this.Zo!==null&&(this.Zo.cancel(),this.Zo=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tt="RemoteStore";class CE{constructor(e,t,r,s,i){this.localStore=e,this.datastore=t,this.asyncQueue=r,this.remoteSyncer={},this.sa=[],this._a=new Map,this.oa=new Map,this.aa=new Map,this.ua=new pn(1e3),this.ca=new pn(1001),this.la=new Set,this.Ea=[],this.ha=i,this.ha.Qe((a=>{r.enqueueAndForget((async()=>{Wn(this)&&(L(Tt,"Restarting streams for network reachability change."),await(async function(l){const h=H(l);h.la.add(4),await Ms(h),h.Ta.set("Unknown"),h.la.delete(4),await yo(h)})(this))}))})),this.Ta=new SE(r,s)}}async function yo(n){if(Wn(n))for(const e of n.Ea)await e(!0)}async function Ms(n){for(const e of n.Ea)await e(!1)}function Pa(n,e){return n.oa.get(e)||void 0}function mf(n,e){const t=H(n),r=Pa(t,e.targetId);if(r!==void 0&&t._a.has(r))return;const s=(function(c,l){const h=Pa(c,l);h!==void 0&&c.aa.delete(h);const f=(function(y,b){return b%2!=0?y.ca.next():y.ua.next()})(c,l);return c.oa.set(l,f),c.aa.set(f,l),f})(t,e.targetId);L(Tt,"remoteStoreListen mapping SDK target ID to remote",e.targetId,s);const i=new Pt(e.target,s,e.purpose,e.sequenceNumber,e.snapshotVersion,e.lastLimboFreeSnapshotVersion,e.resumeToken);t._a.set(s,i),yc(t)?_c(t):Ar(t).Yt()&&gc(t,i)}function mc(n,e){const t=H(n),r=Ar(t),s=Pa(t,e);L(Tt,"remoteStoreUnlisten removing mapping of SDK target ID to remote",e,s),t._a.delete(s),t.oa.delete(e),t.aa.delete(s),r.Yt()&&gf(t,s),t._a.size===0&&(r.Yt()?r.en():Wn(t)&&t.Ta.set("Unknown"))}function gc(n,e){if(n.Pa.J(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo($.min())>0){const t=n.aa.get(e.targetId);if(t===void 0)return void L(Tt,"SDK target ID not found for remote ID: "+e.targetId);const r=n.remoteSyncer.getRemoteKeysForTarget(t).size;e=e.withExpectedCount(r)}Ar(n).Pn(e)}function gf(n,e){n.Pa.J(e),Ar(n).In(e)}function _c(n){n.Pa=new A_({getRemoteKeysForTarget:e=>{const t=n.aa.get(e);return t!==void 0?n.remoteSyncer.getRemoteKeysForTarget(t):K()},ye:e=>n._a.get(e)||null,Ve:()=>n.datastore.serializer.databaseId}),Ar(n).start(),n.Ta.ea()}function yc(n){return Wn(n)&&!Ar(n).Jt()&&n._a.size>0}function Wn(n){return H(n).la.size===0}function _f(n){n.Pa=void 0}async function VE(n){n.Ta.set("Online")}async function NE(n){n._a.forEach(((e,t)=>{gc(n,e)}))}async function kE(n,e){_f(n),yc(n)?(n.Ta.ra(e),_c(n)):n.Ta.set("Unknown")}async function DE(n,e,t){if(n.Ta.set("Online"),e instanceof vd&&e.state===2&&e.cause)try{await(async function(s,i){const a=i.cause;for(const c of i.targetIds){if(s._a.has(c)){const l=s.aa.get(c);l!==void 0&&(await s.remoteSyncer.rejectListen(l,a),s.oa.delete(l),s.aa.delete(c)),s._a.delete(c)}s.Pa.removeTarget(c)}})(n,e)}catch(r){L(Tt,"Failed to remove targets %s: %s ",e.targetIds.join(","),r),await Ui(n,r)}else if(e instanceof _i?n.Pa._e(e):e instanceof Id?n.Pa.he(e):n.Pa.ue(e),!t.isEqual($.min()))try{const r=await pf(n.localStore);t.compareTo(r)>=0&&await(function(i,a){const c=i.Pa.fe(a);c.targetChanges.forEach(((h,f)=>{if(h.resumeToken.approximateByteSize()>0){const m=i._a.get(f);m&&i._a.set(f,m.withResumeToken(h.resumeToken,a))}})),c.targetMismatches.forEach(((h,f)=>{const m=i._a.get(h);if(!m)return;i._a.set(h,m.withResumeToken(ye.EMPTY_BYTE_STRING,m.snapshotVersion)),gf(i,h);const y=new Pt(m.target,h,f,m.sequenceNumber);gc(i,y)}));const l=(function(f,m){const y=new Map;m.targetChanges.forEach(((V,M)=>{const x=f.aa.get(M);x!==void 0&&y.set(x,V)}));let b=new oe(Q);return m.targetMismatches.forEach(((V,M)=>{const x=f.aa.get(V);x!==void 0&&(b=b.insert(x,M))})),new Ds(m.snapshotVersion,y,b,m.documentUpdates,m.augmentedDocumentUpdates,m.resolvedLimboDocuments)})(i,c);return i.remoteSyncer.applyRemoteEvent(l)})(n,t)}catch(r){L(Tt,"Failed to raise snapshot:",r),await Ui(n,r)}}async function Ui(n,e,t){if(!yr(e))throw e;n.la.add(1),await Ms(n),n.Ta.set("Offline"),t||(t=()=>pf(n.localStore)),n.asyncQueue.enqueueRetryable((async()=>{L(Tt,"Retrying IndexedDB access"),await t(),n.la.delete(1),await yo(n)}))}function yf(n,e){return e().catch((t=>Ui(n,t,e)))}async function wo(n){const e=H(n),t=mn(e);let r=e.sa.length>0?e.sa[e.sa.length-1].batchId:Fa;for(;xE(e);)try{const s=await RE(e.localStore,r);if(s===null){e.sa.length===0&&t.en();break}r=s.batchId,OE(e,s)}catch(s){await Ui(e,s)}wf(e)&&Ef(e)}function xE(n){return Wn(n)&&n.sa.length<10}function OE(n,e){n.sa.push(e);const t=mn(n);t.Yt()&&t.Rn&&t.An(e.mutations)}function wf(n){return Wn(n)&&!mn(n).Jt()&&n.sa.length>0}function Ef(n){mn(n).start()}async function LE(n){mn(n).fn()}async function ME(n){const e=mn(n);for(const t of n.sa)e.An(t.mutations)}async function UE(n,e,t){const r=n.sa.shift(),s=lc.from(r,e,t);await yf(n,(()=>n.remoteSyncer.applySuccessfulWrite(s))),await wo(n)}async function FE(n,e){e&&mn(n).Rn&&await(async function(r,s){if((function(a){return _d(a)&&a!==S.ABORTED})(s.code)){const i=r.sa.shift();mn(r).Xt(),await yf(r,(()=>r.remoteSyncer.rejectFailedWrite(i.batchId,s))),await wo(r)}})(n,e),wf(n)&&Ef(n)}async function Fl(n,e){const t=H(n);t.asyncQueue.verifyOperationInProgress(),L(Tt,"RemoteStore received new credentials");const r=Wn(t);t.la.add(3),await Ms(t),r&&t.Ta.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.la.delete(3),await yo(t)}async function BE(n,e){const t=H(n);e?(t.la.delete(2),await yo(t)):e||(t.la.add(2),await Ms(t),t.Ta.set("Unknown"))}function Ar(n){return n.Ia||(n.Ia=(function(t,r,s){const i=H(t);return i.pn(),new ey(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(n.datastore,n.asyncQueue,{ct:VE.bind(null,n),Et:NE.bind(null,n),Tt:kE.bind(null,n),Tn:DE.bind(null,n)}),n.Ea.push((async e=>{e?(n.Ia.Xt(),yc(n)?_c(n):n.Ta.set("Unknown")):(await n.Ia.stop(),_f(n))}))),n.Ia}function mn(n){return n.Ra||(n.Ra=(function(t,r,s){const i=H(t);return i.pn(),new ty(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(n.datastore,n.asyncQueue,{ct:()=>Promise.resolve(),Et:LE.bind(null,n),Tt:FE.bind(null,n),Vn:ME.bind(null,n),dn:UE.bind(null,n)}),n.Ea.push((async e=>{e?(n.Ra.Xt(),await wo(n)):(await n.Ra.stop(),n.sa.length>0&&(L(Tt,`Stopping write stream with ${n.sa.length} pending writes`),n.sa=[]))}))),n.Ra}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wc{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Aa(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Aa(this.observer.error,e):kt("Uncaught Error in snapshot listener:",e.toString()))}Va(){this.muted=!0}Aa(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ec{constructor(e,t,r,s,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=s,this.removalCallback=i,this.deferred=new yt,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((a=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,s,i){const a=Date.now()+r,c=new Ec(e,t,a,s,i);return c.start(r),c}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new k(S.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Tc(n,e){if(kt("AsyncQueue",`${e}: ${n}`),yr(n))return new k(S.UNAVAILABLE,`${e}: ${n}`);throw n}class Bl{constructor(){this.activeTargetIds=T_()}Ba(e){this.activeTargetIds=this.activeTargetIds.add(e)}Ua(e){this.activeTargetIds=this.activeTargetIds.delete(e)}La(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class qE{constructor(){this.fu=new Bl,this.mu={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,r){}addLocalQueryTarget(e,t=!0){return t&&this.fu.Ba(e),this.mu[e]||"not-current"}updateQueryState(e,t,r){this.mu[e]=t}removeLocalQueryTarget(e){this.fu.Ua(e)}isLocalQueryTarget(e){return this.fu.activeTargetIds.has(e)}clearQueryState(e){delete this.mu[e]}getAllActiveQueryTargets(){return this.fu.activeTargetIds}isActiveQueryTarget(e){return this.fu.activeTargetIds.has(e)}start(){return this.fu=new Bl,Promise.resolve()}handleUserChange(e,t,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}function ra(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vn{static emptySet(e){return new Vn(e.comparator)}constructor(e){this.comparator=e?(t,r)=>e(t,r)||B.comparator(t.key,r.key):(t,r)=>B.comparator(t.key,r.key),this.keyedMap=Zn(),this.sortedSet=new oe(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,r)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof Vn)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=r.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const r=new Vn;return r.comparator=this.comparator,r.keyedMap=e,r.sortedSet=t,r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ql{constructor(){this.pu=new oe(B.comparator)}track(e){const t=e.doc.key,r=this.pu.get(t);r?e.type!==0&&r.type===3?this.pu=this.pu.insert(t,e):e.type===3&&r.type!==1?this.pu=this.pu.insert(t,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.pu=this.pu.insert(t,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.pu=this.pu.insert(t,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.pu=this.pu.remove(t):e.type===1&&r.type===2?this.pu=this.pu.insert(t,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.pu=this.pu.insert(t,{type:2,doc:e.doc}):F(63341,{we:e,gu:r}):this.pu=this.pu.insert(t,e)}yu(){const e=[];return this.pu.inorderTraversal(((t,r)=>{e.push(r)})),e}}class dr{constructor(e,t,r,s,i,a,c,l,h){this.query=e,this.docs=t,this.oldDocs=r,this.docChanges=s,this.mutatedKeys=i,this.fromCache=a,this.syncStateChanged=c,this.excludesMetadataChanges=l,this.hasCachedResults=h}static fromInitialDocuments(e,t,r,s,i){const a=[];return t.forEach((c=>{a.push({type:0,doc:c})})),new dr(e,t,Vn.emptySet(t),a,r,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&go(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,r=e.docChanges;if(t.length!==r.length)return!1;for(let s=0;s<t.length;s++)if(t[s].type!==r[s].type||!t[s].doc.isEqual(r[s].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $E{constructor(){this.wu=void 0,this.bu=[]}Su(){return this.bu.some((e=>e.vu()))}}class jE{constructor(){this.queries=$l(),this.onlineState="Unknown",this.Du=new Set}terminate(){(function(t,r){const s=H(t),i=s.queries;s.queries=$l(),i.forEach(((a,c)=>{for(const l of c.bu)l.onError(r)}))})(this,new k(S.ABORTED,"Firestore shutting down"))}}function $l(){return new zn((n=>af(n)),go)}async function Ic(n,e){const t=H(n);let r=3;const s=e.query;let i=t.queries.get(s);i?!i.Su()&&e.vu()&&(r=2):(i=new $E,r=e.vu()?0:1);try{switch(r){case 0:i.wu=await t.onListen(s,!0);break;case 1:i.wu=await t.onListen(s,!1);break;case 2:await t.onFirstRemoteStoreListen(s)}}catch(a){const c=Tc(a,`Initialization of query '${Te(e.query)?Ct(e.query):Zr(e.query)}' failed`);return void e.onError(c)}t.queries.set(s,i),i.bu.push(e),e.xu(t.onlineState),i.wu&&e.Cu(i.wu)&&Ac(t)}async function vc(n,e){const t=H(n),r=e.query;let s=3;const i=t.queries.get(r);if(i){const a=i.bu.indexOf(e);a>=0&&(i.bu.splice(a,1),i.bu.length===0?s=e.vu()?0:1:!i.Su()&&e.vu()&&(s=2))}switch(s){case 0:return t.queries.delete(r),t.onUnlisten(r,!0);case 1:return t.queries.delete(r),t.onUnlisten(r,!1);case 2:return t.onLastRemoteStoreUnlisten(r);default:return}}function zE(n,e){const t=H(n);let r=!1;for(const s of e){const i=s.query,a=t.queries.get(i);if(a){for(const c of a.bu)c.Cu(s)&&(r=!0);a.wu=s}}r&&Ac(t)}function HE(n,e,t){const r=H(n),s=r.queries.get(e);if(s)for(const i of s.bu)i.onError(t);r.queries.delete(e)}function Ac(n){n.Du.forEach((e=>{e.next()}))}var ba;(function(n){n.Default="default",n.Cache="cache"})(ba||(ba={}));class Rc{constructor(e,t,r){this.query=e,this.Fu=t,this.Ou=!1,this.Mu=null,this.onlineState="Unknown",this.options=r||{}}Cu(e){if(!this.options.includeMetadataChanges){const r=[];for(const s of e.docChanges)s.type!==3&&r.push(s);e=new dr(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.Ou?this.Nu(e)&&(this.Fu.next(e),t=!0):this.Lu(e,this.onlineState)&&(this.Bu(e),t=!0),this.Mu=e,t}onError(e){this.Fu.error(e)}xu(e){this.onlineState=e;let t=!1;return this.Mu&&!this.Ou&&this.Lu(this.Mu,e)&&(this.Bu(this.Mu),t=!0),t}Lu(e,t){if(!e.fromCache||!this.vu())return!0;const r=t!=="Offline";return(!this.options.waitForSyncWhenOnline||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}Nu(e){if(e.docChanges.length>0)return!0;const t=this.Mu&&this.Mu.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}Bu(e){e=dr.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Ou=!0,this.Fu.next(e)}vu(){return this.options.source!==ba.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tf{constructor(e){this.key=e}}class If{constructor(e){this.key=e}}class WE{constructor(e,t){this.query=e,this.zu=t,this.ju=null,this.hasCachedResults=!1,this.current=!1,this.Hu=K(),this.mutatedKeys=K(),this.Ju=Te(e)?Aa(e):$a(e),this.Yu=new Vn(this.Ju)}get Zu(){return this.zu}Xu(e,t){const r=t?t.ec:new ql,s=t?t.Yu:this.Yu;let i=t?t.mutatedKeys:this.mutatedKeys,a=s,c=!1;const[l,h]=this.tc(this.query,s);e.inorderTraversal(((m,y)=>{const b=s.get(m),V=rE(this.query,y)?y:null,M=!!b&&this.mutatedKeys.has(b.key),x=!!V&&(V.hasLocalMutations||this.mutatedKeys.has(V.key)&&V.hasCommittedMutations);let z=!1;b&&V?b.data.isEqual(V.data)?M!==x&&(r.track({type:3,doc:V}),z=!0):this.nc(b,V)||(r.track({type:2,doc:V}),z=!0,(l&&this.Ju(V,l)>0||h&&this.Ju(V,h)<0)&&(c=!0)):!b&&V?(r.track({type:0,doc:V}),z=!0):b&&!V&&(r.track({type:1,doc:b}),z=!0,(l||h)&&(c=!0)),z&&(V?(a=a.add(V),i=x?i.add(m):i.delete(m)):(a=a.delete(m),i=i.delete(m)))}));const f=this.rc(this.query);if(f)if(Te(this.query)){const m=[];a.forEach((V=>m.push(V)));const y=hf(this.query,m);let b=new Vn(Aa(this.query));for(const V of y)b=b.add(V);a.forEach((V=>{b.has(V.key)||(i=i.delete(V.key),r.track({type:1,doc:V}))})),a=b}else{const m=this.sc(this.query);for(;a.size>f;){const y=m==="F"?a.last():a.first();a=a.delete(y.key),i=i.delete(y.key),r.track({type:1,doc:y})}}return{Yu:a,ec:r,Oo:c,mutatedKeys:i}}rc(e){var t;return Te(e)?(t=na(e))==null?void 0:t.limit:e.limit||void 0}sc(e){if(Te(e)){const t=na(e);return t&&t.limit<0?"L":"F"}return e.limitType}tc(e,t){var r;if(Te(e)){const s=(r=na(e))==null?void 0:r.limit;return[t.size===s?t.last():null,null]}return[e.limitType==="F"&&t.size===this.rc(this.query)?t.last():null,e.limitType==="L"&&t.size===this.rc(this.query)?t.first():null]}nc(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,r,s){const i=this.Yu;this.Yu=e.Yu,this.mutatedKeys=e.mutatedKeys;const a=e.ec.yu();a.sort(((f,m)=>(function(b,V){const M=x=>{switch(x){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return F(20277,{we:x})}};return M(b)-M(V)})(f.type,m.type)||this.Ju(f.doc,m.doc))),this._c(r),s=s??!1;const c=t&&!s?this.oc():[],l=this.Hu.size===0&&this.current&&!s?1:0,h=l!==this.ju;return this.ju=l,a.length!==0||h?{snapshot:new dr(this.query,e.Yu,i,a,e.mutatedKeys,l===0,h,!1,!!r&&r.resumeToken.approximateByteSize()>0),ac:c}:{ac:c}}xu(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Yu:this.Yu,ec:new ql,mutatedKeys:this.mutatedKeys,Oo:!1},!1)):{ac:[]}}uc(e){return!this.zu.has(e)&&!!this.Yu.has(e)&&!this.Yu.get(e).hasLocalMutations}_c(e){e&&(e.addedDocuments.forEach((t=>this.zu=this.zu.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.zu=this.zu.delete(t))),this.current=e.current)}oc(){if(!this.current)return[];const e=this.Hu;this.Hu=K(),this.Yu.forEach((r=>{this.uc(r.key)&&(this.Hu=this.Hu.add(r.key))}));const t=[];return e.forEach((r=>{this.Hu.has(r)||t.push(new If(r))})),this.Hu.forEach((r=>{e.has(r)||t.push(new Tf(r))})),t}cc(e){this.zu=e.Wo,this.Hu=K();const t=this.Xu(e.documents);return this.applyChanges(t,!0)}lc(){return dr.fromInitialDocuments(this.query,this.Yu,this.mutatedKeys,this.ju===0,this.hasCachedResults)}}const Pc="SyncEngine";class GE{constructor(e,t,r){this.query=e,this.targetId=t,this.view=r}}class KE{constructor(e){this.key=e,this.Ec=!1}}class QE{constructor(e,t,r,s,i,a){this.localStore=e,this.remoteStore=t,this.eventManager=r,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=a,this.hc={},this.Tc=new zn((c=>af(c)),go),this.Pc=new Map,this.Ic=new Set,this.Rc=new oe(B.comparator),this.Ac=new Map,this.Vc=new hc,this.dc={},this.fc=new Map,this.mc=pn.bs(),this.onlineState="Unknown",this.gc=void 0}get isPrimaryClient(){return this.gc===!0}}async function YE(n,e,t=!0){const r=Sf(n);let s;const i=r.Tc.get(e);return i?(r.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.lc()):s=await vf(r,e,t,!0),s}async function JE(n,e){const t=Sf(n);await vf(t,e,!0,!1)}async function vf(n,e,t,r){const s=await PE(n.localStore,Te(e)?e:gt(e)),i=s.targetId,a=n.sharedClientState.addLocalQueryTarget(i,t);let c;return r&&(c=await XE(n,e,i,a==="current",s.resumeToken)),n.isPrimaryClient&&t&&mf(n.remoteStore,s),c}async function XE(n,e,t,r,s){n.yc=(m,y,b)=>(async function(M,x,z,G){let X=x.view.Xu(z);X.Oo&&(X=await Ul(M.localStore,x.query,!1).then((({documents:I})=>x.view.Xu(I,X))));const ne=G&&G.targetChanges.get(x.targetId),he=G&&G.targetMismatches.get(x.targetId)!=null,de=x.view.applyChanges(X,M.isPrimaryClient,ne,he);return zl(M,x.targetId,de.ac),de.snapshot})(n,m,y,b);const i=await Ul(n.localStore,e,!0),a=new WE(e,i.Wo),c=a.Xu(i.documents),l=xs.createSynthesizedTargetChangeForCurrentChange(t,r&&n.onlineState!=="Offline",s),h=a.applyChanges(c,n.isPrimaryClient,l);zl(n,t,h.ac);const f=new GE(e,t,a);return n.Tc.set(e,f),n.Pc.has(t)?n.Pc.get(t).push(e):n.Pc.set(t,[e]),h.snapshot}async function ZE(n,e,t){const r=H(n),s=r.Tc.get(e),i=r.Pc.get(s.targetId);if(i.length>1)return r.Pc.set(s.targetId,i.filter((a=>!go(a,e)))),void r.Tc.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(s.targetId),r.sharedClientState.isActiveQueryTarget(s.targetId)||await Ra(r.localStore,s.targetId,!1).then((()=>{r.sharedClientState.clearQueryState(s.targetId),t&&mc(r.remoteStore,s.targetId),Sa(r,s.targetId)})).catch(_r)):(Sa(r,s.targetId),await Ra(r.localStore,s.targetId,!0))}async function eT(n,e){const t=H(n),r=t.Tc.get(e),s=t.Pc.get(r.targetId);t.isPrimaryClient&&s.length===1&&(t.sharedClientState.removeLocalQueryTarget(r.targetId),mc(t.remoteStore,r.targetId))}async function tT(n,e,t){const r=cT(n);try{const s=await(function(a,c){const l=H(a),h=ee.now(),f=c.reduce(((b,V)=>b.add(V.key)),K());let m,y;return l.persistence.runTransaction("Locally write mutations","readwrite",(b=>{let V=$e(),M=K();return l.ko.getEntries(b,f).next((x=>{V=x,V.forEach(((z,G)=>{G.isValidDocument()||(M=M.add(z))}))})).next((()=>l.localDocuments.getOverlayedDocuments(b,V))).next((x=>{m=x;const z=[];for(const G of c){const X=Yg(G,m.get(G.key).overlayedDocument);X!=null&&z.push(new yn(G.key,X,Xh(X.value.mapValue),pe.exists(!0)))}return l.mutationQueue.addMutationBatch(b,h,z,c)})).next((x=>{y=x;const z=x.applyToLocalDocumentSet(m,M);return l.documentOverlayCache.saveOverlays(b,x.batchId,z)}))})).then((()=>({batchId:y.batchId,changes:Ed(m)})))})(r.localStore,e);r.sharedClientState.addPendingMutation(s.batchId),(function(a,c,l){let h=a.dc[a.currentUser.toKey()];h||(h=new oe(Q)),h=h.insert(c,l),a.dc[a.currentUser.toKey()]=h})(r,s.batchId,t),await Us(r,s.changes),await wo(r.remoteStore)}catch(s){const i=Tc(s,"Failed to persist write");t.reject(i)}}async function Af(n,e){const t=H(n);try{const r=await vE(t.localStore,e);e.targetChanges.forEach(((s,i)=>{const a=t.Ac.get(i);a&&(U(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1,22616),s.addedDocuments.size>0?a.Ec=!0:s.modifiedDocuments.size>0?U(a.Ec,14607):s.removedDocuments.size>0&&(U(a.Ec,42227),a.Ec=!1))})),await Us(t,r,e)}catch(r){await _r(r)}}function jl(n,e,t){const r=H(n);if(r.isPrimaryClient&&t===0||!r.isPrimaryClient&&t===1){const s=[];r.Tc.forEach(((i,a)=>{const c=a.view.xu(e);c.snapshot&&s.push(c.snapshot)})),(function(a,c){const l=H(a);l.onlineState=c;let h=!1;l.queries.forEach(((f,m)=>{for(const y of m.bu)y.xu(c)&&(h=!0)})),h&&Ac(l)})(r.eventManager,e),s.length&&r.hc.Tn(s),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function nT(n,e,t){const r=H(n);r.sharedClientState.updateQueryState(e,"rejected",t);const s=r.Ac.get(e),i=s&&s.key;if(i){let a=new oe(B.comparator);a=a.insert(i,Ae.newNoDocument(i,$.min()));const c=K().add(i),l=new Ds($.min(),new Map,new oe(Q),a,$e(),c);await Af(r,l),r.Rc=r.Rc.remove(i),r.Ac.delete(e),bc(r)}else await Ra(r.localStore,e,!1).then((()=>Sa(r,e,t))).catch(_r)}async function rT(n,e){const t=H(n),r=e.batch.batchId;try{const s=await IE(t.localStore,e);Pf(t,r,null),Rf(t,r),t.sharedClientState.updateMutationState(r,"acknowledged"),await Us(t,s)}catch(s){await _r(s)}}async function sT(n,e,t){const r=H(n);try{const s=await(function(a,c){const l=H(a);return l.persistence.runTransaction("Reject batch","readwrite-primary",(h=>{let f;return l.mutationQueue.lookupMutationBatch(h,c).next((m=>(U(m!==null,37113),f=m.keys(),l.mutationQueue.removeMutationBatch(h,m)))).next((()=>l.mutationQueue.performConsistencyCheck(h))).next((()=>l.documentOverlayCache.removeOverlaysForBatchId(h,f,c))).next((()=>l.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(h,f))).next((()=>l.localDocuments.getDocuments(h,f)))}))})(r.localStore,e);Pf(r,e,t),Rf(r,e),r.sharedClientState.updateMutationState(e,"rejected",t),await Us(r,s)}catch(s){await _r(s)}}function Rf(n,e){(n.fc.get(e)||[]).forEach((t=>{t.resolve()})),n.fc.delete(e)}function Pf(n,e,t){const r=H(n);let s=r.dc[r.currentUser.toKey()];if(s){const i=s.get(e);i&&(t?i.reject(t):i.resolve(),s=s.remove(e)),r.dc[r.currentUser.toKey()]=s}}function Sa(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(const r of n.Pc.get(e))n.Tc.delete(r),t&&n.hc.wc(r,t);n.Pc.delete(e),n.isPrimaryClient&&n.Vc.e_(e).forEach((r=>{n.Vc.containsKey(r)||bf(n,r)}))}function bf(n,e){n.Ic.delete(e.path.canonicalString());const t=n.Rc.get(e);t!==null&&(mc(n.remoteStore,t),n.Rc=n.Rc.remove(e),n.Ac.delete(t),bc(n))}function zl(n,e,t){for(const r of t)r instanceof Tf?(n.Vc.addReference(r.key,e),iT(n,r)):r instanceof If?(L(Pc,"Document no longer in limbo: "+r.key),n.Vc.removeReference(r.key,e),n.Vc.containsKey(r.key)||bf(n,r.key)):F(19791,{bc:r})}function iT(n,e){const t=e.key,r=t.path.canonicalString();n.Rc.get(t)||n.Ic.has(r)||(L(Pc,"New document in limbo: "+t),n.Ic.add(r),bc(n))}function bc(n){for(;n.Ic.size>0&&n.Rc.size<n.maxConcurrentLimboResolutions;){const e=n.Ic.values().next().value;n.Ic.delete(e);const t=new B(Z.fromString(e)),r=n.mc.next();n.Ac.set(r,new KE(t)),n.Rc=n.Rc.insert(t,r),mf(n.remoteStore,new Pt(gt(ro(t.path)),r,"TargetPurposeLimboResolution",oo.wn))}}async function Us(n,e,t){const r=H(n),s=[],i=[],a=[];r.Tc.isEmpty()||(r.Tc.forEach(((c,l)=>{a.push(r.yc(l,e,t).then((h=>{var f;if((h||t)&&r.isPrimaryClient){const m=h?!h.fromCache:(f=t==null?void 0:t.targetChanges.get(l.targetId))==null?void 0:f.current;r.sharedClientState.updateQueryState(l.targetId,m?"current":"not-current")}if(h){s.push(h);const m=fc.mo(l.targetId,h);i.push(m)}})))})),await Promise.all(a),r.hc.Tn(s),await(async function(l,h){const f=H(l);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",(m=>N.forEach(h,(y=>N.forEach(y.Vo,(b=>f.persistence.referenceDelegate.addReference(m,y.targetId,b))).next((()=>N.forEach(y.fo,(b=>f.persistence.referenceDelegate.removeReference(m,y.targetId,b)))))))))}catch(m){if(!yr(m))throw m;L(pc,"Failed to update sequence numbers: "+m)}for(const m of h){const y=m.targetId;if(!m.fromCache){const b=f.Lo.get(y),V=b.snapshotVersion,M=b.withLastLimboFreeSnapshotVersion(V);f.Lo=f.Lo.insert(y,M)}}})(r.localStore,i))}async function oT(n,e){const t=H(n);if(!t.currentUser.isEqual(e)){L(Pc,"User change. New user:",e.toKey());const r=await ff(t.localStore,e);t.currentUser=e,(function(i,a){i.fc.forEach((c=>{c.forEach((l=>{l.reject(new k(S.CANCELLED,a))}))})),i.fc.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await Us(t,r.$o)}}function aT(n,e){const t=H(n),r=t.Ac.get(e);if(r&&r.Ec)return K().add(r.key);{let s=K();const i=t.Pc.get(e);if(!i)return s;for(const a of i??[]){const c=t.Tc.get(a);s=s.unionWith(c.view.Zu)}return s}}function Sf(n){const e=H(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=Af.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=aT.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=nT.bind(null,e),e.hc.Tn=zE.bind(null,e.eventManager),e.hc.wc=HE.bind(null,e.eventManager),e}function cT(n){const e=H(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=rT.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=sT.bind(null,e),e}class Fi{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=io(e.databaseInfo.databaseId),this.sharedClientState=this.vc(e),this.persistence=this.Dc(e),await this.persistence.start(),this.localStore=this.xc(e),this.gcScheduler=this.Cc(e,this.localStore),this.indexBackfillerScheduler=this.Fc(e,this.localStore)}Cc(e,t){return null}Fc(e,t){return null}xc(e){return TE(this.persistence,new yE,e.initialUser,this.serializer)}Dc(e){return new df(dc.b_,this.serializer)}vc(e){return new qE}async terminate(){var e,t;(e=this.gcScheduler)==null||e.stop(),(t=this.indexBackfillerScheduler)==null||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Fi.provider={build:()=>new Fi};class uT extends Fi{constructor(e){super(),this.cacheSizeBytes=e}Cc(e,t){U(this.persistence.referenceDelegate instanceof Mi,46915);const r=this.persistence.referenceDelegate.garbageCollector;return new dy(r,e.asyncQueue,t)}Dc(e){const t=this.cacheSizeBytes!==void 0?Be.withCacheSize(this.cacheSizeBytes):Be.DEFAULT;return new df((r=>Mi.b_(r,t)),this.serializer)}}class Ca{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>jl(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=oT.bind(null,this.syncEngine),await BE(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new jE})()}createDatastore(e){const t=io(e.databaseInfo.databaseId),r=Z_(e.databaseInfo);return sy(e.authCredentials,e.appCheckCredentials,r,t)}createRemoteStore(e){return(function(r,s,i,a,c){return new CE(r,s,i,a,c)})(this.localStore,this.datastore,e.asyncQueue,(t=>jl(this.syncEngine,t,0)),(function(){return bl.Ye()?new bl:new Q_})())}createSyncEngine(e,t){return(function(s,i,a,c,l,h,f){const m=new QE(s,i,a,c,l,h);return f&&(m.gc=!0),m})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await(async function(s){const i=H(s);L(Tt,"RemoteStore shutting down."),i.la.add(5),await Ms(i),i.ha.shutdown(),i.Ta.set("Unknown")})(this.remoteStore),(e=this.datastore)==null||e.terminate(),(t=this.eventManager)==null||t.terminate()}}Ca.provider={build:()=>new Ca};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let lT=class{constructor(e){this.datastore=e,this.readVersions=new Map,this.mutations=[],this.committed=!1,this.lastTransactionError=null,this.writtenDocs=new Set}async lookup(e){if(this.ensureCommitNotCalled(),this.mutations.length>0)throw this.lastTransactionError=new k(S.INVALID_ARGUMENT,"Firestore transactions require all reads to be executed before all writes."),this.lastTransactionError;const t=await(async function(s,i){const a=H(s),c={documents:i.map((m=>_s(a.serializer,m)))},l=await a._t("BatchGetDocuments",a.serializer.databaseId,Z.emptyPath(),c,i.length),h=new Map;l.forEach((m=>{const y=V_(a.serializer,m);h.set(y.key.toString(),y)}));const f=[];return i.forEach((m=>{const y=h.get(m.toString());U(!!y,55234,{key:m}),f.push(y)})),f})(this.datastore,e);return t.forEach((r=>this.recordVersion(r))),t}set(e,t){this.write(t.toMutation(e,this.precondition(e))),this.writtenDocs.add(e.toString())}update(e,t){try{this.write(t.toMutation(e,this.preconditionForUpdate(e)))}catch(r){this.lastTransactionError=r}this.writtenDocs.add(e.toString())}delete(e){this.write(new ks(e,this.precondition(e))),this.writtenDocs.add(e.toString())}async commit(){if(this.ensureCommitNotCalled(),this.lastTransactionError)throw this.lastTransactionError;const e=this.readVersions;this.mutations.forEach((t=>{e.delete(t.key.toString())})),e.forEach(((t,r)=>{const s=B.fromPath(r);this.mutations.push(new od(s,this.precondition(s)))})),await(async function(r,s){const i=H(r),a={writes:s.map((c=>Sd(i.serializer,c)))};await i.nt("Commit",i.serializer.databaseId,Z.emptyPath(),a)})(this.datastore,this.mutations),this.committed=!0}recordVersion(e){let t;if(e.isFoundDocument())t=e.version;else{if(!e.isNoDocument())throw F(50498,{Mc:e.constructor.name});t=$.min()}const r=this.readVersions.get(e.key.toString());if(r){if(!t.isEqual(r))throw new k(S.ABORTED,"Document version changed between two reads.")}else this.readVersions.set(e.key.toString(),t)}precondition(e){const t=this.readVersions.get(e.toString());return!this.writtenDocs.has(e.toString())&&t?t.isEqual($.min())?pe.exists(!1):pe.updateTime(t):pe.none()}preconditionForUpdate(e){const t=this.readVersions.get(e.toString());if(!this.writtenDocs.has(e.toString())&&t){if(t.isEqual($.min()))throw new k(S.INVALID_ARGUMENT,"Can't update a document that doesn't exist.");return pe.updateTime(t)}return pe.exists(!0)}write(e){this.ensureCommitNotCalled(),this.mutations.push(e)}ensureCommitNotCalled(){}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hT{constructor(e,t,r,s,i){this.asyncQueue=e,this.datastore=t,this.options=r,this.updateFunction=s,this.deferred=i,this.Nc=r.maxAttempts,this.Ht=new Wa(this.asyncQueue,"transaction_retry")}Lc(){this.Nc-=1,this.Bc()}Bc(){this.Ht.kt((async()=>{const e=new lT(this.datastore),t=this.Uc(e);t&&t.then((r=>{this.asyncQueue.enqueueAndForget((()=>e.commit().then((()=>{this.deferred.resolve(r)})).catch((s=>{this.kc(s)}))))})).catch((r=>{this.kc(r)}))}))}Uc(e){try{const t=this.updateFunction(e);return!Vs(t)&&t.catch&&t.then?t:(this.deferred.reject(Error("Transaction callback must return a Promise")),null)}catch(t){return this.deferred.reject(t),null}}kc(e){this.Nc>0&&this.qc(e)?(this.Nc-=1,this.asyncQueue.enqueueAndForget((()=>(this.Bc(),Promise.resolve())))):this.deferred.reject(e)}qc(e){if((e==null?void 0:e.name)==="FirebaseError"){const t=e.code;return t==="aborted"||t==="failed-precondition"||t==="already-exists"||!_d(t)}return!1}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gn="FirestoreClient";class dT{constructor(e,t,r,s,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=r,this._databaseInfo=s,this.user=Ne.UNAUTHENTICATED,this.clientId=Ua.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(r,(async a=>{L(gn,"Received user=",a.uid),await this.authCredentialListener(a),this.user=a})),this.appCheckCredentials.start(r,(a=>(L(gn,"Received new app check token=",a),this.appCheckCredentialListener(a,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this._databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new yt;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const r=Tc(t,"Failed to shutdown persistence");e.reject(r)}})),e.promise}}async function sa(n,e){n.asyncQueue.verifyOperationInProgress(),L(gn,"Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let r=t.initialUser;n.setCredentialChangeListener((async s=>{r.isEqual(s)||(await ff(e.localStore,s),r=s)})),e.persistence.setDatabaseDeletedListener((()=>n.terminate())),n._offlineComponents=e}async function Hl(n,e){n.asyncQueue.verifyOperationInProgress();const t=await fT(n);L(gn,"Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener((r=>Fl(e.remoteStore,r))),n.setAppCheckTokenChangeListener(((r,s)=>Fl(e.remoteStore,s))),n._onlineComponents=e}async function fT(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){L(gn,"Using user provided OfflineComponentProvider");try{await sa(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!(function(s){return s.name==="FirebaseError"?s.code===S.FAILED_PRECONDITION||s.code===S.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11})(t))throw t;at("Error using user provided cache. Falling back to memory cache: "+t),await sa(n,new Fi)}}else L(gn,"Using default OfflineComponentProvider"),await sa(n,new uT(void 0));return n._offlineComponents}async function Sc(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(L(gn,"Using user provided OnlineComponentProvider"),await Hl(n,n._uninitializedComponentsProvider._online)):(L(gn,"Using default OnlineComponentProvider"),await Hl(n,new Ca))),n._onlineComponents}function pT(n){return Sc(n).then((e=>e.syncEngine))}function mT(n){return Sc(n).then((e=>e.datastore))}async function Bi(n){const e=await Sc(n),t=e.eventManager;return t.onListen=YE.bind(null,e.syncEngine),t.onUnlisten=ZE.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=JE.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=eT.bind(null,e.syncEngine),t}function gT(n,e,t,r){const s=new wc(r),i=new Rc(e,s,t);return n.asyncQueue.enqueueAndForget((async()=>Ic(await Bi(n),i))),()=>{s.Va(),n.asyncQueue.enqueueAndForget((async()=>vc(await Bi(n),i)))}}function Cf(n,e,t={}){const r=new yt;return n.asyncQueue.enqueueAndForget((async()=>(function(i,a,c,l,h){const f=new wc({next:y=>{f.Va(),a.enqueueAndForget((()=>vc(i,m)));const b=y.docs.has(c);!b&&y.fromCache?h.reject(new k(S.UNAVAILABLE,"Failed to get document because the client is offline.")):b&&y.fromCache&&l&&l.source==="server"?h.reject(new k(S.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):h.resolve(y)},error:y=>h.reject(y)}),m=new Rc(ro(c.path),f,{includeMetadataChanges:!0,waitForSyncWhenOnline:!0});return Ic(i,m)})(await Bi(n),n.asyncQueue,e,t,r))),r.promise}function _T(n,e,t={}){const r=new yt;return n.asyncQueue.enqueueAndForget((async()=>(function(i,a,c,l,h){const f=new wc({next:y=>{f.Va(),a.enqueueAndForget((()=>vc(i,m))),y.fromCache&&l.source==="server"?h.reject(new k(S.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):h.resolve(y)},error:y=>h.reject(y)}),m=new Rc(c instanceof rs?Kw(c):c,f,{includeMetadataChanges:!0,waitForSyncWhenOnline:!0});return Ic(i,m)})(await Bi(n),n.asyncQueue,e,t,r))),r.promise}function yT(n,e){const t=new yt;return n.asyncQueue.enqueueAndForget((async()=>tT(await pT(n),e,t))),t.promise}function wT(n,e,t){const r=new yt;return n.asyncQueue.enqueueAndForget((async()=>{const s=await mT(n);new hT(n.asyncQueue,s,t,e,r).Lc()})),r.promise}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let qi=class{constructor(e,t,r,s,i){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new ie(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new ET(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){var e;return((e=this._document)==null?void 0:e.data.clone().value.mapValue.fields)??void 0}get(e){if(this._document){const t=this._document.data.field(hn("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}},ET=class extends qi{data(){return super.data()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vf{convertValue(e,t="none"){switch(we(e)){case 0:return null;case 1:return e.booleanValue;case 2:return ae(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(an(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw F(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const r={};return _n(e,((s,i)=>{r[s]=this.convertValue(i,t)})),r}convertVectorValue(e){var r,s,i;const t=(i=(s=(r=e.fields)==null?void 0:r[ls].arrayValue)==null?void 0:s.values)==null?void 0:i.map((a=>ae(a.doubleValue)));return new je(t)}convertGeoPoint(e){return new _t(ae(e.latitude),ae(e.longitude))}convertArray(e,t){return(e.values||[]).map((r=>this.convertValue(r,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const r=Cs(e);return r==null?null:this.convertValue(r,t);case"estimate":return this.convertTimestamp(ar(e));default:return null}}convertTimestamp(e){const t=on(e);return new ee(t.seconds,t.nanos)}convertDocumentKey(e,t){const r=Z.fromString(e);U(Nd(r),9688,{name:e});const s=new cs(r.get(1),r.get(3)),i=new B(r.popFirst(5));return s.isEqual(t)||kt(`A document reference to ${i} refers to a different database (${s.projectId}/${s.database}), which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Eo(n,e,t){let r;return r=n?t&&(t.merge||t.mergeFields)?n.toFirestore(e,t):n.toFirestore(e):e,r}class TT extends Vf{constructor(e){super(),this.firestore=e}convertBytes(e){return new Qe(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new ie(this.firestore,null,t)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wl="AsyncQueue";class Gl{constructor(e=Promise.resolve()){this.$c=[],this.Kc=!1,this.Qc=[],this.Wc=null,this.Gc=!1,this.zc=!1,this.jc=[],this.Ht=new Wa(this,"async_queue_retry"),this.Hc=()=>{const r=ra();r&&L(Wl,"Visibility state changed to "+r.visibilityState),this.Ht.$t()},this.Jc=e;const t=ra();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.Hc)}get isShuttingDown(){return this.Kc}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.Yc(),this.Zc(e)}enterRestrictedMode(e){if(!this.Kc){this.Kc=!0,this.zc=e||!1;const t=ra();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.Hc)}}enqueue(e){if(this.Yc(),this.Kc)return new Promise((()=>{}));const t=new yt;return this.Zc((()=>this.Kc&&this.zc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.$c.push(e),this.Xc())))}async Xc(){if(this.$c.length!==0){try{await this.$c[0](),this.$c.shift(),this.Ht.reset()}catch(e){if(!yr(e))throw e;L(Wl,"Operation failed with retryable error: "+e)}this.$c.length>0&&this.Ht.kt((()=>this.Xc()))}}Zc(e){const t=this.Jc.then((()=>(this.Gc=!0,e().catch((r=>{throw this.Wc=r,this.Gc=!1,kt("INTERNAL UNHANDLED ERROR: ",Kl(r)),r})).then((r=>(this.Gc=!1,r))))));return this.Jc=t,t}enqueueAfterDelay(e,t,r){this.Yc(),this.jc.indexOf(e)>-1&&(t=0);const s=Ec.createAndSchedule(this,e,t,r,(i=>this.el(i)));return this.Qc.push(s),s}Yc(){this.Wc&&F(47125,{tl:Kl(this.Wc)})}verifyOperationInProgress(){}async nl(){let e;do e=this.Jc,await e;while(e!==this.Jc)}rl(e){for(const t of this.Qc)if(t.timerId===e)return!0;return!1}il(e){return this.nl().then((()=>{this.Qc.sort(((t,r)=>t.targetTimeMs-r.targetTimeMs));for(const t of this.Qc)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.nl()}))}sl(e){this.jc.push(e)}el(e){const t=this.Qc.indexOf(e);this.Qc.splice(t,1)}}function Kl(n){let e=n.message||"";return n.stack&&(e=n.stack.includes(n.message)?n.stack:n.message+`
`+n.stack),e}class rt extends ao{constructor(e,t,r,s){super(e,t,r,s),this.type="firestore",this._queue=new Gl,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Gl(e),this._firestoreClient=void 0,await e}}}function cR(n,e){const t=typeof n=="object"?n:La(),r=typeof n=="string"?n:Si,s=Yi(t,"firestore").getImmediate({identifier:r});if(!s._initialized){const i=Ch("firestore");i&&my(s,...i)}return s}function Gn(n){if(n._terminated)throw new k(S.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||IT(n),n._firestoreClient}function IT(n){var r,s,i,a;const e=n._freezeSettings(),t=oy(n._databaseId,((r=n._app)==null?void 0:r.options.appId)||"",n._persistenceKey,(s=n._app)==null?void 0:s.options.apiKey,e);n._componentsProvider||(i=e.localCache)!=null&&i._offlineComponentProvider&&((a=e.localCache)!=null&&a._onlineComponentProvider)&&(n._componentsProvider={_offline:e.localCache._offlineComponentProvider,_online:e.localCache._onlineComponentProvider}),n._firestoreClient=new dT(n._authCredentials,n._appCheckCredentials,n._queue,t,n._componentsProvider&&(function(l){const h=l==null?void 0:l._online.build();return{_offline:l==null?void 0:l._offline.build(h),_online:h}})(n._componentsProvider))}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class To extends Vf{constructor(e){super(),this.firestore=e}convertBytes(e){return new Qe(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new ie(this.firestore,null,t)}}class nr{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class rn extends qi{constructor(e,t,r,s,i,a){super(e,t,r,s,a),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new Ei(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const r=this._document.data.field(hn("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new k(S.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=rn._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}rn._jsonSchemaVersion="firestore/documentSnapshot/1.0",rn._jsonSchema={type:ge("string",rn._jsonSchemaVersion),bundleSource:ge("string","DocumentSnapshot"),bundleName:ge("string"),bundle:ge("string")};class Ei extends rn{data(e={}){return super.data(e)}}class Nn{constructor(e,t,r,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new nr(s.hasPendingWrites,s.fromCache),this.query=r}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((r=>{e.call(t,new Ei(this._firestore,this._userDataWriter,r.key,r,new nr(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new k(S.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(s,i){if(s._snapshot.oldDocs.isEmpty()){let a=0;return s._snapshot.docChanges.map((c=>{Te(s._snapshot.query)?Aa(s._snapshot.query):$a(s.query._query);const l=new Ei(s._firestore,s._userDataWriter,c.doc.key,c.doc,new nr(s._snapshot.mutatedKeys.has(c.doc.key),s._snapshot.fromCache),s.query.converter);return c.doc,{type:"added",doc:l,oldIndex:-1,newIndex:a++}}))}{let a=s._snapshot.oldDocs;return s._snapshot.docChanges.filter((c=>i||c.type!==3)).map((c=>{const l=new Ei(s._firestore,s._userDataWriter,c.doc.key,c.doc,new nr(s._snapshot.mutatedKeys.has(c.doc.key),s._snapshot.fromCache),s.query.converter);let h=-1,f=-1;return c.type!==0&&(h=a.indexOf(c.doc.key),a=a.delete(c.doc.key)),c.type!==1&&(a=a.add(c.doc),f=a.indexOf(c.doc.key)),{type:vT(c.type),doc:l,oldIndex:h,newIndex:f}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new k(S.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=Nn._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Ua.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],r=[],s=[];return this.docs.forEach((i=>{i._document!==null&&(t.push(i._document),r.push(this._userDataWriter.convertObjectMap(i._document.data.value.mapValue.fields,"previous")),s.push(i.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function vT(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return F(61501,{type:n})}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Nn._jsonSchemaVersion="firestore/querySnapshot/1.0",Nn._jsonSchema={type:ge("string",Nn._jsonSchemaVersion),bundleSource:ge("string","QuerySnapshot"),bundleName:ge("string"),bundle:ge("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Nf(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new k(S.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Cc{}class Vc extends Cc{}function uR(n,e,...t){let r=[];e instanceof Cc&&r.push(e),r=r.concat(t),(function(i){const a=i.filter((l=>l instanceof Nc)).length,c=i.filter((l=>l instanceof Io)).length;if(a>1||a>0&&c>0)throw new k(S.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(r);for(const s of r)n=s._apply(n);return n}class Io extends Vc{constructor(e,t,r){super(),this._field=e,this._op=t,this._value=r,this.type="where"}static _create(e,t,r){return new Io(e,t,r)}_apply(e){const t=this._parse(e);return kf(e._query,t),new Ot(e.firestore,e.converter,ya(e._query,t))}_parse(e){const t=wr(e.firestore);return(function(i,a,c,l,h,f,m){let y;if(h.isKeyField()){if(f==="array-contains"||f==="array-contains-any")throw new k(S.INVALID_ARGUMENT,`Invalid Query. You can't perform '${f}' queries on documentId().`);if(f==="in"||f==="not-in"){Yl(m,f);const V=[];for(const M of m)V.push(Ql(l,i,M));y={arrayValue:{values:V}}}else y=Ql(l,i,m)}else f!=="in"&&f!=="not-in"&&f!=="array-contains-any"||Yl(m,f),y=Ey(c,a,m,f==="in"||f==="not-in");return me.create(h,f,y)})(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function lR(n,e,t){const r=e,s=hn("where",n);return Io._create(s,r,t)}class Nc extends Cc{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new Nc(e,t)}_parse(e){const t=this._queryConstraints.map((r=>r._parse(e))).filter((r=>r.getFilters().length>0));return t.length===1?t[0]:ct.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:((function(s,i){let a=s;const c=i.getFlattenedFilters();for(const l of c)kf(a,l),a=ya(a,l)})(e._query,t),new Ot(e.firestore,e.converter,ya(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class kc extends Vc{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new kc(e,t)}_apply(e){const t=(function(s,i,a){if(s.startAt!==null)throw new k(S.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(s.endAt!==null)throw new k(S.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new ms(i,a)})(e._query,this._field,this._direction);return new Ot(e.firestore,e.converter,f_(e._query,t))}}function hR(n,e="asc"){const t=e,r=hn("orderBy",n);return kc._create(r,t)}class Dc extends Vc{constructor(e,t,r){super(),this.type=e,this._limit=t,this._limitType=r}static _create(e,t,r){return new Dc(e,t,r)}_apply(e){return new Ot(e.firestore,e.converter,xi(e._query,this._limit,this._limitType))}}function dR(n){return Mg("limit",n),Dc._create("limit",n,"F")}function Ql(n,e,t){if(typeof(t=te(t))=="string"){if(t==="")throw new k(S.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!gd(e)&&t.indexOf("/")!==-1)throw new k(S.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const r=e.path.child(Z.fromString(t));if(!B.isDocumentKey(r))throw new k(S.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return hl(n,new B(r))}if(t instanceof ie)return hl(n,t._key);throw new k(S.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Ji(t)}.`)}function Yl(n,e){if(!Array.isArray(n)||n.length===0)throw new k(S.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function kf(n,e){const t=(function(s,i){for(const a of s)for(const c of a.getFlattenedFilters())if(i.indexOf(c.op)>=0)return c.op;return null})(n.filters,(function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(e.op));if(t!==null)throw t===e.op?new k(S.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new k(S.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jl(n){return(function(t,r){if(typeof t!="object"||t===null)return!1;const s=t;for(const i of r)if(i in s&&typeof s[i]=="function")return!0;return!1})(n,["next","error","complete"])}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const AT={maxAttempts:5};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class RT{constructor(e,t){this._firestore=e,this._commitHandler=t,this._mutations=[],this._committed=!1,this._dataReader=wr(e)}set(e,t,r){this._verifyNotCommitted();const s=Xt(e,this._firestore),i=Eo(s.converter,t,r),a=co(this._dataReader,"WriteBatch.set",s._key,i,s.converter!==null,r);return this._mutations.push(a.toMutation(s._key,pe.none())),this}update(e,t,r,...s){this._verifyNotCommitted();const i=Xt(e,this._firestore);let a;return a=typeof(t=te(t))=="string"||t instanceof gr?Ja(this._dataReader,"WriteBatch.update",i._key,t,r,s):Ya(this._dataReader,"WriteBatch.update",i._key,t),this._mutations.push(a.toMutation(i._key,pe.exists(!0))),this}delete(e){this._verifyNotCommitted();const t=Xt(e,this._firestore);return this._mutations=this._mutations.concat(new ks(t._key,pe.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new k(S.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function Xt(n,e){if((n=te(n)).firestore!==e)throw new k(S.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let PT=class{constructor(e,t){this._firestore=e,this._transaction=t,this._dataReader=wr(e)}get(e){const t=Xt(e,this._firestore),r=new TT(this._firestore);return this._transaction.lookup([t._key]).then((s=>{if(!s||s.length!==1)return F(24041);const i=s[0];if(i.isFoundDocument())return new qi(this._firestore,r,i.key,i,t.converter);if(i.isNoDocument())return new qi(this._firestore,r,t._key,null,t.converter);throw F(18433,{doc:i})}))}set(e,t,r){const s=Xt(e,this._firestore),i=Eo(s.converter,t,r),a=co(this._dataReader,"Transaction.set",s._key,i,s.converter!==null,r);return this._transaction.set(s._key,a),this}update(e,t,r,...s){const i=Xt(e,this._firestore);let a;return a=typeof(t=te(t))=="string"||t instanceof gr?Ja(this._dataReader,"Transaction.update",i._key,t,r,s):Ya(this._dataReader,"Transaction.update",i._key,t),this._transaction.update(i._key,a),this}delete(e){const t=Xt(e,this._firestore);return this._transaction.delete(t._key),this}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bT extends PT{constructor(e,t){super(e,t),this._firestore=e}get(e){const t=Xt(e,this._firestore),r=new To(this._firestore);return super.get(e).then((s=>new rn(this._firestore,r,t._key,s._document,new nr(!1,!1),t.converter)))}}function pR(n,e,t){n=Pe(n,rt);const r={...AT,...t};(function(a){if(a.maxAttempts<1)throw new k(S.INVALID_ARGUMENT,"Max attempts must be at least 1")})(r);const s=Gn(n);return wT(s,(i=>e(new bT(n,i))),r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mR(n){n=Pe(n,ie);const e=Pe(n.firestore,rt),t=Gn(e);return Cf(t,n._key).then((r=>xc(e,n,r)))}function gR(n){n=Pe(n,ie);const e=Pe(n.firestore,rt),t=Gn(e);return Cf(t,n._key,{source:"server"}).then((r=>xc(e,n,r)))}function _R(n){n=Pe(n,Ot);const e=Pe(n.firestore,rt),t=Gn(e),r=new To(e);return Nf(n._query),_T(t,n._query).then((s=>new Nn(e,r,n,s)))}function yR(n,e,t){n=Pe(n,ie);const r=Pe(n.firestore,rt),s=Eo(n.converter,e,t),i=wr(r);return Fs(r,[co(i,"setDoc",n._key,s,n.converter!==null,t).toMutation(n._key,pe.none())])}function wR(n,e,t,...r){n=Pe(n,ie);const s=Pe(n.firestore,rt),i=wr(s);let a;return a=typeof(e=te(e))=="string"||e instanceof gr?Ja(i,"updateDoc",n._key,e,t,r):Ya(i,"updateDoc",n._key,e),Fs(s,[a.toMutation(n._key,pe.exists(!0))])}function ER(n){return Fs(Pe(n.firestore,rt),[new ks(n._key,pe.none())])}function TR(n,e){const t=Pe(n.firestore,rt),r=gy(n),s=Eo(n.converter,e),i=wr(n.firestore);return Fs(t,[co(i,"addDoc",r._key,s,n.converter!==null,{}).toMutation(r._key,pe.exists(!1))]).then((()=>r))}function IR(n,...e){var h,f,m;n=te(n);let t={includeMetadataChanges:!1,source:"default"},r=0;typeof e[r]!="object"||Jl(e[r])||(t=e[r++]);const s={includeMetadataChanges:t.includeMetadataChanges,source:t.source};if(Jl(e[r])){const y=e[r];e[r]=(h=y.next)==null?void 0:h.bind(y),e[r+1]=(f=y.error)==null?void 0:f.bind(y),e[r+2]=(m=y.complete)==null?void 0:m.bind(y)}let i,a,c;if(n instanceof ie)a=Pe(n.firestore,rt),c=ro(n._key.path),i={next:y=>{e[r]&&e[r](xc(a,n,y))},error:e[r+1],complete:e[r+2]};else{const y=Pe(n,Ot);a=Pe(y.firestore,rt),c=y._query;const b=new To(a);i={next:V=>{e[r]&&e[r](new Nn(a,b,y,V))},error:e[r+1],complete:e[r+2]},Nf(n._query)}const l=Gn(a);return gT(l,c,s,i)}function Fs(n,e){const t=Gn(n);return yT(t,e)}function xc(n,e,t){const r=t.docs.get(e._key),s=new To(n);return new rn(n,s,e._key,r,new nr(t.hasPendingWrites,t.fromCache),e.converter)}function vR(n){return n=Pe(n,rt),Gn(n),new RT(n,(e=>Fs(n,e)))}const Xl="@firebase/firestore",Zl="4.17.2";(function(e,t=!0){Vg(jn),Ln(new sn("firestore",((r,{instanceIdentifier:s,options:i})=>{const a=r.getProvider("app").getImmediate(),c=new rt(new H_(r.getProvider("auth-internal")),new K_(a,r.getProvider("app-check-internal")),Bg(a,s),a);return i={useFetchStreams:t,...i},c._setSettings(i),c}),"PUBLIC").setMultipleInstances(!0)),mt(Xl,Zl,e),mt(Xl,Zl,"esm2020")})();var ST="firebase",CT="12.19.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */mt(ST,CT,"app");function Df(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const VT=Df,xf=new Rs("auth","Firebase",Df());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $i=new Oa("@firebase/auth");function Ti(n,...e){$i.logLevel<=Y.WARN&&$i.warn(`Auth (${jn}): ${n}`,...e)}function Ii(n,...e){$i.logLevel<=Y.ERROR&&$i.error(`Auth (${jn}): ${n}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function st(n,...e){throw Oc(n,...e)}function ot(n,...e){return Oc(n,...e)}function vo(n,e,t){const r={...VT(),[e]:t};return new Rs("auth","Firebase",r).create(e,{appName:n.name})}function Vt(n){return vo(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function NT(n,e,t){const r=t;if(!(e instanceof r))throw r.name!==e.constructor.name&&st(n,"argument-error"),vo(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Oc(n,...e){if(typeof n!="string"){const t=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=n.name),n._errorFactory.create(t,...r)}return xf.create(n,...e)}function j(n,e,...t){if(!n)throw Oc(e,...t)}function bt(n){const e="INTERNAL ASSERTION FAILED: "+n;throw Ii(e),new Error(e)}function xt(n,e){n||bt(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Va(){var n;return typeof self<"u"&&((n=self.location)==null?void 0:n.href)||""}function kT(){return eh()==="http:"||eh()==="https:"}function eh(){var n;return typeof self<"u"&&((n=self.location)==null?void 0:n.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function DT(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(kT()||Tm()||"connection"in navigator)?navigator.onLine:!0}function xT(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bs{constructor(e,t){this.shortDelay=e,this.longDelay=t,xt(t>e,"Short delay should be less than long delay!"),this.isMobile=ym()||Im()}get(){return DT()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Lc(n,e){xt(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Of{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;bt("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;bt("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;bt("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const OT={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const LT=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],MT=new Bs(3e4,6e4);function Lt(n,e){return n.tenantId&&!e.tenantId?{...e,tenantId:n.tenantId}:e}async function vt(n,e,t,r,s={}){return Lf(n,s,async()=>{let i={},a={};r&&(e==="GET"?a=r:i={body:JSON.stringify(r)});const c=Ps({...a,key:n.config.apiKey}).slice(1),l=await n._getAdditionalHeaders();l["Content-Type"]="application/json",n.languageCode&&(l["X-Firebase-Locale"]=n.languageCode);const h={method:e,headers:l,...i};return Em()||(h.referrerPolicy="strict-origin-when-cross-origin"),n.emulatorConfig&&$n(n.emulatorConfig.host)&&(h.credentials="include"),Of.fetch()(await Mf(n,n.config.apiHost,t,c),h)})}async function Lf(n,e,t){n._canInitEmulator=!1;const r={...OT,...e};try{const s=new FT(n),i=await Promise.race([t(),s.promise]);s.clearNetworkTimeout();const a=await i.json();if("needConfirmation"in a)throw hi(n,"account-exists-with-different-credential",a);if(i.ok&&!("errorMessage"in a))return a;{const c=i.ok?a.errorMessage:a.error.message,[l,h]=c.split(" : ");if(l==="FEDERATED_USER_ID_ALREADY_LINKED")throw hi(n,"credential-already-in-use",a);if(l==="EMAIL_EXISTS")throw hi(n,"email-already-in-use",a);if(l==="USER_DISABLED")throw hi(n,"user-disabled",a);const f=r[l]||l.toLowerCase().replace(/[_\s]+/g,"-");if(h)throw vo(n,f,h);st(n,f)}}catch(s){if(s instanceof It)throw s;st(n,"network-request-failed",{message:String(s)})}}async function qs(n,e,t,r,s={}){const i=await vt(n,e,t,r,s);return"mfaPendingCredential"in i&&st(n,"multi-factor-auth-required",{_serverResponse:i}),i}async function Mf(n,e,t,r){const s=`${e}${t}?${r}`,i=n,a=i.config.emulator?Lc(n.config,s):`${n.config.apiScheme}://${s}`;return LT.includes(t)&&(await i._persistenceManagerAvailable,i._getPersistenceType()==="COOKIE")?i._getPersistence()._getFinalTarget(a).toString():a}function UT(n){switch(n){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class FT{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,r)=>{this.timer=setTimeout(()=>r(ot(this.auth,"network-request-failed")),MT.get())})}}function hi(n,e,t){const r={appName:n.name};t.email&&(r.email=t.email),t.phoneNumber&&(r.phoneNumber=t.phoneNumber);const s=ot(n,e,r);return s.customData._tokenResponse=t,s}function th(n){return n!==void 0&&n.enterprise!==void 0}class BT{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return UT(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function qT(n,e){return vt(n,"GET","/v2/recaptchaConfig",Lt(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function $T(n,e){return vt(n,"POST","/v1/accounts:delete",e)}async function ji(n,e){return vt(n,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function is(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function jT(n,e=!1){const t=te(n),r=await t.getIdToken(e),s=Mc(r);j(s&&s.exp&&s.auth_time&&s.iat,t.auth,"internal-error");const i=typeof s.firebase=="object"?s.firebase:void 0,a=i==null?void 0:i.sign_in_provider;return{claims:s,token:r,authTime:is(ia(s.auth_time)),issuedAtTime:is(ia(s.iat)),expirationTime:is(ia(s.exp)),signInProvider:a||null,signInSecondFactor:(i==null?void 0:i.sign_in_second_factor)||null}}function ia(n){return Number(n)*1e3}function Mc(n){const[e,t,r]=n.split(".");if(e===void 0||t===void 0||r===void 0)return Ii("JWT malformed, contained fewer than 3 sections"),null;try{const s=bh(t);return s?JSON.parse(s):(Ii("Failed to decode base64 JWT payload"),null)}catch(s){return Ii("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function nh(n){const e=Mc(n);return j(e,"internal-error"),j(typeof e.exp<"u","internal-error"),j(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function fr(n,e,t=!1){if(t)return e;try{return await e}catch(r){throw r instanceof It&&zT(r)&&n.auth.currentUser===n&&await n.auth.signOut(),r}}function zT({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class HT{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const t=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),t}else{this.errorBackoff=3e4;const r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Na{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=is(this.lastLoginAt),this.creationTime=is(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function zi(n){var m;const e=n.auth,t=await n.getIdToken(),r=await fr(n,ji(e,{idToken:t}));j(r==null?void 0:r.users.length,e,"internal-error");const s=r.users[0];n._notifyReloadListener(s);const i=(m=s.providerUserInfo)!=null&&m.length?Uf(s.providerUserInfo):[],a=GT(n.providerData,i),c=n.isAnonymous,l=!(n.email&&s.passwordHash)&&!(a!=null&&a.length),h=c?l:!1,f={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:a,metadata:new Na(s.createdAt,s.lastLoginAt),isAnonymous:h};Object.assign(n,f)}async function WT(n){const e=te(n);await zi(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function GT(n,e){return[...n.filter(r=>!e.some(s=>s.providerId===r.providerId)),...e]}function Uf(n){return n.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function KT(n,e){const t=await Lf(n,{},async()=>{const r=Ps({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:i}=n.config,a=await Mf(n,s,"/v1/token",`key=${i}`),c=await n._getAdditionalHeaders();c["Content-Type"]="application/x-www-form-urlencoded";const l={method:"POST",headers:c,body:r};return n.emulatorConfig&&$n(n.emulatorConfig.host)&&(l.credentials="include"),Of.fetch()(a,l)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function QT(n,e){return vt(n,"POST","/v2/accounts:revokeToken",Lt(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sr{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){j(e.idToken,"internal-error"),j(typeof e.idToken<"u","internal-error"),j(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):nh(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){j(e.length!==0,"internal-error");const t=nh(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(j(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:r,refreshToken:s,expiresIn:i}=await KT(e,t);this.updateTokensAndExpiration(r,s,Number(i))}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,t){const{refreshToken:r,accessToken:s,expirationTime:i}=t,a=new sr;return r&&(j(typeof r=="string","internal-error",{appName:e}),a.refreshToken=r),s&&(j(typeof s=="string","internal-error",{appName:e}),a.accessToken=s),i&&(j(typeof i=="number","internal-error",{appName:e}),a.expirationTime=i),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new sr,this.toJSON())}_performRefresh(){return bt("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zt(n,e){j(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class it{constructor({uid:e,auth:t,stsTokenManager:r,...s}){this.providerId="firebase",this.proactiveRefresh=new HT(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new Na(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const t=await fr(this,this.stsTokenManager.getToken(this.auth,e));return j(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return jT(this,e)}reload(){return WT(this)}_assign(e){this!==e&&(j(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>({...t})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new it({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){j(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&await zi(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(qe(this.auth.app))return Promise.reject(Vt(this.auth));const e=await this.getIdToken();return await fr(this,$T(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){const r=t.displayName??void 0,s=t.email??void 0,i=t.phoneNumber??void 0,a=t.photoURL??void 0,c=t.tenantId??void 0,l=t._redirectEventId??void 0,h=t.createdAt??void 0,f=t.lastLoginAt??void 0,{uid:m,emailVerified:y,isAnonymous:b,providerData:V,stsTokenManager:M}=t;j(m&&M,e,"internal-error");const x=sr.fromJSON(this.name,M);j(typeof m=="string",e,"internal-error"),zt(r,e.name),zt(s,e.name),j(typeof y=="boolean",e,"internal-error"),j(typeof b=="boolean",e,"internal-error"),zt(i,e.name),zt(a,e.name),zt(c,e.name),zt(l,e.name),zt(h,e.name),zt(f,e.name);const z=new it({uid:m,auth:e,email:s,emailVerified:y,displayName:r,isAnonymous:b,photoURL:a,phoneNumber:i,tenantId:c,stsTokenManager:x,createdAt:h,lastLoginAt:f});return V&&Array.isArray(V)&&(z.providerData=V.map(G=>({...G}))),l&&(z._redirectEventId=l),z}static async _fromIdTokenResponse(e,t,r=!1){const s=new sr;s.updateFromServerResponse(t);const i=new it({uid:t.localId,auth:e,stsTokenManager:s,isAnonymous:r});return await zi(i),i}static async _fromGetAccountInfoResponse(e,t,r){const s=t.users[0];j(s.localId!==void 0,"internal-error");const i=s.providerUserInfo!==void 0?Uf(s.providerUserInfo):[],a=!(s.email&&s.passwordHash)&&!(i!=null&&i.length),c=new sr;c.updateFromIdToken(r);const l=new it({uid:s.localId,auth:e,stsTokenManager:c,isAnonymous:a}),h={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:i,metadata:new Na(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(i!=null&&i.length)};return Object.assign(l,h),l}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rh=new Map;function St(n){xt(n instanceof Function,"Expected a class definition");let e=rh.get(n);return e?(xt(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,rh.set(n,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ff{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}Ff.type="NONE";const sh=Ff;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vi(n,e,t){return`firebase:${n}:${e}:${t}`}class kn{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;const{config:s,name:i}=this.auth;this.fullUserKey=vi(this.userKey,s.apiKey,i),this.fullPersistenceKey=vi("persistence",s.apiKey,i),this.boundEventHandler=t._onStorageEvent.bind(t);try{this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}catch{}}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await ji(this.auth,{idToken:e}).catch(()=>{});return t?it._fromGetAccountInfoResponse(this.auth,t,e):null}return it._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){try{this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}catch{}}static async create(e,t,r="authUser"){if(!t.length)return new kn(St(sh),e,r);const s=(await Promise.all(t.map(async h=>{try{if(await h._isAvailable())return h}catch{return}}))).filter(h=>h);let i=s[0]||St(sh);const a=vi(r,e.config.apiKey,e.name);let c=null;for(const h of t)try{const f=await h._get(a);if(f){let m;if(typeof f=="string"){const y=await ji(e,{idToken:f}).catch(()=>{});if(!y)break;m=await it._fromGetAccountInfoResponse(e,y,f)}else m=it._fromJSON(e,f);h!==i&&(c=m),i=h;break}}catch{}const l=s.filter(h=>h._shouldAllowMigration);return!i._shouldAllowMigration||!l.length?new kn(i,e,r):(i=l[0],c&&await i._set(a,c.toJSON()),await Promise.all(t.map(async h=>{if(h!==i)try{await h._remove(a)}catch{}})),new kn(i,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ih(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(jf(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Bf(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Hf(e))return"Blackberry";if(Wf(e))return"Webos";if(qf(e))return"Safari";if((e.includes("chrome/")||$f(e))&&!e.includes("edge/"))return"Chrome";if(zf(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=n.match(t);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function Bf(n=De()){return/firefox\//i.test(n)}function qf(n=De()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function $f(n=De()){return/crios\//i.test(n)}function jf(n=De()){return/iemobile/i.test(n)}function zf(n=De()){return/android/i.test(n)}function Hf(n=De()){return/blackberry/i.test(n)}function Wf(n=De()){return/webos/i.test(n)}function Uc(n=De()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function YT(n=De()){var e;return Uc(n)&&!!((e=window.navigator)!=null&&e.standalone)}function JT(){return vm()&&document.documentMode===10}function Gf(n=De()){return Uc(n)||zf(n)||Wf(n)||Hf(n)||/windows phone/i.test(n)||jf(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kf(n,e=[]){let t;switch(n){case"Browser":t=ih(De());break;case"Worker":t=`${ih(De())}-${n}`;break;default:t=n}const r=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${jn}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class XT{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const r=i=>new Promise((a,c)=>{try{const l=e(i);a(l)}catch(l){c(l)}});r.onAbort=t,this.queue.push(r);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const r of this.queue)await r(e),r.onAbort&&t.push(r.onAbort)}catch(r){t.reverse();for(const s of t)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ZT(n,e={}){return vt(n,"GET","/v2/passwordPolicy",Lt(n,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const eI=6;class tI{constructor(e){var r;const t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??eI,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),t.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),t.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),t.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),t.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((r=e.allowedNonAlphanumericCharacters)==null?void 0:r.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){const r=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;r&&(t.meetsMinPasswordLength=e.length>=r),s&&(t.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let r;for(let s=0;s<e.length;s++)r=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(t,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,t,r,s,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nI{constructor(e,t,r,s){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new oh(this),this.idTokenSubscription=new oh(this),this.beforeStateQueue=new XT(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=xf,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion,this._persistenceManagerAvailable=new Promise(i=>this._resolvePersistenceManagerAvailable=i)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=St(t)),this._initializationPromise=this.queue(async()=>{var r,s,i;if(!this._deleted){try{this.persistenceManager=await kn.create(this,e)}catch(a){Ti(`Failed to initialize persistence: ${a}`),this.persistenceManager=await kn.create(this,[])}finally{(r=this._resolvePersistenceManagerAvailable)==null||r.call(this)}if(!this._deleted){if((s=this._popupRedirectResolver)!=null&&s._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}try{await this.initializeCurrentUser(t)}catch(a){Ti(`Failed to initialize current user: ${a}`),await this.directlySetCurrentUser(null).catch(()=>{})}this.lastNotifiedUid=((i=this.currentUser)==null?void 0:i.uid)||null,!this._deleted&&(this._isInitialized=!0)}}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await ji(this,{idToken:e}),r=await it._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(r)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var i;if(qe(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(c=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(c,c))}):this.directlySetCurrentUser(null)}const t=await this.assertedPersistence.getCurrentUser();let r=t,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(i=this.redirectUser)==null?void 0:i._redirectEventId,c=r==null?void 0:r._redirectEventId,l=await this.tryRedirectSignIn(e);(!a||a===c)&&(l!=null&&l.user)&&(r=l.user,s=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(r)}catch(a){r=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return j(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await zi(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=xT()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(qe(this.app))return Promise.reject(Vt(this));const t=e?te(e):null;return t&&j(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&j(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return qe(this.app)?Promise.reject(Vt(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return qe(this.app)?Promise.reject(Vt(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(St(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await ZT(this),t=new tI(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new Rs("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(r.tenantId=this.tenantId),await QT(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,t){const r=await this.getOrInitRedirectPersistenceManager(t);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&St(e)||this._popupRedirectResolver;j(t,this,"argument-error"),this.redirectPersistenceManager=await kn.create(this,[St(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,r;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)==null?void 0:t._redirectEventId)===e?this._currentUser:((r=this.redirectUser)==null?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((t=this.currentUser)==null?void 0:t.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,s){if(this._deleted)return()=>{};const i=typeof t=="function"?t:t.next.bind(t);let a=!1;const c=this._isInitialized?Promise.resolve():this._initializationPromise;if(j(c,this,"internal-error"),c.then(()=>{a||i(this.currentUser)}).catch(l=>{if(!a)if(typeof t!="function"&&t.error)t.error(l);else if(r)r(l);else throw l}),typeof t=="function"){const l=e.addObserver(t,r,s);return()=>{a=!0,l()}}else{const l=e.addObserver(t);return()=>{a=!0,l()}}}async directlySetCurrentUser(e){if(this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,this.persistenceManager)try{e?await this.persistenceManager.setCurrentUser(e):await this.persistenceManager.removeCurrentUser()}catch(t){const r=(t==null?void 0:t.message)||String(t),s=vo(this,"internal-error",`An internal AuthError has occurred: ${r}`);throw s.customData={originalError:t},s}}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return j(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Kf(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var s;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const t=await((s=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:s.getHeartbeatsHeader());t&&(e["X-Firebase-Client"]=t);const r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){var t;if(qe(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((t=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:t.getToken());return e!=null&&e.error&&Ti(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function Mt(n){return te(n)}class oh{constructor(e){this.auth=e,this.observer=null,this.addObserver=Vm(t=>this.observer=t)}get next(){return j(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ao={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function rI(n){Ao=n}function Qf(n){return Ao.loadJS(n)}function sI(){return Ao.recaptchaEnterpriseScript}function iI(){return Ao.gapiScript}function oI(n){return`__${n}${Math.floor(Math.random()*1e6)}`}class aI{constructor(){this.enterprise=new cI}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class cI{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uI="recaptcha-enterprise",Yf="NO_RECAPTCHA",ah="onFirebaseAuthREInstanceReady";class Wt{constructor(e){this.type=uI,this.auth=Mt(e)}async verify(e="verify",t=!1){async function r(i){if(!t){if(i.tenantId==null&&i._agentRecaptchaConfig!=null)return i._agentRecaptchaConfig.siteKey;if(i.tenantId!=null&&i._tenantRecaptchaConfigs[i.tenantId]!==void 0)return i._tenantRecaptchaConfigs[i.tenantId].siteKey}return new Promise(async(a,c)=>{qT(i,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(l=>{if(l.recaptchaKey===void 0)c(new Error("recaptcha Enterprise site key undefined"));else{const h=new BT(l);return i.tenantId==null?i._agentRecaptchaConfig=h:i._tenantRecaptchaConfigs[i.tenantId]=h,a(h.siteKey)}}).catch(l=>{c(l)})})}function s(i,a,c){const l=window.grecaptcha;th(l)?l.enterprise.ready(()=>{l.enterprise.execute(i,{action:e}).then(h=>{a(h)}).catch(()=>{a(Yf)})}):c(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new aI().execute("siteKey",{action:"verify"}):new Promise((i,a)=>{r(this.auth).then(async c=>{if(!t&&th(window.grecaptcha)&&Wt.scriptInjectionDeferred)await Wt.scriptInjectionDeferred.promise,s(c,i,a);else{if(typeof window>"u"){a(new Error("RecaptchaVerifier is only supported in browser"));return}let l=sI();l.length!==0&&(l+=c+`&onload=${ah}`),Wt.scriptInjectionDeferred=new kh,window[ah]=()=>{var h;(h=Wt.scriptInjectionDeferred)==null||h.resolve()},Qf(l).then(()=>{var h;return(h=Wt.scriptInjectionDeferred)==null?void 0:h.promise}).then(()=>{s(c,i,a)}).catch(h=>{a(h)})}}).catch(c=>{a(c)})})}}Wt.scriptInjectionDeferred=null;async function ch(n,e,t,r=!1,s=!1){const i=new Wt(n);let a;if(s)a=Yf;else try{a=await i.verify(t)}catch{a=await i.verify(t,!0)}const c={...e};if(t==="mfaSmsEnrollment"||t==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in c){const l=c.phoneEnrollmentInfo.phoneNumber,h=c.phoneEnrollmentInfo.recaptchaToken;Object.assign(c,{phoneEnrollmentInfo:{phoneNumber:l,recaptchaToken:h,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in c){const l=c.phoneSignInInfo.recaptchaToken;Object.assign(c,{phoneSignInInfo:{recaptchaToken:l,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return c}return r?Object.assign(c,{captchaResp:a}):Object.assign(c,{captchaResponse:a}),Object.assign(c,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(c,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),c}async function Hi(n,e,t,r,s){var i;if((i=n._getRecaptchaConfig())!=null&&i.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const a=await ch(n,e,t,t==="getOobCode");return r(n,a)}else return r(n,e).catch(async a=>{if(a.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const c=await ch(n,e,t,t==="getOobCode");return r(n,c)}else return Promise.reject(a)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lI(n,e){const t=Yi(n,"auth");if(t.isInitialized()){const s=t.getImmediate(),i=t.getOptions();if(xn(i,e??{}))return s;st(s,"already-initialized")}return t.initialize({options:e})}function hI(n,e){const t=(e==null?void 0:e.persistence)||[],r=(Array.isArray(t)?t:[t]).map(St);e!=null&&e.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function dI(n,e,t){const r=Mt(n);j(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const s=!1,i=Jf(e),{host:a,port:c}=fI(e),l=c===null?"":`:${c}`,h={url:`${i}//${a}${l}/`},f=Object.freeze({host:a,port:c,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:s})});if(!r._canInitEmulator){j(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),j(xn(h,r.config.emulator)&&xn(f,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=h,r.emulatorConfig=f,r.settings.appVerificationDisabledForTesting=!0,$n(a)?xa(`${i}//${a}${l}`):pI()}function Jf(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function fI(n){const e=Jf(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const r=t[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(r);if(s){const i=s[1];return{host:i,port:uh(r.substr(i.length+1))}}else{const[i,a]=r.split(":");return{host:i,port:uh(a)}}}function uh(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function pI(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fc{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return bt("not implemented")}_getIdTokenResponse(e){return bt("not implemented")}_linkToIdToken(e,t){return bt("not implemented")}_getReauthenticationResolver(e){return bt("not implemented")}}async function mI(n,e){return vt(n,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function gI(n,e){return qs(n,"POST","/v1/accounts:signInWithPassword",Lt(n,e))}async function Xf(n,e){return vt(n,"POST","/v1/accounts:sendOobCode",Lt(n,e))}async function _I(n,e){return Xf(n,e)}async function yI(n,e){return Xf(n,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function wI(n,e){return qs(n,"POST","/v1/accounts:signInWithEmailLink",Lt(n,e))}async function EI(n,e){return qs(n,"POST","/v1/accounts:signInWithEmailLink",Lt(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class As extends Fc{constructor(e,t,r,s=null){super("password",r),this._email=e,this._password=t,this._tenantId=s}static _fromEmailAndPassword(e,t){return new As(e,t,"password")}static _fromEmailAndCode(e,t,r=null){return new As(e,t,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t!=null&&t.email&&(t!=null&&t.password)){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Hi(e,t,"signInWithPassword",gI);case"emailLink":return wI(e,{email:this._email,oobCode:this._password});default:st(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const r={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Hi(e,r,"signUpPassword",mI);case"emailLink":return EI(e,{idToken:t,email:this._email,oobCode:this._password});default:st(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ir(n,e){return qs(n,"POST","/v1/accounts:signInWithIdp",Lt(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const TI="http://localhost";class Fn extends Fc{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new Fn(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):st("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:s,...i}=t;if(!r||!s)return null;const a=new Fn(r,s);return a.idToken=i.idToken||void 0,a.accessToken=i.accessToken||void 0,a.secret=i.secret,a.nonce=i.nonce,a.pendingToken=i.pendingToken||null,a}_getIdTokenResponse(e){const t=this.buildRequest();return ir(e,t)}_linkToIdToken(e,t){const r=this.buildRequest();return r.idToken=t,ir(e,r)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,ir(e,t)}buildRequest(){const e={requestUri:TI,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Ps(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function II(n){switch(n){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function vI(n){const e=Hr(Wr(n)).link,t=e?Hr(Wr(e)).deep_link_id:null,r=Hr(Wr(n)).deep_link_id;return(r?Hr(Wr(r)).link:null)||r||t||e||n}class Bc{constructor(e){const t=Hr(Wr(e)),r=t.apiKey??null,s=t.oobCode??null,i=II(t.mode??null);j(r&&s&&i,"argument-error"),this.apiKey=r,this.operation=i,this.code=s,this.continueUrl=t.continueUrl??null,this.languageCode=t.lang??null,this.tenantId=t.tenantId??null}static parseLink(e){const t=vI(e);try{return new Bc(t)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rr{constructor(){this.providerId=Rr.PROVIDER_ID}static credential(e,t){return As._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const r=Bc.parseLink(t);return j(r,"argument-error"),As._fromEmailAndCode(e,r.code,r.tenantId)}}Rr.PROVIDER_ID="password";Rr.EMAIL_PASSWORD_SIGN_IN_METHOD="password";Rr.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qc{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $s extends qc{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gt extends $s{constructor(){super("facebook.com")}static credential(e){return Fn._fromParams({providerId:Gt.PROVIDER_ID,signInMethod:Gt.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Gt.credentialFromTaggedObject(e)}static credentialFromError(e){return Gt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Gt.credential(e.oauthAccessToken)}catch{return null}}}Gt.FACEBOOK_SIGN_IN_METHOD="facebook.com";Gt.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kt extends $s{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return Fn._fromParams({providerId:Kt.PROVIDER_ID,signInMethod:Kt.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Kt.credentialFromTaggedObject(e)}static credentialFromError(e){return Kt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return Kt.credential(t,r)}catch{return null}}}Kt.GOOGLE_SIGN_IN_METHOD="google.com";Kt.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qt extends $s{constructor(){super("github.com")}static credential(e){return Fn._fromParams({providerId:Qt.PROVIDER_ID,signInMethod:Qt.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Qt.credentialFromTaggedObject(e)}static credentialFromError(e){return Qt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Qt.credential(e.oauthAccessToken)}catch{return null}}}Qt.GITHUB_SIGN_IN_METHOD="github.com";Qt.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yt extends $s{constructor(){super("twitter.com")}static credential(e,t){return Fn._fromParams({providerId:Yt.PROVIDER_ID,signInMethod:Yt.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return Yt.credentialFromTaggedObject(e)}static credentialFromError(e){return Yt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return Yt.credential(t,r)}catch{return null}}}Yt.TWITTER_SIGN_IN_METHOD="twitter.com";Yt.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function AI(n,e){return qs(n,"POST","/v1/accounts:signUp",Lt(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bn{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,r,s=!1){const i=await it._fromIdTokenResponse(e,r,s),a=lh(r);return new Bn({user:i,providerId:a,_tokenResponse:r,operationType:t})}static async _forOperation(e,t,r){await e._updateTokensIfNecessary(r,!0);const s=lh(r);return new Bn({user:e,providerId:s,_tokenResponse:r,operationType:t})}}function lh(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wi extends It{constructor(e,t,r,s){super(t.code,t.message),this.operationType=r,this.user=s,Object.setPrototypeOf(this,Wi.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,s){return new Wi(e,t,r,s)}}function Zf(n,e,t,r){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?Wi._fromErrorAndOperation(n,i,e,r):i})}async function RI(n,e,t=!1){const r=await fr(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return Bn._forOperation(n,"link",r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function PI(n,e,t=!1){const{auth:r}=n;if(qe(r.app))return Promise.reject(Vt(r));const s="reauthenticate";try{const i=await fr(n,Zf(r,s,e,n),t);j(i.idToken,r,"internal-error");const a=Mc(i.idToken);j(a,r,"internal-error");const{sub:c}=a;return j(n.uid===c,r,"user-mismatch"),Bn._forOperation(n,s,i)}catch(i){throw(i==null?void 0:i.code)==="auth/user-not-found"&&st(r,"user-mismatch"),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ep(n,e,t=!1){if(qe(n.app))return Promise.reject(Vt(n));const r="signIn",s=await Zf(n,r,e),i=await Bn._fromIdTokenResponse(n,r,s);return t||await n._updateCurrentUser(i.user),i}async function bI(n,e){return ep(Mt(n),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function tp(n){const e=Mt(n);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function AR(n,e,t){const r=Mt(n);await Hi(r,{requestType:"PASSWORD_RESET",email:e,clientType:"CLIENT_TYPE_WEB"},"getOobCode",yI)}async function RR(n,e,t){if(qe(n.app))return Promise.reject(Vt(n));const r=Mt(n),a=await Hi(r,{returnSecureToken:!0,email:e,password:t,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",AI).catch(l=>{throw l.code==="auth/password-does-not-meet-requirements"&&tp(n),l}),c=await Bn._fromIdTokenResponse(r,"signIn",a);return await r._updateCurrentUser(c.user),c}function PR(n,e,t){return qe(n.app)?Promise.reject(Vt(n)):bI(te(n),Rr.credential(e,t)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&tp(n),r})}async function bR(n,e){const t=te(n),s={requestType:"VERIFY_EMAIL",idToken:await n.getIdToken()},{email:i}=await _I(t.auth,s);i!==n.email&&await n.reload()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function SI(n,e){return vt(n,"POST","/v1/accounts:update",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function SR(n,e){const{displayName:t,photoURL:r}=e;if(t===void 0&&r===void 0)return;const s=te(n),a={idToken:await s.getIdToken(),displayName:t,photoUrl:r,returnSecureToken:!0},c=await fr(s,SI(s.auth,a));s.displayName=c.displayName||null,s.photoURL=c.photoUrl||null;const l=s.providerData.find(({providerId:h})=>h==="password");l&&(l.displayName=s.displayName,l.photoURL=s.photoURL),await s._updateTokensIfNecessary(c)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function CR(n,e){return te(n).setPersistence(e)}function CI(n,e,t,r){return te(n).onIdTokenChanged(e,t,r)}function VI(n,e,t){return te(n).beforeAuthStateChanged(e,t)}function VR(n,e,t,r){return te(n).onAuthStateChanged(e,t,r)}function NR(n){return te(n).signOut()}const Gi="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class np{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Gi,"1"),this.storage.removeItem(Gi),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const NI=1e3,kI=10;class rp extends np{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Gf(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const r=this.storage.getItem(t),s=this.localCache[t];r!==s&&e(t,s,r)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((a,c,l)=>{this.notifyListeners(a,l)});return}const r=e.key;t?this.detachListener():this.stopPolling();const s=()=>{const a=this.storage.getItem(r);!t&&this.localCache[r]===a||this.notifyListeners(r,a)},i=this.storage.getItem(r);JT()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,kI):s()}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:r}),!0)})},NI)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}rp.type="LOCAL";const DI=rp;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sp extends np{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}sp.type="SESSION";const ip=sp;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xI(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ro{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(s=>s.isListeningto(e));if(t)return t;const r=new Ro(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:r,eventType:s,data:i}=t.data,a=this.handlersMap[s];if(!(a!=null&&a.size))return;t.ports[0].postMessage({status:"ack",eventId:r,eventType:s});const c=Array.from(a).map(async h=>h(t.origin,i)),l=await xI(c);t.ports[0].postMessage({status:"done",eventId:r,eventType:s,response:l})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Ro.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $c(n="",e=10){let t="";for(let r=0;r<e;r++)t+=Math.floor(Math.random()*10);return n+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class OI{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,r=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let i,a;return new Promise((c,l)=>{const h=$c("",20);s.port1.start();const f=setTimeout(()=>{l(new Error("unsupported_event"))},r);a={messageChannel:s,onMessage(m){const y=m;if(y.data.eventId===h)switch(y.data.status){case"ack":clearTimeout(f),i=setTimeout(()=>{l(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),c(y.data.response);break;default:clearTimeout(f),clearTimeout(i),l(new Error("invalid_response"));break}}},this.handlers.add(a),s.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:h,data:t},[s.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wt(){return window}function LI(n){wt().location.href=n}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function op(){return typeof wt().WorkerGlobalScope<"u"&&typeof wt().importScripts=="function"}async function MI(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function UI(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)==null?void 0:n.controller)||null}function FI(){return op()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ap="firebaseLocalStorageDb",BI=1,Ki="firebaseLocalStorage",cp="fbase_key";class js{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function Po(n,e){return n.transaction([Ki],e?"readwrite":"readonly").objectStore(Ki)}function qI(){const n=indexedDB.deleteDatabase(ap);return new js(n).toPromise()}function up(){const n=indexedDB.open(ap,BI);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const r=n.result;try{r.createObjectStore(Ki,{keyPath:cp})}catch(s){t(s)}}),n.addEventListener("success",async()=>{const r=n.result;r.objectStoreNames.contains(Ki)?e(r):(r.close(),await qI(),e(await up()))})})}async function hh(n,e,t){const r=Po(n,!0).put({[cp]:e,value:t});return new js(r).toPromise()}async function $I(n,e){const t=Po(n,!1).get(e),r=await new js(t).toPromise();return r===void 0?null:r.value}function dh(n,e){const t=Po(n,!0).delete(e);return new js(t).toPromise()}const jI=800,zI=3;class lp{registerLifecycleListeners(){typeof window<"u"&&typeof window.addEventListener=="function"&&(window.addEventListener("pagehide",this.onPageHide),window.addEventListener("pageshow",this.onPageShow))}unregisterLifecycleListeners(){typeof window<"u"&&typeof window.removeEventListener=="function"&&(window.removeEventListener("pagehide",this.onPageHide),window.removeEventListener("pageshow",this.onPageShow))}constructor(){this.type="LOCAL",this.dbPromise=null,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.isClosing=!1,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this.onPageHide=()=>{this.isClosing=!0,this.stopPolling(),this.dbPromise&&(this.dbPromise.then(e=>e.close()).catch(()=>{}),this.dbPromise=null)},this.onPageShow=()=>{this.isClosing&&(this.isClosing=!1,Object.keys(this.listeners).length>0&&this.startPolling())},this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.dbPromise?this.dbPromise:(this.dbPromise=up(),this.dbPromise.catch(()=>{this.dbPromise=null}),this.dbPromise)}async _withRetries(e){let t=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(t++>zI)throw r;if(this.dbPromise){const s=this.dbPromise;this.dbPromise=null;try{(await s).close()}catch{}}}}async initializeServiceWorkerMessaging(){return op()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Ro._getInstance(FI()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var t,r;if(this.activeServiceWorker=await MI(),!this.activeServiceWorker)return;this.sender=new OI(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(t=e[0])!=null&&t.fulfilled&&(r=e[0])!=null&&r.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||UI()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{return indexedDB?(await this._withRetries(async e=>{await hh(e,Gi,"1"),await dh(e,Gi)}),!0):!1}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(r=>hh(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(r=>$I(r,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>dh(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){if(this.isClosing)return[];try{const e=await this._withRetries(s=>{const i=Po(s,!1).getAll();return new js(i).toPromise()});if(this.isClosing)return[];if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],r=new Set;if(e.length!==0)for(const{fbase_key:s,value:i}of e)r.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(i)&&(this.notifyListeners(s,i),t.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!r.has(s)&&(this.notifyListeners(s,null),t.push(s));return t}catch(e){return this.isClosing||Ti(`Firebase Auth cross-tab polling failed with error: ${e}`),[]}}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),jI)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.startPolling(),this.registerLifecycleListeners()),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.stopPolling(),this.unregisterLifecycleListeners())}}lp.type="LOCAL";const HI=lp;new Bs(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hp(n,e){return e?St(e):(j(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jc extends Fc{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return ir(e,this._buildIdpRequest())}_linkToIdToken(e,t){return ir(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return ir(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function WI(n){return ep(n.auth,new jc(n),n.bypassAuthState)}function GI(n){const{auth:e,user:t}=n;return j(t,e,"internal-error"),PI(t,new jc(n),n.bypassAuthState)}async function KI(n){const{auth:e,user:t}=n;return j(t,e,"internal-error"),RI(t,new jc(n),n.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dp{constructor(e,t,r,s,i=!1){this.auth=e,this.resolver=r,this.user=s,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:r,postBody:s,tenantId:i,error:a,type:c}=e;if(a){this.reject(a);return}const l={auth:this.auth,requestUri:t,sessionId:r,tenantId:i||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(c)(l))}catch(h){this.reject(h)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return WI;case"linkViaPopup":case"linkViaRedirect":return KI;case"reauthViaPopup":case"reauthViaRedirect":return GI;default:st(this.auth,"internal-error")}}resolve(e){xt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){xt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const QI=new Bs(2e3,1e4);async function kR(n,e,t){if(qe(n.app))return Promise.reject(ot(n,"operation-not-supported-in-this-environment"));const r=Mt(n);NT(n,e,qc);const s=hp(r,t);return new Sn(r,"signInViaPopup",e,s).executeNotNull()}class Sn extends dp{constructor(e,t,r,s,i){super(e,t,s,i),this.provider=r,this.authWindow=null,this.pollId=null,Sn.currentPopupAction&&Sn.currentPopupAction.cancel(),Sn.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return j(e,this.auth,"internal-error"),e}async onExecution(){xt(this.filter.length===1,"Popup operations only handle one event");const e=$c();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(ot(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(ot(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Sn.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,r;if((r=(t=this.authWindow)==null?void 0:t.window)!=null&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(ot(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,QI.get())};e()}}Sn.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const YI="pendingRedirect",Ai=new Map;class JI extends dp{constructor(e,t,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,r),this.eventId=null}async execute(){let e=Ai.get(this.auth._key());if(!e){try{const r=await XI(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(t){e=()=>Promise.reject(t)}Ai.set(this.auth._key(),e)}return this.bypassAuthState||Ai.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function XI(n,e){const t=tv(e),r=ev(n);if(!await r._isAvailable())return!1;const s=await r._get(t)==="true";return await r._remove(t),s}function ZI(n,e){Ai.set(n._key(),e)}function ev(n){return St(n._redirectPersistence)}function tv(n){return vi(YI,n.config.apiKey,n.name)}async function nv(n,e,t=!1){if(qe(n.app))return Promise.reject(Vt(n));const r=Mt(n),s=hp(r,e),a=await new JI(r,s,t).execute();return a&&!t&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,e)),a}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rv=600*1e3;class sv{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(t=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!iv(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var r;if(e.error&&!fp(e)){const s=((r=e.error.code)==null?void 0:r.split("auth/")[1])||"internal-error";t.onError(ot(this.auth,s))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const r=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=rv&&this.cachedEventUids.clear(),this.cachedEventUids.has(fh(e))}saveEventToCache(e){this.cachedEventUids.add(fh(e)),this.lastProcessedEventTime=Date.now()}}function fh(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function fp({type:n,error:e}){return n==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function iv(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return fp(n);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ov(n,e={}){return vt(n,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const av=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,cv=/^https?/;async function uv(n){if(n.config.emulator)return;const{authorizedDomains:e}=await ov(n);for(const t of e)try{if(lv(t))return}catch{}st(n,"unauthorized-domain")}function lv(n){const e=Va(),{protocol:t,hostname:r}=new URL(e);if(n.startsWith("chrome-extension://")){const a=new URL(n);return a.hostname===""&&r===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&a.hostname===r}if(!cv.test(t))return!1;if(av.test(n))return r===n;const s=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hv=new Bs(3e4,6e4);function ph(){const n=wt().___jsl;if(n!=null&&n.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function dv(n){return new Promise((e,t)=>{var s,i,a;function r(){ph(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{ph(),t(ot(n,"network-request-failed"))},timeout:hv.get()})}if((i=(s=wt().gapi)==null?void 0:s.iframes)!=null&&i.Iframe)e(gapi.iframes.getContext());else if((a=wt().gapi)!=null&&a.load)r();else{const c=oI("iframefcb");return wt()[c]=()=>{gapi.load?r():t(ot(n,"network-request-failed"))},Qf(`${iI()}?onload=${c}`).catch(l=>t(l))}}).catch(e=>{throw Ri=null,e})}let Ri=null;function fv(n){return Ri=Ri||dv(n),Ri}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pv=new Bs(5e3,15e3),mv="__/auth/iframe",gv="emulator/auth/iframe",_v={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},yv=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function wv(n){const e=n.config;j(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?Lc(e,gv):`https://${n.config.authDomain}/${mv}`,r={apiKey:e.apiKey,appName:n.name,v:jn},s=yv.get(n.config.apiHost);s&&(r.eid=s);const i=n._getFrameworks();return i.length&&(r.fw=i.join(",")),`${t}?${Ps(r).slice(1)}`}async function Ev(n){const e=await fv(n),t=wt().gapi;return j(t,n,"internal-error"),e.open({where:document.body,url:wv(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:_v,dontclear:!0},r=>new Promise(async(s,i)=>{await r.restyle({setHideOnLeave:!1});const a=ot(n,"network-request-failed"),c=wt().setTimeout(()=>{i(a)},pv.get());function l(){wt().clearTimeout(c),s(r)}r.ping(l).then(l,()=>{i(a)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tv={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Iv=500,vv=600,Av="_blank",Rv="http://localhost";class mh{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Pv(n,e,t,r=Iv,s=vv){const i=Math.max((window.screen.availHeight-s)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let c="";const l={...Tv,width:r.toString(),height:s.toString(),top:i,left:a},h=De().toLowerCase();t&&(c=$f(h)?Av:t),Bf(h)&&(e=e||Rv,l.scrollbars="yes");const f=Object.entries(l).reduce((y,[b,V])=>`${y}${b}=${V},`,"");if(YT(h)&&c!=="_self")return bv(e||"",c),new mh(null);const m=window.open(e||"",c,f);j(m,n,"popup-blocked");try{m.focus()}catch{}return new mh(m)}function bv(n,e){const t=document.createElement("a");t.href=n,t.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sv="__/auth/handler",Cv="emulator/auth/handler",Vv=encodeURIComponent("fac");async function gh(n,e,t,r,s,i){j(n.config.authDomain,n,"auth-domain-config-required"),j(n.config.apiKey,n,"invalid-api-key");const a={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:r,v:jn,eventId:s};if(e instanceof qc){e.setDefaultLanguage(n.languageCode),a.providerId=e.providerId||"",Cm(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[f,m]of Object.entries({}))a[f]=m}if(e instanceof $s){const f=e.getScopes().filter(m=>m!=="");f.length>0&&(a.scopes=f.join(","))}n.tenantId&&(a.tid=n.tenantId);const c=a;for(const f of Object.keys(c))c[f]===void 0&&delete c[f];const l=await n._getAppCheckToken(),h=l?`#${Vv}=${encodeURIComponent(l)}`:"";return`${Nv(n)}?${Ps(c).slice(1)}${h}`}function Nv({config:n}){return n.emulator?Lc(n,Cv):`https://${n.authDomain}/${Sv}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oa="webStorageSupport";class kv{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=ip,this._completeRedirectFn=nv,this._overrideRedirectResult=ZI}async _openPopup(e,t,r,s){var a;xt((a=this.eventManagers[e._key()])==null?void 0:a.manager,"_initialize() not called before _openPopup()");const i=await gh(e,t,r,Va(),s);return Pv(e,i,$c())}async _openRedirect(e,t,r,s){await this._originValidation(e);const i=await gh(e,t,r,Va(),s);return LI(i),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:s,promise:i}=this.eventManagers[t];return s?Promise.resolve(s):(xt(i,"If manager is not set, promise should be"),i)}const r=this.initAndGetManager(e);return this.eventManagers[t]={promise:r},r.catch(()=>{delete this.eventManagers[t]}),r}async initAndGetManager(e){const t=await Ev(e),r=new sv(e);return t.register("authEvent",s=>(j(s==null?void 0:s.authEvent,e,"invalid-auth-event"),{status:r.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=t,r}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(oa,{type:oa},s=>{var a;const i=(a=s==null?void 0:s[0])==null?void 0:a[oa];i!==void 0&&t(!!i),st(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=uv(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return Gf()||qf()||Uc()}}const Dv=kv;var _h="@firebase/auth",yh="1.13.6";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xv{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){j(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ov(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Lv(n){Ln(new sn("auth",(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:a,authDomain:c}=r.options;j(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});const l={apiKey:a,authDomain:c,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Kf(n)},h=new nI(r,s,i,l);return hI(h,t),h},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider("auth-internal").initialize()})),Ln(new sn("auth-internal",e=>{const t=Mt(e.getProvider("auth").getImmediate());return(r=>new xv(r))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),mt(_h,yh,Ov(n)),mt(_h,yh,"esm2020")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mv=300,Uv=Nh("authIdTokenMaxAge")||Mv;let wh=null;const Fv=n=>async e=>{const t=e&&await e.getIdTokenResult(),r=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(r&&r>Uv)return;const s=t==null?void 0:t.token;wh!==s&&(wh=s,await fetch(n,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function DR(n=La()){const e=Yi(n,"auth");if(e.isInitialized())return e.getImmediate();const t=lI(n,{popupRedirectResolver:Dv,persistence:[HI,DI,ip]}),r=Nh("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(r,location.origin);if(location.origin===i.origin){const a=Fv(i.toString());VI(t,a,()=>a(t.currentUser)),CI(t,c=>a(c))}}const s=Sh("auth");return s&&dI(t,`http://${s}`),t}function Bv(){var n;return((n=document.getElementsByTagName("head"))==null?void 0:n[0])??document}rI({loadJS(n){return new Promise((e,t)=>{const r=document.createElement("script");r.setAttribute("src",n),r.onload=e,r.onerror=s=>{const i=ot("internal-error");i.customData=s,t(i)},r.type="text/javascript",r.charset="UTF-8",Bv().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Lv("Browser");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pp="firebasestorage.googleapis.com",mp="storageBucket",qv=120*1e3,$v=600*1e3;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class le extends It{constructor(e,t,r=0){super(aa(e),`Firebase Storage: ${t} (${aa(e)})`),this.status_=r,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,le.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return aa(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var ue;(function(n){n.UNKNOWN="unknown",n.OBJECT_NOT_FOUND="object-not-found",n.BUCKET_NOT_FOUND="bucket-not-found",n.PROJECT_NOT_FOUND="project-not-found",n.QUOTA_EXCEEDED="quota-exceeded",n.UNAUTHENTICATED="unauthenticated",n.UNAUTHORIZED="unauthorized",n.UNAUTHORIZED_APP="unauthorized-app",n.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",n.INVALID_CHECKSUM="invalid-checksum",n.CANCELED="canceled",n.INVALID_EVENT_NAME="invalid-event-name",n.INVALID_URL="invalid-url",n.INVALID_DEFAULT_BUCKET="invalid-default-bucket",n.NO_DEFAULT_BUCKET="no-default-bucket",n.CANNOT_SLICE_BLOB="cannot-slice-blob",n.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",n.NO_DOWNLOAD_URL="no-download-url",n.INVALID_ARGUMENT="invalid-argument",n.INVALID_ARGUMENT_COUNT="invalid-argument-count",n.APP_DELETED="app-deleted",n.INVALID_ROOT_OPERATION="invalid-root-operation",n.INVALID_FORMAT="invalid-format",n.INTERNAL_ERROR="internal-error",n.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(ue||(ue={}));function aa(n){return"storage/"+n}function zc(){const n="An unknown error occurred, please check the error payload for server response.";return new le(ue.UNKNOWN,n)}function jv(n){return new le(ue.OBJECT_NOT_FOUND,"Object '"+n+"' does not exist.")}function zv(n){return new le(ue.QUOTA_EXCEEDED,"Quota for bucket '"+n+"' exceeded, please view quota on https://firebase.google.com/pricing/.")}function Hv(){const n="User is not authenticated, please authenticate using Firebase Authentication and try again.";return new le(ue.UNAUTHENTICATED,n)}function Wv(){return new le(ue.UNAUTHORIZED_APP,"This app does not have permission to access Firebase Storage on this project.")}function Gv(n){return new le(ue.UNAUTHORIZED,"User does not have permission to access '"+n+"'.")}function Kv(){return new le(ue.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function Qv(){return new le(ue.CANCELED,"User canceled the upload/download.")}function Yv(n){return new le(ue.INVALID_URL,"Invalid URL '"+n+"'.")}function Jv(n){return new le(ue.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+n+"'.")}function Xv(){return new le(ue.NO_DEFAULT_BUCKET,"No default bucket found. Did you set the '"+mp+"' property when initializing the app?")}function Zv(){return new le(ue.CANNOT_SLICE_BLOB,"Cannot slice blob for upload. Please retry the upload.")}function eA(){return new le(ue.NO_DOWNLOAD_URL,"The given file does not have any download URLs.")}function tA(n){return new le(ue.UNSUPPORTED_ENVIRONMENT,`${n} is missing. Make sure to install the required polyfills. See https://firebase.google.com/docs/web/environments-js-sdk#polyfills for more information.`)}function ka(n){return new le(ue.INVALID_ARGUMENT,n)}function gp(){return new le(ue.APP_DELETED,"The Firebase app was deleted.")}function nA(n){return new le(ue.INVALID_ROOT_OPERATION,"The operation '"+n+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}function os(n,e){return new le(ue.INVALID_FORMAT,"String does not match format '"+n+"': "+e)}function zr(n){throw new le(ue.INTERNAL_ERROR,"Internal error: "+n)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xe{constructor(e,t){this.bucket=e,this.path_=t}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(e,t){let r;try{r=Xe.makeFromUrl(e,t)}catch{return new Xe(e,"")}if(r.path==="")return r;throw Jv(e)}static makeFromUrl(e,t){let r=null;const s="([A-Za-z0-9.\\-_]+)";function i(ne){ne.path.charAt(ne.path.length-1)==="/"&&(ne.path_=ne.path_.slice(0,-1))}const a="(/(.*))?$",c=new RegExp("^gs://"+s+a,"i"),l={bucket:1,path:3};function h(ne){ne.path_=decodeURIComponent(ne.path)}const f="v[A-Za-z0-9_]+",m=t.replace(/[.]/g,"\\."),y="(/([^?#]*).*)?$",b=new RegExp(`^https?://${m}/${f}/b/${s}/o${y}`,"i"),V={bucket:1,path:3},M=t===pp?"(?:storage.googleapis.com|storage.cloud.google.com)":t,x="([^?#]*)",z=new RegExp(`^https?://${M}/${s}/${x}`,"i"),X=[{regex:c,indices:l,postModify:i},{regex:b,indices:V,postModify:h},{regex:z,indices:{bucket:1,path:2},postModify:h}];for(let ne=0;ne<X.length;ne++){const he=X[ne],de=he.regex.exec(e);if(de){const I=de[he.indices.bucket];let g=de[he.indices.path];g||(g=""),r=new Xe(I,g),he.postModify(r);break}}if(r==null)throw Yv(e);return r}}class rA{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sA(n,e,t){let r=1,s=null,i=null,a=!1,c=0;function l(){return c===2}let h=!1;function f(...x){h||(h=!0,e.apply(null,x))}function m(x){s=setTimeout(()=>{s=null,n(b,l())},x)}function y(){i&&clearTimeout(i)}function b(x,...z){if(h){y();return}if(x){y(),f.call(null,x,...z);return}if(l()||a){y(),f.call(null,x,...z);return}r<64&&(r*=2);let X;c===1?(c=2,X=0):X=(r+Math.random())*1e3,m(X)}let V=!1;function M(x){V||(V=!0,y(),!h&&(s!==null?(x||(c=2),clearTimeout(s),m(0)):x||(c=1)))}return m(0),i=setTimeout(()=>{a=!0,M(!0)},t),M}function iA(n){n(!1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function oA(n){return n!==void 0}function aA(n){return typeof n=="object"&&!Array.isArray(n)}function Hc(n){return typeof n=="string"||n instanceof String}function Eh(n){return Wc()&&n instanceof Blob}function Wc(){return typeof Blob<"u"}function Th(n,e,t,r){if(r<e)throw ka(`Invalid value for '${n}'. Expected ${e} or greater.`);if(r>t)throw ka(`Invalid value for '${n}'. Expected ${t} or less.`)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gc(n,e,t){let r=e;return t==null&&(r=`https://${e}`),`${t}://${r}/v0${n}`}function _p(n){const e=encodeURIComponent;let t="?";for(const r in n)if(n.hasOwnProperty(r)){const s=e(r)+"="+e(n[r]);t=t+s+"&"}return t=t.slice(0,-1),t}var Dn;(function(n){n[n.NO_ERROR=0]="NO_ERROR",n[n.NETWORK_ERROR=1]="NETWORK_ERROR",n[n.ABORT=2]="ABORT"})(Dn||(Dn={}));/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cA(n,e){const t=n>=500&&n<600,s=[408,429].indexOf(n)!==-1,i=e.indexOf(n)!==-1;return t||s||i}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uA{constructor(e,t,r,s,i,a,c,l,h,f,m,y=!0,b=!1){this.url_=e,this.method_=t,this.headers_=r,this.body_=s,this.successCodes_=i,this.additionalRetryCodes_=a,this.callback_=c,this.errorCallback_=l,this.timeout_=h,this.progressCallback_=f,this.connectionFactory_=m,this.retry=y,this.isUsingEmulator=b,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((V,M)=>{this.resolve_=V,this.reject_=M,this.start_()})}start_(){const e=(r,s)=>{if(s){r(!1,new di(!1,null,!0));return}const i=this.connectionFactory_();this.pendingConnection_=i;const a=c=>{const l=c.loaded,h=c.lengthComputable?c.total:-1;this.progressCallback_!==null&&this.progressCallback_(l,h)};this.progressCallback_!==null&&i.addUploadProgressListener(a),i.send(this.url_,this.method_,this.isUsingEmulator,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&i.removeUploadProgressListener(a),this.pendingConnection_=null;const c=i.getErrorCode()===Dn.NO_ERROR,l=i.getStatus();if(!c||cA(l,this.additionalRetryCodes_)&&this.retry){const f=i.getErrorCode()===Dn.ABORT;r(!1,new di(!1,null,f));return}const h=this.successCodes_.indexOf(l)!==-1;r(!0,new di(h,i))})},t=(r,s)=>{const i=this.resolve_,a=this.reject_,c=s.connection;if(s.wasSuccessCode)try{const l=this.callback_(c,c.getResponse());oA(l)?i(l):i()}catch(l){a(l)}else if(c!==null){const l=zc();l.serverResponse=c.getErrorText(),this.errorCallback_?a(this.errorCallback_(c,l)):a(l)}else if(s.canceled){const l=this.appDelete_?gp():Qv();a(l)}else{const l=Kv();a(l)}};this.canceled_?t(!1,new di(!1,null,!0)):this.backoffId_=sA(e,t,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,this.backoffId_!==null&&iA(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class di{constructor(e,t,r){this.wasSuccessCode=e,this.connection=t,this.canceled=!!r}}function lA(n,e){e!==null&&e.length>0&&(n.Authorization="Firebase "+e)}function hA(n,e){n["X-Firebase-Storage-Version"]="webjs/"+(e??"AppManager")}function dA(n,e){e&&(n["X-Firebase-GMPID"]=e)}function fA(n,e){e!==null&&(n["X-Firebase-AppCheck"]=e)}function pA(n,e,t,r,s,i,a=!0,c=!1){const l=_p(n.urlParams),h=n.url+l,f=Object.assign({},n.headers);return dA(f,e),lA(f,t),hA(f,i),fA(f,r),new uA(h,n.method,f,n.body,n.successCodes,n.additionalRetryCodes,n.handler,n.errorHandler,n.timeout,n.progressCallback,s,a,c)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mA(){return typeof BlobBuilder<"u"?BlobBuilder:typeof WebKitBlobBuilder<"u"?WebKitBlobBuilder:void 0}function gA(...n){const e=mA();if(e!==void 0){const t=new e;for(let r=0;r<n.length;r++)t.append(n[r]);return t.getBlob()}else{if(Wc())return new Blob(n);throw new le(ue.UNSUPPORTED_ENVIRONMENT,"This browser doesn't seem to support creating Blobs")}}function _A(n,e,t){return n.webkitSlice?n.webkitSlice(e,t):n.mozSlice?n.mozSlice(e,t):n.slice?n.slice(e,t):null}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yA(n){if(typeof atob>"u")throw tA("base-64");return atob(n)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pt={RAW:"raw",BASE64:"base64",BASE64URL:"base64url",DATA_URL:"data_url"};class ca{constructor(e,t){this.data=e,this.contentType=t||null}}function wA(n,e){switch(n){case pt.RAW:return new ca(yp(e));case pt.BASE64:case pt.BASE64URL:return new ca(wp(n,e));case pt.DATA_URL:return new ca(TA(e),IA(e))}throw zc()}function yp(n){const e=[];for(let t=0;t<n.length;t++){let r=n.charCodeAt(t);if(r<=127)e.push(r);else if(r<=2047)e.push(192|r>>6,128|r&63);else if((r&64512)===55296)if(!(t<n.length-1&&(n.charCodeAt(t+1)&64512)===56320))e.push(239,191,189);else{const i=r,a=n.charCodeAt(++t);r=65536|(i&1023)<<10|a&1023,e.push(240|r>>18,128|r>>12&63,128|r>>6&63,128|r&63)}else(r&64512)===56320?e.push(239,191,189):e.push(224|r>>12,128|r>>6&63,128|r&63)}return new Uint8Array(e)}function EA(n){let e;try{e=decodeURIComponent(n)}catch{throw os(pt.DATA_URL,"Malformed data URL.")}return yp(e)}function wp(n,e){switch(n){case pt.BASE64:{const s=e.indexOf("-")!==-1,i=e.indexOf("_")!==-1;if(s||i)throw os(n,"Invalid character '"+(s?"-":"_")+"' found: is it base64url encoded?");break}case pt.BASE64URL:{const s=e.indexOf("+")!==-1,i=e.indexOf("/")!==-1;if(s||i)throw os(n,"Invalid character '"+(s?"+":"/")+"' found: is it base64 encoded?");e=e.replace(/-/g,"+").replace(/_/g,"/");break}}let t;try{t=yA(e)}catch(s){throw s.message.includes("polyfill")?s:os(n,"Invalid character found")}const r=new Uint8Array(t.length);for(let s=0;s<t.length;s++)r[s]=t.charCodeAt(s);return r}class Ep{constructor(e){this.base64=!1,this.contentType=null;const t=e.match(/^data:([^,]+)?,/);if(t===null)throw os(pt.DATA_URL,"Must be formatted 'data:[<mediatype>][;base64],<data>");const r=t[1]||null;r!=null&&(this.base64=vA(r,";base64"),this.contentType=this.base64?r.substring(0,r.length-7):r),this.rest=e.substring(e.indexOf(",")+1)}}function TA(n){const e=new Ep(n);return e.base64?wp(pt.BASE64,e.rest):EA(e.rest)}function IA(n){return new Ep(n).contentType}function vA(n,e){return n.length>=e.length?n.substring(n.length-e.length)===e:!1}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jt{constructor(e,t){let r=0,s="";Eh(e)?(this.data_=e,r=e.size,s=e.type):e instanceof ArrayBuffer?(t?this.data_=new Uint8Array(e):(this.data_=new Uint8Array(e.byteLength),this.data_.set(new Uint8Array(e))),r=this.data_.length):e instanceof Uint8Array&&(t?this.data_=e:(this.data_=new Uint8Array(e.length),this.data_.set(e)),r=e.length),this.size_=r,this.type_=s}size(){return this.size_}type(){return this.type_}slice(e,t){if(Eh(this.data_)){const r=this.data_,s=_A(r,e,t);return s===null?null:new Jt(s)}else{const r=new Uint8Array(this.data_.buffer,e,t-e);return new Jt(r,!0)}}static getBlob(...e){if(Wc()){const t=e.map(r=>r instanceof Jt?r.data_:r);return new Jt(gA.apply(null,t))}else{const t=e.map(a=>Hc(a)?wA(pt.RAW,a).data:a.data_);let r=0;t.forEach(a=>{r+=a.byteLength});const s=new Uint8Array(r);let i=0;return t.forEach(a=>{for(let c=0;c<a.length;c++)s[i++]=a[c]}),new Jt(s,!0)}}uploadData(){return this.data_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Tp(n){let e;try{e=JSON.parse(n)}catch{return null}return aA(e)?e:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function AA(n){if(n.length===0)return null;const e=n.lastIndexOf("/");return e===-1?"":n.slice(0,e)}function RA(n,e){const t=e.split("/").filter(r=>r.length>0).join("/");return n.length===0?t:n+"/"+t}function Ip(n){const e=n.lastIndexOf("/",n.length-2);return e===-1?n:n.slice(e+1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function PA(n,e){return e}class Me{constructor(e,t,r,s){this.server=e,this.local=t||e,this.writable=!!r,this.xform=s||PA}}let fi=null;function bA(n){return!Hc(n)||n.length<2?n:Ip(n)}function vp(){if(fi)return fi;const n=[];n.push(new Me("bucket")),n.push(new Me("generation")),n.push(new Me("metageneration")),n.push(new Me("name","fullPath",!0));function e(i,a){return bA(a)}const t=new Me("name");t.xform=e,n.push(t);function r(i,a){return a!==void 0?Number(a):a}const s=new Me("size");return s.xform=r,n.push(s),n.push(new Me("timeCreated")),n.push(new Me("updated")),n.push(new Me("md5Hash",null,!0)),n.push(new Me("cacheControl",null,!0)),n.push(new Me("contentDisposition",null,!0)),n.push(new Me("contentEncoding",null,!0)),n.push(new Me("contentLanguage",null,!0)),n.push(new Me("contentType",null,!0)),n.push(new Me("metadata","customMetadata",!0)),fi=n,fi}function SA(n,e){function t(){const r=n.bucket,s=n.fullPath,i=new Xe(r,s);return e._makeStorageReference(i)}Object.defineProperty(n,"ref",{get:t})}function CA(n,e,t){const r={};r.type="file";const s=t.length;for(let i=0;i<s;i++){const a=t[i];r[a.local]=a.xform(r,e[a.server])}return SA(r,n),r}function Ap(n,e,t){const r=Tp(e);return r===null?null:CA(n,r,t)}function VA(n,e,t,r){const s=Tp(e);if(s===null||!Hc(s.downloadTokens))return null;const i=s.downloadTokens;if(i.length===0)return null;const a=encodeURIComponent;return i.split(",").map(h=>{const f=n.bucket,m=n.fullPath,y="/b/"+a(f)+"/o/"+a(m),b=Gc(y,t,r),V=_p({alt:"media",token:h});return b+V})[0]}function NA(n,e){const t={},r=e.length;for(let s=0;s<r;s++){const i=e[s];i.writable&&(t[i.server]=n[i.local])}return JSON.stringify(t)}class Rp{constructor(e,t,r,s){this.url=e,this.method=t,this.handler=r,this.timeout=s,this.urlParams={},this.headers={},this.body=null,this.errorHandler=null,this.progressCallback=null,this.successCodes=[200],this.additionalRetryCodes=[]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pp(n){if(!n)throw zc()}function kA(n,e){function t(r,s){const i=Ap(n,s,e);return Pp(i!==null),i}return t}function DA(n,e){function t(r,s){const i=Ap(n,s,e);return Pp(i!==null),VA(i,s,n.host,n._protocol)}return t}function bp(n){function e(t,r){let s;return t.getStatus()===401?t.getErrorText().includes("Firebase App Check token is invalid")?s=Wv():s=Hv():t.getStatus()===402?s=zv(n.bucket):t.getStatus()===403?s=Gv(n.path):s=r,s.status=t.getStatus(),s.serverResponse=r.serverResponse,s}return e}function xA(n){const e=bp(n);function t(r,s){let i=e(r,s);return r.getStatus()===404&&(i=jv(n.path)),i.serverResponse=s.serverResponse,i}return t}function OA(n,e,t){const r=e.fullServerUrl(),s=Gc(r,n.host,n._protocol),i="GET",a=n.maxOperationRetryTime,c=new Rp(s,i,DA(n,t),a);return c.errorHandler=xA(e),c}function LA(n,e){return n&&n.contentType||e&&e.type()||"application/octet-stream"}function MA(n,e,t){const r=Object.assign({},t);return r.fullPath=n.path,r.size=e.size(),r.contentType||(r.contentType=LA(null,e)),r}function UA(n,e,t,r,s){const i=e.bucketOnlyServerUrl(),a={"X-Goog-Upload-Protocol":"multipart"};function c(){let X="";for(let ne=0;ne<2;ne++)X=X+Math.random().toString().slice(2);return X}const l=c();a["Content-Type"]="multipart/related; boundary="+l;const h=MA(e,r,s),f=NA(h,t),m="--"+l+`\r
Content-Type: application/json; charset=utf-8\r
\r
`+f+`\r
--`+l+`\r
Content-Type: `+h.contentType+`\r
\r
`,y=`\r
--`+l+"--",b=Jt.getBlob(m,r,y);if(b===null)throw Zv();const V={name:h.fullPath},M=Gc(i,n.host,n._protocol),x="POST",z=n.maxUploadRetryTime,G=new Rp(M,x,kA(n,t),z);return G.urlParams=V,G.headers=a,G.body=b.uploadData(),G.errorHandler=bp(e),G}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class FA{constructor(){this.sent_=!1,this.xhr_=new XMLHttpRequest,this.initXhr(),this.errorCode_=Dn.NO_ERROR,this.sendPromise_=new Promise(e=>{this.xhr_.addEventListener("abort",()=>{this.errorCode_=Dn.ABORT,e()}),this.xhr_.addEventListener("error",()=>{this.errorCode_=Dn.NETWORK_ERROR,e()}),this.xhr_.addEventListener("load",()=>{e()})})}send(e,t,r,s,i){if(this.sent_)throw zr("cannot .send() more than once");if($n(e)&&r&&(this.xhr_.withCredentials=!0),this.sent_=!0,this.xhr_.open(t,e,!0),i!==void 0)for(const a in i)i.hasOwnProperty(a)&&this.xhr_.setRequestHeader(a,i[a].toString());return s!==void 0?this.xhr_.send(s):this.xhr_.send(),this.sendPromise_}getErrorCode(){if(!this.sent_)throw zr("cannot .getErrorCode() before sending");return this.errorCode_}getStatus(){if(!this.sent_)throw zr("cannot .getStatus() before sending");try{return this.xhr_.status}catch{return-1}}getResponse(){if(!this.sent_)throw zr("cannot .getResponse() before sending");return this.xhr_.response}getErrorText(){if(!this.sent_)throw zr("cannot .getErrorText() before sending");return this.xhr_.statusText}abort(){this.xhr_.abort()}getResponseHeader(e){return this.xhr_.getResponseHeader(e)}addUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.addEventListener("progress",e)}removeUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.removeEventListener("progress",e)}}class BA extends FA{initXhr(){this.xhr_.responseType="text"}}function Sp(){return new BA}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qn{constructor(e,t){this._service=e,t instanceof Xe?this._location=t:this._location=Xe.makeFromUrl(t,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,t){return new qn(e,t)}get root(){const e=new Xe(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return Ip(this._location.path)}get storage(){return this._service}get parent(){const e=AA(this._location.path);if(e===null)return null;const t=new Xe(this._location.bucket,e);return new qn(this._service,t)}_throwIfRoot(e){if(this._location.path==="")throw nA(e)}}function qA(n,e,t){n._throwIfRoot("uploadBytes");const r=UA(n.storage,n._location,vp(),new Jt(e,!0),t);return n.storage.makeRequestWithTokens(r,Sp).then(s=>({metadata:s,ref:n}))}function $A(n){n._throwIfRoot("getDownloadURL");const e=OA(n.storage,n._location,vp());return n.storage.makeRequestWithTokens(e,Sp).then(t=>{if(t===null)throw eA();return t})}function jA(n,e){const t=RA(n._location.path,e),r=new Xe(n._location.bucket,t);return new qn(n.storage,r)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zA(n){return/^[A-Za-z]+:\/\//.test(n)}function HA(n,e){return new qn(n,e)}function Cp(n,e){if(n instanceof Kc){const t=n;if(t._bucket==null)throw Xv();const r=new qn(t,t._bucket);return e!=null?Cp(r,e):r}else return e!==void 0?jA(n,e):n}function WA(n,e){if(e&&zA(e)){if(n instanceof Kc)return HA(n,e);throw ka("To use ref(service, url), the first argument must be a Storage instance.")}else return Cp(n,e)}function Ih(n,e){const t=e==null?void 0:e[mp];return t==null?null:Xe.makeFromBucketSpec(t,n)}function GA(n,e,t,r={}){n.host=`${e}:${t}`;const s=$n(e);s&&xa(`https://${n.host}/b`),n._isUsingEmulator=!0,n._protocol=s?"https":"http";const{mockUserToken:i}=r;i&&(n._overrideAuthToken=typeof i=="string"?i:Dh(i,n.app.options.projectId))}class Kc{constructor(e,t,r,s,i,a=!1){this.app=e,this._authProvider=t,this._appCheckProvider=r,this._url=s,this._firebaseVersion=i,this._isUsingEmulator=a,this._bucket=null,this._host=pp,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=qv,this._maxUploadRetryTime=$v,this._requests=new Set,s!=null?this._bucket=Xe.makeFromBucketSpec(s,this._host):this._bucket=Ih(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,this._url!=null?this._bucket=Xe.makeFromBucketSpec(this._url,e):this._bucket=Ih(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){Th("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){Th("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const e=this._authProvider.getImmediate({optional:!0});if(e){const t=await e.getToken();if(t!==null)return t.accessToken}return null}async _getAppCheckToken(){if(qe(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=this._appCheckProvider.getImmediate({optional:!0});return e?(await e.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new qn(this,e)}_makeRequest(e,t,r,s,i=!0){if(this._deleted)return new rA(gp());{const a=pA(e,this._appId,r,s,t,this._firebaseVersion,i,this._isUsingEmulator);return this._requests.add(a),a.getPromise().then(()=>this._requests.delete(a),()=>this._requests.delete(a)),a}}async makeRequestWithTokens(e,t){const[r,s]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,t,r,s).getPromise()}}const vh="@firebase/storage",Ah="0.14.5";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vp="storage";function xR(n,e,t){return n=te(n),qA(n,e,t)}function OR(n){return n=te(n),$A(n)}function LR(n,e){return n=te(n),WA(n,e)}function MR(n=La(),e){n=te(n);const r=Yi(n,Vp).getImmediate({identifier:e}),s=Ch("storage");return s&&KA(r,...s),r}function KA(n,e,t,r={}){GA(n,e,t,r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function QA(n,{instanceIdentifier:e}){const t=n.getProvider("app").getImmediate(),r=n.getProvider("auth-internal"),s=n.getProvider("app-check-internal");return new Kc(t,r,s,e,jn)}function YA(){Ln(new sn(Vp,QA,"PUBLIC").setMultipleInstances(!0)),mt(vh,Ah,""),mt(vh,Ah,"esm2020")}YA();export{wR as A,pR as B,sR as C,mR as D,TR as E,rR as F,Kt as G,lR as H,VR as I,ZA as J,LR as K,xR as L,OR as M,La as a,cR as b,MR as c,DR as d,gR as e,gy as f,XA as g,AR as h,wg as i,NR as j,RR as k,bR as l,kR as m,PR as n,DI as o,yR as p,uR as q,hR as r,CR as s,nR as t,SR as u,IR as v,_R as w,dR as x,ER as y,vR as z};
