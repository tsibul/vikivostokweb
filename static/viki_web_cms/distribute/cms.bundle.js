(()=>{"use strict";var e={d:(t,n)=>{for(var a in n)e.o(n,a)&&!e.o(t,a)&&Object.defineProperty(t,a,{enumerable:!0,get:n[a]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t)};function t(){const e=document.createElement("div");return e.classList.add("dictionary-content__square"),e}function n(e){e.close(),e.remove()}function a(e){const t=document.createElement("button");return t.classList.add("btn","btn__cancel"),t.textContent=e,t}function d(e){const t=document.createElement("button");return t.classList.add("btn","btn__save"),t.textContent=e,t}function c(e){const t=document.createElement("input");return t.type=e,t.classList.add("modal__content_"+e),t}function i(e){return fetch(e).then((e=>e.json()))}function o(e,t,n,a,d){d&&s({id:"",value:""},t,n,a),e.forEach((e=>{s(e,t,n,a)}))}function s(e,t,n,a){const d=document.createElement("li");d.classList.add("dropdown__list_item"),d.value=e.id,d.textContent=e.value,d.addEventListener("click",(e=>{n.value=e.target.textContent,a.value=e.target.value,t.classList.add("invisible")})),t.appendChild(d)}async function l(e){const t=g+"field_names/"+e;return await i(t)}function r(e){const t=document.createElement("label");return t.classList.add("modal__content_label"),t.htmlFor=e.field+"Input",t.textContent=e.label,t}e.d({},{G:()=>C,e:()=>g});const u={string:function(e){const t=c("text");return t.value=e.fieldValue,t.name=e.fieldName.field,t},boolean:function(e){const t=c("checkbox");return t.checked=e.fieldValue,t.id=e.fieldName.field+"Input",t.name=e.fieldName.field,t},number:function(e){const t=c("number");return t.value=e.fieldValue,t.name=e.fieldName.field,t},foreign:async function(e){const t=e.fieldName.foreignClass,n=e.fieldValue,a=await async function(e,t,n){const a=document.createElement("div");a.classList.add("dropdown");const d=c("text"),s=document.createElement("input");s.hidden=!0,s.type="text",d.classList.add("dropdown__input"),a.appendChild(d),a.appendChild(s),a.insertAdjacentHTML("beforeend",'<i class="fa-solid fa-chevron-down dropdown__input_icon"></i>');const l=document.createElement("ul");l.classList.add("dropdown__list","invisible");const r=g+"dropdown_list/"+e,u=await i(r);if(t){let e=u.find((e=>e.id===t));d.value=e.value,s.value=e.id}else u[0]&&!n&&(d.value=u[0].value,s.value=u[0].id);return o(u,l,d,s,n),d.addEventListener("click",(()=>{l.classList.toggle("invisible")})),a.appendChild(l),d.addEventListener("keyup",(e=>{let t=e.target.value.toUpperCase();const n=u.filter((e=>e.value.toUpperCase().indexOf(t)>-1));l.innerHTML="",o(n,l,d,s)})),a}(t,n,e.fieldName.null);return a.querySelector("[hidden]").name=e.fieldName.field+"_id",a},image:function(e){const t=document.createElement("img");return t.classList.add("modal__content_image"),t.src=e.url+e.fieldValue,t.alt=e.fieldName.field,t},file:function(e){const t=document.createElement("div");t.classList.add("modal__content_file-frame");const n=c("file");return n.placeholder=e.fieldValue,n.name=e.fieldName.field,t.appendChild(n),t}};function m(e){let t="14px 6fr ";return e.forEach((e=>{"name"!==e.field&&("boolean"===e.type||"number"===e.type?t+="1fr ":t+="3fr ")})),t+="80px",t}async function f(e,t,n,a,d){const c=document.createElement("div");c.classList.add("dictionary-content__rows");const o=g+"field_values/"+e+"/"+t+"/"+n+"/"+a,s=await i(o);let r=0;return s.values.forEach((i=>{let o=document.createElement("div");p(o,i,s.field_params,e),o.style.gridTemplateColumns=d,c.appendChild(o),r++,20===r&&(o.dataset.lastRecord=n+20,o.addEventListener("mouseover",(d=>async function(e,t,n,a,d){const c=m(await l(t)),i=e.closest(".dictionary-content__rows");[...(await f(t,n,d,a,c)).children].forEach((e=>{i.appendChild(e)}));const o=e.cloneNode(!0);e.parentNode.replaceChild(o,e)}(d.target,e,t,a,n+20))))})),c}function p(e,n,d,c){e.classList.add("dictionary-content__row");const i=t();n.hex&&(i.style.backgroundColor=n.hex),e.appendChild(i),e.id=c+"_row_"+n.id,Object.keys(n).forEach(((t,a)=>{if("id"!==t){let a;Object.keys(d).includes(t)&&"image"===d[t].type?(a=document.createElement("img"),a.classList.add("dictionary-content__row_img"),a.src=d[t].url+n[t],a.alt=n[t]):(a=document.createElement("div"),a.classList.add("dictionary-content__row_item"),a.textContent=n[t]),e.appendChild(a)}}));const o=a("Изм.");o.dataset.itemId=n.id,o.addEventListener("click",(e=>_(e))),e.appendChild(o)}async function _(e){e.preventDefault();const t=e.target.closest(".dictionary-content").parentElement.querySelector(".dictionary-frame__header"),c=t.dataset.class,o=t.dataset.title,s=await async function(e,t,c){const o=document.createElement("dialog");o.classList.add("modal"),o.addEventListener("keypress",(e=>{"Escape"===e.key&&n(o)}));const s=function(e,t,a){const d=document.createElement("div");d.classList.add("modal__header");let c=t;c="0"===a?"Создать "+c:"Изменить "+c;const i=document.createElement("div");i.textContent=c,d.appendChild(i);const o=document.createElement("button");return o.classList.add("modal__header_btn"),o.textContent="×",o.addEventListener("click",(t=>{t.preventDefault(),n(e)})),d.appendChild(o),d}(o,t,c);o.appendChild(s);const m=document.createElement("form");m.id=e+"__form",m.classList.add("modal__form"),m.enctype="multipart/form-data";const f=await async function(e,t,n){const a=document.createElement("div");a.classList.add("modal__content");const d=await l(t);let c;const o=g+"record_info/"+t+"/"+n,s=await i(o);for(const e of d){let t={fieldName:e,fieldValue:null,url:s.url};"0"!==n&&("foreign"!==e.type?t.fieldValue=s.record[e.field]:t.fieldValue=s.record[e.field+"_id"]),a.appendChild(r(e)),c=await u[e.type](t),a.appendChild(c)}return a}(0,e,c);m.appendChild(f),m.appendChild(function(e,t){const c=document.createElement("div");c.classList.add("modal__button-block");const i=a("Отменить");i.type="button",i.addEventListener("click",(t=>{t.preventDefault(),n(e)}));const o=d("Записать");return o.type="button",o.classList.add("submit"),o.dataset.id=t,c.appendChild(i),c.appendChild(o),c}(o,c)),o.appendChild(m);const _=new FormData(m);return m.querySelector(".submit").addEventListener("click",(t=>async function(e,t,a,d){e.preventDefault();const c=e.target.dataset.id,i=t.closest(".modal");i.querySelectorAll("input").forEach((e=>{e.classList.remove("border-alert")})),e.target.disabled=!0;const o=new FormData(t);if(!function(e,t){const n=Array.from(t.values()),a=Array.from(e.values());return n.sort(),a.sort(),JSON.stringify(n)===JSON.stringify(a)}(o,d)){const t=g+"edit_dictionary/"+a+"/"+c;await fetch(t,{method:"POST",body:o}).then((e=>e.json())).then((t=>{const d=t.errors;if(d){let t;d.forEach((n=>{e.target.disabled=!1,t=i.querySelector(`[name = "${n}"]`),t.hidden?t.previousElementSibling.classList.add("border-alert"):t.classList.add("border-alert"),e.target.focus()}))}else{let e;if("0"!==c)e=document.querySelector("#"+a+"_row_"+c),e.innerHTML="";else{e=document.createElement("div"),e.id=a+"_row_"+t.values.id,e.classList.add("dictionary-content__row");const n=document.getElementById(a).querySelector(".dictionary-content__rows");n.insertAdjacentElement("afterbegin",e),e.style.gridTemplateColumns=n.closest(".dictionary-frame").querySelector(".dictionary-frame__header").dataset.grid}p(e,t.values,t.params,a),e.scrollIntoView({behavior:"smooth"}),e.focus(),n(i)}}))}}(t,m,e,_))),o}(c,o,e.target.dataset.itemId);document.querySelector(".service").appendChild(s),s.showModal(),function(e){let t,n,a=!1;e.querySelector(".modal__header").addEventListener("mousedown",(d=>{a=!0,t=d.clientX-e.offsetLeft,n=d.clientY-e.offsetTop,e.style.cursor="grabbing"})),document.addEventListener("mousemove",(d=>{a&&(e.style.left=d.clientX-t+"px",e.style.top=d.clientY-n+"px")})),document.addEventListener("mouseup",(()=>{a=!1,e.style.cursor="grab"}))}(s),console.log()}async function y(e,n,a,d){const c=await l(e),i=document.createElement("div");i.classList.add("dictionary-content");const o=await async function(e){const n=document.createElement("div");n.classList.add("dictionary-content__title","dictionary-content__row"),n.appendChild(t()),e.forEach((e=>{let t=document.createElement("div");t.classList.add("dictionary-content__title_item"),t.textContent=e.label,n.appendChild(t)}));const a=document.createElement("button");return a.classList.add("btn","btn__save"),a.textContent="Создать",a.dataset.itemId="0",a.addEventListener("click",(e=>_(e))),n.appendChild(a),n}(c);o.style.gridTemplateColumns=n,i.appendChild(o);const s=await f(e,a,0,d,n);return i.appendChild(s),i.dataset.grid=n,i}async function h(e,t,n,a){let d=e.querySelector(".dictionary-content");const c=d.dataset.grid;d.remove(),d=await y(t,c,n.checked?0:1,a),e.appendChild(d)}function v(e){let t=e;return function(e){return/^[a-zA-Zа-яА-ЯёЁ0-9 _#]*$/.test(e)}(e)&&e||(t="None"),t.replace(/ /g,"|")}async function E(e,t){const n=e.closest(".dictionary-frame__header").parentElement,a=n.querySelector(".dictionary-frame__input").value,d=n.querySelector(".check");await h(n,t,d,v(a))}function L(e,t,n){const c=document.createElement("div");c.classList.add("dictionary-frame__header");const i=document.createElement("div");i.classList.add("dictionary-frame__header_left"),i.textContent=t,c.appendChild(i);const o=document.createElement("div");if(o.classList.add("dictionary-frame__header_right"),n){const e=function(){const e=document.createElement("button");return e.classList.add("btn","btn__neutral"),e.textContent="Загрузить",e}();e.addEventListener("click",(()=>async function(){}())),o.appendChild(e)}const s=function(){const e=document.createElement("input");return e.type="checkbox",e.checked=!0,e.classList.add("check"),e}();s.id=e+"-deleted",s.addEventListener("change",(()=>async function(e,t){const n=t.closest(".dictionary-frame__header").parentElement;let a=n.querySelector(".dictionary-frame__input").value;await h(n,e,t,v(a))}(e,s))),o.appendChild(s);const l=document.createElement("label");l.htmlFor=e+"-deleted",l.classList.add("dictionary-frame__label"),l.textContent="скрыть удаленные",o.appendChild(l),o.insertAdjacentHTML("beforeend",'<i class="fa fa-solid fa-magnifying-glass"></i>');const r=document.createElement("input");r.classList.add("dictionary-frame__input"),r.type="text",r.placeholder="поиск...",r.addEventListener("keypress",(t=>{"Enter"===t.key&&E(t.target,e)})),o.appendChild(r);const u=d("Поиск");u.addEventListener("click",(t=>E(t.target,e)));const m=a("Очистить");return m.addEventListener("click",(t=>async function(e,t){const n=e.closest(".dictionary-frame");n.querySelector(".dictionary-frame__input").value="";const a=n.querySelector(".check");await h(n,t,a,"None")}(t.target,e))),o.appendChild(u),o.appendChild(m),c.appendChild(o),c.dataset.class=e,c.dataset.title=t,c}const g="./json/",C={Goods:async function(e){const t="14px 4fr 1fr 2fr 3fr 3fr 3fr 3fr 3fr 1fr 1fr 3fr 1fr",n=await y(e,t,0,"None");return n.id=e,n.dataset.grid=t,n},Catalogue:async function(e){return document.createElement("div")},PriceList:async function(e){return document.createElement("div")}},b=document.querySelectorAll(".menu__item"),w=document.querySelector(".content");b.forEach((e=>{e.addEventListener("click",(t=>{e.classList.contains("menu__item_bold")||(e.classList.add("menu__item_bold"),w.innerHTML="","Standard"===t.target.dataset.page?function(e,t){e.style.flexDirection="row";const n=document.createElement("div");n.classList.add("content__left"),e.appendChild(n);const a=document.createElement("div");a.classList.add("content__right"),e.appendChild(a),JSON.parse(t).forEach((e=>{let t=document.createElement("details");t.classList.add("section-left");let a=document.createElement("summary");a.textContent=e.section_name,t.appendChild(a),e.cms_settings.forEach((e=>{let n=document.createElement("li");n.textContent=e.setting,n.dataset.class=e.setting_class,n.dataset.upload=e.upload,n.classList.add("section-left__content"),t.appendChild(n)}));const d=t.querySelectorAll("li");d.forEach((e=>{e.addEventListener("click",(()=>async function(e,t,n,a,d){if(e.classList.toggle("text-active"),document.getElementById(t))document.getElementById(t).classList.toggle("invisible");else{const a=document.querySelector(".content__right"),d=await async function(e,t,n){const a=document.createElement("section");a.classList.add("dictionary-frame"),a.id=e;const d=L(e,t,n);return a.appendChild(d),a}(t,e.textContent,n),c=m(await l(t)),i=await y(t,c,0,"None");d.appendChild(i),a.appendChild(d)}!function(e,t){const n=e.querySelector("summary");Array.from(t).some((e=>e.classList.contains("text-active")))?n.classList.add("text-active"):n.classList.remove("text-active")}(a,d)}(e,e.dataset.class,JSON.parse(e.dataset.upload),t,d)))})),n.appendChild(t)}))}(w,e.dataset.content):async function(e,t,n){e.style.flexDirection="column";const a=JSON.parse(t)[0],d=a.cms_settings[0].setting,c=a.cms_settings[0].setting_class,i=L(c,d,a.cms_settings[0].upload);e.appendChild(i);const o=await C[n](c);e.appendChild(o)}(w,e.dataset.content,t.target.dataset.page)),b.forEach((t=>{t!==e&&t.classList.remove("menu__item_bold")}))}))}))})();