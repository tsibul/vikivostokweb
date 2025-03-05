(()=>{"use strict";var e={d:(t,n)=>{for(var a in n)e.o(n,a)&&!e.o(t,a)&&Object.defineProperty(t,a,{enumerable:!0,get:n[a]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t)};function t(e){const t=document.createElement("button");return t.classList.add("btn","btn__neutral"),t.textContent=e,t}function n(e){e.close(),e.remove()}function a(e,t,a){const c=document.createElement("div");c.classList.add("modal__header");let d=t;d="0"===a?"Создать "+d:"Изменить "+d;const o=document.createElement("div");o.textContent=d,c.appendChild(o);const i=document.createElement("button");return i.classList.add("modal__header_btn"),i.textContent="×",i.addEventListener("click",(t=>{t.preventDefault(),n(e)})),c.appendChild(i),c}function c(e){const t=document.createElement("button");return t.classList.add("btn","btn__cancel"),t.textContent=e,t}function d(e){const t=document.createElement("button");return t.classList.add("btn","btn__save"),t.textContent=e,t}function o(e,t){const a=document.createElement("div");a.classList.add("modal__button-block");const o=c("Отменить");o.type="button",o.addEventListener("click",(t=>{t.preventDefault(),n(e)}));const i=d("Записать");return i.type="button",i.classList.add("submit"),i.dataset.id=t,a.appendChild(o),a.appendChild(i),a}function i(e){let t,n,a=!1;e.querySelector(".modal__header").addEventListener("mousedown",(c=>{a=!0,t=c.clientX-e.offsetLeft,n=c.clientY-e.offsetTop,e.style.cursor="grabbing"})),document.addEventListener("mousemove",(c=>{a&&(e.style.left=c.clientX-t+"px",e.style.top=c.clientY-n+"px")})),document.addEventListener("mouseup",(()=>{a=!1,e.style.cursor="grab"}))}function l(e){const t=document.createElement("input");return t.type=e,t.classList.add("modal__content_"+e),t}function s(e){return fetch(e).then((e=>e.json()))}async function r(e,t,n){const a=document.createElement("div");a.classList.add("dropdown");const c=l("text"),d=document.createElement("input");d.hidden=!0,d.type="text",c.classList.add("dropdown__input"),a.appendChild(c),a.appendChild(d),a.insertAdjacentHTML("beforeend",'<i class="fa-solid fa-chevron-down dropdown__input_icon"></i>');const o=document.createElement("ul");o.classList.add("dropdown__list","invisible");const i=z+"dropdown_list/"+e,r=await s(i);if(t){let e=r.find((e=>e.id===t));c.value=e.value,d.value=e.id}else r[0]&&!n&&(c.value=r[0].value,d.value=r[0].id);return u(r,o,c,d,n),c.addEventListener("click",(()=>{o.classList.toggle("invisible")})),a.appendChild(o),c.addEventListener("keyup",(e=>{let t=e.target.value.toUpperCase();const n=r.filter((e=>e.value.toUpperCase().indexOf(t)>-1));o.innerHTML="",u(n,o,c,d)})),a}function u(e,t,n,a,c){c&&m({id:"",value:""},t,n,a),e.forEach((e=>{m(e,t,n,a)}))}function m(e,t,n,a){const c=document.createElement("li");c.classList.add("dropdown__list_item"),c.value=e.id,c.textContent=e.value,c.addEventListener("click",(e=>{n.value=e.target.textContent,a.value=e.target.value,a.dispatchEvent(new Event("change",{bubbles:!0})),t.classList.add("invisible")})),t.appendChild(c)}async function p(e){const t=e.fieldName.foreignClass,n=e.fieldValue,a=await r(t,n,e.fieldName.null);return a.querySelector("[hidden]").name=e.fieldName.field+"_id",a}function _(e){let t=e;return function(e){return/^[a-zA-Zа-яА-ЯёЁ0-9 ._#]*$/.test(e)}(e)&&e||(t="None"),t.replace(/ /g,"|")}function f(e,t,n){const a=document.createElement("input");return a.type=e,a.name=t,"id"===t.slice(-2)&&(a.hidden=!0),"checkbox"===e?(a.checked=n,a.classList.add("check","catalogue__check")):(a.value=n,a.readOnly=!0,a.classList.add("catalogue__input")),a}function h(e,t){t.value=JSON.stringify(e)}function y(e){const t=e.target.closest("form").querySelector('input[type="file"]');t.value="",t.dispatchEvent(new Event("change",{bubbles:!0}))}async function v(e,t){t.enctype="multipart/form-data",t.classList.add("catalogue","catalogue__row"),t.appendChild(f("number","id",e.id));const n=f("checkbox","deleted",e.deleted);n.addEventListener("change",(e=>function(e){const t=e.target.closest("form");if(t.querySelector("textarea").value){const e=t.querySelector(".btn__save");e.disabled=!1,e.classList.remove("btn__disabled");const n=t.querySelector(".btn__cancel");n.disabled=!1,n.classList.remove("btn__disabled")}}(e))),t.appendChild(n);const a=document.createElement("textarea");a.value=e.name,a.name="name",a.classList.add("catalogue__input"),a.readOnly=!0,t.appendChild(a),t.appendChild(f("text","item_article",e.item_article));const o=document.createElement("div");o.classList.add("catalogue__input","main_color_text"),o.textContent=e.main_color_text,t.appendChild(o),t.appendChild(f("text","main_color__id",e.main_color__id)),t.appendChild(f("number","goods_option__id",e.goods_option__id));const i=document.createElement("div");i.classList.add("catalogue__input","goods_option__name"),i.textContent=e.goods_option__name,t.appendChild(i);const l=document.createElement("img");l.classList.add("catalogue__img"),l.alt=e.item_article,l.loading="lazy",l.src="/static/viki_web_cms/files/item_photo/"+e.image,t.appendChild(l);const u=f("checkbox","simple_article",e.simple_article);0===e.id&&(u.checked=!0),u.addEventListener("change",(e=>y(e))),t.appendChild(u);const m=await r("Goods",e.goods__id,!1);t.appendChild(m);const p=m.querySelector("input[hidden]");p.name="goods__id",p.addEventListener("change",(e=>y(e)));const _=document.createElement("div");_.classList.add("catalogue__file");const g=document.createElement("div");g.textContent=e.image,g.classList.add("catalogue__file_text"),_.appendChild(g);const E=document.createElement("div");E.classList.add("catalogue__input-frame");const b=document.createElement("input");b.classList.add("catalogue__file_input"),b.type="file",b.name="image",b.accept="image/png, image/jpeg, image/jpg",b.addEventListener("change",(async e=>await async function(e,t,n,a,c){const d=e.target.closest("form"),o=d.querySelector('input[name="id"]'),i=d.querySelector('input[name="colors"]'),l=d.querySelector('input[name="goods_option__id"]'),r=d.querySelector('textarea[name="name"]'),u=d.querySelector('input[name="item_article"]'),m=d.querySelector('input[name="main_color__id"]'),p=d.querySelector(".main_color_text"),_=d.querySelector(".goods_option__name"),f=d.querySelector(".btn__save");function y(){t.textContent="",c.src="",r.value="",u.value="",m.value="",p.textContent="",l.value="",_.textContent="",i.value="",f.disabled=!0,f.classList.contains("btn__disabled")||f.classList.add("btn__disabled")}if(i.value="",l.value="",/(\.jpg|\.jpeg|\.png)$/i.exec(e.target.value)){const d=e.target.files[0],v=new FileReader;v.onload=function(e){c.src=e.target.result},v.readAsDataURL(d),t.textContent=e.target.value.split("\\").pop();const g=t.textContent.split(".")[0],E=z+"parse_file_data/"+n+"/"+a+"/"+g+"/"+o.value,b=await s(E);b.error?y():(r.value=b.values.name,u.value=b.values.item_article,m.value=b.values.main_color__id,p.textContent=b.values.main_color_text,l.value=b.values.goods_option__id,_.textContent=b.values.goods_option__name,h(b.values.colors,i),f.disabled=!1,f.classList.remove("btn__disabled"))}else e.target.value="",y()}(e,g,p.value,u.checked?1:0,l))),E.appendChild(b),_.appendChild(E),t.appendChild(_);const C=document.createElement("div");C.classList.add("catalogue__btn-block");const L=d("");L.disabled=!0,L.classList.add("tooltip","btn__disabled"),L.innerHTML='<i class="catalogue__icon fa-solid fa-check"></i><span class="tooltip-text">сохранить</span>',L.addEventListener("click",(e=>async function(e,t){t.disabled=!0,t.classList.add("btn__disabled");const n=t.closest("form"),a=n.querySelector('input[name="id"]').value,c=document.querySelector(".catalogue__title").querySelector(".btn__save");c.disabled=!1,c.classList.remove("btn__disabled");const d=new FormData(n),o=Object.fromEntries(d.entries());let i=!1;if("0"!==a){const e=z+"catalogue_record/"+a,t=await s(e);for(const e in o)if(t.values[0][e]!==o[e]){i=!0;break}}if("0"===a||i){e.preventDefault();const t=z+"save_catalogue_item/"+a;await fetch(t,{method:"POST",body:d}).then((e=>e.json())).then((e=>{"0"===a&&(n.querySelector('input[name="id"]').value=e.id);const t=n.querySelector(".btn__cancel");t.disabled=!0,t.classList.add("btn__disabled")}))}}(e,L)));const w=c("");w.classList.add("tooltip","btn__disabled"),w.disabled=!0,w.innerHTML='<i class="catalogue__icon fa-solid fa-x"></i><span class="tooltip-text">отменить</span>',w.addEventListener("click",(e=>async function(e){const t=e.target.closest("form"),n=t.querySelector('input[name="id"]').value;if("0"===n){t.remove();const e=document.querySelector(".catalogue__title").querySelector(".btn__save");e.disabled=!1,e.classList.remove("btn__disabled")}else{t.innerHTML="";const e=z+"catalogue_record/"+n,a=await s(e);await v(a.values[0],t)}}(e))),C.appendChild(L),C.appendChild(w),t.appendChild(C);const S=f("text","colors","");S.hidden=!0,t.appendChild(S),e.colors&&h(e.colors,S)}async function g(e){const t=e.target,n=t.dataset.lastId,a=t.closest(".content"),c=a.querySelector(".dictionary-frame__input").value,d=a.querySelector(".check"),o=a.querySelector(".catalogue__content");await E(o,d.checked?1:0,n,_(c),0)}async function E(e,t,n,a,c){const d=z+"catalogue_data/"+t+"/"+n+"/"+a+"/"+c,o=(await s(d)).values;let i,l=0;const r=e.querySelector(`form[data-last-id="${n}"]`);r&&r.removeEventListener("mouseover",g);for(const t of o)i=document.createElement("form"),await v(t,i),e.appendChild(await i),l++,20===l&&(i.dataset.lastId=Number.parseInt(n)+l,i.addEventListener("mouseover",g))}async function b(e,t,n){const a=e.querySelector(".catalogue__content");a.innerHTML="",await E(a,t.checked?0:1,0,n,0)}function C(){const e=document.createElement("details");return e.classList.add("alert__details"),e}function L(e,t){const n=document.createElement("summary");return n.classList.add("alert__summary"),n.textContent=e+" "+t,n}function w(e){const t=document.createElement("div");t.classList.add("alert__element");const n=document.createElement("div");n.textContent="артикул";const a=document.createElement("div");a.textContent=e.item;const c=document.createElement("div");c.textContent="результат";const d=document.createElement("div");return d.textContent=e.message,t.appendChild(n),t.appendChild(a),t.appendChild(c),t.appendChild(d),t}async function S(e){e.preventDefault();const t=e.target.closest("form"),n=new FormData(t),a=Object.fromEntries(n.entries()).csv_file.name,c=t.querySelector(".error-message");a.endsWith(".csv")?await k(e,t,n,"catalogue_csv_load",c):(t.querySelector("input").value="",c.style.display="block",c.textContent="Неправильный формат файла")}async function x(e){e.preventDefault();const t=e.target.closest("form"),n=new FormData(t),a=t.querySelector(".error-message");await k(e,t,n,"catalogue_files_load",a)}async function k(e,t,a,c,o){const l=document.querySelector(".content"),s=_(l.querySelector(".dictionary-frame__input").value),r=l.querySelector(".check"),u=e.target.closest("dialog"),m=z+c;await fetch(m,{method:"POST",body:a}).then((e=>e.json())).then((e=>{if(e.error)t.querySelector("input").value="",o.style.display="block",o.textContent=e.error;else{n(u),b(l,r.checked?1:0,s);const t=function(e){const t=document.createElement("dialog");t.classList.add("alert");const n=document.createElement("header");n.classList.add("modal__header");const a=document.createElement("h4");a.textContent="Результат загрузки",n.appendChild(a);const c=document.createElement("div");c.innerHTML="&times;",c.addEventListener("click",(()=>{t.remove()})),n.appendChild(c),t.appendChild(n);const o=C(),i=L("Ошибки",e.recordErrorLength);o.appendChild(i),e.recordError.forEach((e=>{o.appendChild(w(e))})),t.appendChild(o);const l=C(),s=L("Дубли",e.recordDoubleLength);l.appendChild(s),e.recordDouble.forEach((e=>{l.appendChild(w(e))})),t.appendChild(l);const r=C(),u=L("Успешно",e.recordSuccessLength);r.appendChild(u),e.recordSuccess.forEach((e=>{r.appendChild(w(e))})),t.appendChild(r);const m=d("Ok");return m.classList.add("alert__btn"),m.addEventListener("click",(()=>{t.remove()})),t.appendChild(m),t}(e);document.querySelector(".service").appendChild(t),t.showModal(),i(t)}}))}async function q(){const e=D("Загрузить несколько фото"),t=await p({fieldName:{field:"goods",foreignClass:"Goods",null:!1}});t.style.marginTop="8px",e.form.querySelector(".modal__button-block").insertAdjacentElement("beforebegin",t),e.fileInput.name="files",e.fileInput.accept="image/png, image/jpeg, image/jpg",e.fileInput.multiple=!0,e.buttonSubmit.addEventListener("click",x)}function D(e){const t=document.querySelector(".service"),c=document.createElement("dialog");c.classList.add("catalogue__modal"),c.addEventListener("keypress",(e=>{"Escape"===e.key&&n(c)}));const d=a(c,"",0);d.firstElementChild.textContent=e,c.appendChild(d);const l=document.createElement("form");l.id="catalogueDialog",l.classList.add("modal__form"),l.enctype="multipart/form-data";const s=document.createElement("div");s.classList.add("catalogue__input-frame");const r=document.createElement("input");r.classList.add("catalogue__modal_file-input"),r.type="file",s.appendChild(r),l.appendChild(s);const u=document.createElement("div");u.classList.add("error-message"),u.textContent="Error",l.appendChild(u),l.appendChild(o(c,0)),c.appendChild(l);const m=l.querySelector(".submit");return t.appendChild(c),r.addEventListener("change",(()=>{u.textContent="",u.style.display="none"})),c.showModal(),i(c),{form:l,fileInput:r,buttonSubmit:m}}function j(){const e=document.createElement("div");return e.classList.add("dictionary-content__square"),e}async function N(e){const t=z+"field_names/"+e;return await s(t)}function I(e){const t=document.createElement("label");return t.classList.add("modal__content_label"),t.htmlFor=e.field+"Input",t.textContent=e.label,t}e.d({},{G:()=>X,e:()=>z});const O={string:function(e){const t=l("text");return t.value=e.fieldValue,t.name=e.fieldName.field,t},boolean:function(e){const t=l("checkbox");return t.checked=e.fieldValue,t.id=e.fieldName.field+"Input",t.name=e.fieldName.field,t},number:function(e){const t=l("number");return t.value=e.fieldValue,t.name=e.fieldName.field,t},foreign:p,image:function(e){const t=document.createElement("img");return t.classList.add("modal__content_image"),t.src=e.url+e.fieldValue,t.alt=e.fieldName.field,t},file:function(e){const t=document.createElement("div");t.classList.add("modal__content_file-frame");const n=l("file");return n.placeholder=e.fieldValue,n.name=e.fieldName.field,t.appendChild(n),t}};function T(e){let t="14px 6fr ";return e.forEach((e=>{"name"!==e.field&&("boolean"===e.type||"number"===e.type?t+="1fr ":t+="3fr ")})),t+="80px",t}async function M(e,t,n,a,c){const d=document.createElement("div");d.classList.add("dictionary-content__rows");const o=z+"field_values/"+e+"/"+t+"/"+n+"/"+a,i=await s(o);let l=0;return i.values.forEach((o=>{let s=document.createElement("div");A(s,o,i.field_params,e),s.style.gridTemplateColumns=c,d.appendChild(s),l++,20===l&&(s.dataset.lastRecord=n+20,s.addEventListener("mouseover",(c=>async function(e,t,n,a,c){const d=T(await N(t)),o=e.closest(".dictionary-content__rows");[...(await M(t,n,c,a,d)).children].forEach((e=>{o.appendChild(e)}));const i=e.cloneNode(!0);e.parentNode.replaceChild(i,e)}(c.target,e,t,a,n+20))))})),d}function A(e,t,n,a){e.classList.add("dictionary-content__row");const d=j();t.hex&&(d.style.backgroundColor=t.hex),e.appendChild(d),e.id=a+"_row_"+t.id,Object.keys(t).forEach(((a,c)=>{if("id"!==a){let c;Object.keys(n).includes(a)&&"image"===n[a].type?(c=document.createElement("img"),c.classList.add("dictionary-content__row_img"),c.src=n[a].url+t[a],c.alt=t[a]):Object.keys(n).includes(a)&&"boolean"===n[a].type?(c=document.createElement("input"),c.type="checkbox",c.checked=t[a],c.disabled=!0,c.classList.add("dictionary-content__check")):(c=document.createElement("div"),c.classList.add("dictionary-content__row_item"),c.textContent=t[a]),e.appendChild(c)}}));const o=c("Изм.");o.dataset.itemId=t.id,o.addEventListener("click",(e=>F(e))),e.appendChild(o)}async function F(e){e.preventDefault();const t=e.target.closest(".dictionary-content").parentElement.querySelector(".dictionary-frame__header"),c=t.dataset.class,d=t.dataset.title,l=await async function(e,t,c){const d=document.createElement("dialog");d.classList.add("modal"),d.addEventListener("keypress",(e=>{"Escape"===e.key&&n(d)}));const i=a(d,t,c);d.appendChild(i);const l=document.createElement("form");l.id=e+"__form",l.classList.add("modal__form"),l.enctype="multipart/form-data";const r=await async function(e,t,n){const a=document.createElement("div");a.classList.add("modal__content");const c=await N(t);let d;const o=z+"record_info/"+t+"/"+n,i=await s(o);for(const e of c){let t={fieldName:e,fieldValue:null,url:i.url};"0"!==n&&("foreign"!==e.type?t.fieldValue=i.record[e.field]:t.fieldValue=i.record[e.field+"_id"]),a.appendChild(I(e)),d=await O[e.type](t),a.appendChild(d)}return a}(0,e,c);l.appendChild(r),l.appendChild(o(d,c)),d.appendChild(l);const u=new FormData(l);return l.querySelector(".submit").addEventListener("click",(t=>async function(e,t,a,c){e.preventDefault();const d=e.target.dataset.id,o=t.closest(".modal");o.querySelectorAll("input").forEach((e=>{e.classList.remove("border-alert")})),e.target.disabled=!0;const i=new FormData(t);if(!function(e,t){const n=Array.from(t.values()),a=Array.from(e.values());return n.sort(),a.sort(),JSON.stringify(n)===JSON.stringify(a)}(i,c)){const t=z+"edit_dictionary/"+a+"/"+d;await fetch(t,{method:"POST",body:i}).then((e=>e.json())).then((t=>{const c=t.errors;if(c){let t;c.forEach((n=>{e.target.disabled=!1,t=o.querySelector(`[name = "${n}"]`),t.hidden?t.previousElementSibling.classList.add("border-alert"):t.classList.add("border-alert"),e.target.focus()}))}else{let e;if("0"!==d)e=document.querySelector("#"+a+"_row_"+d),e.innerHTML="";else{let n;e=document.createElement("div"),e.id=a+"_row_"+t.values.id,e.classList.add("dictionary-content__row"),n=document.getElementById(a)?document.getElementById(a).querySelector(".dictionary-content__rows"):document.querySelector(".dictionary-content__rows"),n.insertAdjacentElement("afterbegin",e),e.style.gridTemplateColumns=n.closest(".dictionary-content").dataset.grid}A(e,t.values,t.params,a),e.scrollIntoView({behavior:"smooth"}),e.focus(),n(o)}}))}}(t,l,e,u))),d}(c,d,e.target.dataset.itemId);document.querySelector(".service").appendChild(l),l.showModal(),i(l),console.log()}async function H(e,t,n,a){const c=await N(e),d=document.createElement("div");d.classList.add("dictionary-content");const o=await async function(e){const t=document.createElement("div");t.classList.add("dictionary-content__title","dictionary-content__row"),t.appendChild(j()),e.forEach((e=>{let n=document.createElement("div");n.classList.add("dictionary-content__title_item"),n.textContent=e.label,t.appendChild(n)}));const n=document.createElement("button");return n.classList.add("btn","btn__save"),n.textContent="Создать",n.dataset.itemId="0",n.addEventListener("click",(e=>F(e))),t.appendChild(n),t}(c);o.style.gridTemplateColumns=t,d.appendChild(o);const i=await M(e,n,0,a,t);return d.appendChild(i),d.dataset.grid=t,d}async function V(e,t,n,a){let c=e.querySelector(".dictionary-content");const d=c.dataset.grid;c.remove(),c=await H(t,d,n.checked?0:1,a),e.appendChild(c)}async function P(e,t){const n=e.closest(".dictionary-frame__header").parentElement,a=n.querySelector(".dictionary-frame__input").value,c=n.querySelector(".check");"Catalogue"===t?await b(n,c,_(a)):await V(n,t,c,_(a))}function B(e,n,a){const o=document.createElement("div");o.classList.add("dictionary-frame__header");const i=document.createElement("div");i.classList.add("dictionary-frame__header_left"),i.textContent=n,o.appendChild(i);const l=document.createElement("div");if(l.classList.add("dictionary-frame__header_right"),a){const n=t("Загрузить CSV");n.addEventListener("click",(()=>async function(e){"Catalogue"===e&&function(){const e=D("Загрузить csv файл");e.fileInput.name="csv_file",e.fileInput.accept=".csv",e.buttonSubmit.addEventListener("click",S)}()}(e))),l.appendChild(n)}const s=function(){const e=document.createElement("input");return e.type="checkbox",e.checked=!0,e.classList.add("check"),e}();s.id=e+"-deleted",s.addEventListener("change",(()=>async function(e,t){const n=t.closest(".dictionary-frame__header").parentElement,a=_(n.querySelector(".dictionary-frame__input").value);"Catalogue"===e?await b(n,t,a):await V(n,e,t,a)}(e,s))),l.appendChild(s);const r=document.createElement("label");r.htmlFor=e+"-deleted",r.classList.add("dictionary-frame__label"),r.textContent="скрыть удаленные",l.appendChild(r),l.insertAdjacentHTML("beforeend",'<i class="fa fa-solid fa-magnifying-glass"></i>');const u=document.createElement("input");u.classList.add("dictionary-frame__input"),u.type="text",u.placeholder="поиск...",u.addEventListener("keypress",(t=>{"Enter"===t.key&&P(t.target,e)})),l.appendChild(u);const m=d("Поиск");m.addEventListener("click",(t=>P(t.target,e)));const p=c("Очистить");return p.addEventListener("click",(t=>async function(e,t){const n=e.closest(".dictionary-frame__header").parentElement;n.querySelector(".dictionary-frame__input").value="";const a=n.querySelector(".check");"Catalogue"===t?await b(n,a,"None"):await V(n,t,a,"None")}(t.target,e))),l.appendChild(m),l.appendChild(p),o.appendChild(l),o.dataset.class=e,o.dataset.title=n,o}const G=[{field:"deleted",type:"boolean",label:"уд."},{field:"name",type:"string",label:"название",null:!1},{field:"item_article",type:"string",label:"артикул",null:!1},{field:"main_color",type:"foreign",label:"осн. цвет",foreignClass:"Color",null:!1},{field:"goods_option",type:"foreign",label:"опция",foreignClass:"GoodsOption",null:!1},{field:"image",type:"img",label:"фото",url:"/static/viki_web_cms/files/item_photo/",null:!0},{field:"simple_article",type:"boolean",label:"ст. арт."},{field:"goods",type:"foreign",label:"номенклатура",foreignClass:"Goods",null:!1},{field:"image_file",type:"file",label:"файл",null:!0}];async function J(e){}function $(e,t,n,a){t.innerHTML="",e.forEach((c=>{m(c,t,n,a),n.value=e[0].value,a.value=e[0].id}))}async function R(e){e.preventDefault();const t=e.target.closest("form"),a=document.getElementById("promoCheck"),c=document.getElementById("promoDate");c.addEventListener("click",(()=>{c.classList.remove("price__modal_border-alert")})),a.addEventListener("click",(()=>{c.classList.remove("price__modal_border-alert")}));const d=document.getElementById("priceDate");if(d.addEventListener("click",(()=>{d.classList.remove("price__modal_border-alert")})),d.value)if(a.checked&&!c.value)c.classList.add("price__modal_border-alert");else{const a=new FormData(t),c=z+"save_new_price_date";await fetch(c,{method:"POST",body:a}).then((e=>e.json())).then((async t=>{const a=document.querySelector(".dictionary-frame__header_left"),c=a.querySelector(".dropdown__list"),d=a.querySelector(".price-dropdown__input"),o=a.querySelector('input[name="priceDateId"]'),i=e.target.closest("dialog");await $(t,c,d,o),n(i)}))}else d.classList.add("price__modal_border-alert")}async function U(e){const t=document.querySelector(".service"),c=document.createElement("dialog");c.classList.add("catalogue__modal"),c.addEventListener("keypress",(e=>{"Escape"===e.key&&n(c)}));const o=a(c,"",0);o.firstElementChild.textContent="Новый прайс лист",c.appendChild(o);const l=document.createElement("form");l.id="priceDialog",l.classList.add("modal__form");const s=document.createElement("div");s.classList.add("price__modal_row");const r=document.createElement("label");r.classList.add("price__modal_label"),r.textContent="дата прайс-листа",r.htmlFor="priceDate";const u=document.createElement("input");u.classList.add("price__modal_date"),u.type="date",u.id="priceDate",u.name="priceDate",s.appendChild(r),s.appendChild(u),l.appendChild(s);const m=document.createElement("div");m.classList.add("price__modal_row");const p=document.createElement("label");p.classList.add("price__modal_label"),p.textContent="акция",p.htmlFor="promoCheck";const _=document.createElement("input");_.classList.add("price__modal_check"),_.type="checkbox",_.id="promoCheck",_.name="promoCheck";const f=document.createElement("label");f.classList.add("price__modal_label"),f.textContent="окончание",f.htmlFor="promoDate";const h=document.createElement("input");h.classList.add("price__modal_date"),h.type="date",h.id="promoDate",h.name="promoDate",m.appendChild(p),m.appendChild(_),m.appendChild(f),m.appendChild(h),l.appendChild(m);const y=d("Записать");y.addEventListener("click",R),y.classList.add("price__modal_btn"),l.appendChild(y),c.appendChild(l),t.appendChild(c),c.showModal(),i(c)}const z="./json/",X={Goods:async function(e){const t="14px 4fr 1fr 1.5fr 1fr 3fr 3fr 3fr 2fr 2fr 1fr 1fr 3fr 1.5fr",n=await H(e,t,0,"None");return n.id=e,n.dataset.grid=t,n},Catalogue:async function(e){const n=document.querySelector(".dictionary-frame__header_right"),a=t("Загрузить несколько фото");a.addEventListener("click",await q),n.insertAdjacentElement("afterbegin",a);const c=document.createElement("div"),o=document.createElement("div");let i;o.classList.add("catalogue","catalogue__title"),G.forEach((e=>{i=document.createElement("p"),i.classList.add("catalogue__title-item"),i.textContent=e.label,o.appendChild(i)}));const l=d("Новый");l.addEventListener("click",(async e=>{e.target.disabled=!0,e.target.classList.add("btn__disabled");const t=document.createElement("form");await v({id:0},t);const n=t.querySelector(".btn__cancel");n.disabled=!1,n.classList.remove("btn__disabled"),s.insertAdjacentElement("afterbegin",t),t.scrollIntoView({behavior:"smooth"}),t.focus()})),o.appendChild(l),c.appendChild(o);const s=document.createElement("div");return s.classList.add("catalogue__content"),await E(s,0,0,"None",0),c.appendChild(s),c},PriceList:async function(e){const n=document.querySelector(".dictionary-frame__header_left"),a=await async function(){const e=document.createElement("div");e.classList.add("price-dropdown");const t=document.createElement("div");t.classList.add("price-dropdown__frame");const n=document.createElement("input");n.classList.add("price-dropdown__input"),n.readOnly=!0,t.appendChild(n),n.insertAdjacentHTML("afterend",'<i class="fa-solid fa-chevron-down"></i>');const a=document.createElement("input");a.hidden=!0,a.type="text",a.name="priceDateId",e.appendChild(t),e.appendChild(a);const c=document.createElement("ul");c.classList.add("dropdown__list","invisible"),e.appendChild(c);const d=z+"dropdown_list/Price",o=await s(d);return o[0]&&(n.value=o[0].value,a.value=o[0].id),$(o,c,n,a),e.addEventListener("click",(e=>{c.classList.remove("invisible")})),document.addEventListener("click",(e=>{t.contains(e.target)||c.classList.contains("invisible")||c.classList.add("invisible")})),e}();n.appendChild(a);const c=a.querySelector("input"),d=t("Новый прайс");return n.appendChild(d),c.addEventListener("change",J),d.addEventListener("click",U),document.createElement("div")}},Y=document.querySelectorAll(".menu__item"),W=document.querySelector(".content");Y.forEach((e=>{e.addEventListener("click",(async t=>{e.classList.contains("menu__item_bold")||(e.classList.add("menu__item_bold"),W.innerHTML="","Standard"===t.target.dataset.page?function(e,t){e.style.flexDirection="row";const n=document.createElement("div");n.classList.add("content__left"),e.appendChild(n);const a=document.createElement("div");a.classList.add("content__right"),e.appendChild(a),JSON.parse(t).forEach((e=>{let t=document.createElement("details");t.classList.add("section-left");let a=document.createElement("summary");a.textContent=e.section_name,t.appendChild(a),e.cms_settings.forEach((e=>{let n=document.createElement("li");n.textContent=e.setting,n.dataset.class=e.setting_class,n.dataset.upload=e.upload,n.classList.add("section-left__content"),t.appendChild(n)}));const c=t.querySelectorAll("li");c.forEach((e=>{e.addEventListener("click",(()=>async function(e,t,n,a,c){if(e.classList.toggle("text-active"),document.getElementById(t))document.getElementById(t).classList.toggle("invisible");else{const a=document.querySelector(".content__right"),c=await async function(e,t,n){const a=document.createElement("section");a.classList.add("dictionary-frame"),a.id=e;const c=B(e,t,n);return a.appendChild(c),a}(t,e.textContent,n),d=T(await N(t)),o=await H(t,d,0,"None");c.appendChild(o),a.appendChild(c)}!function(e,t){const n=e.querySelector("summary");Array.from(t).some((e=>e.classList.contains("text-active")))?n.classList.add("text-active"):n.classList.remove("text-active")}(a,c)}(e,e.dataset.class,JSON.parse(e.dataset.upload),t,c)))})),n.appendChild(t)}))}(W,e.dataset.content):await async function(e,t,n){e.style.flexDirection="column";const a=JSON.parse(t)[0],c=a.cms_settings[0].setting,d=a.cms_settings[0].setting_class,o=B(d,c,a.cms_settings[0].upload);e.appendChild(o);const i=await X[n](d);e.appendChild(i)}(W,e.dataset.content,t.target.dataset.page)),Y.forEach((t=>{t!==e&&t.classList.remove("menu__item_bold")}))}))}))})();