(()=>{"use strict";var e={d:(t,n)=>{for(var a in n)e.o(n,a)&&!e.o(t,a)&&Object.defineProperty(t,a,{enumerable:!0,get:n[a]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t)};function t(e){e.close(),e.remove()}function n(e,n,a){const c=document.createElement("div");c.classList.add("modal__header");let i=n;i="0"===a?"Создать "+i:"Изменить "+i;const d=document.createElement("div");d.textContent=i,c.appendChild(d);const o=document.createElement("button");return o.classList.add("modal__header_btn"),o.textContent="×",o.addEventListener("click",(n=>{n.preventDefault(),t(e)})),c.appendChild(o),c}function a(e){const t=document.createElement("button");return t.classList.add("btn","btn__cancel"),t.textContent=e,t}function c(e){const t=document.createElement("button");return t.classList.add("btn","btn__save"),t.textContent=e,t}function i(e,n){const i=document.createElement("div");i.classList.add("modal__button-block");const d=a("Отменить");d.type="button",d.addEventListener("click",(n=>{n.preventDefault(),t(e)}));const o=c("Записать");return o.type="button",o.classList.add("submit"),o.dataset.id=n,i.appendChild(d),i.appendChild(o),i}function d(e){let t,n,a=!1;e.querySelector(".modal__header").addEventListener("mousedown",(c=>{a=!0,t=c.clientX-e.offsetLeft,n=c.clientY-e.offsetTop,e.style.cursor="grabbing"})),document.addEventListener("mousemove",(c=>{a&&(e.style.left=c.clientX-t+"px",e.style.top=c.clientY-n+"px")})),document.addEventListener("mouseup",(()=>{a=!1,e.style.cursor="grab"}))}function o(){const e=document.createElement("div");return e.classList.add("dictionary-content__square"),e}function l(e){const t=document.createElement("input");return t.type=e,t.classList.add("modal__content_"+e),t}function s(e){return fetch(e).then((e=>e.json()))}async function r(e,t,n){const a=document.createElement("div");a.classList.add("dropdown");const c=l("text"),i=document.createElement("input");i.hidden=!0,i.type="text",c.classList.add("dropdown__input"),a.appendChild(c),a.appendChild(i),a.insertAdjacentHTML("beforeend",'<i class="fa-solid fa-chevron-down dropdown__input_icon"></i>');const d=document.createElement("ul");d.classList.add("dropdown__list","invisible");const o=I+"dropdown_list/"+e,r=await s(o);if(t){let e=r.find((e=>e.id===t));c.value=e.value,i.value=e.id}else r[0]&&!n&&(c.value=r[0].value,i.value=r[0].id);return u(r,d,c,i,n),c.addEventListener("click",(()=>{d.classList.toggle("invisible")})),a.appendChild(d),c.addEventListener("keyup",(e=>{let t=e.target.value.toUpperCase();const n=r.filter((e=>e.value.toUpperCase().indexOf(t)>-1));d.innerHTML="",u(n,d,c,i)})),a}function u(e,t,n,a,c){c&&m({id:"",value:""},t,n,a),e.forEach((e=>{m(e,t,n,a)}))}function m(e,t,n,a){const c=document.createElement("li");c.classList.add("dropdown__list_item"),c.value=e.id,c.textContent=e.value,c.addEventListener("click",(e=>{n.value=e.target.textContent,a.value=e.target.value,a.dispatchEvent(new Event("change",{bubbles:!0})),t.classList.add("invisible")})),t.appendChild(c)}async function p(e){const t=I+"field_names/"+e;return await s(t)}function _(e){const t=document.createElement("label");return t.classList.add("modal__content_label"),t.htmlFor=e.field+"Input",t.textContent=e.label,t}e.d({},{G:()=>A,e:()=>I});const f={string:function(e){const t=l("text");return t.value=e.fieldValue,t.name=e.fieldName.field,t},boolean:function(e){const t=l("checkbox");return t.checked=e.fieldValue,t.id=e.fieldName.field+"Input",t.name=e.fieldName.field,t},number:function(e){const t=l("number");return t.value=e.fieldValue,t.name=e.fieldName.field,t},foreign:async function(e){const t=e.fieldName.foreignClass,n=e.fieldValue,a=await r(t,n,e.fieldName.null);return a.querySelector("[hidden]").name=e.fieldName.field+"_id",a},image:function(e){const t=document.createElement("img");return t.classList.add("modal__content_image"),t.src=e.url+e.fieldValue,t.alt=e.fieldName.field,t},file:function(e){const t=document.createElement("div");t.classList.add("modal__content_file-frame");const n=l("file");return n.placeholder=e.fieldValue,n.name=e.fieldName.field,t.appendChild(n),t}};function y(e){let t="14px 6fr ";return e.forEach((e=>{"name"!==e.field&&("boolean"===e.type||"number"===e.type?t+="1fr ":t+="3fr ")})),t+="80px",t}async function v(e,t,n,a,c){const i=document.createElement("div");i.classList.add("dictionary-content__rows");const d=I+"field_values/"+e+"/"+t+"/"+n+"/"+a,o=await s(d);let l=0;return o.values.forEach((d=>{let s=document.createElement("div");h(s,d,o.field_params,e),s.style.gridTemplateColumns=c,i.appendChild(s),l++,20===l&&(s.dataset.lastRecord=n+20,s.addEventListener("mouseover",(c=>async function(e,t,n,a,c){const i=y(await p(t)),d=e.closest(".dictionary-content__rows");[...(await v(t,n,c,a,i)).children].forEach((e=>{d.appendChild(e)}));const o=e.cloneNode(!0);e.parentNode.replaceChild(o,e)}(c.target,e,t,a,n+20))))})),i}function h(e,t,n,c){e.classList.add("dictionary-content__row");const i=o();t.hex&&(i.style.backgroundColor=t.hex),e.appendChild(i),e.id=c+"_row_"+t.id,Object.keys(t).forEach(((a,c)=>{if("id"!==a){let c;Object.keys(n).includes(a)&&"image"===n[a].type?(c=document.createElement("img"),c.classList.add("dictionary-content__row_img"),c.src=n[a].url+t[a],c.alt=t[a]):Object.keys(n).includes(a)&&"boolean"===n[a].type?(c=document.createElement("input"),c.type="checkbox",c.checked=t[a],c.disabled=!0,c.classList.add("dictionary-content__check")):(c=document.createElement("div"),c.classList.add("dictionary-content__row_item"),c.textContent=t[a]),e.appendChild(c)}}));const d=a("Изм.");d.dataset.itemId=t.id,d.addEventListener("click",(e=>g(e))),e.appendChild(d)}async function g(e){e.preventDefault();const a=e.target.closest(".dictionary-content").parentElement.querySelector(".dictionary-frame__header"),c=a.dataset.class,o=a.dataset.title,l=await async function(e,a,c){const d=document.createElement("dialog");d.classList.add("modal"),d.addEventListener("keypress",(e=>{"Escape"===e.key&&t(d)}));const o=n(d,a,c);d.appendChild(o);const l=document.createElement("form");l.id=e+"__form",l.classList.add("modal__form"),l.enctype="multipart/form-data";const r=await async function(e,t,n){const a=document.createElement("div");a.classList.add("modal__content");const c=await p(t);let i;const d=I+"record_info/"+t+"/"+n,o=await s(d);for(const e of c){let t={fieldName:e,fieldValue:null,url:o.url};"0"!==n&&("foreign"!==e.type?t.fieldValue=o.record[e.field]:t.fieldValue=o.record[e.field+"_id"]),a.appendChild(_(e)),i=await f[e.type](t),a.appendChild(i)}return a}(0,e,c);l.appendChild(r),l.appendChild(i(d,c)),d.appendChild(l);const u=new FormData(l);return l.querySelector(".submit").addEventListener("click",(n=>async function(e,n,a,c){e.preventDefault();const i=e.target.dataset.id,d=n.closest(".modal");d.querySelectorAll("input").forEach((e=>{e.classList.remove("border-alert")})),e.target.disabled=!0;const o=new FormData(n);if(!function(e,t){const n=Array.from(t.values()),a=Array.from(e.values());return n.sort(),a.sort(),JSON.stringify(n)===JSON.stringify(a)}(o,c)){const n=I+"edit_dictionary/"+a+"/"+i;await fetch(n,{method:"POST",body:o}).then((e=>e.json())).then((n=>{const c=n.errors;if(c){let t;c.forEach((n=>{e.target.disabled=!1,t=d.querySelector(`[name = "${n}"]`),t.hidden?t.previousElementSibling.classList.add("border-alert"):t.classList.add("border-alert"),e.target.focus()}))}else{let e;if("0"!==i)e=document.querySelector("#"+a+"_row_"+i),e.innerHTML="";else{let t;e=document.createElement("div"),e.id=a+"_row_"+n.values.id,e.classList.add("dictionary-content__row"),t=document.getElementById(a)?document.getElementById(a).querySelector(".dictionary-content__rows"):document.querySelector(".dictionary-content__rows"),t.insertAdjacentElement("afterbegin",e),e.style.gridTemplateColumns=t.closest(".dictionary-content").dataset.grid}h(e,n.values,n.params,a),e.scrollIntoView({behavior:"smooth"}),e.focus(),t(d)}}))}}(n,l,e,u))),d}(c,o,e.target.dataset.itemId);document.querySelector(".service").appendChild(l),l.showModal(),d(l),console.log()}async function b(e,t,n,a){const c=await p(e),i=document.createElement("div");i.classList.add("dictionary-content");const d=await async function(e){const t=document.createElement("div");t.classList.add("dictionary-content__title","dictionary-content__row"),t.appendChild(o()),e.forEach((e=>{let n=document.createElement("div");n.classList.add("dictionary-content__title_item"),n.textContent=e.label,t.appendChild(n)}));const n=document.createElement("button");return n.classList.add("btn","btn__save"),n.textContent="Создать",n.dataset.itemId="0",n.addEventListener("click",(e=>g(e))),t.appendChild(n),t}(c);d.style.gridTemplateColumns=t,i.appendChild(d);const l=await v(e,n,0,a,t);return i.appendChild(l),i.dataset.grid=t,i}async function L(e,t,n,a){let c=e.querySelector(".dictionary-content");const i=c.dataset.grid;c.remove(),c=await b(t,i,n.checked?0:1,a),e.appendChild(c)}function E(e){let t=e;return function(e){return/^[a-zA-Zа-яА-ЯёЁ0-9 _#]*$/.test(e)}(e)&&e||(t="None"),t.replace(/ /g,"|")}function C(e,t,n){const a=document.createElement("input");return a.type=e,a.name=t,"id"===t.slice(-2)&&(a.hidden=!0),"checkbox"===e?(a.checked=n,a.classList.add("check","catalogue__check")):(a.value=n,a.readOnly=!0,a.classList.add("catalogue__input")),a}function w(e,t){t.value=JSON.stringify(e)}function x(e){const t=e.target.closest("form").querySelector('input[type="file"]');t.value="",t.dispatchEvent(new Event("change",{bubbles:!0}))}async function S(e,t){t.enctype="multipart/form-data",t.classList.add("catalogue","catalogue__row"),t.appendChild(C("number","id",e.id));const n=C("checkbox","deleted",e.deleted);n.addEventListener("change",(e=>function(e){const t=e.target.closest("form");if(t.querySelector("textarea").value){const e=t.querySelector(".btn__save");e.disabled=!1,e.classList.remove("btn__disabled");const n=t.querySelector(".btn__cancel");n.disabled=!1,n.classList.remove("btn__disabled")}}(e))),t.appendChild(n);const i=document.createElement("textarea");i.value=e.name,i.name="name",i.classList.add("catalogue__input"),i.readOnly=!0,t.appendChild(i),t.appendChild(C("text","item_article",e.item_article));const d=document.createElement("div");d.classList.add("catalogue__input","main_color_text"),d.textContent=e.main_color_text,t.appendChild(d),t.appendChild(C("text","main_color__id",e.main_color__id)),t.appendChild(C("number","goods_option__id",e.goods_option__id));const o=document.createElement("div");o.classList.add("catalogue__input","goods_option__name"),o.textContent=e.goods_option__name,t.appendChild(o);const l=document.createElement("img");l.classList.add("catalogue__img"),l.alt=e.item_article,l.src="/static/viki_web_cms/files/item_photo/"+e.image,t.appendChild(l);const u=C("checkbox","simple_article",e.simple_article);0===e.id&&(u.checked=!0),u.addEventListener("change",(e=>x(e))),t.appendChild(u);const m=await r("Goods",e.goods__id,!1);t.appendChild(m);const p=m.querySelector("input[hidden]");p.name="goods__id",p.addEventListener("change",(e=>x(e)));const _=document.createElement("div");_.classList.add("catalogue__file");const f=document.createElement("div");f.textContent=e.image,f.classList.add("catalogue__file_text"),_.appendChild(f);const y=document.createElement("div");y.classList.add("catalogue__input-frame");const v=document.createElement("input");v.classList.add("catalogue__file_input"),v.type="file",v.name="image",v.accept="image/png, image/jpeg, image/jpg",v.addEventListener("change",(async e=>await async function(e,t,n,a,c){const i=e.target.closest("form"),d=i.querySelector('input[name="id"]'),o=i.querySelector('input[name="colors"]'),l=i.querySelector('input[name="goods_option__id"]'),r=i.querySelector('textarea[name="name"]'),u=i.querySelector('input[name="item_article"]'),m=i.querySelector('input[name="main_color__id"]'),p=i.querySelector(".main_color_text"),_=i.querySelector(".goods_option__name"),f=i.querySelector(".btn__save");function y(){t.textContent="",c.src="",r.value="",u.value="",m.value="",p.textContent="",l.value="",_.textContent="",o.value="",f.disabled=!0,f.classList.contains("btn__disabled")||f.classList.add("btn__disabled")}if(o.value="",l.value="",/(\.jpg|\.jpeg|\.png)$/i.exec(e.target.value)){const i=e.target.files[0],v=new FileReader;v.onload=function(e){c.src=e.target.result},v.readAsDataURL(i),t.textContent=e.target.value.split("\\").pop();const h=t.textContent.split(".")[0],g=I+"parse_file_data/"+n+"/"+a+"/"+h+"/"+d.value,b=await s(g);b.error?y():(r.value=b.values.name,u.value=b.values.item_article,m.value=b.values.main_color__id,p.textContent=b.values.main_color_text,l.value=b.values.goods_option__id,_.textContent=b.values.goods_option__name,w(b.values.colors,o),f.disabled=!1,f.classList.remove("btn__disabled"))}else e.target.value="",y()}(e,f,p.value,u.checked?1:0,l))),y.appendChild(v),_.appendChild(y),t.appendChild(_);const h=document.createElement("div");h.classList.add("catalogue__btn-block");const g=c("");g.disabled=!0,g.classList.add("tooltip","btn__disabled"),g.innerHTML='<i class="catalogue__icon fa-solid fa-check"></i><span class="tooltip-text">сохранить</span>',g.addEventListener("click",(e=>async function(e,t){t.disabled=!0,t.classList.add("btn__disabled");const n=t.closest("form"),a=n.querySelector('input[name="id"]').value,c=document.querySelector(".catalogue__title").querySelector(".btn__save");c.disabled=!1,c.classList.remove("btn__disabled");const i=new FormData(n),d=Object.fromEntries(i.entries());let o=!1;if("0"!==a){const e=I+"catalogue_record/"+a,t=await s(e);for(const e in d)if(t.values[0][e]!==d[e]){o=!0;break}}if("0"===a||o){e.preventDefault();const t=I+"save_catalogue_item/"+a;await fetch(t,{method:"POST",body:i}).then((e=>e.json())).then((e=>{"0"===a&&(n.querySelector('input[name="id"]').value=e.id);const t=n.querySelector(".btn__cancel");t.disabled=!0,t.classList.add("btn__disabled")}))}}(e,g)));const b=a("");b.classList.add("tooltip","btn__disabled"),b.disabled=!0,b.innerHTML='<i class="catalogue__icon fa-solid fa-x"></i><span class="tooltip-text">отменить</span>',b.addEventListener("click",(e=>async function(e){const t=e.target.closest("form"),n=t.querySelector('input[name="id"]').value;if("0"===n){t.remove();const e=document.querySelector(".catalogue__title").querySelector(".btn__save");e.disabled=!1,e.classList.remove("btn__disabled")}else{t.innerHTML="";const e=I+"catalogue_record/"+n,a=await s(e);await S(a.values[0],t)}}(e))),h.appendChild(g),h.appendChild(b),t.appendChild(h);const L=C("text","colors","");L.hidden=!0,t.appendChild(L),e.colors&&w(e.colors,L)}async function k(e){const t=e.target,n=t.dataset.lastId,a=t.closest(".content"),c=a.querySelector(".dictionary-frame__input").value,i=a.querySelector(".check"),d=a.querySelector(".catalogue__content");await q(d,i.checked?1:0,n,E(c),0)}async function q(e,t,n,a,c){const i=I+"catalogue_data/"+t+"/"+n+"/"+a+"/"+c,d=(await s(i)).values;let o,l=0;const r=e.querySelector(`form[data-last-id="${n}"]`);r&&r.removeEventListener("mouseover",k);for(const t of d)o=document.createElement("form"),await S(t,o),e.appendChild(await o),l++,20===l&&(o.dataset.lastId=n+l,o.addEventListener("mouseover",k))}async function N(e,t,n){const a=e.querySelector(".catalogue__content");a.innerHTML="",await q(a,t.checked?0:1,0,n,0)}async function O(e,t){const n=e.closest(".dictionary-frame__header").parentElement,a=n.querySelector(".dictionary-frame__input").value,c=n.querySelector(".check");"Catalogue"===t?await N(n,c,E(a)):await L(n,t,c,E(a))}function j(e,o,l){const s=document.createElement("div");s.classList.add("dictionary-frame__header");const r=document.createElement("div");r.classList.add("dictionary-frame__header_left"),r.textContent=o,s.appendChild(r);const u=document.createElement("div");if(u.classList.add("dictionary-frame__header_right"),l){const a=function(){const e=document.createElement("button");return e.classList.add("btn","btn__neutral"),e.textContent="Загрузить",e}();a.addEventListener("click",(()=>async function(e){"Catalogue"===e&&function(){const e=document.querySelector(".service"),a=document.createElement("dialog");a.classList.add("catalogue__modal"),a.addEventListener("keypress",(e=>{"Escape"===e.key&&t(a)}));const c=n(a,"",0);a.appendChild(c);const o=document.createElement("form");o.id="catalogueDialog",o.classList.add("modal__form"),o.enctype="multipart/form-data";const l=document.createElement("div");l.classList.add("catalogue__input-frame");const s=document.createElement("input");s.classList.add("catalogue__modal_file-input"),s.type="file",s.name="csv_file",s.accept=".csv",l.appendChild(s),o.appendChild(l),o.appendChild(i(a,0)),a.appendChild(o),o.querySelector(".submit").addEventListener("click",(e=>{})),e.appendChild(a),c.firstElementChild.textContent="Загрузить csv файл",a.showModal(),d(a)}()}(e))),u.appendChild(a)}const m=function(){const e=document.createElement("input");return e.type="checkbox",e.checked=!0,e.classList.add("check"),e}();m.id=e+"-deleted",m.addEventListener("change",(()=>async function(e,t){const n=t.closest(".dictionary-frame__header").parentElement,a=E(n.querySelector(".dictionary-frame__input").value);"Catalogue"===e?await N(n,t,a):await L(n,e,t,a)}(e,m))),u.appendChild(m);const p=document.createElement("label");p.htmlFor=e+"-deleted",p.classList.add("dictionary-frame__label"),p.textContent="скрыть удаленные",u.appendChild(p),u.insertAdjacentHTML("beforeend",'<i class="fa fa-solid fa-magnifying-glass"></i>');const _=document.createElement("input");_.classList.add("dictionary-frame__input"),_.type="text",_.placeholder="поиск...",_.addEventListener("keypress",(t=>{"Enter"===t.key&&O(t.target,e)})),u.appendChild(_);const f=c("Поиск");f.addEventListener("click",(t=>O(t.target,e)));const y=a("Очистить");return y.addEventListener("click",(t=>async function(e,t){const n=e.closest(".dictionary-frame__header").parentElement;n.querySelector(".dictionary-frame__input").value="";const a=n.querySelector(".check");"Catalogue"===t?await N(n,a,"None"):await L(n,t,a,"None")}(t.target,e))),u.appendChild(f),u.appendChild(y),s.appendChild(u),s.dataset.class=e,s.dataset.title=o,s}const T=[{field:"deleted",type:"boolean",label:"уд."},{field:"name",type:"string",label:"название",null:!1},{field:"item_article",type:"string",label:"артикул",null:!1},{field:"main_color",type:"foreign",label:"осн. цвет",foreignClass:"Color",null:!1},{field:"goods_option",type:"foreign",label:"опция",foreignClass:"GoodsOption",null:!1},{field:"image",type:"img",label:"фото",url:"/static/viki_web_cms/files/item_photo/",null:!0},{field:"simple_article",type:"boolean",label:"ст. арт."},{field:"goods",type:"foreign",label:"номенклатура",foreignClass:"Goods",null:!1},{field:"image_file",type:"file",label:"файл",null:!0}],I="./json/",A={Goods:async function(e){const t="14px 4fr 1fr 1.5fr 1fr 3fr 3fr 3fr 2fr 2fr 1fr 1fr 3fr 1.5fr",n=await b(e,t,0,"None");return n.id=e,n.dataset.grid=t,n},Catalogue:async function(e){const t=document.createElement("div"),n=document.createElement("div");let a;n.classList.add("catalogue","catalogue__title"),T.forEach((e=>{a=document.createElement("p"),a.classList.add("catalogue__title-item"),a.textContent=e.label,n.appendChild(a)}));const i=c("Новый");i.addEventListener("click",(async e=>{e.target.disabled=!0,e.target.classList.add("btn__disabled");const t=document.createElement("form");await S({id:0},t);const n=t.querySelector(".btn__cancel");n.disabled=!1,n.classList.remove("btn__disabled"),d.insertAdjacentElement("afterbegin",t),t.scrollIntoView({behavior:"smooth"}),t.focus()})),n.appendChild(i),t.appendChild(n);const d=document.createElement("div");return d.classList.add("catalogue__content"),await q(d,0,0,"None",0),t.appendChild(d),t},PriceList:async function(e){return document.createElement("div")}},D=document.querySelectorAll(".menu__item"),M=document.querySelector(".content");D.forEach((e=>{e.addEventListener("click",(async t=>{e.classList.contains("menu__item_bold")||(e.classList.add("menu__item_bold"),M.innerHTML="","Standard"===t.target.dataset.page?function(e,t){e.style.flexDirection="row";const n=document.createElement("div");n.classList.add("content__left"),e.appendChild(n);const a=document.createElement("div");a.classList.add("content__right"),e.appendChild(a),JSON.parse(t).forEach((e=>{let t=document.createElement("details");t.classList.add("section-left");let a=document.createElement("summary");a.textContent=e.section_name,t.appendChild(a),e.cms_settings.forEach((e=>{let n=document.createElement("li");n.textContent=e.setting,n.dataset.class=e.setting_class,n.dataset.upload=e.upload,n.classList.add("section-left__content"),t.appendChild(n)}));const c=t.querySelectorAll("li");c.forEach((e=>{e.addEventListener("click",(()=>async function(e,t,n,a,c){if(e.classList.toggle("text-active"),document.getElementById(t))document.getElementById(t).classList.toggle("invisible");else{const a=document.querySelector(".content__right"),c=await async function(e,t,n){const a=document.createElement("section");a.classList.add("dictionary-frame"),a.id=e;const c=j(e,t,n);return a.appendChild(c),a}(t,e.textContent,n),i=y(await p(t)),d=await b(t,i,0,"None");c.appendChild(d),a.appendChild(c)}!function(e,t){const n=e.querySelector("summary");Array.from(t).some((e=>e.classList.contains("text-active")))?n.classList.add("text-active"):n.classList.remove("text-active")}(a,c)}(e,e.dataset.class,JSON.parse(e.dataset.upload),t,c)))})),n.appendChild(t)}))}(M,e.dataset.content):await async function(e,t,n){e.style.flexDirection="column";const a=JSON.parse(t)[0],c=a.cms_settings[0].setting,i=a.cms_settings[0].setting_class,d=j(i,c,a.cms_settings[0].upload);e.appendChild(d);const o=await A[n](i);e.appendChild(o)}(M,e.dataset.content,t.target.dataset.page)),D.forEach((t=>{t!==e&&t.classList.remove("menu__item_bold")}))}))}))})();