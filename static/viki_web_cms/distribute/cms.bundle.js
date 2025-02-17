(()=>{"use strict";var e={d:(t,n)=>{for(var a in n)e.o(n,a)&&!e.o(t,a)&&Object.defineProperty(t,a,{enumerable:!0,get:n[a]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t)};function t(){const e=document.createElement("div");return e.classList.add("dictionary-content__square"),e}function n(e){e.close(),e.remove()}function a(e){const t=document.createElement("button");return t.classList.add("btn","btn__cancel"),t.textContent=e,t}function c(e){const t=document.createElement("button");return t.classList.add("btn","btn__save"),t.textContent=e,t}function d(e){const t=document.createElement("input");return t.type=e,t.classList.add("modal__content_"+e),t}function i(e){return fetch(e).then((e=>e.json()))}function o(e,t,n,a){let c;e.forEach((e=>{c=document.createElement("li"),c.classList.add("dropdown__list_item"),c.value=e.id,c.textContent=e.value,c.addEventListener("click",(e=>{n.value=e.target.textContent,a.value=e.target.value,t.classList.add("invisible")})),t.appendChild(c)}))}async function s(e){const t=v+"field_names/"+e;return await i(t)}function l(e){const t=document.createElement("label");return t.classList.add("modal__content_label"),t.htmlFor=e.field+"Input",t.textContent=e.label,t}e.d({},{G:()=>E,e:()=>v});const r={string:function(e){const t=d("text");return t.value=e.fieldValue,t.name=e.fieldName.field,t},boolean:function(e){const t=d("checkbox");return t.checked=e.fieldValue,t.id=e.fieldName.field+"Input",t.name=e.fieldName.field,t},number:function(e){const t=d("number");return t.value=e.fieldValue,t.name=e.fieldName.field,t},foreign:async function(e){const t=e.fieldName.foreignClass,n=e.fieldValue,a=await async function(e,t){const n=document.createElement("div");n.classList.add("dropdown");const a=d("text"),c=document.createElement("input");c.hidden=!0,c.type="text",a.classList.add("dropdown__input"),n.appendChild(a),n.appendChild(c),n.insertAdjacentHTML("beforeend",'<i class="fa-solid fa-chevron-down dropdown__input_icon"></i>');const s=document.createElement("ul");s.classList.add("dropdown__list","invisible");const l=v+"dropdown_list/"+e,r=await i(l);if(t){let e=r.find((e=>e.id===t));a.value=e.value,c.value=e.id}else r[0]&&(a.value=r[0].value,c.value=r[0].id);return o(r,s,a,c),a.addEventListener("click",(()=>{s.classList.toggle("invisible")})),n.appendChild(s),a.addEventListener("keyup",(e=>{let t=e.target.value.toUpperCase();const n=r.filter((e=>e.value.toUpperCase().indexOf(t)>-1));s.innerHTML="",o(n,s,a,c)})),n}(t,n);return a.querySelector("[hidden]").name=e.fieldName.field+"_id",a},image:function(e){const t=document.createElement("img");return t.classList.add("modal__content_image"),t.src=e.url+e.fieldValue,t.alt=e.fieldName.field,t},file:function(e){const t=document.createElement("div");t.classList.add("modal__content_file-frame");const n=d("file");return n.placeholder=e.fieldValue,n.name=e.fieldName.field,t.appendChild(n),t}};async function u(e){const t=e.closest(".dictionary-content").parentElement.querySelector(".dictionary-frame__header"),d=t.dataset.class,o=t.dataset.title,u=await async function(e,t,d){const o=document.createElement("dialog");o.classList.add("modal");const u=function(e,t,a){const c=document.createElement("div");c.classList.add("modal__header");let d=t;d="0"===a?"Создать "+d:"Изменить "+d;const i=document.createElement("div");i.textContent=d,c.appendChild(i);const o=document.createElement("button");return o.classList.add("modal__header_btn"),o.textContent="×",o.addEventListener("click",(t=>{t.preventDefault(),n(e)})),c.appendChild(o),c}(o,t,d);o.appendChild(u);const m=document.createElement("form");m.id=e+"__form",m.classList.add("modal__form"),m.enctype="multipart/form-data";const f=document.createElement("input");f.value=d,f.hidden=!0,f.name="id";const p=await async function(e,t,n){const a=document.createElement("div");a.classList.add("modal__content");const c=await s(t);let d;const o=v+"record_info/"+t+"/"+n,u=await i(o);for(const e of c){let t={fieldName:e,fieldValue:null,url:u.url};"0"!==n&&("foreign"!==e.type?t.fieldValue=u.record[e.field]:t.fieldValue=u.record[e.field+"_id"]),a.appendChild(l(e)),d=await r[e.type](t),a.appendChild(d)}return a}(0,e,d);m.appendChild(f),m.appendChild(p),m.appendChild(function(e){const t=document.createElement("div");t.classList.add("modal__button-block");const d=a("Отменить");d.type="button",d.addEventListener("click",(t=>{t.preventDefault(),n(e)}));const i=c("Записать");return i.type="button",i.classList.add("submit"),t.appendChild(d),t.appendChild(i),t}(o)),o.appendChild(m);const _=new FormData(m);return m.querySelector(".submit").addEventListener("mousedown",(t=>async function(e,t,a,c){e.preventDefault();const d=t.closest(".modal");e.target.disabled=!0;const i=new FormData(t);if(!function(e,t){const n=Array.from(t.values()),a=Array.from(e.values());return n.sort(),a.sort(),JSON.stringify(n)===JSON.stringify(a)}(i,c)){const e=v+"edit_dictionary/"+a;await fetch(e,{method:"POST",body:i})}n(d),console.log()}(t,m,e,_))),o}(d,o,e.dataset.itemId);document.querySelector(".service").appendChild(u),u.showModal(),function(e){let t,n,a=!1;e.querySelector(".modal__header").addEventListener("mousedown",(c=>{a=!0,t=c.clientX-e.offsetLeft,n=c.clientY-e.offsetTop,e.style.cursor="grabbing"})),document.addEventListener("mousemove",(c=>{a&&(e.style.left=c.clientX-t+"px",e.style.top=c.clientY-n+"px")})),document.addEventListener("mouseup",(()=>{a=!1,e.style.cursor="grab"}))}(u),console.log()}function m(e){let t="14px 6fr ";return e.forEach((e=>{"name"!==e.field&&("boolean"===e.type||"number"===e.type?t+="1fr ":t+="3fr ")})),t+="80px",t}async function f(e,n,c,d,o){const l=document.createElement("div");l.classList.add("dictionary-content__rows");const r=v+"field_values/"+e+"/"+n+"/"+c+"/"+d,p=await i(r);let _=0;return p.values.forEach((i=>{let r=document.createElement("div");!function(e,n,c){e.classList.add("dictionary-content__row");const d=t();n.hex&&(d.style.backgroundColor=n.hex),e.appendChild(d),e.id="row_"+n.id,Object.keys(n).forEach(((t,a)=>{if("id"!==t){let a;Object.keys(c).includes(t)&&"image"===c[t].type?(a=document.createElement("img"),a.classList.add("dictionary-content__row_img"),a.src=c[t].url+n[t],a.alt=n[t]):(a=document.createElement("div"),a.classList.add("dictionary-content__row_item"),a.textContent=n[t]),e.appendChild(a)}}));const i=a("Изм.");i.dataset.itemId=n.id,i.addEventListener("click",(e=>u(e.target))),e.appendChild(i)}(r,i,p.field_params),r.style.gridTemplateColumns=o,l.appendChild(r),_++,20===_&&(r.dataset.lastRecord=c+20,r.addEventListener("mouseover",(t=>async function(e,t,n,a,c){const d=m(await s(t)),i=e.closest(".dictionary-content__rows");[...(await f(t,n,c,a,d)).children].forEach((e=>{i.appendChild(e)}));const o=e.cloneNode(!0);e.parentNode.replaceChild(o,e)}(t.target,e,n,d,c+20))))})),l}async function p(e,n,a,c){const d=await s(e),i=document.createElement("div");i.classList.add("dictionary-content");const o=await async function(e){const n=document.createElement("div");n.classList.add("dictionary-content__title","dictionary-content__row"),n.appendChild(t()),e.forEach((e=>{let t=document.createElement("div");t.classList.add("dictionary-content__title_item"),t.textContent=e.label,n.appendChild(t)}));const a=document.createElement("button");return a.classList.add("btn","btn__save"),a.textContent="Создать",a.dataset.itemId="0",a.addEventListener("click",(e=>u(e.target))),n.appendChild(a),n}(d);o.style.gridTemplateColumns=n,i.appendChild(o);const l=await f(e,a,0,c,n);return i.appendChild(l),i}async function _(e,t,n,a){let c=e.querySelector(".dictionary-content");const d=e.querySelector(".dictionary-frame__header").dataset.grid;c.remove(),c=await p(t,d,n.checked?0:1,a),e.appendChild(c)}function y(e){let t=e;return function(e){return/^[a-zA-Zа-яА-ЯёЁ0-9 _#]*$/.test(e)}(e)&&e||(t="None"),t.replace(/ /g,"|")}function h(e,t,n){const d=document.createElement("div");d.classList.add("dictionary-frame__header");const i=document.createElement("div");i.classList.add("dictionary-frame__header_left"),i.textContent=t,d.appendChild(i);const o=document.createElement("div");if(o.classList.add("dictionary-frame__header_right"),n){const e=function(){const e=document.createElement("button");return e.classList.add("btn","btn__neutral"),e.textContent="Загрузить",e}();e.addEventListener("click",(()=>async function(){}())),o.appendChild(e)}const s=function(){const e=document.createElement("input");return e.type="checkbox",e.checked=!0,e.classList.add("check"),e}();s.id=e+"-deleted",s.addEventListener("change",(()=>async function(e,t){const n=t.closest(".dictionary-frame");let a=n.querySelector(".dictionary-frame__input").value;await _(n,e,t,y(a))}(e,s))),o.appendChild(s);const l=document.createElement("label");l.htmlFor=e+"-deleted",l.classList.add("dictionary-frame__label"),l.textContent="скрыть удаленные",o.appendChild(l),o.insertAdjacentHTML("beforeend",'<i class="fa fa-solid fa-magnifying-glass"></i>');const r=document.createElement("input");r.classList.add("dictionary-frame__input"),r.type="text",r.placeholder="поиск...",o.appendChild(r);const u=c("Поиск");u.addEventListener("click",(t=>async function(e,t){const n=e.closest(".dictionary-frame"),a=n.querySelector(".dictionary-frame__input").value,c=n.querySelector(".check");await _(n,t,c,y(a))}(t.target,e)));const m=a("Очистить");return m.addEventListener("click",(t=>async function(e,t){const n=e.closest(".dictionary-frame");n.querySelector(".dictionary-frame__input").value="";const a=n.querySelector(".check");await _(n,t,a,"None")}(t.target,e))),o.appendChild(u),o.appendChild(m),d.appendChild(o),d.dataset.class=e,d.dataset.title=t,d}const v="./json/",E={Goods:async function(e){return await p(e,"14px 4fr 1fr 2fr 3fr 3fr 3fr 3fr 3fr 1fr 1fr 3fr 1fr",0,"None")},Catalogue:async function(e){return document.createElement("div")},PriceList:async function(e){return document.createElement("div")}},L=document.querySelectorAll(".menu__item"),C=document.querySelector(".content");L.forEach((e=>{e.addEventListener("click",(t=>{e.classList.contains("menu__item_bold")||(e.classList.add("menu__item_bold"),C.innerHTML="","Standard"===t.target.dataset.page?function(e,t){e.style.flexDirection="row";const n=document.createElement("div");n.classList.add("content__left"),e.appendChild(n);const a=document.createElement("div");a.classList.add("content__right"),e.appendChild(a),JSON.parse(t).forEach((e=>{let t=document.createElement("details");t.classList.add("section-left");let a=document.createElement("summary");a.textContent=e.section_name,t.appendChild(a),e.cms_settings.forEach((e=>{let n=document.createElement("li");n.textContent=e.setting,n.dataset.class=e.setting_class,n.dataset.upload=e.upload,n.classList.add("section-left__content"),t.appendChild(n)}));const c=t.querySelectorAll("li");c.forEach((e=>{e.addEventListener("click",(()=>async function(e,t,n,a,c){if(e.classList.toggle("text-active"),document.getElementById(t))document.getElementById(t).classList.toggle("invisible");else{const a=document.querySelector(".content__right"),c=await async function(e,t,n){const a=m(await s(e)),c=document.createElement("section");c.classList.add("dictionary-frame"),c.id=e;const d=h(e,t,n);return d.dataset.grid=a,c.appendChild(d),c}(t,e.textContent,n),d=c.querySelector(".dictionary-frame__header").dataset.grid,i=await p(t,d,0,"None");c.appendChild(i),a.appendChild(c)}!function(e,t){const n=e.querySelector("summary");Array.from(t).some((e=>e.classList.contains("text-active")))?n.classList.add("text-active"):n.classList.remove("text-active")}(a,c)}(e,e.dataset.class,JSON.parse(e.dataset.upload),t,c)))})),n.appendChild(t)}))}(C,e.dataset.content):async function(e,t,n){e.style.flexDirection="column";const a=JSON.parse(t)[0],c=a.cms_settings[0].setting,d=a.cms_settings[0].setting_class,i=h(d,c,a.cms_settings[0].upload);e.appendChild(i);const o=await E[n](d);e.appendChild(o)}(C,e.dataset.content,t.target.dataset.page)),L.forEach((t=>{t!==e&&t.classList.remove("menu__item_bold")}))}))}))})();