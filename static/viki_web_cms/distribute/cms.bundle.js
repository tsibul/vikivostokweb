(()=>{"use strict";var e={d:(t,n)=>{for(var a in n)e.o(n,a)&&!e.o(t,a)&&Object.defineProperty(t,a,{enumerable:!0,get:n[a]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t)};function t(e){const t=document.createElement("button");return t.classList.add("btn","btn__neutral"),t.textContent=e,t}function n(e){e.close(),e.remove()}function a(e,t,a){const c=document.createElement("div");c.classList.add("modal__header");let d=t;d="0"===a?"Создать "+d:"Изменить "+d;const o=document.createElement("div");o.textContent=d,c.appendChild(o);const i=document.createElement("button");return i.classList.add("modal__header_btn"),i.textContent="×",i.addEventListener("click",(t=>{t.preventDefault(),n(e)})),c.appendChild(i),c}function c(e){const t=document.createElement("button");return t.classList.add("btn","btn__cancel"),t.textContent=e,t}function d(e){const t=document.createElement("button");return t.classList.add("btn","btn__save"),t.textContent=e,t}function o(e,t){const a=document.createElement("div");a.classList.add("modal__button-block");const o=c("Отменить");o.type="button",o.addEventListener("click",(t=>{t.preventDefault(),n(e)}));const i=d("Записать");return i.type="button",i.classList.add("submit"),i.dataset.id=t,a.appendChild(o),a.appendChild(i),a}function i(e){let t,n,a=!1;e.querySelector(".modal__header").addEventListener("mousedown",(c=>{a=!0,t=c.clientX-e.offsetLeft,n=c.clientY-e.offsetTop,e.style.cursor="grabbing"})),document.addEventListener("mousemove",(c=>{a&&(e.style.left=c.clientX-t+"px",e.style.top=c.clientY-n+"px")})),document.addEventListener("mouseup",(()=>{a=!1,e.style.cursor="grab"}))}function l(e){return fetch(e).then((e=>e.json()))}function s(e){const t=document.createElement("input");return t.type=e,t.classList.add("modal__content_"+e),t}async function r(e,t,n){const a=document.createElement("div");a.classList.add("dropdown");const c=s("text"),d=document.createElement("input");d.hidden=!0,d.type="text",c.classList.add("dropdown__input"),a.appendChild(c),a.appendChild(d),a.insertAdjacentHTML("beforeend",'<i class="fa-solid fa-chevron-down dropdown__input_icon"></i>');const o=document.createElement("ul");o.classList.add("dropdown__list","invisible");const i=H+"dropdown_list/"+e,r=await l(i);if(t){let e=r.find((e=>e.id===t));c.value=e.value,d.value=e.id}else r[0]&&!n&&(c.value=r[0].value,d.value=r[0].id);return u(r,o,c,d,n),c.addEventListener("click",(()=>{o.classList.toggle("invisible")})),a.appendChild(o),c.addEventListener("keyup",(e=>{let t=e.target.value.toUpperCase();const n=r.filter((e=>e.value.toUpperCase().indexOf(t)>-1));o.innerHTML="",u(n,o,c,d)})),a}function u(e,t,n,a,c){c&&m({id:"",value:""},t,n,a),e.forEach((e=>{m(e,t,n,a)}))}function m(e,t,n,a){const c=document.createElement("li");c.classList.add("dropdown__list_item"),c.value=e.id,c.textContent=e.value,c.addEventListener("click",(e=>{n.value=e.target.textContent,a.value=e.target.value,a.dispatchEvent(new Event("change",{bubbles:!0})),t.classList.add("invisible")})),t.appendChild(c)}function p(e,t,n){const a=document.createElement("input");return a.type=e,a.name=t,"id"===t.slice(-2)&&(a.hidden=!0),"checkbox"===e?(a.checked=n,a.classList.add("check","catalogue__check")):(a.value=n,a.readOnly=!0,a.classList.add("catalogue__input")),a}function _(e,t){t.value=JSON.stringify(e)}function f(e){const t=e.target.closest("form").querySelector('input[type="file"]');t.value="",t.dispatchEvent(new Event("change",{bubbles:!0}))}async function h(e,t){t.enctype="multipart/form-data",t.classList.add("catalogue","catalogue__row"),t.appendChild(p("number","id",e.id));const n=p("checkbox","deleted",e.deleted);n.addEventListener("change",(e=>function(e){const t=e.target.closest("form");if(t.querySelector("textarea").value){const e=t.querySelector(".btn__save");e.disabled=!1,e.classList.remove("btn__disabled");const n=t.querySelector(".btn__cancel");n.disabled=!1,n.classList.remove("btn__disabled")}}(e))),t.appendChild(n);const a=document.createElement("textarea");a.value=e.name,a.name="name",a.classList.add("catalogue__input"),a.readOnly=!0,t.appendChild(a),t.appendChild(p("text","item_article",e.item_article));const o=document.createElement("div");o.classList.add("catalogue__input","main_color_text"),o.textContent=e.main_color_text,t.appendChild(o),t.appendChild(p("text","main_color__id",e.main_color__id)),t.appendChild(p("number","goods_option__id",e.goods_option__id));const i=document.createElement("div");i.classList.add("catalogue__input","goods_option__name"),i.textContent=e.goods_option__name,t.appendChild(i);const s=document.createElement("img");s.classList.add("catalogue__img"),s.alt=e.item_article,s.loading="lazy",s.src="/static/viki_web_cms/files/item_photo/"+e.image,t.appendChild(s);const u=p("checkbox","simple_article",e.simple_article);0===e.id&&(u.checked=!0),u.addEventListener("change",(e=>f(e))),t.appendChild(u);const m=await r("Goods",e.goods__id,!1);t.appendChild(m);const y=m.querySelector("input[hidden]");y.name="goods__id",y.addEventListener("change",(e=>f(e)));const v=document.createElement("div");v.classList.add("catalogue__file");const g=document.createElement("div");g.textContent=e.image,g.classList.add("catalogue__file_text"),v.appendChild(g);const b=document.createElement("div");b.classList.add("catalogue__input-frame");const C=document.createElement("input");C.classList.add("catalogue__file_input"),C.type="file",C.name="image",C.accept="image/png, image/jpeg, image/jpg",C.addEventListener("change",(async e=>await async function(e,t,n,a,c){const d=e.target.closest("form"),o=d.querySelector('input[name="id"]'),i=d.querySelector('input[name="colors"]'),s=d.querySelector('input[name="goods_option__id"]'),r=d.querySelector('textarea[name="name"]'),u=d.querySelector('input[name="item_article"]'),m=d.querySelector('input[name="main_color__id"]'),p=d.querySelector(".main_color_text"),f=d.querySelector(".goods_option__name"),h=d.querySelector(".btn__save");function y(){t.textContent="",c.src="",r.value="",u.value="",m.value="",p.textContent="",s.value="",f.textContent="",i.value="",h.disabled=!0,h.classList.contains("btn__disabled")||h.classList.add("btn__disabled")}if(i.value="",s.value="",/(\.jpg|\.jpeg|\.png)$/i.exec(e.target.value)){const d=e.target.files[0],v=new FileReader;v.onload=function(e){c.src=e.target.result},v.readAsDataURL(d),t.textContent=e.target.value.split("\\").pop();const g=t.textContent.split(".")[0],b=H+"parse_file_data/"+n+"/"+a+"/"+g+"/"+o.value,C=await l(b);C.error?y():(r.value=C.values.name,u.value=C.values.item_article,m.value=C.values.main_color__id,p.textContent=C.values.main_color_text,s.value=C.values.goods_option__id,f.textContent=C.values.goods_option__name,_(C.values.colors,i),h.disabled=!1,h.classList.remove("btn__disabled"))}else e.target.value="",y()}(e,g,y.value,u.checked?1:0,s))),b.appendChild(C),v.appendChild(b),t.appendChild(v);const E=document.createElement("div");E.classList.add("catalogue__btn-block");const L=d("");L.disabled=!0,L.classList.add("tooltip","btn__disabled"),L.innerHTML='<i class="catalogue__icon fa-solid fa-check"></i><span class="tooltip-text">сохранить</span>',L.addEventListener("click",(e=>async function(e,t){t.disabled=!0,t.classList.add("btn__disabled");const n=t.closest("form"),a=n.querySelector('input[name="id"]').value,c=document.querySelector(".catalogue__title").querySelector(".btn__save");c.disabled=!1,c.classList.remove("btn__disabled");const d=new FormData(n),o=Object.fromEntries(d.entries());let i=!1;if("0"!==a){const e=H+"catalogue_record/"+a,t=await l(e);for(const e in o)if(t.values[0][e]!==o[e]){i=!0;break}}if("0"===a||i){e.preventDefault();const t=H+"save_catalogue_item/"+a;await fetch(t,{method:"POST",body:d}).then((e=>e.json())).then((e=>{"0"===a&&(n.querySelector('input[name="id"]').value=e.id);const t=n.querySelector(".btn__cancel");t.disabled=!0,t.classList.add("btn__disabled")}))}}(e,L)));const w=c("");w.classList.add("tooltip","btn__disabled"),w.disabled=!0,w.innerHTML='<i class="catalogue__icon fa-solid fa-x"></i><span class="tooltip-text">отменить</span>',w.addEventListener("click",(e=>async function(e){const t=e.target.closest("form"),n=t.querySelector('input[name="id"]').value;if("0"===n){t.remove();const e=document.querySelector(".catalogue__title").querySelector(".btn__save");e.disabled=!1,e.classList.remove("btn__disabled")}else{t.innerHTML="";const e=H+"catalogue_record/"+n,a=await l(e);await h(a.values[0],t)}}(e))),E.appendChild(L),E.appendChild(w),t.appendChild(E);const x=p("text","colors","");x.hidden=!0,t.appendChild(x),e.colors&&_(e.colors,x)}function y(e){let t=e;return function(e){return/^[a-zA-Zа-яА-ЯёЁ0-9 ._#]*$/.test(e)}(e)&&e||(t="None"),t.replace(/ /g,"|")}async function v(e){const t=e.target,n=t.dataset.lastId,a=t.closest(".content"),c=a.querySelector(".dictionary-frame__input").value,d=a.querySelector(".check"),o=a.querySelector(".catalogue__content");await g(o,d.checked?1:0,n,y(c),0)}async function g(e,t,n,a,c){const d=H+"catalogue_data/"+t+"/"+n+"/"+a+"/"+c,o=(await l(d)).values;let i,s=0;const r=e.querySelector(`form[data-last-id="${n}"]`);r&&r.removeEventListener("mouseover",v);for(const t of o)i=document.createElement("form"),await h(t,i),e.appendChild(await i),s++,20===s&&(i.dataset.lastId=Number.parseInt(n)+s,i.addEventListener("mouseover",v))}async function b(e,t,n){const a=e.querySelector(".catalogue__content");a.innerHTML="",await g(a,t.checked?0:1,0,n,0)}function C(){const e=document.createElement("details");return e.classList.add("alert__details"),e}function E(e,t){const n=document.createElement("summary");return n.classList.add("alert__summary"),n.textContent=e+" "+t,n}function L(e){const t=document.createElement("div");t.classList.add("alert__element");const n=document.createElement("div");n.textContent="артикул";const a=document.createElement("div");a.textContent=e.item;const c=document.createElement("div");c.textContent="результат";const d=document.createElement("div");return d.textContent=e.message,t.appendChild(n),t.appendChild(a),t.appendChild(c),t.appendChild(d),t}async function w(e){e.preventDefault();const t=document.querySelector(".content"),a=y(t.querySelector(".dictionary-frame__input").value),c=t.querySelector(".check"),o=e.target.closest("form"),l=o.querySelector(".error-message"),s=e.target.closest("dialog"),r=new FormData(o);if(Object.fromEntries(r.entries()).csv_file.name.endsWith(".csv")){const e=H+"catalogue_csv_load";await fetch(e,{method:"POST",body:r}).then((e=>e.json())).then((e=>{if(e.error)o.querySelector("input").value="",l.style.display="block",l.textContent=e.error;else{n(s),b(t,c.checked?1:0,a);const o=function(e){const t=document.createElement("dialog");t.classList.add("alert");const n=document.createElement("header");n.classList.add("modal__header");const a=document.createElement("h4");a.textContent="Результат загрузки",n.appendChild(a);const c=document.createElement("div");c.innerHTML="&times;",c.addEventListener("click",(()=>{t.remove()})),n.appendChild(c),t.appendChild(n);const o=C(),i=E("Ошибки",e.recordErrorLength);o.appendChild(i),e.recordError.forEach((e=>{o.appendChild(L(e))})),t.appendChild(o);const l=C(),s=E("Дубли",e.recordDoubleLength);l.appendChild(s),e.recordDouble.forEach((e=>{l.appendChild(L(e))})),t.appendChild(l);const r=C(),u=E("Успешно",e.recordSuccessLength);r.appendChild(u),e.recordSuccess.forEach((e=>{r.appendChild(L(e))})),t.appendChild(r);const m=d("Ok");return m.classList.add("alert__btn"),m.addEventListener("click",(()=>{t.remove()})),t.appendChild(m),t}(e);document.querySelector(".service").appendChild(o),o.showModal(),i(o)}}))}else o.querySelector("input").value="",l.style.display="block",l.textContent="Неправильный формат файла";console.log("mmm")}function x(){const e=document.createElement("div");return e.classList.add("dictionary-content__square"),e}async function S(e){const t=H+"field_names/"+e;return await l(t)}function k(e){const t=document.createElement("label");return t.classList.add("modal__content_label"),t.htmlFor=e.field+"Input",t.textContent=e.label,t}e.d({},{G:()=>F,e:()=>H});const q={string:function(e){const t=s("text");return t.value=e.fieldValue,t.name=e.fieldName.field,t},boolean:function(e){const t=s("checkbox");return t.checked=e.fieldValue,t.id=e.fieldName.field+"Input",t.name=e.fieldName.field,t},number:function(e){const t=s("number");return t.value=e.fieldValue,t.name=e.fieldName.field,t},foreign:async function(e){const t=e.fieldName.foreignClass,n=e.fieldValue,a=await r(t,n,e.fieldName.null);return a.querySelector("[hidden]").name=e.fieldName.field+"_id",a},image:function(e){const t=document.createElement("img");return t.classList.add("modal__content_image"),t.src=e.url+e.fieldValue,t.alt=e.fieldName.field,t},file:function(e){const t=document.createElement("div");t.classList.add("modal__content_file-frame");const n=s("file");return n.placeholder=e.fieldValue,n.name=e.fieldName.field,t.appendChild(n),t}};function N(e){let t="14px 6fr ";return e.forEach((e=>{"name"!==e.field&&("boolean"===e.type||"number"===e.type?t+="1fr ":t+="3fr ")})),t+="80px",t}async function O(e,t,n,a,c){const d=document.createElement("div");d.classList.add("dictionary-content__rows");const o=H+"field_values/"+e+"/"+t+"/"+n+"/"+a,i=await l(o);let s=0;return i.values.forEach((o=>{let l=document.createElement("div");j(l,o,i.field_params,e),l.style.gridTemplateColumns=c,d.appendChild(l),s++,20===s&&(l.dataset.lastRecord=n+20,l.addEventListener("mouseover",(c=>async function(e,t,n,a,c){const d=N(await S(t)),o=e.closest(".dictionary-content__rows");[...(await O(t,n,c,a,d)).children].forEach((e=>{o.appendChild(e)}));const i=e.cloneNode(!0);e.parentNode.replaceChild(i,e)}(c.target,e,t,a,n+20))))})),d}function j(e,t,n,a){e.classList.add("dictionary-content__row");const d=x();t.hex&&(d.style.backgroundColor=t.hex),e.appendChild(d),e.id=a+"_row_"+t.id,Object.keys(t).forEach(((a,c)=>{if("id"!==a){let c;Object.keys(n).includes(a)&&"image"===n[a].type?(c=document.createElement("img"),c.classList.add("dictionary-content__row_img"),c.src=n[a].url+t[a],c.alt=t[a]):Object.keys(n).includes(a)&&"boolean"===n[a].type?(c=document.createElement("input"),c.type="checkbox",c.checked=t[a],c.disabled=!0,c.classList.add("dictionary-content__check")):(c=document.createElement("div"),c.classList.add("dictionary-content__row_item"),c.textContent=t[a]),e.appendChild(c)}}));const o=c("Изм.");o.dataset.itemId=t.id,o.addEventListener("click",(e=>T(e))),e.appendChild(o)}async function T(e){e.preventDefault();const t=e.target.closest(".dictionary-content").parentElement.querySelector(".dictionary-frame__header"),c=t.dataset.class,d=t.dataset.title,s=await async function(e,t,c){const d=document.createElement("dialog");d.classList.add("modal"),d.addEventListener("keypress",(e=>{"Escape"===e.key&&n(d)}));const i=a(d,t,c);d.appendChild(i);const s=document.createElement("form");s.id=e+"__form",s.classList.add("modal__form"),s.enctype="multipart/form-data";const r=await async function(e,t,n){const a=document.createElement("div");a.classList.add("modal__content");const c=await S(t);let d;const o=H+"record_info/"+t+"/"+n,i=await l(o);for(const e of c){let t={fieldName:e,fieldValue:null,url:i.url};"0"!==n&&("foreign"!==e.type?t.fieldValue=i.record[e.field]:t.fieldValue=i.record[e.field+"_id"]),a.appendChild(k(e)),d=await q[e.type](t),a.appendChild(d)}return a}(0,e,c);s.appendChild(r),s.appendChild(o(d,c)),d.appendChild(s);const u=new FormData(s);return s.querySelector(".submit").addEventListener("click",(t=>async function(e,t,a,c){e.preventDefault();const d=e.target.dataset.id,o=t.closest(".modal");o.querySelectorAll("input").forEach((e=>{e.classList.remove("border-alert")})),e.target.disabled=!0;const i=new FormData(t);if(!function(e,t){const n=Array.from(t.values()),a=Array.from(e.values());return n.sort(),a.sort(),JSON.stringify(n)===JSON.stringify(a)}(i,c)){const t=H+"edit_dictionary/"+a+"/"+d;await fetch(t,{method:"POST",body:i}).then((e=>e.json())).then((t=>{const c=t.errors;if(c){let t;c.forEach((n=>{e.target.disabled=!1,t=o.querySelector(`[name = "${n}"]`),t.hidden?t.previousElementSibling.classList.add("border-alert"):t.classList.add("border-alert"),e.target.focus()}))}else{let e;if("0"!==d)e=document.querySelector("#"+a+"_row_"+d),e.innerHTML="";else{let n;e=document.createElement("div"),e.id=a+"_row_"+t.values.id,e.classList.add("dictionary-content__row"),n=document.getElementById(a)?document.getElementById(a).querySelector(".dictionary-content__rows"):document.querySelector(".dictionary-content__rows"),n.insertAdjacentElement("afterbegin",e),e.style.gridTemplateColumns=n.closest(".dictionary-content").dataset.grid}j(e,t.values,t.params,a),e.scrollIntoView({behavior:"smooth"}),e.focus(),n(o)}}))}}(t,s,e,u))),d}(c,d,e.target.dataset.itemId);document.querySelector(".service").appendChild(s),s.showModal(),i(s),console.log()}async function D(e,t,n,a){const c=await S(e),d=document.createElement("div");d.classList.add("dictionary-content");const o=await async function(e){const t=document.createElement("div");t.classList.add("dictionary-content__title","dictionary-content__row"),t.appendChild(x()),e.forEach((e=>{let n=document.createElement("div");n.classList.add("dictionary-content__title_item"),n.textContent=e.label,t.appendChild(n)}));const n=document.createElement("button");return n.classList.add("btn","btn__save"),n.textContent="Создать",n.dataset.itemId="0",n.addEventListener("click",(e=>T(e))),t.appendChild(n),t}(c);o.style.gridTemplateColumns=t,d.appendChild(o);const i=await O(e,n,0,a,t);return d.appendChild(i),d.dataset.grid=t,d}async function I(e,t,n,a){let c=e.querySelector(".dictionary-content");const d=c.dataset.grid;c.remove(),c=await D(t,d,n.checked?0:1,a),e.appendChild(c)}async function A(e,t){const n=e.closest(".dictionary-frame__header").parentElement,a=n.querySelector(".dictionary-frame__input").value,c=n.querySelector(".check");"Catalogue"===t?await b(n,c,y(a)):await I(n,t,c,y(a))}function M(e,l,s){const r=document.createElement("div");r.classList.add("dictionary-frame__header");const u=document.createElement("div");u.classList.add("dictionary-frame__header_left"),u.textContent=l,r.appendChild(u);const m=document.createElement("div");if(m.classList.add("dictionary-frame__header_right"),s){const c=t("Загрузить CSV");c.addEventListener("click",(()=>async function(e){"Catalogue"===e&&function(){const e=document.querySelector(".service"),t=document.createElement("dialog");t.classList.add("catalogue__modal"),t.addEventListener("keypress",(e=>{"Escape"===e.key&&n(t)}));const c=a(t,"",0);t.appendChild(c);const d=document.createElement("form");d.id="catalogueDialog",d.classList.add("modal__form"),d.enctype="multipart/form-data";const l=document.createElement("div");l.classList.add("catalogue__input-frame");const s=document.createElement("input");s.classList.add("catalogue__modal_file-input"),s.type="file",s.name="csv_file",s.accept=".csv",l.appendChild(s),d.appendChild(l);const r=document.createElement("div");r.classList.add("error-message"),r.textContent="Error",d.appendChild(r),d.appendChild(o(t,0)),t.appendChild(d),d.querySelector(".submit").addEventListener("click",w),e.appendChild(t),c.firstElementChild.textContent="Загрузить csv файл",s.addEventListener("change",(()=>{r.textContent="",r.style.display="none"})),t.showModal(),i(t)}()}(e))),m.appendChild(c)}const p=function(){const e=document.createElement("input");return e.type="checkbox",e.checked=!0,e.classList.add("check"),e}();p.id=e+"-deleted",p.addEventListener("change",(()=>async function(e,t){const n=t.closest(".dictionary-frame__header").parentElement,a=y(n.querySelector(".dictionary-frame__input").value);"Catalogue"===e?await b(n,t,a):await I(n,e,t,a)}(e,p))),m.appendChild(p);const _=document.createElement("label");_.htmlFor=e+"-deleted",_.classList.add("dictionary-frame__label"),_.textContent="скрыть удаленные",m.appendChild(_),m.insertAdjacentHTML("beforeend",'<i class="fa fa-solid fa-magnifying-glass"></i>');const f=document.createElement("input");f.classList.add("dictionary-frame__input"),f.type="text",f.placeholder="поиск...",f.addEventListener("keypress",(t=>{"Enter"===t.key&&A(t.target,e)})),m.appendChild(f);const h=d("Поиск");h.addEventListener("click",(t=>A(t.target,e)));const v=c("Очистить");return v.addEventListener("click",(t=>async function(e,t){const n=e.closest(".dictionary-frame__header").parentElement;n.querySelector(".dictionary-frame__input").value="";const a=n.querySelector(".check");"Catalogue"===t?await b(n,a,"None"):await I(n,t,a,"None")}(t.target,e))),m.appendChild(h),m.appendChild(v),r.appendChild(m),r.dataset.class=e,r.dataset.title=l,r}const V=[{field:"deleted",type:"boolean",label:"уд."},{field:"name",type:"string",label:"название",null:!1},{field:"item_article",type:"string",label:"артикул",null:!1},{field:"main_color",type:"foreign",label:"осн. цвет",foreignClass:"Color",null:!1},{field:"goods_option",type:"foreign",label:"опция",foreignClass:"GoodsOption",null:!1},{field:"image",type:"img",label:"фото",url:"/static/viki_web_cms/files/item_photo/",null:!0},{field:"simple_article",type:"boolean",label:"ст. арт."},{field:"goods",type:"foreign",label:"номенклатура",foreignClass:"Goods",null:!1},{field:"image_file",type:"file",label:"файл",null:!0}],H="./json/",F={Goods:async function(e){const t="14px 4fr 1fr 1.5fr 1fr 3fr 3fr 3fr 2fr 2fr 1fr 1fr 3fr 1.5fr",n=await D(e,t,0,"None");return n.id=e,n.dataset.grid=t,n},Catalogue:async function(e){const n=document.querySelector(".dictionary-frame__header_right"),a=t("Загрузить несколько фото");a.addEventListener("click",(()=>async function(){}())),n.insertAdjacentElement("afterbegin",a);const c=document.createElement("div"),o=document.createElement("div");let i;o.classList.add("catalogue","catalogue__title"),V.forEach((e=>{i=document.createElement("p"),i.classList.add("catalogue__title-item"),i.textContent=e.label,o.appendChild(i)}));const l=d("Новый");l.addEventListener("click",(async e=>{e.target.disabled=!0,e.target.classList.add("btn__disabled");const t=document.createElement("form");await h({id:0},t);const n=t.querySelector(".btn__cancel");n.disabled=!1,n.classList.remove("btn__disabled"),s.insertAdjacentElement("afterbegin",t),t.scrollIntoView({behavior:"smooth"}),t.focus()})),o.appendChild(l),c.appendChild(o);const s=document.createElement("div");return s.classList.add("catalogue__content"),await g(s,0,0,"None",0),c.appendChild(s),c},PriceList:async function(e){return document.createElement("div")}},J=document.querySelectorAll(".menu__item"),P=document.querySelector(".content");J.forEach((e=>{e.addEventListener("click",(async t=>{e.classList.contains("menu__item_bold")||(e.classList.add("menu__item_bold"),P.innerHTML="","Standard"===t.target.dataset.page?function(e,t){e.style.flexDirection="row";const n=document.createElement("div");n.classList.add("content__left"),e.appendChild(n);const a=document.createElement("div");a.classList.add("content__right"),e.appendChild(a),JSON.parse(t).forEach((e=>{let t=document.createElement("details");t.classList.add("section-left");let a=document.createElement("summary");a.textContent=e.section_name,t.appendChild(a),e.cms_settings.forEach((e=>{let n=document.createElement("li");n.textContent=e.setting,n.dataset.class=e.setting_class,n.dataset.upload=e.upload,n.classList.add("section-left__content"),t.appendChild(n)}));const c=t.querySelectorAll("li");c.forEach((e=>{e.addEventListener("click",(()=>async function(e,t,n,a,c){if(e.classList.toggle("text-active"),document.getElementById(t))document.getElementById(t).classList.toggle("invisible");else{const a=document.querySelector(".content__right"),c=await async function(e,t,n){const a=document.createElement("section");a.classList.add("dictionary-frame"),a.id=e;const c=M(e,t,n);return a.appendChild(c),a}(t,e.textContent,n),d=N(await S(t)),o=await D(t,d,0,"None");c.appendChild(o),a.appendChild(c)}!function(e,t){const n=e.querySelector("summary");Array.from(t).some((e=>e.classList.contains("text-active")))?n.classList.add("text-active"):n.classList.remove("text-active")}(a,c)}(e,e.dataset.class,JSON.parse(e.dataset.upload),t,c)))})),n.appendChild(t)}))}(P,e.dataset.content):await async function(e,t,n){e.style.flexDirection="column";const a=JSON.parse(t)[0],c=a.cms_settings[0].setting,d=a.cms_settings[0].setting_class,o=M(d,c,a.cms_settings[0].upload);e.appendChild(o);const i=await F[n](d);e.appendChild(i)}(P,e.dataset.content,t.target.dataset.page)),J.forEach((t=>{t!==e&&t.classList.remove("menu__item_bold")}))}))}))})();